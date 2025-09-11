"use client";

import { Box, Typography } from "@mui/material";
import ChatIcon from "@/assets/icon-ai-chat.svg";
import ChatSidebar from "./sidebar";
import { COLORS } from "@/lib/theme";
import ChatInput from "./input";

export default function Chat() {
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
          <Typography>Content</Typography>
        </Box>
        <ChatInput />
      </Box>
    </Box>
  );
}
