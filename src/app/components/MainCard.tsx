import {
  Box,
  Card,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  Collapse,
} from "@mui/material";
import AssistantOutlinedIcon from "@mui/icons-material/AssistantOutlined";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { forwardRef, useEffect, useState } from "react";
import { blueGrey, grey, indigo } from "@mui/material/colors";
import { NavigationItem } from "../types/navigation";
import { useRouter } from "next/navigation";

export const MainCard = forwardRef<
  HTMLDivElement,
  {
    isExpanded: boolean;
    onClick: () => void;
    data: NavigationItem;
  }
>(({ isExpanded, onClick, data }, ref) => {
  type MenuItem = NavigationItem;

  const router = useRouter();
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => ({}));

  // 카드가 닫힐 때 모든 서브 메뉴 상태를 초기화
  useEffect(() => {
    if (!isExpanded) {
      setExpanded({});
    }
  }, [isExpanded]);

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

      siblings.forEach((sib) => {
        if (sib.id !== id) {
          delete next[sib.id];
          const descendantIds = collectDescendantIds(sib);
          descendantIds.forEach((dId) => delete next[dId]);
        }
      });

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

  const renderItems = (
    items: MenuItem[],
    depth = 0,
    ancestorIds: string[] = []
  ) => {
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
      const isItemExpanded = !!expanded[item.id];
      const currentPathIds = [...ancestorIds, item.id];

      const stylesByDepth = (() => {
        if (depth === 0) {
          return {
            textColor: "white",
            fontSize: 16,
            fontWeight: 600,
            paddingLeft: "12px",
            height: 44,
            bgColor: indigo[900],
          } as const;
        }
        if (depth === 1) {
          return {
            textColor: "black",
            fontSize: 14,
            paddingLeft: "24px",
            fontWeight: 500,
            height: 36,
            bgColor: grey[200],
          } as const;
        }
        if (depth === 2) {
          return {
            textColor: "black",
            fontSize: 12,
            paddingLeft: "32px",
            fontWeight: 400,
            height: 32,
            bgColor: blueGrey[100],
          } as const;
        }
      })();

      return (
        <Box
          key={item.id}
          sx={{
            bgcolor: stylesByDepth?.bgColor,
          }}
        >
          <ListItemButton
            onClick={
              hasChildren
                ? () => handleToggleAtDepth(item.id, items)
                : () => router.push(`/${currentPathIds.join("/")}`)
            }
            sx={{
              pl: stylesByDepth?.paddingLeft,
              height: stylesByDepth?.height,
              "& .MuiListItemText-primary": {
                color: stylesByDepth?.textColor,
                fontSize: stylesByDepth?.fontSize,
                fontWeight: stylesByDepth?.fontWeight,
              },
            }}
          >
            <ListItemText primary={item.label} />
            {hasChildren && (
              <ArrowDropDownIcon
                sx={{
                  color: stylesByDepth?.textColor,
                  fontSize: 24,
                  transition: "transform 0.3s ease-in-out",
                  transform: isItemExpanded ? "rotate(180deg)" : "rotate(0deg)",
                }}
              />
            )}
          </ListItemButton>
          {hasChildren && (
            <Collapse in={isItemExpanded} timeout="auto" unmountOnExit>
              <List disablePadding>
                {renderItems(item.children!, depth + 1, currentPathIds)}
              </List>
            </Collapse>
          )}
        </Box>
      );
    });
  };

  const hasChildren = Array.isArray(data.children) && data.children.length > 0;

  return (
    <Box flex={1} minWidth={0} height="fit-content">
      <Card
        sx={{
          p: 3,
          borderRadius: 2,
          height: "100%",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          cursor: "pointer",
        }}
        ref={ref}
        onClick={onClick}
      >
        <Box
          color="#5E5ADB"
          bgcolor="#EAE9FF"
          width={48}
          height={48}
          borderRadius={99}
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{ cursor: "pointer" }}
        >
          <AssistantOutlinedIcon sx={{ fontSize: 36 }} />
        </Box>
        <Typography
          fontSize={28}
          fontWeight={600}
          mt={2}
          mb={1}
          sx={{ cursor: "pointer" }}
        >
          {data.label}
        </Typography>
        <Typography
          fontSize={16}
          fontWeight={400}
          color="#858E96"
          whiteSpace={isExpanded ? "normal" : "nowrap"}
          overflow="hidden"
          sx={{ textOverflow: "ellipsis" }}
          style={{ cursor: "pointer" }}
        >
          {data.description}
        </Typography>
        {hasChildren && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <Box
              mt={3}
              sx={{ overflowY: "auto" }}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <List disablePadding>
                {renderItems(data.children!, 0, [data.id])}
              </List>
            </Box>
          </Collapse>
        )}
      </Card>
    </Box>
  );
});
MainCard.displayName = "MainCard";
