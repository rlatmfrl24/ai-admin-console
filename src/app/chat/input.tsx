"use client";

import { Box, Paper, InputBase, IconButton, Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import SendIcon from "@/assets/icon-send.svg";
import { COLORS } from "@/lib/theme";
import { Controller, useForm } from "react-hook-form";
import { useChatStore } from "@/lib/store/chatStore";
import type { ChatMessage } from "@/lib/types/chat";

type ChatInputProps = {
  onSubmit?: (message: string) => void;
};

type FormValues = {
  message: string;
};

export default function ChatInput({ onSubmit }: ChatInputProps) {
  const { control, handleSubmit, reset, watch } = useForm<FormValues>({
    defaultValues: { message: "" },
  });
  const addMessage = useChatStore((s) => s.addMessage);
  const isAwaitingResponse = useChatStore((s) => s.isAwaitingResponse);
  const setAwaitingResponse = useChatStore((s) => s.setAwaitingResponse);

  const messageValue = watch("message");

  function generateChatId(): string {
    const randomSuffix = Math.random().toString(36).slice(2, 10);
    return `msg_${Date.now()}_${randomSuffix}`;
  }

  const onLocalSubmit = async (values: FormValues) => {
    const trimmed = values.message?.trim();
    if (!trimmed) return;

    // Add user message to current thread (creates a new one if none exists)
    const userMessage: ChatMessage = {
      chatId: generateChatId(),
      message: trimmed,
      role: "user",
      createdAt: new Date(),
    };
    addMessage(userMessage);

    // Optional external handler
    onSubmit?.(trimmed);
    reset();

    // Call backend and append assistant response
    try {
      setAwaitingResponse(true);
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });
      if (!res.ok) {
        throw new Error(`Request failed: ${res.status}`);
      }
      const data = await res.json();
      const assistant = data?.message;
      if (assistant) {
        // Normalize createdAt as Date instance
        const assistantMessage: ChatMessage = {
          ...assistant,
          createdAt: assistant?.createdAt
            ? new Date(assistant.createdAt)
            : new Date(),
        };
        addMessage(assistantMessage);
      }
    } catch {
      const errorMessage: ChatMessage = {
        chatId: generateChatId(),
        message: "요청 처리 중 오류가 발생했습니다.",
        role: "assistant",
        createdAt: new Date(),
      };
      addMessage(errorMessage);
    } finally {
      setAwaitingResponse(false);
    }
  };

  return (
    <Box
      aria-label="chat-input-container"
      display="flex"
      gap={1}
      p={2}
      alignItems="flex-end"
      component="form"
      onSubmit={handleSubmit(onLocalSubmit)}
    >
      <Paper
        aria-label="chat-input-box"
        elevation={2}
        sx={{
          display: "flex",
          flex: 1,
          p: 1,
          borderRadius: 6,
          gap: 1.5,
          border: "1px solid transparent",
          transition: "border-color 0.2s ease",
          "&:focus-within": {
            borderColor: COLORS.primary.main,
          },
        }}
      >
        <IconButton
          sx={{
            width: 32,
            height: 32,
            border: "1px solid #0000003b",
          }}
        >
          <Add sx={{ fontSize: 20 }} />
        </IconButton>
        <Controller
          name="message"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <InputBase
              {...field}
              fullWidth
              multiline
              placeholder="Please enter your question.."
            />
          )}
        />
      </Paper>
      <Button
        startIcon={<SendIcon />}
        variant="contained"
        sx={{
          borderRadius: "96px",
          px: 3,
          py: 1.5,
        }}
        type="submit"
        disabled={!messageValue?.trim() || isAwaitingResponse}
      >
        SUBMIT
      </Button>
    </Box>
  );
}
