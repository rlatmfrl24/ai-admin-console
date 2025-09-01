import { Box, Button } from "@mui/material";
import { useEffect } from "react";
import { useHeaderStore } from "@/app/knowledge/store/headerStore";

export default function BSAChunkEdit() {
  const setHeaderNode = useHeaderStore((s) => s.setHeaderNode);

  useEffect(() => {
    const header = (
      <Box display={"inline-flex"} gap={1}>
        <Button size="small" variant="outlined">
          취소
        </Button>
        <Button size="small" variant="contained">
          저장
        </Button>
      </Box>
    );
    setHeaderNode(header);
    return () => setHeaderNode(null);
  }, [setHeaderNode]);

  return <div>BSAChunkEdit</div>;
}
