"use client";

import {
  Box,
  Button,
  TextField,
  Typography,
  Portal,
  IconButton,
  Popover,
} from "@mui/material";
import { AddCircle, Cached, FileUploadOutlined } from "@mui/icons-material";
import MenuTree from "@/app/knowledge/chunks/commercial/bsa/[id]/components/MenuTree";
import { BSA_MENU_TREE } from "@/constants/bsa";
import { ChunkCard } from "./components/ChunkCard";
import InputWithLabel from "@/components/common/Input";
import { COLORS } from "@/constants/color";
import { format } from "date-fns";
import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import type {
  BSAMenuTreeItemProps,
  BSATableProps,
  ChunkProps,
} from "@/types/bsa";
import { useBSAChunksStore } from "@/app/knowledge/chunks/commercial/bsa/store/bsaChunksStore";
import { faker } from "@faker-js/faker";
import {
  AttachmentPreviewForDocument,
  AttachmentPreviewForUI,
} from "./components/AttachmentPreview";
import FilterChipMenu from "./components/FilterChipMenu";
import LeftPanelOpenIcon from "@/assets/icon-left-panel-open.svg";
import LeftPanelCloseIcon from "@/assets/icon-left-panel-close.svg";
import AIProcessIcon from "@/assets/icon-ai-process.svg";
import { alpha } from "@mui/material/styles";

function findIndexPath(
  nodes: BSAMenuTreeItemProps[],
  targetId: string,
  acc: number[] = []
): number[] | null {
  for (const n of nodes) {
    const nextAcc = [...acc, n.index];
    if (n.id === targetId) return nextAcc;
    if (n.children?.length) {
      const found = findIndexPath(n.children, targetId, nextAcc);
      if (found) return found;
    }
  }
  return null;
}

function isChunkChanged(chunk: ChunkProps, chunks: ChunkProps[]): boolean {
  return (
    chunk.title !==
      chunks.find((c) => c.progressId === chunk.progressId)?.title ||
    chunk.content !==
      chunks.find((c) => c.progressId === chunk.progressId)?.content ||
    chunk.attachedFile !==
      chunks.find((c) => c.progressId === chunk.progressId)?.attachedFile ||
    chunk.attachedFile?.some(
      (a, i) =>
        a.description !==
        chunks.find((c) => c.progressId === chunk.progressId)?.attachedFile?.[i]
          ?.description
    )
  );
}

type BSAEditProps = {
  selectedData: BSATableProps | null;
  selectedTreeItem: BSAMenuTreeItemProps | null;
  setSelectedTreeItem: Dispatch<SetStateAction<BSAMenuTreeItemProps | null>>;
  onNext?: () => void;
};

export default function BSAChunkEdit({
  selectedData,
  selectedTreeItem,
  setSelectedTreeItem,
  onNext,
}: BSAEditProps) {
  const chunks = useBSAChunksStore((s) => s.chunks);
  const setSelectedChunk = useBSAChunksStore((s) => s.setSelectedChunk);
  const selectedChunk = useBSAChunksStore((s) => s.selectedChunk);
  const updateChunk = useBSAChunksStore((s) => s.updateChunk);
  const addChunk = useBSAChunksStore((s) => s.addChunk);
  const cleanupNewEmptyChunks = useBSAChunksStore(
    (s) => s.cleanupNewEmptyChunks
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [savedPreviewUrls, setSavedPreviewUrls] = useState<string[]>([]);
  const baseChunk = chunks.find(
    (c) => c.progressId === selectedChunk?.progressId
  );
  const [draftChunk, setDraftChunk] = useState<ChunkProps | null>(null);
  const flushTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scheduleFlush = (next: ChunkProps) => {
    if (flushTimerRef.current) clearTimeout(flushTimerRef.current);
    flushTimerRef.current = setTimeout(() => {
      setSelectedChunk(next);
    }, 300);
  };

  useEffect(() => {
    if (!draftChunk) {
      setPreviewUrls([]);
      return;
    }
    const files = (draftChunk.attachedFile ?? []).map((a) => a.file);
    let cancelled = false;
    Promise.all(
      files.map(
        (file) =>
          new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve((reader.result as string) || "");
            reader.onerror = () => resolve("");
            reader.readAsDataURL(file);
          })
      )
    ).then((urls) => {
      if (!cancelled) {
        setPreviewUrls(urls.filter(Boolean));
      }
    });
    return () => {
      cancelled = true;
    };
  }, [draftChunk]);
  useEffect(() => {
    if (!selectedChunk) {
      setSavedPreviewUrls([]);
      return;
    }
    const files = (baseChunk?.attachedFile ?? []).map((a) => a.file);
    let cancelled = false;
    Promise.all(
      files.map(
        (file) =>
          new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve((reader.result as string) || "");
            reader.onerror = () => resolve("");
            reader.readAsDataURL(file);
          })
      )
    ).then((urls) => {
      if (!cancelled) {
        setSavedPreviewUrls(urls.filter(Boolean));
      }
    });
    return () => {
      cancelled = true;
    };
  }, [chunks, selectedChunk, baseChunk]);
  useEffect(() => {
    if (flushTimerRef.current) {
      clearTimeout(flushTimerRef.current);
      flushTimerRef.current = null;
    }
    if (!selectedChunk) {
      setDraftChunk(null);
      return;
    }
    setDraftChunk({ ...selectedChunk });
  }, [selectedChunk]);

  const [filter, setFilter] = useState<string[]>([
    "draft",
    "in-progress",
    "completed",
    "done",
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);
  const [promptAnchorEl, setPromptAnchorEl] = useState<HTMLElement | null>(
    null
  );
  const isPromptOpen = Boolean(promptAnchorEl);
  const openPrompt = (e: React.MouseEvent<HTMLElement>) =>
    setPromptAnchorEl(e.currentTarget as HTMLElement);
  const closePrompt = () => setPromptAnchorEl(null);
  const visibleChunks =
    filter.length === 0
      ? []
      : chunks
          .filter((c) => filter.includes(c.status))
          .filter((c) => {
            if (normalizedQuery === "") return true;
            return (
              c.title.toLowerCase().includes(normalizedQuery) ||
              c.progressId.toLowerCase().includes(normalizedQuery)
            );
          });

  return (
    <>
      <Box
        aria-label="BSA Menu Tree"
        aria-expanded={!isMenuCollapsed}
        borderRight={1}
        borderColor={COLORS.blueGrey[100]}
        width={isMenuCollapsed ? "46px" : "264px"}
        sx={{
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          minHeight: 0,
          transition: "width 240ms ease-in-out",
          willChange: "width",
        }}
      >
        <Box
          display={"flex"}
          alignItems={"center"}
          gap={0.5}
          px={0.5}
          py={1}
          borderBottom={isMenuCollapsed ? 0 : 1}
          borderColor={COLORS.blueGrey[100]}
        >
          <IconButton
            aria-label={
              isMenuCollapsed
                ? "Expand BSA Menu Tree"
                : "Collapse BSA Menu Tree"
            }
            onClick={() => setIsMenuCollapsed((prev) => !prev)}
          >
            {isMenuCollapsed ? <LeftPanelOpenIcon /> : <LeftPanelCloseIcon />}
          </IconButton>
          <Typography
            fontSize={14}
            fontWeight={500}
            color="text.primary"
            sx={{
              transition: "opacity 200ms ease, transform 200ms ease",
              opacity: isMenuCollapsed ? 0 : 1,
              transform: isMenuCollapsed ? "translateX(-4px)" : "none",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            Commercial
          </Typography>
        </Box>
        <Box
          sx={{
            flex: 1,
            width: "264px",
            minWidth: "264px",
            overflowY: "auto",
            overflowX: "hidden",
            transition: "opacity 200ms ease, transform 200ms ease",
            willChange: "transform, opacity",
            opacity: isMenuCollapsed ? 0 : 1,
            transform: isMenuCollapsed ? "translateX(-218px)" : "none",
            pointerEvents: isMenuCollapsed ? "none" : "auto",
          }}
          aria-hidden={isMenuCollapsed}
        >
          <MenuTree
            items={BSA_MENU_TREE}
            ariaLabel="BSA Menu Tree"
            selectedId={selectedTreeItem?.id}
            onSelect={(_, item) => setSelectedTreeItem(item)}
          />
        </Box>
      </Box>
      <Box
        flex={selectedChunk ? 0 : 1}
        flexBasis={"565px"}
        p={2}
        borderRight={selectedChunk ? 1 : 0}
        borderColor={COLORS.blueGrey[100]}
        sx={{ overflow: "auto", minHeight: 0 }}
      >
        <Box
          display={"flex"}
          alignItems={"center"}
          gap={0.5}
          justifyContent={"space-between"}
        >
          <Typography fontSize={14} fontWeight={500} color="text.primary">
            {findIndexPath(BSA_MENU_TREE, selectedTreeItem?.id ?? "")?.join(
              "."
            ) +
              ". " +
              selectedTreeItem?.label}
          </Typography>
          {!selectedChunk && (
            <Box display={"flex"} alignItems={"center"} gap={0.5}>
              <FilterChipMenu filter={filter} setFilter={setFilter} />
              <InputWithLabel
                noLabel
                variant="outlined"
                size="small"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </Box>
          )}
        </Box>
        <Box
          mt={1.5}
          display={"grid"}
          gridTemplateColumns={"repeat(auto-fill, minmax(252px, 1fr))"}
          gap={1.5}
        >
          <Box
            display={"flex"}
            flexDirection={"column"}
            sx={{
              border: "2px dashed",
              borderColor: COLORS.blueGrey[100],
              borderRadius: 2,
              cursor: "pointer",
            }}
            minHeight={80}
            justifyContent={"center"}
            alignItems={"center"}
            gap={0.5}
            onClick={() => {
              const now = new Date();
              const newChunk: ChunkProps = {
                title: "",
                content: "",
                status: "draft",
                progressId: faker.string.numeric(4),
                attachedFile: [],
                embeddingAt: null,
                updatedAt: now,
                createdAt: now,
                isNew: true,
              };
              addChunk(newChunk);
              setSelectedChunk(newChunk);
            }}
          >
            <AddCircle sx={{ color: "primary.main" }} />
            <Typography fontSize={14} fontWeight={500} color="primary.main">
              New Chunk
            </Typography>
          </Box>
          {visibleChunks.map((chunk) => (
            <ChunkCard
              key={chunk.progressId}
              chunk={chunk}
              showProgressId={!selectedData?.fileName.includes(".pdf")}
              selected={selectedChunk?.progressId === chunk.progressId}
              onSelect={setSelectedChunk}
            />
          ))}
        </Box>
      </Box>
      {selectedChunk && (
        <Box flex={1} display={"flex"} p={2} gap={2} sx={{ minHeight: 0 }}>
          <Box flex={1} display={"flex"} flexDirection={"column"} gap={1}>
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Typography fontSize={14} fontWeight={500} color="text.primary">
                Edit Data
              </Typography>
              <Box>
                <Box
                  onClick={openPrompt}
                  display={"flex"}
                  alignItems={"center"}
                  gap={0.5}
                  px={1.5}
                  py={0.5}
                  sx={{
                    border: "1px solid transparent",
                    borderRadius: "6px",
                    background: `linear-gradient(${alpha(
                      COLORS.primary.states.focus,
                      isPromptOpen ? 0.12 : 0
                    )}, ${alpha(
                      COLORS.primary.states.focus,
                      isPromptOpen ? 0.12 : 0
                    )}) padding-box, linear-gradient(${COLORS.common.white}, ${
                      COLORS.common.white
                    }) padding-box, ${COLORS.gradient.secondary} border-box`,
                    cursor: "pointer",
                  }}
                >
                  <AIProcessIcon />
                  <Typography
                    fontSize={13}
                    fontWeight={500}
                    sx={{
                      background: COLORS.gradient.secondary,
                      backgroundClip: "text",
                      textFillColor: "transparent",
                    }}
                  >
                    PROMPT
                  </Typography>
                </Box>
                <Popover
                  open={isPromptOpen}
                  anchorEl={promptAnchorEl}
                  onClose={closePrompt}
                  anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                  transformOrigin={{ vertical: "top", horizontal: "left" }}
                  sx={{ zIndex: 2100 }}
                  slotProps={{
                    paper: {
                      elevation: 1,
                      sx: {
                        width: "560px",
                        border: 1,
                        borderColor: COLORS.blueGrey[100],
                        borderRadius: 2,
                        bgcolor: COLORS.common.white,
                        overflow: "visible",
                      },
                    },
                  }}
                >
                  <Box
                    display={"flex"}
                    alignItems={"center"}
                    gap={0.5}
                    p={"12px 16px 8px 16px"}
                  >
                    <AIProcessIcon />
                    <Typography
                      fontSize={16}
                      fontWeight={500}
                      sx={{
                        background: COLORS.gradient.secondary,
                        backgroundClip: "text",
                        textFillColor: "transparent",
                      }}
                    >
                      Prompt
                    </Typography>
                  </Box>
                  <Box
                    borderTop={1}
                    borderBottom={1}
                    borderColor={COLORS.blueGrey[100]}
                    p={2}
                    gap={1.5}
                    display={"flex"}
                    flexDirection={"column"}
                  >
                    <Box
                      display={"flex"}
                      flexDirection={"column"}
                      p={2}
                      fontSize={14}
                      fontWeight={500}
                      bgcolor={COLORS.grey[100]}
                      borderRadius={2}
                    >
                      <p>
                        해당 Chunk data를 이용해서 다음 메타 항목들을
                        추출해주세요.
                      </p>
                      <p>semantic_title</p>
                      <p>semantic_summary</p>
                      <p>semantic_chunk</p>
                    </Box>
                    <Box display={"flex"} flexDirection={"column"}>
                      <Typography
                        variant="caption"
                        color={"text.primary"}
                        lineHeight={1.3}
                        fontWeight={500}
                        m={"2px"}
                      >
                        Add Prompt
                      </Typography>
                      <TextField
                        placeholder="추가로 원하는 프롬프트를 유저별로 입력"
                        sx={{
                          "& .MuiInputBase-root": {
                            padding: "6px 12px",
                          },
                          "& .MuiOutlinedInput-root": {
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            fontSize: "13px",
                            backgroundColor: "white",
                          },
                        }}
                        multiline
                        rows={10}
                      />
                    </Box>
                  </Box>
                  <Box
                    display={"flex"}
                    gap={1}
                    justifyContent={"end"}
                    p={"8px 16px"}
                  >
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{
                        color: "text.primary",
                        borderColor: "text.primary",
                      }}
                      onClick={closePrompt}
                    >
                      CANCEL
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={closePrompt}
                    >
                      ADD
                    </Button>
                  </Box>
                </Popover>
              </Box>
            </Box>
            <Box
              flex={1}
              border={2}
              borderColor={"primary.main"}
              borderRadius={2}
              display={"flex"}
              flexDirection={"column"}
              sx={{ minHeight: 0 }}
            >
              <Box
                flex={1}
                display={"flex"}
                flexDirection={"column"}
                gap={2}
                p={1.5}
                sx={{
                  borderRadius: "8px 8px 0px 0px",
                  background: "linear-gradient(180deg, #FFF 0%, #F7F6FF 100%)",
                  overflow: "auto",
                }}
              >
                <InputWithLabel
                  label="Title"
                  value={draftChunk?.title ?? ""}
                  onChange={(e) => {
                    if (!draftChunk) return;
                    const next = {
                      ...draftChunk,
                      title: e.target.value,
                    } as ChunkProps;
                    setDraftChunk(next);
                    scheduleFlush(next);
                  }}
                />
                {selectedData?.fileName.includes(".pdf") && (
                  <InputWithLabel
                    label="Program ID"
                    value={draftChunk?.progressId ?? ""}
                    disabled
                  />
                )}
                <Box display={"flex"} flexDirection={"column"}>
                  <Typography
                    variant="caption"
                    color={"text.primary"}
                    lineHeight={1.3}
                    fontWeight={500}
                    m={"2px"}
                  >
                    Content
                  </Typography>
                  <TextField
                    value={draftChunk?.content ?? ""}
                    sx={{
                      "& .MuiInputBase-root": {
                        padding: "6px 12px",
                      },
                      "& .MuiOutlinedInput-root": {
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        fontSize: "13px",
                        backgroundColor: "white",
                      },
                    }}
                    onChange={(e) => {
                      if (!draftChunk) return;
                      const next = {
                        ...draftChunk,
                        content: e.target.value,
                      } as ChunkProps;
                      setDraftChunk(next);
                      scheduleFlush(next);
                    }}
                    multiline
                  />
                </Box>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<FileUploadOutlined sx={{ fontSize: 20 }} />}
                  sx={{
                    fontSize: 14,
                    lineHeight: 1.4,
                    width: "fit-content",
                    textTransform: "none",
                    color: "text.primary",
                    borderColor: "text.primary",
                  }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  Attach File
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  hidden
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files ?? []);
                    if (!files.length || !draftChunk) return;
                    const newAttachments = files.map((file) => ({
                      file,
                      description: "",
                    }));
                    const updated: ChunkProps = {
                      ...draftChunk,
                      attachedFile: [
                        ...(draftChunk.attachedFile ?? []),
                        ...newAttachments,
                      ],
                    };
                    setDraftChunk(updated);
                    scheduleFlush(updated);
                    e.currentTarget.value = "";
                  }}
                />
                {previewUrls.length > 0 && (
                  <Box gap={1} display={"flex"} flexDirection={"column"}>
                    {previewUrls.map((url, idx) =>
                      selectedData?.fileName.includes(".pdf") ? (
                        <AttachmentPreviewForDocument
                          key={`${url}-${idx}`}
                          url={url}
                          index={idx}
                          mode="edit"
                          description={
                            draftChunk?.attachedFile?.[idx]?.description ?? ""
                          }
                          onChangeDescription={(value) => {
                            if (!draftChunk) return;
                            const updated: ChunkProps = {
                              ...draftChunk,
                              attachedFile: (draftChunk.attachedFile ?? []).map(
                                (a, i) =>
                                  i === idx ? { ...a, description: value } : a
                              ),
                            };
                            setDraftChunk(updated);
                            scheduleFlush(updated);
                          }}
                          onRemove={() => {
                            if (!draftChunk) return;
                            const updated: ChunkProps = {
                              ...draftChunk,
                              attachedFile: (
                                draftChunk.attachedFile ?? []
                              ).filter((_, i) => i !== idx),
                            };
                            setDraftChunk(updated);
                            scheduleFlush(updated);
                          }}
                        />
                      ) : (
                        <AttachmentPreviewForUI
                          key={`${url}-${idx}`}
                          url={url}
                          index={idx}
                          mode="edit"
                          description={
                            draftChunk?.attachedFile?.[idx]?.description ?? ""
                          }
                          onRemove={() => {
                            if (!draftChunk) return;
                            const updated: ChunkProps = {
                              ...draftChunk,
                              attachedFile: (
                                draftChunk.attachedFile ?? []
                              ).filter((_, i) => i !== idx),
                            };
                            setDraftChunk(updated);
                            scheduleFlush(updated);
                          }}
                        />
                      )
                    )}
                  </Box>
                )}
              </Box>
              <Box
                display={"flex"}
                justifyContent={"space-between"}
                alignItems={"center"}
                px={2}
                py={1}
              >
                <Typography
                  fontSize={12}
                  fontWeight={400}
                  color={COLORS.blueGrey[200]}
                  display={"flex"}
                  alignItems={"center"}
                  gap={0.5}
                >
                  <Cached sx={{ fontSize: 16 }} />
                  {selectedChunk.updatedAt
                    ? format(selectedChunk.updatedAt, "yyyy-MM-dd HH:mm:ss")
                    : ""}
                </Typography>
                <Button
                  size="small"
                  variant="contained"
                  disabled={
                    !selectedChunk.isNew &&
                    !isChunkChanged(selectedChunk, chunks)
                  }
                  onClick={() => {
                    const updated = {
                      ...selectedChunk,
                      updatedAt: new Date(),
                      isNew: false,
                    } as ChunkProps;
                    updateChunk(updated);
                    setSelectedChunk(updated);
                    cleanupNewEmptyChunks(updated.progressId);
                  }}
                >
                  Save
                </Button>
              </Box>
            </Box>
          </Box>
          {!selectedChunk.isNew && (
            <Box
              flex={1}
              display={"flex"}
              flexDirection={"column"}
              gap={1}
              sx={{ minHeight: 0 }}
            >
              <Box
                display={"flex"}
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <Typography fontSize={14} fontWeight={500} color="text.primary">
                  Current Data
                </Typography>
                <Typography
                  fontSize={12}
                  fontWeight={400}
                  color={COLORS.blueGrey[200]}
                  display={"flex"}
                  alignItems={"center"}
                  gap={0.5}
                >
                  <Cached sx={{ fontSize: 16 }} />
                  {selectedChunk.embeddingAt
                    ? format(selectedChunk.embeddingAt, "yyyy-MM-dd HH:mm:ss")
                    : ""}
                </Typography>
              </Box>
              <Box
                flex={1}
                bgcolor={COLORS.grey[100]}
                borderRadius={2}
                display={"flex"}
                flexDirection={"column"}
                px={2}
                py={1.5}
                gap={1}
                sx={{ overflow: "auto" }}
              >
                <Typography fontSize={14} fontWeight={500} color="text.primary">
                  {
                    chunks.find(
                      (c) => c.progressId === selectedChunk.progressId
                    )?.title
                  }
                </Typography>
                <Typography
                  fontSize={12}
                  fontWeight={400}
                  whiteSpace={"pre-line"}
                >
                  {
                    chunks.find(
                      (c) => c.progressId === selectedChunk.progressId
                    )?.content
                  }
                </Typography>
                {savedPreviewUrls.length > 0 && (
                  <Box
                    gap={1}
                    display={"flex"}
                    flexDirection={"column"}
                    mt={0.5}
                  >
                    {savedPreviewUrls.map((url, idx) => (
                      <AttachmentPreviewForDocument
                        key={`saved-${url}-${idx}`}
                        url={url}
                        index={idx}
                        mode="read"
                        description={
                          chunks.find(
                            (c) => c.progressId === selectedChunk.progressId
                          )?.attachedFile?.[idx]?.description ?? ""
                        }
                      />
                    ))}
                  </Box>
                )}
              </Box>
            </Box>
          )}
        </Box>
      )}
      <Portal container={() => document.getElementById("knowledge-footer")}>
        {selectedChunk ? (
          <Box
            display={"flex"}
            justifyContent={"flex-end"}
            alignItems={"center"}
            bgcolor="white"
            px={2}
            py={1}
            borderTop={1}
            borderColor={COLORS.blueGrey[100]}
          >
            <Button size="small" variant="contained" onClick={onNext}>
              Next
            </Button>
          </Box>
        ) : null}
      </Portal>
    </>
  );
}
