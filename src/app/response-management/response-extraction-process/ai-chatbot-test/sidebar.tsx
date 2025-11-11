import {
  Box,
  IconButton,
  Paper,
  Typography,
  Menu,
  MenuItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import { useState, useMemo, useRef, useEffect, memo } from 'react';
import {
  Add,
  DeleteOutline,
  EditOutlined,
  MoreVert,
} from '@mui/icons-material';

import LeftPanelOpenIcon from '@/assets/icon-left-panel-open.svg';
import LeftPanelCloseIcon from '@/assets/icon-left-panel-close.svg';
import { COLORS } from '@/lib/constants/color';
import { useChatStore } from '@/lib/store/chatStore';
import { Thread } from '@/lib/types/chat';
import InputWithLabel from '@/components/common/Input';

// Sidebar widths (px)
const SIDEBAR_CLOSED_WIDTH_PX = 48;
const SIDEBAR_OPEN_WIDTH_PX = 336;
const SIDEBAR_CONTENT_WIDTH_PX = 320;

export default function ChatSidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const createThread = useChatStore((s) => s.createThread);
  const threadHistory = useChatStore((s) => s.threadHistory);
  const currentThreadId = useChatStore((s) => s.currentThreadId);
  const sidebarWidth = useMemo(
    () => (sidebarOpen ? SIDEBAR_OPEN_WIDTH_PX : SIDEBAR_CLOSED_WIDTH_PX),
    [sidebarOpen],
  );
  return (
    <Paper
      aria-label="chat-sidebar"
      aria-expanded={sidebarOpen}
      elevation={6}
      sx={{
        width: sidebarWidth,
        transition: (theme) =>
          theme.transitions.create(['width'], {
            duration: theme.transitions.duration.standard,
            easing: theme.transitions.easing.easeInOut,
          }),
        px: 1,
        py: 1.5,
        borderRadius: 0,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        zIndex: (theme) => theme.zIndex.appBar - 1,
      }}
    >
      <IconButton
        onClick={() => setSidebarOpen((v) => !v)}
        aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
        aria-controls="chat-sidebar-content"
        sx={{ alignSelf: 'flex-start' }}
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
          flex: '0 0 auto',
          height: '100%',
          opacity: sidebarOpen ? 1 : 0,
          transition: (theme) =>
            theme.transitions.create(['opacity'], {
              duration: theme.transitions.duration.shorter,
              easing: theme.transitions.easing.easeInOut,
            }),
          pointerEvents: sidebarOpen ? 'auto' : 'none',
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
          display={'flex'}
          alignItems={'center'}
          justifyContent={'center'}
          gap={0.5}
          sx={{
            cursor: 'pointer',
            '&:hover': { backgroundColor: COLORS.primary.states.hover },
          }}
        >
          <Add />
          <Typography fontSize={13} fontWeight={500}>
            NEW CHAT
          </Typography>
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
        <Box flex={1} display={'flex'} flexDirection={'column'}>
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
  );
}

const ChatSidebarItemComponent = ({
  isSelected = false,
  thread,
}: {
  isSelected?: boolean;
  thread: Thread;
}) => {
  const setCurrentThread = useChatStore((s) => s.setCurrentThread);
  const removeThread = useChatStore((s) => s.removeThread);
  const renameThread = useChatStore((s) => s.renameThread);
  const [isHovered, setIsHovered] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const open = Boolean(anchorEl);
  const menuButtonId = useMemo(
    () => `thread-menu-button-${thread.threadId}`,
    [thread.threadId],
  );

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    event.preventDefault();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setIsHovered(false);
  };

  const handleMenuItemClick = (action: string) => {
    if (action === 'delete') {
      setDeleteDialogOpen(true);
    } else if (action === 'rename') {
      setIsRenaming(true);
    }
    handleMenuClose();
  };

  const handleDeleteConfirm = () => {
    removeThread(thread.threadId);
    setDeleteDialogOpen(false);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(thread.name);
  const renameInputRef = useRef<HTMLInputElement>(null);

  const handleRenameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setIsRenaming(false);
      renameThread(thread.threadId, renameValue);
    }
    if (e.key === 'Escape') {
      setIsRenaming(false);
      setRenameValue(thread.name);
    }
  };

  // 포커스 효과를 위한 useEffect
  useEffect(() => {
    if (isRenaming && renameInputRef.current) {
      const rafId = requestAnimationFrame(() => {
        renameInputRef.current?.focus();
        renameInputRef.current?.select();
      });
      return () => cancelAnimationFrame(rafId);
    }
  }, [isRenaming]);

  return (
    <>
      {isRenaming ? (
        <InputWithLabel
          ref={renameInputRef}
          aria-label="rename-thread-input"
          noLabel
          value={renameValue}
          onChange={(e) => setRenameValue(e.target.value)}
          onKeyDown={handleRenameKeyDown}
          onBlur={() => {
            setIsRenaming(false);
          }}
        />
      ) : (
        <Box
          height={36}
          pl={1}
          bgcolor={isSelected ? COLORS.blueGrey[50] : 'transparent'}
          borderRadius={2}
          sx={{
            cursor: 'pointer',
            '&:hover': { backgroundColor: COLORS.grey[100] },
          }}
          onClick={() => setCurrentThread(thread.threadId)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => {
            if (!open) {
              setIsHovered(false);
            }
          }}
          display={'flex'}
          alignItems={'center'}
          justifyContent={'space-between'}
        >
          <Typography fontSize={14}>{thread.name || 'New Chat'}</Typography>
          {isHovered && (
            <IconButton
              size="small"
              onClick={handleMenuClick}
              id={menuButtonId}
              aria-controls={open ? 'thread-menu' : undefined}
              aria-haspopup={true}
              aria-expanded={open ? 'true' : undefined}
            >
              <MoreVert sx={{ fontSize: 20 }} />
            </IconButton>
          )}
          <Menu
            id="thread-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            keepMounted={false}
            disablePortal
            slotProps={{
              list: {
                'aria-labelledby': menuButtonId,
              },
              paper: {
                sx: {
                  borderRadius: 2,
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            disableAutoFocusItem
          >
            <MenuItem onClick={() => handleMenuItemClick('rename')}>
              <EditOutlined
                sx={{ fontSize: 20, color: COLORS.action.active, mr: 1 }}
              />
              <ListItemText slotProps={{ primary: { fontSize: 12 } }}>
                Name Edit
              </ListItemText>
            </MenuItem>
            <MenuItem onClick={() => handleMenuItemClick('delete')}>
              <DeleteOutline
                sx={{ fontSize: 20, color: COLORS.action.active, mr: 1 }}
              />
              <ListItemText slotProps={{ primary: { fontSize: 12 } }}>
                Delete
              </ListItemText>
            </MenuItem>
          </Menu>
          <Dialog
            open={deleteDialogOpen}
            onClose={handleDeleteCancel}
            aria-labelledby="delete-dialog-title"
            aria-describedby="delete-dialog-description"
            slotProps={{
              paper: {
                elevation: 1,
                sx: {
                  borderRadius: 4,
                },
              },
            }}
          >
            <DialogTitle
              id="delete-dialog-title"
              sx={{
                padding: 2,
                pb: 1,
              }}
            >
              Delete this chat?
            </DialogTitle>
            <DialogContent
              sx={{
                padding: 2,
                borderBottom: `1px solid ${COLORS.blueGrey[100]}`,
              }}
            >
              <DialogContentText id="delete-dialog-description">
                This action will delete &ldquo;{thread.name || 'New Chat'}
                &rdquo;
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleDeleteCancel}
                variant="outlined"
                size="small"
                sx={{
                  color: 'text.primary',
                  borderColor: 'text.primary',
                  borderRadius: '6px',
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteConfirm}
                variant="contained"
                size="small"
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      )}
    </>
  );
};

const ChatSidebarItem = memo(
  ChatSidebarItemComponent,
  (prev, next) =>
    prev.isSelected === next.isSelected && prev.thread === next.thread,
);
