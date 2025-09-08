"use client";

import { Box, Button, Typography } from "@mui/material";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optional: logging can be added here
  }, [error]);

  return (
    <Box p={2} display={"flex"} flexDirection={"column"} gap={1}>
      <Typography fontSize={16} fontWeight={600} color="error.main">
        Unable to load BSA detail
      </Typography>
      <Typography fontSize={13} color="text.secondary">
        {error?.message || "Unknown error"}
      </Typography>
      <Box>
        <Button size="small" variant="outlined" onClick={reset}>
          Retry
        </Button>
      </Box>
    </Box>
  );
}
