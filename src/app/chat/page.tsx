"use client";

import { Box, Typography } from "@mui/material";
import ChatIcon from "@/assets/icon-ai-chat.svg";
import ChatSidebar from "./sidebar";
import { COLORS } from "@/lib/theme";
import ChatInput from "./input";
import { useChatStore } from "@/lib/store/chatStore";

export default function Chat() {
  const currentThread = useChatStore((s) =>
    s.currentThreadId
      ? s.threadHistory.find((t) => t.threadId === s.currentThreadId) ?? null
      : null
  );
  const messages = currentThread?.messages ?? [];
  return (
    <Box display="flex" height="100%" position="relative">
      <ChatSidebar />
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        ml={6}
        flex={1}
        sx={{
          background: COLORS.gradient.primary,
        }}
      >
        <Box
          aria-label="chat-header"
          display="flex"
          alignItems="center"
          gap={1.5}
          px={2}
          py={1.5}
        >
          <ChatIcon />
          <Typography variant="h6">AI Chat</Typography>
        </Box>
        <Box
          aria-label="chat-content"
          flexGrow={1}
          height={0}
          minHeight={0}
          overflow="auto"
          display="flex"
          flexDirection="column"
        >
          <Box p={2} display="flex" flexDirection="column" gap={1}>
            {messages.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                메시지가 없습니다.
              </Typography>
            ) : (
              messages.map((m) => (
                <Box
                  key={m.chatId}
                  display="flex"
                  gap={1}
                  alignItems="baseline"
                >
                  <Typography variant="caption" sx={{ minWidth: 72 }}>
                    {m.role}
                  </Typography>
                  <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                    {typeof m.message === "string"
                      ? m.message
                      : JSON.stringify(m.message)}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ marginLeft: "auto" }}
                  >
                    {new Date(m.createdAt).toLocaleTimeString()}
                  </Typography>
                </Box>
              ))
            )}
          </Box>
        </Box>
        <ChatInput />
      </Box>
    </Box>
  );
}
