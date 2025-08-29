import { useState, Fragment, useCallback, memo } from "react";
import {
  List,
  ListItemButton,
  ListItemText,
  Collapse,
  Box,
} from "@mui/material";
import { ArrowDropDown } from "@mui/icons-material";
import type { BSAMenuTreeItemProps } from "@/types/bsa";
import { COLORS } from "@/constants/color";

type MenuTreeProps = {
  items: BSAMenuTreeItemProps[];
  selectedId?: string;
  onSelect?: (id: string, item: BSAMenuTreeItemProps) => void;
  defaultExpandedIds?: string[];
  ariaLabel?: string;
};

function getDepthStyles(
  level: number,
  isExpanded: boolean,
  isSelected: boolean
) {
  switch (level) {
    case 0:
      return {
        bgcolor: isExpanded || isSelected ? COLORS.indigo[900] : "white",
        "&.Mui-selected": {
          bgcolor: COLORS.indigo[900],
        },
        "&:hover": {
          bgcolor:
            isExpanded || isSelected ? COLORS.indigo[800] : COLORS.grey[100],
        },
        "&.Mui-selected:hover": {
          bgcolor: COLORS.indigo[800],
        },
      } as const;
    case 1:
      return {
        bgcolor:
          isExpanded || isSelected ? COLORS.blueGrey[100] : COLORS.grey[100],
        "&.Mui-selected": {
          bgcolor: COLORS.blueGrey[100],
        },
        "&:hover": {
          bgcolor: COLORS.grey[200],
        },
        "&.Mui-selected:hover": {
          bgcolor: COLORS.grey[200],
        },
      } as const;
    default:
      return {} as const;
  }
}

const ExpandIcon = memo(function ExpandIcon({
  hasChildren,
  isExpanded,
}: {
  hasChildren: boolean;
  isExpanded: boolean;
}) {
  return (
    <Box display="inline-flex" alignItems="center" width={20}>
      {hasChildren ? (
        isExpanded ? (
          <ArrowDropDown
            sx={{ transform: "rotate(180deg)", color: "white" }}
            fontSize="small"
          />
        ) : (
          <ArrowDropDown fontSize="small" sx={{ color: "action.active" }} />
        )
      ) : null}
    </Box>
  );
});

function MenuTree({
  items = [],
  selectedId,
  onSelect,
  defaultExpandedIds,
  ariaLabel,
}: MenuTreeProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    () => new Set<string>(defaultExpandedIds ?? [])
  );

  const toggleExpand = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleSelect = useCallback(
    (item: BSAMenuTreeItemProps) => {
      onSelect?.(item.id, item);
    },
    [onSelect]
  );

  const renderItems = (
    nodes: BSAMenuTreeItemProps[],
    level: number,
    parentPrefix: string
  ) => {
    const sorted = [...nodes].sort((a, b) => a.index - b.index);
    return sorted.map((node) => {
      const hasChildren =
        Array.isArray(node.children) && node.children.length > 0;
      const isExpanded = expandedIds.has(node.id);
      const isSelected = selectedId === node.id;
      const basePrefix = parentPrefix ? parentPrefix + "." : "";
      const displayPrefix = `${basePrefix}${node.index}.`;
      const primaryStyles = {
        fontSize: 12,
        fontWeight: level === 0 ? 500 : 400,
        lineHeight: 1.5,
        color:
          (level === 0 && isExpanded) || (level === 0 && isSelected)
            ? "white"
            : "text.primary",
      } as const;

      return (
        <Fragment key={node.id}>
          <ListItemButton
            role="treeitem"
            aria-level={level + 1}
            aria-expanded={hasChildren ? isExpanded : undefined}
            selected={isSelected}
            onClick={() => {
              if (hasChildren) {
                toggleExpand(node.id);
              } else {
                handleSelect(node);
              }
            }}
            sx={{
              pl: 1,
              py: 0.5,
              gap: 0.5,
              minHeight: 32,
              alignItems: "center",
              borderBottom: 1,
              borderColor: COLORS.blueGrey[100],
              ...getDepthStyles(level, isExpanded, isSelected),
            }}
          >
            <ExpandIcon hasChildren={hasChildren} isExpanded={isExpanded} />
            <ListItemText
              primary={`${displayPrefix} ${node.label}`}
              sx={{
                "& .MuiListItemText-primary": primaryStyles,
              }}
            />
          </ListItemButton>
          {hasChildren && (
            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
              <List disablePadding role="group">
                {renderItems(
                  node.children,
                  level + 1,
                  `${basePrefix}${node.index}`
                )}
              </List>
            </Collapse>
          )}
        </Fragment>
      );
    });
  };

  return (
    <Box role="tree" aria-label={ariaLabel} sx={{ width: "100%" }}>
      <List disablePadding>{renderItems(items, 0, "")}</List>
    </Box>
  );
}
export default memo(MenuTree);
