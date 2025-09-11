"use client";

import {
  Box,
  Typography,
  Button,
  Paper,
  InputBase,
  IconButton,
} from "@mui/material";
import ChatIcon from "@/assets/icon-ai-chat.svg";
import ChatSidebar from "./sidebar";
import { COLORS } from "@/lib/theme";
import SendIcon from "@/assets/icon-send.svg";
import { Add } from "@mui/icons-material";

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
        <Box
          aria-label="chat-input-container"
          display="flex"
          gap={1}
          p={2}
          alignItems="flex-end"
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
            <InputBase
              fullWidth
              multiline
              placeholder="Please enter your question.."
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
          >
            SUBMIT
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
