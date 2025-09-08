import { COLORS } from "@/lib/constants/color";

export const BSA_STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "in-progress", label: "In-Progress" },
  { value: "completed", label: "Completed" },
  { value: "done", label: "Done" },
] as const;

export type BSAStatus = (typeof BSA_STATUS_OPTIONS)[number]["value"];

export const BSA_STATUS_LABEL: Record<BSAStatus, string> = {
  draft: "Draft",
  "in-progress": "In-Progress",
  completed: "Completed",
  done: "Done",
};

export const BSA_STATUS_CHIP_COLOR: Record<BSAStatus, string> = {
  draft: COLORS.grey[300],
  "in-progress": COLORS.cyan[100],
  completed: COLORS.green.A100,
  done: COLORS.grey[200],
};

// 타입 호환 보조가 필요한 경우, 각 사용 파일에서 BSAStatus를 사용하세요.
