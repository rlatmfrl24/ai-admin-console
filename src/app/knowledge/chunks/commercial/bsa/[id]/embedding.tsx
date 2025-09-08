import { Box, Button, Portal, Typography } from "@mui/material";
import { COLORS } from "@/constants/color";
import { useMemo, useState } from "react";
import { ChunkProps } from "@/types/bsa";
import { CheckableChunkCard } from "./components/ChunkCard";
import { useBSAChunksStore } from "@/app/knowledge/chunks/commercial/bsa/store/bsaChunksStore";

export default function BSAChunkEmbedding() {
  const chunks = useBSAChunksStore((s) => s.chunks);
  const updateChunk = useBSAChunksStore((s) => s.updateChunk);
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

  return (
    <>
      <Box display={"flex"} flexDirection={"column"} p={2} flex={1} gap={1.5}>
        <Box>
          <Typography>List of Chunks Requiring Embedding</Typography>
        </Box>
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
              onSelect={(chunk: ChunkProps) => {
                if (selectedChunks.includes(chunk)) {
                  setSelectedChunks(
                    selectedChunks.filter(
                      (c) => c.progressId !== chunk.progressId
                    )
                  );
                } else {
                  setSelectedChunks([...selectedChunks, chunk]);
                }
              }}
            />
          ))}
        </Box>
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
            onClick={() => {
              const now = new Date();
              selectedChunks.forEach((chunk) => {
                updateChunk({ ...chunk, embeddingAt: now });
              });
              setSelectedChunks([]);
            }}
          >
            Embedding
          </Button>
        </Box>
      </Portal>
    </>
  );
}
