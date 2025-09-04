"use client";

import { COLORS } from "@/constants/color";
import { NAV_ITEMS } from "@/constants/navigation";
import { ArrowDropDown } from "@mui/icons-material";
import { Box, Breadcrumbs, Typography } from "@mui/material";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { useHeaderStore } from "@/app/knowledge/chunks/commercial/bsa/store/headerStore";

const KnowledgeBreadcrumbs = ({
  breadcrumbs,
  headerNode,
}: {
  breadcrumbs: { label: string; href: string }[];
  headerNode?: React.ReactNode;
}) => {
  return (
    <Box
      aria-label="BreadCrumbs"
      borderBottom={1}
      borderColor={COLORS.blueGrey[100]}
      px={2}
      py={1}
      display={"flex"}
      alignItems={"center"}
      justifyContent={"space-between"}
    >
      <Breadcrumbs separator="/" aria-label="breadcrumb">
        {breadcrumbs.map((breadcrumb, index) => (
          <Box
            aria-label="Breadcrumb"
            key={index}
            display={"flex"}
            alignItems={"center"}
            p={0.5}
            gap={0.5}
            borderRadius={1}
            sx={{
              cursor: "pointer",
              "&:hover": {
                backgroundColor: COLORS.action.selected,
              },
            }}
          >
            <Typography lineHeight={1} fontSize={12} color="text.primary">
              {breadcrumb.label}
            </Typography>
            <ArrowDropDown
              sx={{
                fontSize: 16,
              }}
            />
          </Box>
        ))}
      </Breadcrumbs>
      {headerNode}
    </Box>
  );
};

export default function KnowledgeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const segments = useMemo(
    () => pathname.split("/").filter(Boolean),
    [pathname]
  );
  const headerNode = useHeaderStore((s) => s.headerNode);
  const initialBreadcrumbs = useMemo(() => {
    let currentItems = NAV_ITEMS;
    const accumulated: string[] = [];
    return segments.reduce<{ label: string; href: string }[]>(
      (acc, segment) => {
        const matched = currentItems.find((item) => item.id === segment);
        if (!matched) {
          currentItems = [];
          return acc;
        }
        accumulated.push(segment);
        currentItems = matched.children ?? [];
        acc.push({
          label: matched.label,
          href: `/${accumulated.join("/")}`,
        });
        return acc;
      },
      []
    );
  }, [segments]);

  return (
    <Box display={"flex"} flexDirection={"column"} height={"100%"}>
      <Box height={"100%"} display={"flex"} flexDirection={"column"}>
        <Box
          bgcolor={"white"}
          border={1}
          borderColor={COLORS.blueGrey[100]}
          flexGrow={1}
          height={0}
          minHeight={0}
          overflow={"auto"}
          m={1.5}
          borderRadius={2}
          display={"flex"}
          flexDirection={"column"}
        >
          <KnowledgeBreadcrumbs
            breadcrumbs={initialBreadcrumbs}
            headerNode={headerNode}
          />
          <Box p={1.5} flex={1} minHeight={0}>
            {children}
          </Box>
        </Box>
        <Box id="knowledge-footer" />
      </Box>
    </Box>
  );
}
