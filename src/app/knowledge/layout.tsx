"use client";

import { COLORS } from "@/constants/color";
import { NAV_ITEMS } from "@/constants/navigation";
import { ArrowDropDown } from "@mui/icons-material";
import { Box, Breadcrumbs, Typography } from "@mui/material";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

export default function KnowledgeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs = useMemo(() => {
    let currentItems = NAV_ITEMS;
    const accumulated: string[] = [];
    return segments.map((segment) => {
      accumulated.push(segment);
      const matched = currentItems.find((item) => item.id === segment);
      if (matched) {
        currentItems = matched.children ?? [];
        return {
          label: matched.label,
          href: `/${accumulated.join("/")}`,
        };
      }
      currentItems = [];
      return {
        label: segment,
        href: `/${accumulated.join("/")}`,
      };
    });
  }, [segments]);

  return (
    <Box p={1.5} height={"100%"}>
      <Box
        bgcolor={"white"}
        border={1}
        borderColor={COLORS.blueGrey[100]}
        height={"100%"}
        borderRadius={2}
      >
        <Box
          aria-label="BreadCrumbs"
          borderBottom={1}
          borderColor={COLORS.blueGrey[100]}
          px={2}
          py={1}
        >
          <Breadcrumbs separator="›" aria-label="breadcrumb">
            {breadcrumbs.map((breadcrumb, index) => (
              <Box
                key={index}
                display={"flex"}
                alignItems={"center"}
                p={0.5}
                gap={0.5}
              >
                <Typography lineHeight={1} fontSize={12} color="text.primary">
                  {breadcrumb.label}
                </Typography>
                {index < breadcrumbs.length - 1 && (
                  <ArrowDropDown
                    sx={{
                      fontSize: 16,
                    }}
                  />
                )}
              </Box>
            ))}
          </Breadcrumbs>
        </Box>
        <Box p={1.5}>{children}</Box>
      </Box>
    </Box>
  );
}
