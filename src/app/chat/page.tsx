"use client";

import { Box, Typography } from "@mui/material";
import ChatIcon from "@/assets/icon-ai-chat.svg";
import ChatSidebar from "./sidebar";
import { COLORS } from "@/lib/theme";
import ChatInput from "./input";
import UserMessage from "./components/UserMessage";
import ResponseMessage from "./components/ResponseMessage";
import { ChatAnswer } from "@/lib/types/chat";
import { useEffect, useRef } from "react";
import EmptyChatLayer from "@/assets/img-empty-chat.svg";
import Source from "./source";
import JsonViewer from "./components/JsonViewer";
import { useChatStore } from "@/lib/store/chatStore";

export default function Chat() {
  const currentThread = useChatStore((s) =>
    s.currentThreadId
      ? s.threadHistory.find((t) => t.threadId === s.currentThreadId) ?? null
      : null
  );
  const messages = currentThread?.messages ?? [];
  const isAwaiting = useChatStore((s) => s.isAwaitingResponse);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const selectedAnswer = useChatStore((s) => s.selectedAnswer);
  const isJsonViewerOpen = useChatStore((s) => s.isJsonViewerOpen);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, isAwaiting]);

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
          overflow={messages.length === 0 ? "hidden" : "auto"}
          display="flex"
          flexDirection="column"
        >
          <Box p={2} display="flex" flexDirection="column" gap={2.5}>
            {messages.length === 0 ? (
              <EmptyChat />
            ) : (
              messages.map((m) => {
                if (m.role === "user") {
                  return <UserMessage key={m.chatId} message={m} />;
                } else {
                  return (
                    <ResponseMessage key={m.chatId} message={m as ChatAnswer} />
                  );
                }
              })
            )}
            {isAwaiting && (
              <Typography variant="body2" color="text.secondary">
                대기중...
              </Typography>
            )}
            <div ref={bottomRef} />
          </Box>
        </Box>
        <ChatInput />
      </Box>
      {selectedAnswer && <Source />}
      {isJsonViewerOpen && <JsonViewer />}
    </Box>
  );
}

const EmptyChat = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      gap={2}
      alignItems="center"
      justifyContent="center"
      height="100%"
      minHeight="calc(100vh - 200px)"
    >
      <EmptyChatLayer />
      <Typography
        fontSize={24}
        fontWeight={400}
        lineHeight={"116%"}
        textAlign="center"
        color={COLORS.primary.states.focusVisible}
      >
        Everything You Want to Know
        <br /> about Allegro NX
      </Typography>
    </Box>
  );
};
