import { Box, Button } from "@mui/material";
import { useEffect } from "react";
import { useHeaderStore } from "@/app/knowledge/store/headerStore";

export default function BSAManualEmbedding() {
  const setHeaderNode = useHeaderStore((s) => s.setHeaderNode);

  useEffect(() => {
    const header = (
      <Box display={"inline-flex"} gap={1}>
        <Button size="small" variant="outlined">
          임베딩 취소
        </Button>
        <Button size="small" variant="contained" color="secondary">
          임베딩 실행
        </Button>
      </Box>
    );
    setHeaderNode(header);
    return () => setHeaderNode(null);
  }, [setHeaderNode]);

  return <div>BSAManualEmbedding</div>;
}
