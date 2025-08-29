"use client";

import { Box } from "@mui/material";
import BSAManualList from "./list";
import BSAManualEdit from "./edit";
import BSAManualEmbedding from "./embedding";
import { useState } from "react";

export default function BSAManual() {
  const [currentPhase] = useState<"list" | "edit" | "embedding">("list");

  const renderContent = () => {
    switch (currentPhase) {
      case "list":
        return <BSAManualList />;
      case "edit":
        return <BSAManualEdit />;
      case "embedding":
        return <BSAManualEmbedding />;
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
