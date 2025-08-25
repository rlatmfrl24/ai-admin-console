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
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import type { NavigationItem } from "../types/navigation";
import AssistantOutlinedIcon from "@mui/icons-material/AssistantOutlined";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { NAV_ITEMS } from "../constants/navigation";
import { useRouter } from "next/navigation";
import { indigo } from "@mui/material/colors";

type MenuItem = NavigationItem;

export default function SideNavigation() {
  const navItems = useMemo(() => {
    return NAV_ITEMS;
  }, []);

  const [open, setOpen] = useState(false);
  const router = useRouter();

  const toggleSidebar = () => {
    setOpen(!open);
  };

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
            containerBg: indigo[900],
            textColor: "#ffffff",
            paddingLeft: 2,
            fontSize: 16,
            height: 44,
          } as const;
          if (isExpanded) {
            return {
              ...style,
              containerBg: "#4C4A76",
              fontSize: 16,
            } as const;
          }
          return style;
        }
        if (depth === 1) {
          const style = {
            containerBg: indigo[900],
            textColor: "#ffffff",
            fontSize: 14,
            paddingLeft: 7,
            height: 36,
          } as const;
          if (hasChildren && isExpanded) {
            return {
              ...style,
              containerBg: "#4C4A76",
              fontSize: 14,
            } as const;
          }
          return style;
        }
        if (depth === 2) {
          const style = {
            containerBg: indigo[900],
            textColor: "#ffffff",
            fontSize: 12,
            paddingLeft: 7,
            height: 36,
          } as const;
          if (hasChildren && isExpanded) {
            return {
              ...style,
              containerBg: "#4C4A76",
              fontSize: 12,
            } as const;
          }
          return style;
        }
        return {
          containerBg: "#ffffff",
          textColor: indigo[900],
          fontSize: 12,
          paddingLeft: 8,
          height: 32,
        } as const;
      })();

      const fontWeight = depth === 0 ? (isExpanded ? 600 : 400) : 600;
      const lineHeight = depth === 0 ? "24px" : depth === 1 ? "20px" : "16px";

      return (
        <Box key={item.id} sx={{ backgroundColor: stylesByDepth.containerBg }}>
          <ListItemButton
            onClick={
              hasChildren
                ? () => handleToggleAtDepth(item.id, items)
                : () => {
                    router.push(currentPath);
                    toggleSidebar();
                  }
            }
            sx={{
              pl: stylesByDepth.paddingLeft,
              py: 0,
              height: stylesByDepth.height,
              "& .MuiListItemText-primary": {
                color: stylesByDepth.textColor,
                fontSize: stylesByDepth.fontSize,
                fontWeight,
                lineHeight,
              },
              borderBottom: "1px solid #ADB3B9",
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
    <Drawer open={open} onClose={toggleSidebar}>
      <Box minWidth={368} bgcolor={"#2C2A56"} height={"100%"}>
        <Box
          bgcolor={indigo[900]}
          height={54}
          px={1.5}
          display="flex"
          alignItems="center"
        >
          <IconButton onClick={toggleSidebar}>
            <MenuOpen sx={{ color: "white", fontSize: 24 }} />
          </IconButton>
        </Box>
        <Box>
          {navItems.length > 0 ? (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              height={200}
              flexDirection="column"
              sx={{ color: "#ffffff" }}
            >
              <CircularProgress size={28} sx={{ color: "#ffffff", mb: 1 }} />
              <Typography variant="body2">메뉴 불러오는 중…</Typography>
            </Box>
          ) : (
            <List disablePadding>{renderItems(navItems ?? [])}</List>
          )}
        </Box>
      </Box>
    </Drawer>
  );
}
