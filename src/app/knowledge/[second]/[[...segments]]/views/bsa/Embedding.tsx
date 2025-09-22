"use client";

import { Box, Button, Portal, Typography } from "@mui/material";
import { useMemo, useState, useCallback } from "react";
import { UploadFile } from "@mui/icons-material";

import { CheckableChunkCard } from "./components/ChunkCard";

import { COLORS } from "@/lib/theme";
import { ChunkProps } from "@/lib/types/bsa";
import { useBSAStore } from "@/lib/store/bsaStore";


export default function BSAChunkEmbedding() {
  const chunks = useBSAStore((s) => s.chunks);
  const updateChunk = useBSAStore((s) => s.updateChunk);
  const selectedRow = useBSAStore((s) => s.selectedRow);
  const showProgressId = useMemo(() => {
    const name = selectedRow?.fileName ?? selectedRow?.filePath ?? "";
    return name.toLowerCase().endsWith(".png");
  }, [selectedRow]);
  const embeddingRequiredChunks = useMemo<ChunkProps[]>(
    () =>
      chunks.filter((chunk: ChunkProps) => {
        return (
          (chunk.embeddingAt && chunk.embeddingAt <= chunk.updatedAt) ||
          chunk.embeddingAt === null
        );
      }),
    [chunks]
  );

  const [selectedChunks, setSelectedChunks] = useState<ChunkProps[]>([]);

  const toggleSelect = useCallback((chunk: ChunkProps) => {
    setSelectedChunks((prev) =>
      prev.some((c) => c.progressId === chunk.progressId)
        ? prev.filter((c) => c.progressId !== chunk.progressId)
        : [...prev, chunk]
    );
  }, []);

  const handleEmbedding = useCallback(() => {
    const now = new Date();
    const toUpdate = selectedChunks;
    toUpdate.forEach((chunk) => {
      updateChunk({ ...chunk, embeddingAt: now });
    });
    setSelectedChunks([]);
  }, [selectedChunks, updateChunk]);

  return (
    <>
      <Box display={"flex"} flexDirection={"column"} p={2} flex={1} gap={1.5}>
        <Box>
          <Typography>List of Chunks Requiring Embedding</Typography>
        </Box>
        {embeddingRequiredChunks.length > 0 ? (
          <Box
            display={"grid"}
            gridTemplateColumns={"repeat(auto-fill, minmax(252px, 1fr))"}
            gap={1.5}
          >
            {embeddingRequiredChunks.map((chunk: ChunkProps) => (
              <CheckableChunkCard
                key={chunk.progressId}
                chunk={chunk}
                selected={selectedChunks.includes(chunk)}
                onSelect={toggleSelect}
                showProgressId={showProgressId}
              />
            ))}
          </Box>
        ) : (
          <Box
            display={"flex"}
            flexDirection={"column"}
            alignItems={"center"}
            justifyContent={"center"}
            gap={2}
            flex={1}
            height={"100%"}
            color={COLORS.blueGrey[100]}
          >
            <UploadFile sx={{ fontSize: 40 }} />
            <Typography fontSize={14} fontWeight={500}>
              No chunks need embedding
            </Typography>
          </Box>
        )}
      </Box>
      <Portal container={() => document.getElementById("knowledge-footer")}>
        <Box
          display={"flex"}
          justifyContent={"flex-end"}
          gap={1}
          bgcolor="white"
          px={2}
          py={1}
          borderTop={1}
          borderColor={COLORS.blueGrey[100]}
        >
          <Button
            size="small"
            variant="contained"
            disabled={selectedChunks.length === 0}
            onClick={handleEmbedding}
          >
            Embedding
          </Button>
        </Box>
      </Portal>
    </>
  );
}
