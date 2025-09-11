"use client";

import { Box, Paper, InputBase, IconButton, Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import SendIcon from "@/assets/icon-send.svg";
import { COLORS } from "@/lib/theme";
import { Controller, useForm } from "react-hook-form";

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

  const messageValue = watch("message");

  const onLocalSubmit = (values: FormValues) => {
    onSubmit?.(values.message);
    if (!onSubmit) {
      console.log("submit message:", values.message);
    }
    reset();
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
        disabled={!messageValue?.trim()}
      >
        SUBMIT
      </Button>
    </Box>
  );
}
