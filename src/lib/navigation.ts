import NAV_ITEMS from "@/lib/constants/navigation";
import type { NavigationItem } from "@/lib/types/navigation";

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
