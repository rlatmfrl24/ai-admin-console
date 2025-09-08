"use client";

import { COLORS } from "@/lib/theme";
import { ArrowDropDown } from "@mui/icons-material";
import { Box, Breadcrumbs, Typography } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState, useRef, useCallback } from "react";
import type React from "react";
import { useHeaderStore } from "@/lib/headerStore";
import {
  NestedDropdownMenu,
  MenuItemData,
} from "@/components/NestedDropdownMenu";
import { NavigationItem } from "@/lib/types/navigation";
import { breadcrumbFor, siblingsFor } from "@/lib/navigation";

/**
 * NavigationItem을 MenuItemData로 변환하는 유틸리티 함수
 */
const convertNavItemsToMenuItems = (
  navItems: NavigationItem[],
  basePath: string = ""
): MenuItemData[] => {
  return navItems.map((item) => ({
    id: item.id,
    label: item.label,
    href: basePath ? `${basePath}/${item.id}` : `/${item.id}`,
    children: item.children
      ? convertNavItemsToMenuItems(
          item.children,
          basePath ? `${basePath}/${item.id}` : `/${item.id}`
        )
      : undefined,
    disabled: false,
  }));
};

/**
 * 현재 브레드크럼 레벨에서 사용 가능한 네비게이션 아이템들을 찾는 함수
 */
const getAvailableItemsAtLevel = (
  segments: string[],
  breadcrumbIndex: number
): NavigationItem[] => siblingsFor(`/${segments.join("/")}`, breadcrumbIndex);

const KnowledgeBreadcrumbs = ({
  breadcrumbs,
  headerNode,
}: {
  breadcrumbs: { label: string; href: string }[];
  headerNode?: React.ReactNode;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const segments = useMemo(
    () => pathname.split("/").filter(Boolean),
    [pathname]
  );

  // 드롭다운 메뉴 상태 관리
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);
  const breadcrumbRefs = useRef<(HTMLElement | null)[]>([]);

  /**
   * 브레드크럼 클릭 시 드롭다운 메뉴 토글
   */
  const handleBreadcrumbClick = useCallback(
    (index: number) => (event: React.MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();

      if (openMenuIndex === index) {
        setOpenMenuIndex(null);
      } else {
        setOpenMenuIndex(index);
      }
    },
    [openMenuIndex]
  );

  /**
   * 메뉴 닫기
   */
  const handleCloseMenu = useCallback(() => {
    setOpenMenuIndex(null);
  }, []);

  /**
   * 메뉴 아이템 클릭 시 네비게이션 처리
   */
  const handleMenuItemClick = useCallback(
    (item: MenuItemData) => {
      if (item.href) {
        router.push(item.href);
      }
      handleCloseMenu();
    },
    [router, handleCloseMenu]
  );

  /**
   * 현재 열린 메뉴의 아이템들을 가져오기
   */
  const currentMenuItems = useMemo<MenuItemData[]>(() => {
    if (openMenuIndex === null) return [];
    const availableItems = getAvailableItemsAtLevel(segments, openMenuIndex);
    const basePath = breadcrumbs
      .slice(0, openMenuIndex)
      .map((b) => b.href.split("/").pop())
      .filter(Boolean)
      .join("/");
    return convertNavItemsToMenuItems(
      availableItems,
      basePath ? `/${basePath}` : ""
    );
  }, [openMenuIndex, segments, breadcrumbs]);

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
            ref={(el) => {
              breadcrumbRefs.current[index] = el as HTMLElement | null;
            }}
            display={"flex"}
            alignItems={"center"}
            p={0.5}
            gap={0.5}
            borderRadius={1}
            onClick={handleBreadcrumbClick(index)}
            sx={{
              cursor: "pointer",
              backgroundColor:
                openMenuIndex === index
                  ? COLORS.action.selected
                  : "transparent",
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
                transform:
                  openMenuIndex === index ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s ease-in-out",
              }}
            />
          </Box>
        ))}
      </Breadcrumbs>

      {/* 드롭다운 메뉴 */}
      {openMenuIndex !== null && (
        <NestedDropdownMenu
          items={currentMenuItems}
          anchorEl={breadcrumbRefs.current[openMenuIndex]}
          open={openMenuIndex !== null}
          onClose={handleCloseMenu}
          onItemClick={handleMenuItemClick}
          id={`breadcrumb-menu-${openMenuIndex}`}
        />
      )}

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
    return breadcrumbFor(`/${segments.join("/")}`).map((b) => ({
      label: b.label,
      href: b.href,
    }));
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
