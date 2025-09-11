import { ChatAnswer } from "@/lib/types/chat";
import { Box, Divider, Paper, Typography } from "@mui/material";
import { COLORS } from "@/lib/theme";
import { format } from "date-fns";
import { AccessTime } from "@mui/icons-material";
import { AgentChip } from "./Chips";

export default function ResponseMessage({ message }: { message: ChatAnswer }) {
  const topRankedSources = (() => {
    const map = new Map<string, (typeof message.sources)[number]>();
    for (const s of message?.sources ?? []) {
      const existing = map.get(s.sourceType);
      if (!existing || s.sourceRank < existing.sourceRank) {
        map.set(s.sourceType, s);
      }
    }
    return Array.from(map.values()).sort((a, b) => a.sourceRank - b.sourceRank);
  })();

  const AgentChips = (() => {
    const map = new Map<string, number>();
    for (const s of message?.sources ?? []) {
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
      aria-label="response-message"
      width={"fit-content"}
      alignSelf={"flex-start"}
      display={"flex"}
      alignItems={"flex-end"}
      gap={1.5}
    >
      <Paper
        aria-label="response-message-content"
        sx={{
          fontSize: 14,
          px: 2,
          py: 1.5,
          lineHeight: 1.4,
          borderRadius: 1.5,
        }}
      >
        <Box display={"flex"} flexDirection={"column"}>
          <Box display={"flex"} alignItems={"center"} gap={0.5}>
            <Typography fontSize={12} color={COLORS.blueGrey[300]} width={48}>
              Intent
            </Typography>
            <Typography fontSize={12}>{message?.intent}</Typography>
          </Box>
          <Box display={"flex"} alignItems={"center"} gap={0.5}>
            <Typography fontSize={12} color={COLORS.blueGrey[300]} width={48}>
              Agent
            </Typography>
            {AgentChips.map((chip) => (
              <AgentChip
                key={chip.type}
                type={chip.type as "agent" | "retrieval" | "api" | "pim"}
                count={chip.count}
              />
            ))}
          </Box>
        </Box>
        {message?.message as string}
        {topRankedSources.map((source) => (
          <Box key={source.sourceType}>
            {source.sourceType}
            {source.sourceRank}
            <Typography
              fontSize={12}
              fontWeight={400}
              color={COLORS.blueGrey[300]}
            >
              {source.sourceName.title}
            </Typography>
            <Divider />
          </Box>
        ))}
      </Paper>
      <Typography
        fontSize={12}
        fontWeight={400}
        color={COLORS.blueGrey[300]}
        display={"flex"}
        alignItems={"center"}
        gap={0.5}
        mb={0.5}
      >
        <AccessTime sx={{ fontSize: 12 }} />
        {format(message?.createdAt, "HH:mm:ss")}
      </Typography>
    </Box>
  );
}
