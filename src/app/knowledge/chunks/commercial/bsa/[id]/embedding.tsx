import { Box, Button, Portal, Typography } from "@mui/material";
import { COLORS } from "@/constants/color";
import { useMemo, useState } from "react";
import { ChunkProps } from "@/types/bsa";
import ChunkCard from "../ChunkCard";

type BSAEmbeddingProps = {
  chunks: ChunkProps[];
};

export default function BSAChunkEmbedding({ chunks }: BSAEmbeddingProps) {
  const embeddingRequiredChunks = useMemo<ChunkProps[]>(
    () =>
      chunks.filter((chunk: ChunkProps) => {
        return chunk.embeddingAt !== chunk.updatedAt;
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
            <ChunkCard
              key={chunk.progressId}
              chunk={chunk}
              checkable
              selected={selectedChunks.includes(chunk)}
              onSelect={(chunk: ChunkProps) => {
                setSelectedChunks([...selectedChunks, chunk]);
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
          <Button size="small" variant="contained">
            Embedding
          </Button>
        </Box>
      </Portal>
    </>
  );
}
