"use client";

import { Box, Typography } from "@mui/material";
import MainLayer1 from "@/assets/main-layer-1.svg";
import MainLayer2 from "@/assets/main-layer-2.svg";
import { useEffect, useMemo, useRef, useState } from "react";
import { NavigationItem } from "../types/navigation";
import { MainCard } from "../components/MainCard";
import { NAV_ITEMS } from "../constants/navigation";

const TARGET_NAV_ID = [
  "knowledge",
  "chatbot-settings",
  "settings",
  "customer-support",
];

export default function Main() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const navItems = useMemo(() => {
    return NAV_ITEMS;
  }, []);

  const handleCardClick = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      if (!expandedId) return;
      const currentRef = cardRefs.current[expandedId];
      if (!currentRef) return;
      const target = event.target as Node;
      if (!currentRef.contains(target)) {
        setExpandedId(null);
      }
    };
    document.addEventListener("mousedown", handleDocumentClick);
    return () => {
      document.removeEventListener("mousedown", handleDocumentClick);
    };
  }, [expandedId]);

  const targetNavItems = navItems
    ? TARGET_NAV_ID.map((id) => navItems.find((item) => item.id === id))
        .filter((item): item is NavigationItem => !!item)
        .sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
    : [];

  return (
    <Box position="relative" height="100%" bgcolor="white">
      <Box position="absolute" top={0} right={0} zIndex={1}>
        <MainLayer1 />
      </Box>
      <Box position="absolute" top={0} right={493} zIndex={1}>
        <MainLayer2 />
      </Box>
      <Typography
        fontSize={45}
        fontWeight={500}
        lineHeight={"52px"}
        position="absolute"
        top={247}
        left={40}
      >
        ALLEGRO NX System Admin
        <br /> super easy and quick for everyone.
      </Typography>

      {targetNavItems?.length > 0 && (
        <Box
          zIndex={3}
          p={5}
          gap={3}
          display="flex"
          alignItems="flex-end"
          position="absolute"
          bottom={0}
          left={0}
          width="100%"
        >
          {targetNavItems.map((child) => (
            <MainCard
              key={child.id}
              isExpanded={expandedId === child.id}
              onClick={() => handleCardClick(child.id)}
              data={child}
              ref={(el) => {
                cardRefs.current[child.id] = el;
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}
