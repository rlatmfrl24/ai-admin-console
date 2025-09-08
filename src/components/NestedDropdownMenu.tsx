import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Grow,
  ClickAwayListener,
  ListItemIcon,
  ListItemText,
  Box,
} from "@mui/material";
import { ArrowDropDown } from "@mui/icons-material";
import type { PopperProps } from "@mui/material/Popper";
export interface MenuItemData {
  id: string;
  label: string;
  icon?: React.ReactElement;
  href?: string;
  children?: MenuItemData[];
  disabled?: boolean;
  selected?: boolean;
}

export interface NestedDropdownMenuProps {
  items: MenuItemData[];
  anchorEl?: HTMLElement | null;
  open?: boolean;
  onClose?: () => void;
  onItemClick?: (item: MenuItemData) => void;
  id?: string;
  className?: string;
  placement?: PopperProps["placement"];
  hoverOpenDelay?: number;
  hoverCloseDelay?: number;
}

interface SubMenuState {
  anchorEl: HTMLElement | null;
  menuItem: MenuItemData;
  isOpen: boolean;
}

export const NestedDropdownMenu: React.FC<NestedDropdownMenuProps> = ({
  items,
  anchorEl,
  open = false,
  onClose,
  onItemClick,
  id,
  className,
  placement = "bottom-start",
  hoverOpenDelay,
  hoverCloseDelay,
}) => {
  const [subMenuState, setSubMenuState] = useState<SubMenuState | null>(null);
  const menuListRef = useRef<HTMLUListElement>(null);
  const focusedIndexRef = useRef<number>(-1);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const leaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastHoverItemIdRef = useRef<string | null>(null);

  const openDelay = hoverOpenDelay ?? 160;
  const closeDelay = hoverCloseDelay ?? 140;

  const openSubMenu = useCallback(
    (anchorElement: HTMLElement, menuItem: MenuItemData) => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      if (leaveTimeoutRef.current) {
        clearTimeout(leaveTimeoutRef.current);
      }

      setSubMenuState({
        anchorEl: anchorElement,
        menuItem,
        isOpen: true,
      });
    },
    []
  );

  const closeSubMenu = useCallback(() => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
    }

    leaveTimeoutRef.current = setTimeout(() => {
      setSubMenuState(null);
    }, closeDelay);
  }, [closeDelay]);

  const closeSubMenuImmediate = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
    }
    setSubMenuState(null);
  }, []);

  const handleMouseEnter = useCallback(
    (event: React.MouseEvent<HTMLElement>, item: MenuItemData) => {
      const target = event.currentTarget as HTMLElement;
      if (item.children && item.children.length > 0) {
        if (hoverTimeoutRef.current) {
          clearTimeout(hoverTimeoutRef.current);
        }
        lastHoverItemIdRef.current = item.id;
        hoverTimeoutRef.current = setTimeout(() => {
          // 빠르게 이동 시 이전 타이머 무시
          if (lastHoverItemIdRef.current !== item.id) return;
          // DOM에서 분리된 앵커는 무시
          if (!target || !document.body.contains(target)) return;
          openSubMenu(target, item);
        }, openDelay);
      } else {
        closeSubMenu();
      }
    },
    [openSubMenu, closeSubMenu, openDelay]
  );

  const handleMouseLeave = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }

      const nextTarget = event.relatedTarget as Node | null;
      if (nextTarget && subMenuState?.menuItem) {
        const childMenuId = `${id || "menu"}-${subMenuState.menuItem.id}`;
        const childMenuElement = document.getElementById(childMenuId);
        if (childMenuElement && childMenuElement.contains(nextTarget)) {
          return;
        }
      }

      if (leaveTimeoutRef.current) {
        clearTimeout(leaveTimeoutRef.current);
      }
      // Guarded close: wait and then check if child submenu is hovered
      leaveTimeoutRef.current = setTimeout(() => {
        if (subMenuState?.menuItem) {
          const childMenuId = `${id || "menu"}-${subMenuState.menuItem.id}`;
          const childMenuElement = document.getElementById(childMenuId);
          if (
            childMenuElement &&
            (childMenuElement.matches(":hover") ||
              childMenuElement.contains(document.activeElement))
          ) {
            return; // keep open if user moved into submenu
          }
        }
        setSubMenuState(null);
      }, closeDelay);
    },
    [closeDelay, id, subMenuState?.menuItem]
  );

  const handleItemClick = useCallback(
    (item: MenuItemData) => {
      if (item.disabled) return;

      if (item.href && !item.children) {
        window.location.href = item.href;
      }

      onItemClick?.(item);
      onClose?.();
    },
    [onItemClick, onClose]
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (!menuListRef.current) return;

      const menuItems = Array.from(
        menuListRef.current.children
      ) as HTMLLIElement[];
      const currentFocusIndex = focusedIndexRef.current;

      switch (event.key) {
        // ArrowUp/ArrowDown은 MUI MenuList 기본 네비게이션에 맡깁니다.

        case "ArrowRight":
          if (currentFocusIndex >= 0) {
            const currentItem = items[currentFocusIndex];
            if (currentItem?.children && currentItem.children.length > 0) {
              event.preventDefault();
              const currentElement = menuItems[currentFocusIndex];
              if (currentElement) {
                openSubMenu(currentElement, currentItem);
              }
            }
          }
          break;

        case "ArrowLeft":
          event.preventDefault();
          // 1) 하위 서브메뉴가 열려 있으면 우선 닫기
          if (subMenuState?.isOpen) {
            closeSubMenuImmediate();
            break;
          }
          // 2) 현재 메뉴가 서브메뉴인 경우: 자신을 닫고 상위 메뉴 아이템으로 포커스 복귀
          if (anchorEl) {
            onClose?.();
            // 닫힘 후 포커스 복구를 위해 다음 프레임에 실행
            setTimeout(() => {
              try {
                (anchorEl as HTMLElement).focus();
              } catch {}
            }, 0);
            break;
          }
          // 3) 그 외의 경우(최상위 등)에는 전체 메뉴 닫기
          onClose?.();
          break;

        case "Enter":
        case " ":
          event.preventDefault();
          if (currentFocusIndex >= 0) {
            const currentItem = items[currentFocusIndex];
            if (currentItem) {
              if (currentItem.children && currentItem.children.length > 0) {
                const currentElement = menuItems[currentFocusIndex];
                if (currentElement) {
                  openSubMenu(currentElement, currentItem);
                }
              } else {
                handleItemClick(currentItem);
              }
            }
          }
          break;

        case "Escape":
          event.preventDefault();
          if (subMenuState?.isOpen) {
            closeSubMenuImmediate();
          } else {
            onClose?.();
          }
          break;

        case "Tab":
          event.preventDefault();
          onClose?.();
          break;
      }
    },
    [
      items,
      openSubMenu,
      closeSubMenuImmediate,
      handleItemClick,
      subMenuState?.isOpen,
      onClose,
      anchorEl,
    ]
  );

  /**
   * 메뉴 아이템 포커스 처리
   */
  const handleItemFocus = useCallback((index: number) => {
    focusedIndexRef.current = index;
  }, []);

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      if (leaveTimeoutRef.current) {
        clearTimeout(leaveTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (open && menuListRef.current) {
      menuListRef.current.focus();
      focusedIndexRef.current = -1;
    }
  }, [open]);

  if (!open || !anchorEl) {
    return null;
  }

  return (
    <ClickAwayListener onClickAway={onClose || (() => {})}>
      <div>
        <Popper
          open={open}
          anchorEl={anchorEl}
          role={undefined}
          placement={placement}
          transition
          disablePortal={false}
          sx={{ zIndex: 1300 }}
        >
          {({ TransitionProps, placement: popperPlacement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin: popperPlacement?.startsWith("right")
                  ? "left top"
                  : popperPlacement?.startsWith("left")
                  ? "right top"
                  : popperPlacement?.startsWith("top")
                  ? "left bottom"
                  : "left top",
              }}
            >
              <Paper
                elevation={3}
                sx={{
                  minWidth: 200,
                  maxWidth: 300,
                  borderRadius: 1,
                  overflow: "hidden",
                }}
              >
                <MenuList
                  ref={menuListRef}
                  autoFocusItem={false}
                  id={id}
                  aria-labelledby={id ? `${id}-button` : undefined}
                  onKeyDown={handleKeyDown}
                  onMouseLeave={handleMouseLeave}
                  onMouseEnter={() => {
                    if (leaveTimeoutRef.current) {
                      clearTimeout(leaveTimeoutRef.current);
                    }
                  }}
                  tabIndex={0}
                  sx={{
                    py: 1,
                    "&.MuiList-root": {
                      py: 0,
                      borderRadius: 1,
                      outline: "none",
                    },
                    "& .MuiMenuItem-root": {
                      minHeight: 34,
                      px: 1,
                      py: 0.5,
                      "&:focus:not(.Mui-selected)": {
                        backgroundColor: "transparent",
                      },
                      "&.Mui-selected": {
                        backgroundColor: "action.selected",
                      },
                      "&.Mui-disabled": {
                        opacity: 0.5,
                      },
                    },
                  }}
                  className={className}
                >
                  {items.map((item, index) => (
                    <MenuItem
                      key={item.id}
                      disabled={item.disabled}
                      selected={
                        Boolean(item.selected) ||
                        subMenuState?.menuItem.id === item.id
                      }
                      onClick={(event) => {
                        if (item.children && item.children.length > 0) {
                          event.preventDefault();
                          event.stopPropagation();
                          const target = event.currentTarget as HTMLElement;
                          if (hoverTimeoutRef.current) {
                            clearTimeout(hoverTimeoutRef.current);
                          }
                          if (leaveTimeoutRef.current) {
                            clearTimeout(leaveTimeoutRef.current);
                          }
                          openSubMenu(target, item);
                        } else {
                          handleItemClick(item);
                        }
                      }}
                      onMouseEnter={(event) => handleMouseEnter(event, item)}
                      onFocus={() => handleItemFocus(index)}
                      tabIndex={-1}
                      role="menuitem"
                      aria-haspopup={
                        item.children && item.children.length > 0
                          ? "menu"
                          : undefined
                      }
                      aria-expanded={
                        subMenuState?.menuItem.id === item.id &&
                        subMenuState.isOpen
                          ? "true"
                          : undefined
                      }
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        cursor: item.disabled ? "default" : "pointer",
                        "&.Mui-selected": {
                          backgroundColor: "action.selected",
                          "&:hover": { backgroundColor: "action.selected" },
                        },
                        "&:hover:not(.Mui-selected)": {
                          backgroundColor: "action.hover",
                        },
                        "&:focus:not(.Mui-selected)": {
                          backgroundColor: "transparent",
                        },
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", flex: 1 }}
                      >
                        {item.icon && (
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            {item.icon}
                          </ListItemIcon>
                        )}
                        <ListItemText
                          primary={item.label}
                          slotProps={{
                            primary: {
                              noWrap: true,
                              fontSize: "13px",
                            },
                          }}
                        />
                      </Box>
                      {item.children && item.children.length > 0 && (
                        <ArrowDropDown
                          sx={{
                            color: "action.active",
                            ml: 1,
                            fontSize: 20,
                            rotate: "270deg",
                          }}
                        />
                      )}
                    </MenuItem>
                  ))}
                </MenuList>
              </Paper>
            </Grow>
          )}
        </Popper>

        {subMenuState?.isOpen && subMenuState.menuItem.children && (
          <NestedDropdownMenu
            items={subMenuState.menuItem.children}
            anchorEl={subMenuState.anchorEl}
            open={subMenuState.isOpen}
            onClose={closeSubMenuImmediate}
            onItemClick={onItemClick}
            id={`${id || "menu"}-${subMenuState.menuItem.id}`}
            placement="right-start"
            hoverOpenDelay={openDelay}
            hoverCloseDelay={closeDelay}
          />
        )}
      </div>
    </ClickAwayListener>
  );
};

export default NestedDropdownMenu;
