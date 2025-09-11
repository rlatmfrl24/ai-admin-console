"use client";

import { Box, IconButton, Typography } from "@mui/material";
import { COLORS } from "@/lib/theme";
import { Close } from "@mui/icons-material";
import { useChatStore } from "@/lib/store/chatStore";
import { AgentFilterChip } from "./components/Chips";

export default function Source() {
  const setSelectedAnswer = useChatStore((s) => s.setSelectedAnswer);
  const selectedAnswer = useChatStore((s) => s.selectedAnswer);
  const selectedSourceType = useChatStore((s) => s.selectedSourceType);

  const AgentChips = (() => {
    const map = new Map<string, number>();
    for (const s of selectedAnswer?.sources ?? []) {
      const existing = map.get(s.sourceType);
      map.set(s.sourceType, (existing ?? 0) + 1);
    }
    return Array.from(map.entries()).map(([type, count]) => ({
      type,
      count,
    }));
  })();

  return (
    <Box
      bgcolor={"white"}
      borderLeft={1}
      borderColor={COLORS.blueGrey[100]}
      minWidth={488 + 16 + 16}
      px={2}
      display={"flex"}
      flexDirection={"column"}
    >
      <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={"space-between"}
        mt={1.5}
      >
        <Typography fontSize={20} fontWeight={500}>
          Source
        </Typography>
        <IconButton size="small" onClick={() => setSelectedAnswer(null)}>
          <Close sx={{ fontSize: 20 }} />
        </IconButton>
      </Box>
      <Box display={"flex"} alignItems={"center"} gap={0.5}>
        {AgentChips.map((chip) => (
          <AgentFilterChip
            key={chip.type}
            type={chip.type as "api" | "pim" | "retrieval" | "chat"}
            count={chip.count}
            checked={selectedSourceType === chip.type}
          />
        ))}
      </Box>
    </Box>
  );
}
