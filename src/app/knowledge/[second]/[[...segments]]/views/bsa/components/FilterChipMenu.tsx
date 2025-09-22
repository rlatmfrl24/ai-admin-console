"use client";

// [인수인계 메모]
// - 역할: 상태(draft/in-progress/completed/done) 필터 Chip + 메뉴.
// - API 연동 시: 필터 변경(setFilter) 시 서버 목록 재조회 트리거로 연결.
// - 유의: 메뉴 열림 상태(anchorEl)와 클릭 이벤트 버블링 제어.
// - 접근성: 메뉴키보드 탐색/포커스 관리(MUI 기본 제공), aria 속성 검토.

import { Box, Checkbox, Divider, Typography, Menu } from "@mui/material";
import { ArrowDropDown } from "@mui/icons-material";
import {
  useState,
  useMemo,
  useCallback,
  type Dispatch,
  type SetStateAction,
} from "react";

import type { ChunkProps } from "@/lib/types/bsa";

import { useBSAStore } from "@/lib/store/bsaStore";
import { COLORS } from "@/lib/theme";
import {
  BSA_STATUS_OPTIONS,
  BSA_STATUS_LABEL,
  BSA_STATUS_CHIP_COLOR,
  type BSAStatus,
} from "@/lib/constants/bsa-status";

export default function FilterChipMenu({
  filter,
  setFilter,
}: {
  filter: string[];
  setFilter: Dispatch<SetStateAction<string[]>>;
}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const chunks = useBSAStore((s) => s.chunks);
  const statusCounts: Record<BSAStatus, number> = useMemo(
    () => ({
      draft: chunks.filter((c) => c.status === "draft").length,
      "in-progress": chunks.filter((c) => c.status === "in-progress").length,
      completed: chunks.filter((c) => c.status === "completed").length,
      done: chunks.filter((c) => c.status === "done").length,
    }),
    [chunks]
  );

  const menuLabel = useMemo(() => {
    const count = filter.length;
    if (count === 0) return "None";
    if (count === BSA_STATUS_OPTIONS.length) return "All Status";
    const first = filter[0] as BSAStatus | undefined;
    const firstLabel = first ? BSA_STATUS_LABEL[first] : "";
    if (count === 1) return firstLabel;
    return `${firstLabel} +${count - 1}`;
  }, [filter]);

  const handleTriggerClick = useCallback(
    (e: React.MouseEvent) => {
      if (open) {
        setAnchorEl(null);
      } else {
        setAnchorEl(e.currentTarget as HTMLElement);
      }
    },
    [open]
  );

  const handleMenuClose = useCallback(() => setAnchorEl(null), []);

  const handleToggleAll = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setFilter((prev) =>
        prev.length === BSA_STATUS_OPTIONS.length
          ? []
          : BSA_STATUS_OPTIONS.map((o) => o.value)
      );
    },
    [setFilter]
  );

  const handleToggleOption = useCallback(
    (value: string) => (e: React.MouseEvent) => {
      e.stopPropagation();
      setFilter((prev) =>
        prev.includes(value)
          ? prev.filter((f) => f !== value)
          : [...prev, value]
      );
    },
    [setFilter]
  );

  return (
    <>
      <Box
        display={"flex"}
        alignItems={"center"}
        gap={0.5}
        border={1}
        borderColor={"rgba(0, 0, 0, 0.42)"}
        borderRadius={2}
        p={"3px 4px 3px 8px"}
        ml={1}
        sx={{
          cursor: "pointer",
          backgroundColor:
            filter.length === 0 || filter.length === BSA_STATUS_OPTIONS.length
              ? "white"
              : COLORS.indigo[900],
        }}
        color={
          filter.length === 0 || filter.length === BSA_STATUS_OPTIONS.length
            ? "rgba(0, 0, 0, 0.87)"
            : "white"
        }
        onClick={handleTriggerClick}
      >
        <Typography lineHeight={1} fontSize={12}>
          {menuLabel}
        </Typography>
        <ArrowDropDown sx={{ fontSize: 16 }} />
      </Box>

      <Menu
        open={open}
        anchorEl={anchorEl}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          paper: {
            sx: {
              borderRadius: "8px",
              minWidth: "200px",
              backgroundColor: "white",
              boxShadow:
                "0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.20)",
            },
          },
          list: { disablePadding: true },
        }}
      >
        <Box
          role="button"
          tabIndex={0}
          onMouseDown={(e) => {
            e.preventDefault();
          }}
          onClick={(e) => {
            e.stopPropagation();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
            }
          }}
        >
          <Box
            display={"flex"}
            alignItems={"center"}
            gap={0.5}
            p={0.5}
            sx={{
              cursor: "pointer",
              "&:hover": { backgroundColor: COLORS.text.states.selected },
            }}
            onClick={handleToggleAll}
          >
            <Checkbox
              size="small"
              checked={filter.length === BSA_STATUS_OPTIONS.length}
            />
            <Typography fontSize={13}>All Status</Typography>
          </Box>
        </Box>
        <Divider />
        {BSA_STATUS_OPTIONS.map(({ value }) => (
          <Box
            key={value}
            role="button"
            tabIndex={0}
            onClick={(e) => {
              e.preventDefault();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
              }
            }}
          >
            <Box
              display={"flex"}
              alignItems={"center"}
              gap={0.5}
              pl={0.5}
              pr={1.5}
              sx={{
                cursor: "pointer",
                "&:hover": { backgroundColor: COLORS.blueGrey[50] },
              }}
              onClick={handleToggleOption(value)}
            >
              <Checkbox size="small" checked={filter.includes(value)} />
              <Typography fontSize={13} flex={1}>
                {BSA_STATUS_LABEL[value]}
              </Typography>
              <Typography
                fontSize={12}
                px={1}
                py={0.5}
                lineHeight={1}
                borderRadius={1}
                bgcolor={BSA_STATUS_CHIP_COLOR[value]}
              >
                {statusCounts[value as ChunkProps["status"]]}
              </Typography>
            </Box>
          </Box>
        ))}
      </Menu>
    </>
  );
}
