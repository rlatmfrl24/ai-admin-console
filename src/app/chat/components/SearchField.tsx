import { COLORS } from "@/lib/constants/color";
import {
  Clear,
  KeyboardArrowDown,
  KeyboardArrowUp,
  Search,
} from "@mui/icons-material";
import { Box, Divider, IconButton, InputBase, Typography } from "@mui/material";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useChatStore } from "@/lib/store/chatStore";
import { ChatAnswer } from "@/lib/types/chat";

export default function SearchField() {
  const [query, setQuery] = useState("");
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

  useEffect(() => {
    // 외부에서 변경된 검색어와 동기화
    setQuery(storeQuery);
  }, [storeQuery]);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setMatches([]);
      setCurrentMatchIndex(0);
      setStoreMatches([]);
      setStoreMatchIndex(0);
      console.debug("[Search] cleared", { query: trimmed });
      return;
    }

    const pattern = useRegex
      ? trimmed
      : trimmed.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    let regex: RegExp | null = null;
    try {
      regex = new RegExp(pattern, `g${caseSensitive ? "" : "i"}`);
    } catch {
      console.warn("[Search] invalid regex", { pattern });
      setMatches([]);
      setCurrentMatchIndex(0);
      setStoreMatches([]);
      setStoreMatchIndex(0);
      return;
    }

    const flattened: {
      chatId: string;
      section: "body" | "source-title" | "source-content";
      sourceKey?: string;
      occurrence: number;
    }[] = [];

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

      // Sources (assistant only) — top-ranked by sourceType
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
    query,
    messages,
    setStoreMatches,
    setStoreMatchIndex,
    caseSensitive,
    useRegex,
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
          if (e.key === "Enter") {
            if (matches.length === 0) return;
            if (e.shiftKey) {
              const next =
                (currentMatchIndex - 1 + matches.length) % matches.length;
              scrollToMatch(next);
              setCurrentMatchIndex(next);
              setStoreMatchIndex(next);
            } else {
              const next = (currentMatchIndex + 1) % matches.length;
              scrollToMatch(next);
              setCurrentMatchIndex(next);
              setStoreMatchIndex(next);
            }
          }
        }}
        inputRef={inputRef}
      />
      {isSearching && (
        <>
          {matches.length > 0 && (
            <Typography variant="caption" color={COLORS.blueGrey[100]}>
              {currentMatchIndex + 1} / {matches.length}
            </Typography>
          )}
          <Divider orientation="vertical" sx={{ height: 12, mx: 0.5 }} />
          <Divider orientation="vertical" sx={{ height: 12, mx: 0.5 }} />
          <IconButton
            aria-label="find-upwards"
            sx={{ width: 20, height: 20 }}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              if (matches.length === 0) return;
              const next =
                (currentMatchIndex - 1 + matches.length) % matches.length;
              scrollToMatch(next);
              setCurrentMatchIndex(next);
              setStoreMatchIndex(next);
            }}
            disabled={matches.length === 0}
          >
            <KeyboardArrowUp
              sx={{ fontSize: 20, color: COLORS.blueGrey[100] }}
            />
          </IconButton>
          <IconButton
            aria-label="find-downwards"
            sx={{ width: 20, height: 20 }}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              if (matches.length === 0) return;
              const next = (currentMatchIndex + 1) % matches.length;
              scrollToMatch(next);
              setCurrentMatchIndex(next);
              setStoreMatchIndex(next);
            }}
            disabled={matches.length === 0}
          >
            <KeyboardArrowDown
              sx={{ fontSize: 20, color: COLORS.blueGrey[100] }}
            />
          </IconButton>
          <IconButton
            aria-label="clear-search"
            sx={{ width: 20, height: 20 }}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              setQuery("");
              setStoreQuery("");
              setMatches([]);
              setCurrentMatchIndex(0);
              setStoreMatches([]);
              setStoreMatchIndex(0);
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
