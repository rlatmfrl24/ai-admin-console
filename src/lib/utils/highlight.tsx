import React from "react";
import { colors } from "@mui/material";

import { buildSearchRegex } from "@/lib/utils/search";
import { useChatStore } from "@/lib/store/chatStore";

type HighlightOptions = {
  // caseSensitive/useRegex는 전역 스토어를 사용합니다. 호출부에서 넘길 필요가 없습니다.
  activeOccurrence?: number; // 1-based index of active match within this text
};

export function renderHighlightedText(
  text: string,
  query: string,
  options: HighlightOptions = {}
): React.ReactNode {
  if (!query || !query.trim()) return text;
  const caseSensitive = useChatStore.getState().searchCaseSensitive;
  const useRegex = useChatStore.getState().searchUseRegex;
  const { activeOccurrence } = options;
  const { regex } = buildSearchRegex(query, { caseSensitive, useRegex });
  if (!regex) return text;

  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let occurrenceIndex = 0;
  while ((match = regex.exec(text)) !== null) {
    const start = match.index;
    const end = start + match[0].length;
    // Zero-length match guard (e.g., lookaheads). Skip to avoid infinite loop and empty spans.
    if (end === start) {
      if (regex.lastIndex === match.index) {
        regex.lastIndex++;
      }
      continue;
    }
    if (start > lastIndex) {
      nodes.push(
        <React.Fragment key={lastIndex}>
          {text.slice(lastIndex, start)}
        </React.Fragment>
      );
    }
    occurrenceIndex += 1;
    const isActive =
      activeOccurrence != null && occurrenceIndex === activeOccurrence;
    nodes.push(
      <span
        key={`h-${start}`}
        style={{
          backgroundColor: isActive
            ? colors.teal.A200
            : "rgba(64, 255, 218, 0.32)",
          padding: 0,
        }}
      >
        {text.slice(start, end)}
      </span>
    );
    lastIndex = end;
    if (regex.lastIndex === match.index) {
      regex.lastIndex++;
    }
  }
  if (lastIndex < text.length) {
    nodes.push(
      <React.Fragment key={lastIndex}>{text.slice(lastIndex)}</React.Fragment>
    );
  }
  return nodes.length > 0 ? nodes : text;
}
