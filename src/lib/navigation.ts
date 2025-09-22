import type { NavigationItem } from "@/lib/types/navigation";

import NAV_ITEMS from "@/lib/constants/navigation";

export function pathFor(ids: string[]): string {
  const clean = ids.filter(Boolean);
  return `/${clean.join("/")}`;
}

export type Breadcrumb = { id: string; label: string; href: string };

export function breadcrumbFor(path: string): Breadcrumb[] {
  const segments = (path || "").split("/").filter(Boolean);
  let currentItems: NavigationItem[] = NAV_ITEMS;
  const breadcrumbs: Breadcrumb[] = [];
  const accIds: string[] = [];
  for (const seg of segments) {
    const matched = currentItems.find((i) => i.id === seg);
    if (!matched) break;
    accIds.push(matched.id);
    breadcrumbs.push({
      id: matched.id,
      label: matched.label,
      href: pathFor(accIds),
    });
    currentItems = matched.children ?? [];
  }
  return breadcrumbs;
}

export function siblingsFor(path: string, level: number): NavigationItem[] {
  const segments = (path || "").split("/").filter(Boolean);
  let currentItems: NavigationItem[] = NAV_ITEMS;
  for (let i = 0; i <= level; i++) {
    const seg = segments[i];
    const matched = currentItems.find((it) => it.id === seg);
    if (!matched) return [];
    if (i === level) return currentItems;
    currentItems = matched.children ?? [];
  }
  return currentItems;
}

// NAV_ITEMS 트리를 ids 경로로 탐색하여 가장 마지막으로 일치한 항목과 일치한 id 배열을 반환
export function findItemByIds(ids: string[]): {
  item?: NavigationItem;
  matchedIds: string[];
} {
  const clean = ids.filter(Boolean);
  let currentItems: NavigationItem[] = NAV_ITEMS;
  const matchedIds: string[] = [];
  let current: NavigationItem | undefined = undefined;
  for (const id of clean) {
    const found = currentItems.find((it) => it.id === id);
    if (!found) break;
    matchedIds.push(found.id);
    current = found;
    currentItems = found.children ?? [];
  }
  return { item: current, matchedIds };
}

// ids가 NAV_ITEMS에서 완전히 유효한 경로인지 여부
export function isValidPath(ids: string[]): boolean {
  const clean = ids.filter(Boolean);
  const { matchedIds } = findItemByIds(clean);
  return matchedIds.length === clean.length;
}

// ids가 완전히 일치할 때 해당 노드의 children 반환 (부분 일치면 빈 배열)
export function childrenForIds(ids: string[]): NavigationItem[] {
  const clean = ids.filter(Boolean);
  const { item, matchedIds } = findItemByIds(clean);
  if (!item) return [];
  if (matchedIds.length !== clean.length) return [];
  return item.children ?? [];
}
