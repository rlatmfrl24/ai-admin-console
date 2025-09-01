"use client";

import { Box } from "@mui/material";
import BSAChunkList from "./list";
import BSAChunkEdit from "./edit";
import BSAChunkEmbedding from "./embedding";
import { useState } from "react";

export default function BSAManual() {
  const [currentPhase] = useState<"list" | "edit" | "embedding">("list");

  const renderContent = () => {
    switch (currentPhase) {
      case "list":
        return <BSAChunkList />;
      case "edit":
        return <BSAChunkEdit />;
      case "embedding":
        return <BSAChunkEmbedding />;
    }
  };

  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      height={"100%"}
      sx={{ minHeight: 0 }}
    >
      {renderContent()}
    </Box>
  );
}
