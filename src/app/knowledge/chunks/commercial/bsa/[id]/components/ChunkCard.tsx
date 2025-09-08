import { COLORS } from "@/lib/theme";
import { ChunkProps } from "@/lib/types/bsa";
// [인수인계 메모]
// - 역할: 단일 Chunk 카드 UI(상태칩/제목/진행ID/액션)
// - API 연동 시 onDelete, onSelect는 상위에서 서버 호출 후 상태를 동기화하세요.
// - 선택/삭제/드래그 상태에서 이벤트 버블링 제어 주의.
// - 접근성: 버튼에 적절한 aria-label 적용(이미 반영), 카드 선택 시 키보드 접근 고려.
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
import {
  BSA_STATUS_CHIP_COLOR,
  BSA_STATUS_LABEL,
  type BSAStatus,
} from "@/lib/constants/bsa-status";

function getStatusChip(status: BSAStatus) {
  return (
    <Chip
      label={BSA_STATUS_LABEL[status]}
      backgroundColor={BSA_STATUS_CHIP_COLOR[status]}
    />
  );
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
          {getStatusChip(chunk.status as BSAStatus)}
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
              <ListItemText
                sx={{
                  "& .MuiListItemText-primary": {
                    fontSize: 12,
                    lineHeight: "16px",
                  },
                }}
              >
                Delete
              </ListItemText>
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
  showProgressId = false,
}: {
  chunk: ChunkProps;
  selected?: boolean;
  onSelect?: (chunk: ChunkProps) => void;
  showProgressId?: boolean;
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
