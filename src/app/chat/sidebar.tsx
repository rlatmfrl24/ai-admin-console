import {
  Box,
  IconButton,
  Paper,
  Typography,
  ClickAwayListener,
} from "@mui/material";
import LeftPanelOpenIcon from "@/assets/icon-left-panel-open.svg";
import LeftPanelCloseIcon from "@/assets/icon-left-panel-close.svg";
import { useState, useMemo } from "react";
import { COLORS } from "@/lib/constants/color";
import { Add } from "@mui/icons-material";
import { useChatStore } from "@/lib/store/chatStore";
import { Thread } from "@/lib/types/chat";

// Sidebar widths (px)
const SIDEBAR_CLOSED_WIDTH_PX = 48;
const SIDEBAR_OPEN_WIDTH_PX = 336;
const SIDEBAR_CONTENT_WIDTH_PX = 320;

export default function ChatSidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const createThread = useChatStore((s) => s.createThread);
  const threadHistory = useChatStore((s) => s.threadHistory);
  const currentThreadId = useChatStore((s) => s.currentThreadId);
  const sidebarWidth = useMemo(
    () => (sidebarOpen ? SIDEBAR_OPEN_WIDTH_PX : SIDEBAR_CLOSED_WIDTH_PX),
    [sidebarOpen]
  );
  return (
    <ClickAwayListener onClickAway={() => sidebarOpen && setSidebarOpen(false)}>
      <Paper
        aria-label="chat-sidebar"
        aria-expanded={sidebarOpen}
        elevation={6}
        sx={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          width: sidebarWidth,
          transition: (theme) =>
            theme.transitions.create(["width"], {
              duration: theme.transitions.duration.standard,
              easing: theme.transitions.easing.easeInOut,
            }),
          px: 1,
          py: 1.5,
          borderRadius: 0,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          zIndex: (theme) => theme.zIndex.appBar - 1,
        }}
      >
        <IconButton
          onClick={() => setSidebarOpen((v) => !v)}
          aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          aria-controls="chat-sidebar-content"
          sx={{ alignSelf: "flex-start" }}
          size="small"
        >
          {sidebarOpen ? (
            <LeftPanelCloseIcon sx={{ fontSize: 20 }} />
          ) : (
            <LeftPanelOpenIcon sx={{ fontSize: 20 }} />
          )}
        </IconButton>
        <Box
          id="chat-sidebar-content"
          aria-hidden={!sidebarOpen}
          mt={1}
          sx={{
            width: SIDEBAR_CONTENT_WIDTH_PX,
            minWidth: SIDEBAR_CONTENT_WIDTH_PX,
            flex: "0 0 auto",
            height: "100%",
            opacity: sidebarOpen ? 1 : 0,
            transition: (theme) =>
              theme.transitions.create(["opacity"], {
                duration: theme.transitions.duration.shorter,
                easing: theme.transitions.easing.easeInOut,
              }),
            pointerEvents: sidebarOpen ? "auto" : "none",
          }}
          hidden={!sidebarOpen}
        >
          <Box
            aria-label="new-chat"
            onClick={() => createThread()}
            px={1.5}
            py={0.5}
            border={1}
            borderColor={COLORS.primary.states.outlineBorder}
            borderRadius={1}
            color={COLORS.primary.main}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
            gap={0.5}
            sx={{
              cursor: "pointer",
              "&:hover": { backgroundColor: COLORS.primary.states.hover },
            }}
          >
            <Add />
            NEW CHAT
          </Box>
          <Typography
            fontSize={12}
            fontWeight={500}
            color={COLORS.blueGrey[300]}
            mt={2}
            mb={1}
            ml={1}
          >
            History
          </Typography>
          <Box flex={1} display={"flex"} flexDirection={"column"}>
            {threadHistory.map((thread) => (
              <ChatSidebarItem
                key={thread.threadId}
                isSelected={thread.threadId === currentThreadId}
                thread={thread}
              />
            ))}
          </Box>
        </Box>
      </Paper>
    </ClickAwayListener>
  );
}

const ChatSidebarItem = ({
  isSelected = false,
  thread,
}: {
  isSelected?: boolean;
  thread: Thread | null;
}) => {
  const setCurrentThread = useChatStore((s) => s.setCurrentThread);
  return (
    <Box
      p={1}
      bgcolor={isSelected ? COLORS.blueGrey[50] : "transparent"}
      borderRadius={2}
      sx={{
        cursor: "pointer",
        "&:hover": { backgroundColor: COLORS.grey[100] },
      }}
      onClick={() => setCurrentThread(thread?.threadId || "")}
    >
      {thread?.threadId || "New Chat"}
    </Box>
  );
};
