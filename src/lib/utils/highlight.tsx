import React from "react";
import { COLORS } from "@/lib/constants/color";

function escapeRegExp(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

type HighlightOptions = {
  caseSensitive?: boolean;
  useRegex?: boolean;
  activeOccurrence?: number; // 1-based index of active match within this text
};

export function renderHighlightedText(
  text: string,
  query: string,
  options: HighlightOptions = {}
): React.ReactNode {
  if (!query || !query.trim()) return text;
  const { caseSensitive = false, useRegex = false, activeOccurrence } = options;

  let pattern = query.trim();
  if (!useRegex) {
    pattern = escapeRegExp(pattern);
  }

  let regex: RegExp | null = null;
  try {
    regex = new RegExp(pattern, `g${caseSensitive ? "" : "i"}`);
  } catch {
    return text;
  }

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
            ? COLORS.warning.states.focusVisible
            : COLORS.primary.states.focus,
          borderRadius: 4,
          padding: "0 2px",
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
