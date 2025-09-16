"use client";

import { AnswerSource, ChatAnswer } from "@/lib/types/chat";
import { Box, Divider, Paper, Typography } from "@mui/material";
import { COLORS } from "@/lib/theme";
import { format } from "date-fns";
import { AccessTime, ChevronRight } from "@mui/icons-material";
import { AgentChip } from "./Chips";
import RetrievalIcon from "@/assets/icon-agent-retrieval.svg";
import PimIcon from "@/assets/icon-agent-pim.svg";
import ApiIcon from "@/assets/icon-agent-api.svg";
import ChatIcon from "@/assets/icon-agent-chat.svg";
import AIProfileIcon from "@/assets/icon-ai-profile.svg";
import { useChatStore } from "@/lib/store/chatStore";

function formatDuration(duration: number) {
  const seconds = Math.floor(duration / 1000);
  const milliseconds = duration % 1000;
  return `${seconds}.${milliseconds.toString().padStart(3, "0")}s`;
}

export default function ResponseMessage({ message }: { message: ChatAnswer }) {
  const selectedAnswer = useChatStore((s) => s.selectedAnswer);
  const setSelectedAnswer = useChatStore((s) => s.setSelectedAnswer);
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
      <AIProfileIcon
        style={{
          alignSelf: "flex-start",
          marginTop: 8,
          flexShrink: 0,
          minWidth: 32,
          minHeight: 32,
        }}
      />
      <Paper
        aria-label="response-message-content"
        sx={{
          fontSize: 14,
          px: 2,
          py: 1.5,
          lineHeight: 1.4,
          borderRadius: 1.5,
          border:
            selectedAnswer?.chatId === message.chatId ? "2px solid" : "none",
          borderColor: COLORS.primary.main,
        }}
        elevation={2}
        onClick={() => setSelectedAnswer(message)}
      >
        <Box
          display={"flex"}
          flexDirection={"column"}
          gap={1}
          p={2}
          border={1}
          borderColor={COLORS.blueGrey[50]}
          borderRadius={1}
        >
          <Box display={"flex"} alignItems={"center"} gap={0.5}>
            <Typography fontSize={12} color={COLORS.blueGrey[300]} width={48}>
              Intent
            </Typography>
            <Typography fontSize={12}>{message?.intent.title}</Typography>
          </Box>
          <Box display={"flex"} alignItems={"center"} gap={0.5}>
            <Typography fontSize={12} color={COLORS.blueGrey[300]} width={48}>
              Agent
            </Typography>
            {AgentChips.map((chip) => (
              <AgentChip
                key={chip.type}
                type={chip.type as "api" | "pim" | "retrieval" | "chat"}
                count={chip.count}
              />
            ))}
          </Box>
          <Box display={"flex"} alignItems={"center"} gap={1.5}>
            <Box display={"flex"} alignItems={"center"} gap={0.5}>
              <Typography fontSize={12} color={COLORS.blueGrey[300]} width={48}>
                Duration
              </Typography>
              <Typography fontSize={12}>
                {formatDuration(message?.duration)}
              </Typography>
            </Box>
            <Divider orientation="vertical" sx={{ height: 12 }} />
            <Box display={"flex"} alignItems={"center"} gap={1}>
              <Typography fontSize={12} color={COLORS.blueGrey[300]}>
                Source
              </Typography>
              <Typography fontSize={12}>{message?.sources.length}</Typography>
            </Box>
          </Box>
        </Box>
        <Box ml={0.5} mt={1.5}>
          <Typography fontSize={14}>{message?.message as string}</Typography>
          {topRankedSources.map((source, index) => (
            <Box key={source.sourceType} mt={1.5}>
              <SourceMessage source={source} />
              {index !== topRankedSources.length - 1 && (
                <Divider sx={{ my: 1.5 }} />
              )}
            </Box>
          ))}
        </Box>
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

const SourceMessage = ({ source }: { source: AnswerSource }) => {
  const selectOnlySourceType = useChatStore((s) => s.selectOnlySourceType);
  return (
    <Box
      sx={{
        cursor: "pointer",
      }}
      onClick={() => {
        selectOnlySourceType(source.sourceType);
      }}
    >
      <Box display={"flex"} alignItems={"center"} gap={0.5}>
        <Box
          bgcolor={COLORS.agent[source.sourceType].background}
          borderRadius={99}
          p={0.5}
          width={24}
          height={24}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          gap={1}
        >
          {(() => {
            switch (source.sourceType) {
              case "retrieval":
                return <RetrievalIcon />;
              case "pim":
                return <PimIcon />;
              case "api":
                return <ApiIcon />;
              case "chat":
                return <ChatIcon />;
            }
          })()}
        </Box>
        <Typography fontSize={16} fontWeight={600} flex={1}>
          {source.sourceMessage.title}
        </Typography>
        <Typography fontSize={12} color={COLORS.blueGrey[300]}>
          {source.sourceName}
        </Typography>
        <Typography
          fontSize={12}
          fontWeight={500}
          color={COLORS.agent[source.sourceType].main}
        >
          {formatDuration(source.duration)}
        </Typography>
        <ChevronRight sx={{ fontSize: 20, color: COLORS.blueGrey[200] }} />
      </Box>
      <Typography
        fontSize={14}
        color={COLORS.blueGrey[900]}
        whiteSpace={"pre-wrap"}
        mt={1}
      >
        {source.sourceMessage.content}
      </Typography>
    </Box>
  );
};
