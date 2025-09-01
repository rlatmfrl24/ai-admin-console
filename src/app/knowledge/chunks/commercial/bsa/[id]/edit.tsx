"use client";

import { Box, Button, TextField, Typography, Portal } from "@mui/material";
import { Cached, FileUploadOutlined } from "@mui/icons-material";
import MenuTree from "@/app/knowledge/chunks/commercial/bsa/MenuTree";
import { BSA_MENU_TREE } from "@/constants/bsa";
import { ChunkCard } from "../ChunkCard";
import InputWithLabel from "@/components/common/Input";
import { COLORS } from "@/constants/color";
import { format } from "date-fns";
import { useEffect, type Dispatch, type SetStateAction } from "react";
import type {
  BSAMenuTreeItemProps,
  BSATableProps,
  ChunkProps,
} from "@/types/bsa";
import { useBSAChunksStore } from "@/app/knowledge/store/bsaChunksStore";

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
      chunks.find((c) => c.progressId === chunk.progressId)?.attachedFile
  );
}

type BSAEditProps = {
  selectedData: BSATableProps | null;
  selectedTreeItem: BSAMenuTreeItemProps | null;
  setSelectedTreeItem: Dispatch<SetStateAction<BSAMenuTreeItemProps | null>>;
  initialExpandedIds: string[];
  onNext?: () => void;
};

export default function BSAChunkEdit({
  selectedData,
  selectedTreeItem,
  setSelectedTreeItem,
  initialExpandedIds,
  onNext,
}: BSAEditProps) {
  const chunks = useBSAChunksStore((s) => s.chunks);
  const setSelectedChunk = useBSAChunksStore((s) => s.setSelectedChunk);
  const selectedChunk = useBSAChunksStore((s) => s.selectedChunk);
  const updateChunk = useBSAChunksStore((s) => s.updateChunk);
  useEffect(() => {
    setSelectedChunk(null);
  }, [setSelectedChunk]);
  return (
    <>
      <Box
        aria-label="BSA Menu Tree"
        borderRight={1}
        borderColor={COLORS.blueGrey[100]}
        width={"264px"}
      >
        <MenuTree
          items={BSA_MENU_TREE}
          ariaLabel="BSA Menu Tree"
          defaultExpandedIds={initialExpandedIds}
          selectedId={selectedTreeItem?.id}
          onSelect={(_, item) => setSelectedTreeItem(item)}
        />
      </Box>
      <Box
        flex={selectedChunk ? 0 : 1}
        flexBasis={"560px"}
        p={2}
        borderRight={selectedChunk ? 1 : 0}
        borderColor={COLORS.blueGrey[100]}
      >
        <Typography fontSize={14} fontWeight={500} color="text.primary">
          {findIndexPath(BSA_MENU_TREE, selectedTreeItem?.id ?? "")?.join(".") +
            ". " +
            selectedTreeItem?.label}
        </Typography>
        <Box
          mt={1.5}
          display={"grid"}
          gridTemplateColumns={"repeat(auto-fill, minmax(252px, 1fr))"}
          gap={1.5}
        >
          {chunks.map((chunk) => (
            <ChunkCard
              key={chunk.progressId}
              chunk={chunk}
              selected={selectedChunk?.progressId === chunk.progressId}
              onSelect={setSelectedChunk}
            />
          ))}
        </Box>
      </Box>
      {selectedChunk && (
        <Box flex={1} display={"flex"} p={2} gap={2}>
          <Box flex={1} display={"flex"} flexDirection={"column"} gap={1}>
            <Typography fontSize={14} fontWeight={500} color="text.primary">
              Edit Data
            </Typography>
            <Box
              flex={1}
              border={2}
              borderColor={"primary.main"}
              borderRadius={2}
              display={"flex"}
              flexDirection={"column"}
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
                }}
              >
                <InputWithLabel
                  label="Title"
                  value={selectedChunk.title}
                  onChange={(e) =>
                    setSelectedChunk({
                      ...selectedChunk,
                      title: e.target.value,
                    })
                  }
                />
                {selectedData?.fileName.includes(".pdf") && (
                  <InputWithLabel
                    label="Program ID"
                    value={selectedChunk.progressId}
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
                    value={selectedChunk.content}
                    sx={{
                      "& .MuiInputBase-root": {
                        padding: "6px 12px",
                      },
                      "& .MuiOutlinedInput-root": {
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        fontSize: "13px",
                      },
                    }}
                    onChange={(e) =>
                      setSelectedChunk({
                        ...selectedChunk,
                        content: e.target.value,
                      })
                    }
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
                >
                  Attach File
                </Button>
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
                  disabled={!isChunkChanged(selectedChunk, chunks)}
                  onClick={() => {
                    const updated = {
                      ...selectedChunk,
                      updatedAt: new Date(),
                    } as ChunkProps;
                    updateChunk(updated);
                    setSelectedChunk(updated);
                  }}
                >
                  Save
                </Button>
              </Box>
            </Box>
          </Box>
          <Box flex={1} display={"flex"} flexDirection={"column"} gap={1}>
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
            >
              <Typography fontSize={14} fontWeight={500} color="text.primary">
                {
                  chunks.find((c) => c.progressId === selectedChunk.progressId)
                    ?.title
                }
              </Typography>
              <Typography fontSize={12} fontWeight={400}>
                {
                  chunks.find((c) => c.progressId === selectedChunk.progressId)
                    ?.content
                }
              </Typography>
            </Box>
          </Box>
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
