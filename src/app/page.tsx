import type { NavigationItem } from "@/lib/types/navigation";

import NAV_ITEMS from "@/lib/constants/navigation";
import MainLanding from "@/components/MainLanding";

const TARGET_NAV_ID = [
  "knowledge",
  "response-management",
  "settings",
  "customer-support",
];

export default function Main() {
  const targetNavItems: NavigationItem[] = TARGET_NAV_ID.map((id) =>
    (NAV_ITEMS as NavigationItem[]).find((item) => item.id === id)
  )
    .filter((item): item is NavigationItem => !!item)
    .sort((a, b) => (a.index ?? 0) - (b.index ?? 0));

  return <MainLanding items={targetNavItems} />;
}
