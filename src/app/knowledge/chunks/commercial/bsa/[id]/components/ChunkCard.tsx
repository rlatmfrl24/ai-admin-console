import { COLORS } from "@/constants/color";
import { ChunkProps } from "@/types/bsa";
import {
  Box,
  Card,
  CardContent,
  IconButton,
  Typography,
  Popover,
  MenuItem,
  ListItemText,
} from "@mui/material";
import { Chip } from "@/components/common/Chip";
import { CheckCircle, MoreVert } from "@mui/icons-material";
import { useState } from "react";

function getStatusChip(status: string) {
  switch (status) {
    case "done":
      return <Chip label="Done" backgroundColor={COLORS.grey[200]} />;
    case "in-progress":
      return <Chip label="In-Progress" backgroundColor={COLORS.cyan[100]} />;
    case "completed":
      return <Chip label="Completed" backgroundColor={COLORS.green.A100} />;
    case "draft":
      return <Chip label="Draft" backgroundColor={COLORS.grey[300]} />;
    default:
      return null;
  }
}

export function ChunkCard({
  chunk,
  selected = false,
  showProgressId = true,
  onSelect,
  onDelete,
  disableClick = false,
  disableActions = false,
}: {
  chunk: ChunkProps;
  selected?: boolean;
  showProgressId?: boolean;
  onSelect?: (chunk: ChunkProps) => void;
  onDelete?: (chunk: ChunkProps) => void;
  disableClick?: boolean;
  disableActions?: boolean;
}) {
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);
  const isMenuOpen = Boolean(menuAnchorEl);
  const openMenu = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setMenuAnchorEl(e.currentTarget as HTMLElement);
  };
  const closeMenu = () => setMenuAnchorEl(null);
  return (
    <Card
      sx={{
        border: 1,
        borderColor: selected ? COLORS.primary.main : COLORS.blueGrey[100],
        borderRadius: 2,
        minWidth: 252,
        width: "100%",
        cursor: disableClick ? "grab" : "pointer",
      }}
      elevation={selected ? 2 : 0}
      onClick={(e) => {
        if (disableClick || isMenuOpen) {
          e.stopPropagation();
          return;
        }
        onSelect?.(chunk);
      }}
    >
      <CardContent sx={{ "&.MuiCardContent-root": { p: 1.5 } }}>
        <Box display={"flex"} justifyContent={"space-between"}>
          {getStatusChip(chunk.status)}
          <IconButton
            aria-label="More Options"
            sx={{ p: 0.5 }}
            disabled={disableActions}
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            onClick={disableActions ? undefined : openMenu}
          >
            <MoreVert sx={{ fontSize: "16px" }} />
          </IconButton>
          <Popover
            open={isMenuOpen}
            anchorEl={menuAnchorEl}
            onClose={closeMenu}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            slotProps={{
              paper: {
                elevation: 1,
                sx: {
                  border: "1px solid",
                  borderColor: COLORS.blueGrey[100],
                  borderRadius: 2,
                  bgcolor: COLORS.common.white,
                  overflow: "visible",
                },
              },
            }}
          >
            <MenuItem
              onClick={(e) => {
                e.stopPropagation();
                closeMenu();
                onDelete?.(chunk);
              }}
              sx={{
                "&.MuiMenuItem-root": {
                  borderRadius: 2,
                },
              }}
            >
              <ListItemText>Delete</ListItemText>
            </MenuItem>
          </Popover>
        </Box>
        <Typography mt="10px" fontSize={14} fontWeight={400}>
          {chunk.title}
        </Typography>
        {showProgressId && (
          <Typography
            color={COLORS.blueGrey[300]}
            fontSize={12}
            fontWeight={500}
          >
            {chunk.progressId}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

export function CheckableChunkCard({
  chunk,
  selected = false,
  onSelect,
}: {
  chunk: ChunkProps;
  selected?: boolean;
  onSelect?: (chunk: ChunkProps) => void;
}) {
  return (
    <Card
      sx={{
        borderRadius: 2,
        minWidth: 252,
        width: "100%",
        cursor: "pointer",
      }}
      onClick={() => onSelect?.(chunk)}
      elevation={2}
    >
      <CardContent sx={{ "&.MuiCardContent-root": { p: 1.5 } }}>
        <Box display={"flex"} justifyContent={"space-between"}>
          {getStatusChip(chunk.status)}
          <CheckCircle
            sx={{
              fontSize: "20px",
              color: selected ? COLORS.primary.main : COLORS.blueGrey[300],
            }}
          />
        </Box>
        <Typography mt="10px">{chunk.title}</Typography>
      </CardContent>
    </Card>
  );
}
