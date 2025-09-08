import { Box, Button, Portal, Typography } from "@mui/material";
import { COLORS } from "@/lib/theme";
import { useMemo, useState, useCallback } from "react";
import { ChunkProps } from "@/lib/types/bsa";
import { CheckableChunkCard } from "./components/ChunkCard";
import { useBSAStore } from "@/app/knowledge/chunks/commercial/bsa/utils/bsaStore";
import { UploadFile } from "@mui/icons-material";

/**
 * [인수인계 메모]
 * - 역할: Embedding 대상 Chunk 선택 및 Embedding 실행.
 * - API 교체 포인트:
 *   1) handleEmbedding에서 POST /api/bsa/:id/embedding (배치 처리) 호출 후 embeddingAt 업데이트
 *   2) 서버가 처리 큐/상태를 관리하는 경우, 폴링 또는 웹소켓으로 상태 동기화
 * - 유의사항:
 *   - 멱등성: 동일 요청 반복 시 중복 처리 방지(서버측 요청 ID 활용)
 *   - 부분 실패: 일부 Chunk 실패 시 재시도 가능하도록 결과 매핑/표시 설계
 */
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
