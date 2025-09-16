"use client";

import { Box, Paper, Typography } from "@mui/material";
import ChatIcon from "@/assets/icon-ai-chat.svg";
import ChatSidebar from "./sidebar";
import { COLORS } from "@/lib/theme";
import ChatInput from "./input";
import UserMessage from "./components/UserMessage";
import ResponseMessage from "./components/ResponseMessage";
import { ChatAnswer } from "@/lib/types/chat";
import { useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import EmptyChatLayer from "@/assets/img-empty-chat.svg";
import Source from "./source";
import JsonViewer from "./components/JsonViewer";
import { useChatStore } from "@/lib/store/chatStore";
import AIProfileIcon from "@/assets/icon-ai-profile.svg";

export default function Chat() {
  const currentThread = useChatStore((s) =>
    s.currentThreadId
      ? s.threadHistory.find((t) => t.threadId === s.currentThreadId) ?? null
      : null
  );
  const messages = useMemo(
    () => currentThread?.messages ?? [],
    [currentThread?.messages]
  );
  const isAwaiting = useChatStore((s) => s.isAwaitingResponse);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const selectedAnswer = useChatStore((s) => s.selectedAnswer);
  const isJsonViewerOpen = useChatStore((s) => s.isJsonViewerOpen);

  // Avoid flicker by controlling scroll behavior based on change type
  const prevIsAwaitingRef = useRef(isAwaiting);
  const prevMsgLenRef = useRef(messages.length);
  useEffect(() => {
    const prevIsAwaiting = prevIsAwaitingRef.current;
    const prevMsgLen = prevMsgLenRef.current;

    if (messages.length > prevMsgLen) {
      // New message appended → smooth scroll
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    } else if (isAwaiting && !prevIsAwaiting) {
      // Waiting bubble appeared → smooth scroll
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    } else if (!isAwaiting && prevIsAwaiting) {
      // Waiting bubble removed → jump instantly to avoid flicker
      bottomRef.current?.scrollIntoView({ behavior: "auto" });
    }

    prevIsAwaitingRef.current = isAwaiting;
    prevMsgLenRef.current = messages.length;
  }, [messages.length, isAwaiting]);

  // unified animations only; no additional delay logic

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
          sx={{ overflowAnchor: "none", scrollbarGutter: "stable" }}
        >
          <Box p={2} display="flex" flexDirection="column" gap={2.5}>
            {messages.length === 0 ? (
              <EmptyChat />
            ) : (
              <AnimatePresence initial={false}>
                {messages.map((m) => (
                  <motion.div
                    key={m.chatId}
                    style={{
                      alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                      width: "fit-content",
                    }}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                  >
                    {m.role === "user" ? (
                      <UserMessage message={m} />
                    ) : (
                      <ResponseMessage message={m as ChatAnswer} />
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
            <AnimatePresence initial={false}>
              {isAwaiting && (
                <motion.div
                  key="waiting"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.12, ease: "easeOut" }}
                >
                  <WaitingMessage />
                </motion.div>
              )}
            </AnimatePresence>
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

const WaitingMessage = () => {
  return (
    <Box display="flex" alignItems="center" gap={1.5}>
      <AIProfileIcon sx={{ marginTop: 8 }} />
      <Paper sx={{ p: 2, borderRadius: 1.5 }}>
        <Box display="flex" alignItems="center" gap={0.5}>
          {[0, 1, 2].map((index) => (
            <Box
              key={index}
              sx={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                backgroundColor: "#B5BED7",
                animation: `bounce 1.4s ease-in-out infinite`,
                animationDelay: `${index * 0.2}s`,
                "@keyframes bounce": {
                  "0%, 60%, 100%": {
                    transform: "translateY(0)",
                  },
                  "30%": {
                    transform: "translateY(-4px)",
                  },
                },
              }}
            />
          ))}
        </Box>
      </Paper>
    </Box>
  );
};

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
