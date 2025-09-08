"use client";

import { Box, Checkbox, Divider, Typography, Menu } from "@mui/material";
import { ArrowDropDown } from "@mui/icons-material";
import { useBSAChunksStore } from "@/app/knowledge/chunks/commercial/bsa/store/bsaChunksStore";
import type { ChunkProps } from "@/types/bsa";
import { COLORS } from "@/constants/color";
import { useState, type Dispatch, type SetStateAction } from "react";

export default function FilterChipMenu({
  filter,
  setFilter,
}: {
  filter: string[];
  setFilter: Dispatch<SetStateAction<string[]>>;
}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const STATUS_OPTIONS = [
    { value: "draft", label: "Draft" },
    { value: "in-progress", label: "In-Progress" },
    { value: "completed", label: "Completed" },
    { value: "done", label: "Done" },
  ] as const;

  const chunks = useBSAChunksStore((s) => s.chunks);
  const statusCounts: Record<ChunkProps["status"], number> = {
    draft: chunks.filter((c) => c.status === "draft").length,
    "in-progress": chunks.filter((c) => c.status === "in-progress").length,
    completed: chunks.filter((c) => c.status === "completed").length,
    done: chunks.filter((c) => c.status === "done").length,
  };

  const menuLabel = (() => {
    const count = filter.length;
    if (count === 0) return "None";
    if (count === STATUS_OPTIONS.length) return "All Status";
    const firstLabel =
      STATUS_OPTIONS.find((o) => o.value === filter[0])?.label ?? "";
    if (count === 1) return firstLabel;
    return `${firstLabel} +${count - 1}`;
  })();

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
        sx={{
          cursor: "pointer",
          backgroundColor:
            filter.length === 0 || filter.length === STATUS_OPTIONS.length
              ? "white"
              : COLORS.indigo[900],
        }}
        color={
          filter.length === 0 || filter.length === STATUS_OPTIONS.length
            ? "rgba(0, 0, 0, 0.87)"
            : "white"
        }
        onClick={(e) => {
          if (open) {
            setAnchorEl(null);
          } else {
            setAnchorEl(e.currentTarget as HTMLElement);
          }
        }}
      >
        <Typography lineHeight={1} fontSize={12}>
          {menuLabel}
        </Typography>
        <ArrowDropDown sx={{ fontSize: 16 }} />
      </Box>

      <Menu
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
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
        <div
          onMouseDown={(e) => {
            e.preventDefault();
          }}
          onClick={(e) => {
            e.stopPropagation();
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
            onClick={(e) => {
              e.stopPropagation();
              if (filter.length === STATUS_OPTIONS.length) {
                setFilter([]);
              } else {
                setFilter(STATUS_OPTIONS.map((o) => o.value));
              }
            }}
          >
            <Checkbox
              size="small"
              checked={filter.length === STATUS_OPTIONS.length}
            />
            <Typography fontSize={13}>All Status</Typography>
          </Box>
        </div>
        <Divider />
        {STATUS_OPTIONS.map(({ value, label }) => (
          <div
            key={value}
            onClick={(e) => {
              e.preventDefault();
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
              onClick={(e) => {
                e.stopPropagation();
                if (filter.includes(value)) {
                  setFilter(filter.filter((f) => f !== value));
                } else {
                  setFilter([...filter, value]);
                }
              }}
            >
              <Checkbox size="small" checked={filter.includes(value)} />
              <Typography fontSize={13} flex={1}>
                {label}
              </Typography>
              <Typography
                fontSize={12}
                px={1}
                py={0.5}
                lineHeight={1}
                borderRadius={1}
                bgcolor={
                  value === "draft"
                    ? COLORS.grey[300]
                    : value === "in-progress"
                    ? COLORS.cyan[100]
                    : value === "completed"
                    ? COLORS.green.A100
                    : COLORS.grey[200]
                }
              >
                {statusCounts[value as ChunkProps["status"]]}
              </Typography>
            </Box>
          </div>
        ))}
      </Menu>
    </>
  );
}
