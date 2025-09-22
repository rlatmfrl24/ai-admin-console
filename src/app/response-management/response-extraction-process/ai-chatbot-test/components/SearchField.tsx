import {
  Clear,
  KeyboardArrowDown,
  KeyboardArrowUp,
  Search,
} from "@mui/icons-material";
import { Box, Divider, IconButton, InputBase, Typography } from "@mui/material";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { COLORS } from "@/lib/constants/color";
import { useChatStore } from "@/lib/store/chatStore";
import { ChatAnswer } from "@/lib/types/chat";
import { buildSearchRegex } from "@/lib/utils/search";

export default function SearchField() {
  const [query, setQuery] = useState("");
  // 입력 디바운싱 결과(빠른 타이핑 시 불필요한 재계산 방지)
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [matches, setMatches] = useState<
    {
      chatId: string;
      section: "body" | "source-title" | "source-content";
      sourceKey?: string;
      occurrence: number;
    }[]
  >([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const currentThread = useChatStore((s) =>
    s.currentThreadId
      ? s.threadHistory.find((t) => t.threadId === s.currentThreadId) ?? null
      : null
  );
  const storeQuery = useChatStore((s) => s.searchQuery);
  const setStoreQuery = useChatStore((s) => s.setSearchQuery);
  const setStoreMatches = useChatStore((s) => s.setSearchMatches);
  const setStoreMatchIndex = useChatStore((s) => s.setSearchCurrentMatchIndex);
  const caseSensitive = useChatStore((s) => s.searchCaseSensitive);
  const useRegex = useChatStore((s) => s.searchUseRegex);

  const messages = useMemo(
    () => currentThread?.messages ?? [],
    [currentThread?.messages]
  );

  // 외부 스토어 검색어와 동기화
  useEffect(() => {
    setQuery(storeQuery);
  }, [storeQuery]);

  // 입력값 디바운싱(200ms)
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 200);
    return () => clearTimeout(timer);
  }, [query]);

  // 컴파일된 정규식 메모화(옵션 변경 또는 디바운스된 검색어 변경 시에만 갱신)
  const compiled = useMemo(() => {
    const trimmed = debouncedQuery.trim();
    if (!trimmed)
      return {
        regex: null as RegExp | null,
        pattern: trimmed,
        error: null as unknown,
      };
    return buildSearchRegex(trimmed, { caseSensitive, useRegex });
  }, [debouncedQuery, caseSensitive, useRegex]);

  // 검색 결과와 인덱스를 한 번에 초기화하는 헬퍼
  const clearSearchState = useCallback(() => {
    setMatches([]);
    setCurrentMatchIndex(0);
    setStoreMatches([]);
    setStoreMatchIndex(0);
  }, [setStoreMatchIndex, setStoreMatches]);

  useEffect(() => {
    // 1) 공백만 입력된 경우 즉시 초기화
    const trimmed = debouncedQuery.trim();
    if (!trimmed) {
      clearSearchState();
      console.debug("[Search] cleared", { query: trimmed });
      return;
    }

    // 2) 정규식이 유효하지 않으면 초기화
    const { regex, pattern, error } = compiled;
    if (!regex) {
      console.warn("[Search] invalid regex", { pattern, error });
      clearSearchState();
      return;
    }

    const flattened: {
      chatId: string;
      section: "body" | "source-title" | "source-content";
      sourceKey?: string;
      occurrence: number;
    }[] = [];

    // 모든 메시지에 대해 본문과 출처에서 일치 항목을 수집
    for (const m of messages) {
      const re = regex; // reuse compiled regex with fresh lastIndex per call

      const addSectionMatches = (
        text: string,
        section: "body" | "source-title" | "source-content",
        chatId: string,
        sourceKey?: string,
        getNextOcc?: () => number
      ) => {
        if (!text || !re) return;
        re.lastIndex = 0;
        let match: RegExpExecArray | null;
        while ((match = re.exec(text)) !== null) {
          const start = match.index;
          const end = start + match[0].length;
          if (end === start) {
            if (re.lastIndex === match.index) re.lastIndex++;
            continue; // skip zero-length matches
          }
          const occurrence = getNextOcc ? getNextOcc() : 1;
          flattened.push({ chatId, section, sourceKey, occurrence });
          if (re.lastIndex === match.index) re.lastIndex++;
        }
      };

      // Body
      let bodyOcc = 0;
      const body =
        (typeof m.message === "string"
          ? m.message
          : (m as unknown as { message?: string })?.message) ?? "";
      addSectionMatches(body, "body", m.chatId, undefined, () => ++bodyOcc);

      // Sources (assistant only)
      // - 동일한 sourceType 내에서 가장 낮은 sourceRank(우선순위가 높은 항목)만 채택
      // - 이렇게 축약하여 매칭 범위를 줄이고 성능과 가독성을 모두 확보
      if (m.role === "assistant") {
        const ans = m as unknown as ChatAnswer;
        const all = Array.isArray(ans.sources) ? ans.sources : [];
        const map = new Map<string, (typeof all)[number]>();
        for (const s of all) {
          const existing = map.get(s.sourceType);
          if (!existing || s.sourceRank < existing.sourceRank) {
            map.set(s.sourceType, s);
          }
        }
        const top = Array.from(map.values()).sort(
          (a, b) => a.sourceRank - b.sourceRank
        );
        for (const s of top) {
          const key = `${s.sourceType}:${s.sourceId}`;
          let titleOcc = 0;
          let contentOcc = 0;
          addSectionMatches(
            s.sourceMessage.title,
            "source-title",
            m.chatId,
            key,
            () => ++titleOcc
          );
          addSectionMatches(
            s.sourceMessage.content,
            "source-content",
            m.chatId,
            key,
            () => ++contentOcc
          );
        }
      }
    }

    // 결과 반영 및 첫 번째 항목으로 포커스 이동 준비
    setMatches(flattened);
    setCurrentMatchIndex(0);
    setStoreMatches(flattened);
    setStoreMatchIndex(0);
    console.debug("[Search] recomputed matches", {
      query: trimmed,
      total: flattened.length,
      sample: flattened.slice(0, 10),
    });
    if (flattened.length > 0) {
      const firstId = flattened[0].chatId;
      const el = document.querySelector(
        `[data-chat-id="${firstId}"]`
      ) as HTMLElement | null;
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      console.debug("[Search] auto-scroll to first match", {
        index: 0,
        match: flattened[0],
      });
    }
  }, [
    debouncedQuery,
    messages,
    setStoreMatches,
    setStoreMatchIndex,
    caseSensitive,
    useRegex,
    compiled,
    clearSearchState,
  ]);

  const scrollToMatch = useCallback(
    (index: number) => {
      const target = matches[index];
      if (!target) return;
      const chatId = target.chatId;
      const el = document.querySelector(
        `[data-chat-id="${chatId}"]`
      ) as HTMLElement | null;
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      console.debug("[Search] navigate to match", { index, match: target });
    },
    [matches]
  );

  // 현재 인덱스 기준 상/하 이동 헬퍼(Enter / Shift+Enter 공통 처리)
  const navigateRelative = useCallback(
    (direction: 1 | -1) => {
      if (matches.length === 0) return;
      const next =
        (currentMatchIndex + direction + matches.length) % matches.length;
      scrollToMatch(next);
      setCurrentMatchIndex(next);
      setStoreMatchIndex(next);
    },
    [currentMatchIndex, matches.length, scrollToMatch, setStoreMatchIndex]
  );

  return (
    <Box
      aria-label="search-field"
      display="flex"
      alignItems="center"
      minWidth={276 + 24}
      borderRadius={5}
      px={1.5}
      py={"6px"}
      sx={{
        outline: "1px solid",
        outlineColor: COLORS.blueGrey[100],
        "&:hover": {
          outlineColor: COLORS.text.primary,
          outline: "1px solid",
        },
        "&:focus-within": {
          outline: "2px solid",
          outlineColor: COLORS.primary.main,
        },
      }}
      gap={0.5}
    >
      <Search sx={{ fontSize: 20, color: COLORS.blueGrey[100], mr: 0.5 }} />
      <InputBase
        placeholder="Search"
        aria-label="Search"
        size="small"
        sx={{
          flex: 1,
          "& .MuiInputBase-input": {
            padding: 0,
            fontSize: 14,
            fontWeight: 500,
            lineHeight: "20px",
            letterSpacing: "0.14px",
          },
        }}
        value={query}
        onClick={() => setIsSearching(true)}
        onBlur={() => setIsSearching(false)}
        onChange={(e) => {
          const v = (e.target as HTMLInputElement).value;
          setQuery(v);
          setStoreQuery(v);
        }}
        onKeyDown={(e) => {
          // Enter: 다음, Shift+Enter: 이전, Escape: 검색 초기화
          if (e.key === "Enter") {
            navigateRelative(e.shiftKey ? -1 : 1);
          } else if (e.key === "Escape") {
            setQuery("");
            setStoreQuery("");
            clearSearchState();
          }
        }}
        inputRef={inputRef}
      />
      {isSearching && (
        <>
          {matches.length > 0 && (
            <Box display={"flex"} alignItems={"center"}>
              <Typography
                fontSize={12}
                fontWeight={500}
                color={COLORS.primary.main}
                lineHeight={1}
              >
                {currentMatchIndex + 1}
              </Typography>
              <Typography
                fontSize={12}
                fontWeight={500}
                color={COLORS.blueGrey[200]}
                lineHeight={1}
              >
                /{matches.length}
              </Typography>
            </Box>
          )}
          <Divider orientation="vertical" sx={{ height: 12, mx: 0.5 }} />
          <IconButton
            aria-label="find-upwards"
            sx={{ width: 20, height: 20 }}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              navigateRelative(-1);
            }}
            disabled={matches.length === 0}
          >
            <KeyboardArrowUp
              sx={{ fontSize: 20, color: COLORS.primary.main }}
            />
          </IconButton>
          <IconButton
            aria-label="find-downwards"
            sx={{ width: 20, height: 20 }}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              navigateRelative(1);
            }}
            disabled={matches.length === 0}
          >
            <KeyboardArrowDown
              sx={{ fontSize: 20, color: COLORS.primary.main }}
            />
          </IconButton>
          <IconButton
            aria-label="clear-search"
            sx={{ width: 20, height: 20 }}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              setQuery("");
              setStoreQuery("");
              clearSearchState();
              inputRef.current?.focus();
            }}
            disabled={query.length === 0}
          >
            <Clear
              sx={{
                fontSize: 20,
                color:
                  query.length > 0 ? COLORS.primary.main : COLORS.blueGrey[100],
              }}
            />
          </IconButton>
        </>
      )}
    </Box>
  );
}
