import {
  Fragment,
  useCallback,
  memo,
  useState,
  useEffect,
  useRef,
} from 'react';
import {
  List,
  ListItemButton,
  ListItemText,
  Box,
  IconButton,
  Collapse,
} from '@mui/material';
import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material';

import type { BSAMenuTreeItemProps } from '@/lib/types/bsa';

import { COLORS } from '@/lib/theme';

// [인수인계 메모]
// - 역할: 좌측 BSA 메뉴 트리(섹션/하위 섹션) 렌더링.
// - API 연동 시: 항목 선택(onSelect) → 해당 섹션의 chunk 목록 API 재조회.
// - 유의: 정렬은 index 기반, prefix는 "1.2." 형태로 계산해 표시.
// - 성능: 리스트 규모가 커질 경우 가상 스크롤 고려. 현재는 단순 리스트 렌더링.

type MenuTreeProps = {
  items: BSAMenuTreeItemProps[];
  selectedId?: string;
  onSelect?: (id: string, item: BSAMenuTreeItemProps) => void;
  ariaLabel?: string;
  enableFolding?: boolean;
};

function getDepthStyles(
  level: number,
  isSelected: boolean,
  enableFolding: boolean,
) {
  switch (level) {
    case 0:
      return {
        paddingLeft: enableFolding ? 1 : 1.5,
        bgcolor: isSelected ? COLORS.indigo[900] : 'white',
        '&.Mui-selected': {
          bgcolor: COLORS.indigo[900],
        },
        '&:hover': {
          bgcolor: isSelected ? COLORS.indigo[800] : COLORS.grey[100],
        },
        '&.Mui-selected:hover': {
          bgcolor: COLORS.indigo[800],
        },
      } as const;
    case 1:
    case 2:
      return {
        paddingLeft: enableFolding ? 1 : 2.5,
        bgcolor: isSelected ? COLORS.blueGrey[100] : COLORS.grey[100],
        '&.Mui-selected': {
          bgcolor: COLORS.blueGrey[100],
        },
        '&:hover': {
          bgcolor: COLORS.grey[200],
        },
        '&.Mui-selected:hover': {
          bgcolor: COLORS.grey[200],
        },
      } as const;
    default:
      return {} as const;
  }
}

// 모든 자식이 있는 항목의 ID를 재귀적으로 수집하는 헬퍼 함수
function collectAllExpandableIds(nodes: BSAMenuTreeItemProps[]): Set<string> {
  const ids = new Set<string>();
  const traverse = (items: BSAMenuTreeItemProps[]) => {
    items.forEach((item) => {
      if (Array.isArray(item.children) && item.children.length > 0) {
        ids.add(item.id);
        traverse(item.children);
      }
    });
  };
  traverse(nodes);
  return ids;
}

function MenuTree({
  items = [],
  selectedId,
  onSelect,
  ariaLabel,
  enableFolding = false,
}: MenuTreeProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => {
    if (enableFolding && items.length > 0) {
      return collectAllExpandableIds(items);
    }
    return new Set<string>();
  });

  // 이전 enableFolding 값을 추적하여 false에서 true로 변경될 때만 초기화
  const prevEnableFoldingRef = useRef(enableFolding);

  // enableFolding이 false에서 true로 변경될 때만 모든 노드를 펼침
  // items 변경 시에는 사용자의 수동 접기/펼치기 상태를 보존
  useEffect(() => {
    const prevEnableFolding = prevEnableFoldingRef.current;

    // enableFolding이 false에서 true로 변경된 경우에만 초기화
    if (!prevEnableFolding && enableFolding && items.length > 0) {
      setExpandedIds(collectAllExpandableIds(items));
    }

    // enableFolding이 true에서 false로 변경된 경우 모든 노드 접기
    if (prevEnableFolding && !enableFolding) {
      setExpandedIds(new Set<string>());
    }

    prevEnableFoldingRef.current = enableFolding;
  }, [enableFolding, items]);

  const handleSelect = useCallback(
    (item: BSAMenuTreeItemProps) => {
      onSelect?.(item.id, item);
    },
    [onSelect],
  );

  const handleToggle = useCallback((e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  }, []);

  const renderItems = (
    nodes: BSAMenuTreeItemProps[],
    level: number,
    parentPrefix: string,
  ) => {
    const sorted = [...nodes].sort((a, b) => a.index - b.index);
    return sorted.map((node) => {
      const hasChildren =
        Array.isArray(node.children) && node.children.length > 0;
      const isSelected = selectedId === node.id;
      const isExpanded = expandedIds.has(node.id);
      const basePrefix = parentPrefix ? parentPrefix + '.' : '';
      const displayPrefix = `${basePrefix}${node.index}.`;
      const primaryStyles = {
        fontSize: 12,
        fontWeight: level === 0 ? 500 : 400,
        lineHeight: 1.5,
        color: level === 0 && isSelected ? 'white' : 'text.primary',
      } as const;
      const showFoldIcon = enableFolding && hasChildren;

      return (
        <Fragment key={node.id}>
          <ListItemButton
            role="treeitem"
            aria-level={level + 1}
            aria-current={isSelected ? 'true' : undefined}
            aria-expanded={showFoldIcon ? isExpanded : undefined}
            selected={isSelected}
            onClick={() => handleSelect(node)}
            sx={{
              py: 0.5,
              gap: 0.5,
              minHeight: 32,
              alignItems: 'center',
              borderBottom: 1,
              borderColor: COLORS.blueGrey[100],
              ...getDepthStyles(level, isSelected, enableFolding),
            }}
          >
            {enableFolding && (
              <IconButton
                size="small"
                disabled={!hasChildren}
                onClick={(e) => handleToggle(e, node.id)}
                sx={{
                  p: 0.25,
                  width: 24,
                  height: 24,
                  color: level === 0 && isSelected ? 'white' : 'text.primary',
                  '&:hover': {
                    bgcolor:
                      level === 0 && isSelected
                        ? 'rgba(255, 255, 255, 0.1)'
                        : COLORS.action.hover,
                  },
                  '&.Mui-disabled': {
                    opacity: 0,
                  },
                }}
                aria-label={
                  hasChildren ? (isExpanded ? '접기' : '펴기') : undefined
                }
              >
                {hasChildren && (
                  <>
                    {isExpanded ? (
                      <ArrowDropUp fontSize="small" />
                    ) : (
                      <ArrowDropDown fontSize="small" />
                    )}
                  </>
                )}
              </IconButton>
            )}
            <ListItemText
              primary={`${displayPrefix} ${node.label}`}
              sx={{
                '& .MuiListItemText-primary': primaryStyles,
              }}
            />
          </ListItemButton>
          {hasChildren && (
            <Collapse in={!enableFolding || isExpanded} timeout="auto">
              <List disablePadding role="group">
                {renderItems(
                  node.children,
                  level + 1,
                  `${basePrefix}${node.index}`,
                )}
              </List>
            </Collapse>
          )}
        </Fragment>
      );
    });
  };

  return (
    <Box role="tree" aria-label={ariaLabel} sx={{ width: '100%' }}>
      <List disablePadding>{renderItems(items, 0, '')}</List>
    </Box>
  );
}
export default memo(MenuTree);
