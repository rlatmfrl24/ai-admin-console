import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Collapse,
  ListItemIcon,
} from "@mui/material";
import { MenuOpen } from "@mui/icons-material";
import { useEffect, useMemo, useState } from "react";
import type { NavigationItem } from "../types/navigation";
import AssistantOutlinedIcon from "@mui/icons-material/AssistantOutlined";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { NAV_ITEMS } from "../constants/navigation";
import { useRouter } from "next/navigation";
import { COLORS } from "@/constants/color";

type MenuItem = NavigationItem;

type SideNavigationProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function SideNavigation({
  open,
  onOpenChange,
}: SideNavigationProps) {
  const navItems = useMemo(() => {
    return NAV_ITEMS;
  }, []);
  const router = useRouter();

  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => ({}));

  const collectDescendantIds = (item: MenuItem): string[] => {
    if (!Array.isArray(item.children) || item.children.length === 0) {
      return [];
    }
    return item.children.reduce<string[]>((acc, child) => {
      acc.push(child.id, ...collectDescendantIds(child));
      return acc;
    }, []);
  };

  const handleToggleAtDepth = (id: string, siblings: MenuItem[]) => {
    setExpanded((prev) => {
      const isCurrentlyExpanded = !!prev[id];
      const next: Record<string, boolean> = { ...prev };

      // 닫아야 할 형제들과 그 하위들을 모두 닫음
      siblings.forEach((sib) => {
        if (sib.id !== id) {
          delete next[sib.id];
          const descendantIds = collectDescendantIds(sib);
          descendantIds.forEach((dId) => delete next[dId]);
        }
      });

      // 클릭한 항목 토글 및 하위 정리
      if (isCurrentlyExpanded) {
        delete next[id];
        const clicked = siblings.find((s) => s.id === id);
        if (clicked) {
          const descendantIds = collectDescendantIds(clicked);
          descendantIds.forEach((dId) => delete next[dId]);
        }
      } else {
        next[id] = true;
      }

      return next;
    });
  };

  useEffect(() => {
    if (!open) {
      setExpanded({} as Record<string, boolean>);
    }
  }, [open]);

  const renderItems = (items: MenuItem[], depth = 0, parentPath = "") => {
    const sortedItems = items
      .map((it, pos) => ({ it, pos }))
      .sort((a, b) => {
        const ai = a.it.index ?? a.pos;
        const bi = b.it.index ?? b.pos;
        return ai - bi;
      })
      .map(({ it }) => it);
    return sortedItems.map((item) => {
      const hasChildren =
        Array.isArray(item.children) && item.children.length > 0;
      const isExpanded = !!expanded[item.id];
      const currentPath = `${parentPath}/${item.id}`;

      const stylesByDepth = (() => {
        if (depth === 0) {
          const style = {
            containerBg: COLORS.indigo[900],
            textColor: "#ffffff",
            paddingLeft: 2,
            fontSize: 16,
            fontWeight: 600,
            height: 44,
            borderBottom: "1px solid ",
            borderColor: COLORS.blueGrey[700],
          } as const;
          if (isExpanded) {
            return {
              ...style,
              containerBg: COLORS.indigo[800],
              fontSize: 16,
              borderBottom: "1px solid ",
              borderColor: COLORS.indigo[900],
            } as const;
          }
          return style;
        }
        if (depth === 1) {
          const style = {
            containerBg: COLORS.indigo[900],
            textColor: "#ffffff",
            fontSize: 14,
            fontWeight: 600,
            paddingLeft: 7,
            height: 36,
            borderBottom: "1px solid ",
            borderColor: COLORS.blueGrey[700],
          } as const;
          if (hasChildren && isExpanded) {
            return {
              ...style,
              containerBg: COLORS.indigo[800],
              fontSize: 14,
              borderBottom: "1px solid ",
              borderColor: COLORS.indigo[900],
            } as const;
          }
          return style;
        }
        if (depth === 2) {
          const style = {
            containerBg: COLORS.indigo[900],
            textColor: "#ffffff",
            fontSize: 12,
            fontWeight: 500,
            paddingLeft: 7,
            height: 36,
            borderBottom: "1px solid ",
            borderColor: COLORS.blueGrey[700],
          } as const;
          if (hasChildren && isExpanded) {
            return {
              ...style,
              containerBg: COLORS.indigo[800],
              fontSize: 12,
              borderBottom: "1px solid ",
              borderColor: COLORS.indigo[900],
            } as const;
          }
          return style;
        }
        return {
          containerBg: COLORS.blueGrey[50],
          textColor: "rgba(0, 0, 0, 0.87)",
          fontSize: 12,
          fontWeight: 500,
          paddingLeft: 8,
          height: 32,
          borderBottom: "1px solid ",
          borderColor: COLORS.blueGrey[50],
        } as const;
      })();

      return (
        <Box key={item.id} sx={{ backgroundColor: stylesByDepth.containerBg }}>
          <ListItemButton
            onClick={
              hasChildren
                ? () => handleToggleAtDepth(item.id, items)
                : () => {
                    router.push(currentPath);
                    onOpenChange(false);
                  }
            }
            sx={{
              pl: stylesByDepth.paddingLeft,
              py: 0,
              height: stylesByDepth.height,
              "& .MuiListItemText-primary": {
                color: stylesByDepth.textColor,
                fontSize: stylesByDepth.fontSize,
                fontWeight: stylesByDepth.fontWeight,
              },
              borderBottom: stylesByDepth.borderBottom,
              borderColor: stylesByDepth.borderColor,
            }}
          >
            {depth === 0 && (
              <ListItemIcon
                sx={{ minWidth: 0, mr: 1, color: stylesByDepth.textColor }}
              >
                <AssistantOutlinedIcon />
              </ListItemIcon>
            )}
            <ListItemText primary={item.label} />
            {hasChildren && (
              <ArrowDropDownIcon
                sx={{
                  color: stylesByDepth.textColor,
                  fontSize: 24,
                  transition: "transform 0.3s ease-in-out",
                  transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                }}
              />
            )}
          </ListItemButton>
          {hasChildren && (
            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
              <List disablePadding>
                {renderItems(item.children!, depth + 1, currentPath)}
              </List>
            </Collapse>
          )}
        </Box>
      );
    });
  };

  return (
    <Drawer open={open} onClose={() => onOpenChange(false)}>
      <Box minWidth={368} bgcolor={COLORS.indigo[900]} height={"100%"}>
        <Box
          bgcolor={COLORS.indigo[900]}
          height={54}
          px={1.5}
          display="flex"
          alignItems="center"
        >
          <IconButton onClick={() => onOpenChange(false)}>
            <MenuOpen sx={{ color: "white", fontSize: 24 }} />
          </IconButton>
        </Box>
        <Box>
          <List disablePadding>{renderItems(navItems ?? [])}</List>
        </Box>
      </Box>
    </Drawer>
  );
}
