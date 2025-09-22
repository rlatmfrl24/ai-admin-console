import Link from "next/link";
import { notFound } from "next/navigation";
import type { NavigationItem } from "@/lib/types/navigation";
import { childrenForIds, isValidPath, pathFor } from "@/lib/navigation";
import BSAList from "./views/bsa/List";
import BSADetail from "./views/bsa/Detail";

type PageProps = {
  params: Promise<{ second: string; segments?: string[] }>;
};

export default async function Page({ params }: PageProps) {
  const { second, segments } = await params;
  // 내비게이션 유효성 검증 시, 동적 ID 등 NAV 트리에 없는 꼬리 세그먼트는 제외하여 검증한다
  let idsForValidation = ["knowledge", second, ...(segments ?? [])];
  if (second === "chunks" && Array.isArray(segments)) {
    // 예: /knowledge/chunks/commercial/bsa/[id] → 검증은 bsa까지로 제한
    if (segments[0] === "commercial" && segments[1] === "bsa") {
      idsForValidation = ["knowledge", second, "commercial", "bsa"];
    }
  }

  if (!isValidPath(idsForValidation)) return notFound();

  const children: NavigationItem[] = childrenForIds(idsForValidation);

  return (
    <div style={{ padding: 0, height: "100%" }}>
      {/* 특정 경로(BSA)에 대해 리스트/상세 렌더링 */}
      {second === "chunks" && Array.isArray(segments) ? (
        segments[0] === "commercial" && segments[1] === "bsa" ? (
          segments.length >= 3 ? (
            <BSADetail />
          ) : (
            <BSAList />
          )
        ) : children.length > 0 ? (
          <ul style={{ paddingLeft: 16, marginTop: 16 }}>
            {children.map((child) => (
              <li key={child.id} style={{ marginBottom: 8 }}>
                <Link href={pathFor([...idsForValidation, child.id])}>
                  {child.label}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div style={{ marginTop: 16 }}>콘텐츠가 준비되었습니다.</div>
        )
      ) : children.length > 0 ? (
        <ul style={{ paddingLeft: 16, marginTop: 16 }}>
          {children.map((child) => (
            <li key={child.id} style={{ marginBottom: 8 }}>
              <Link href={pathFor([...idsForValidation, child.id])}>
                {child.label}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div style={{ marginTop: 16 }}>콘텐츠가 준비되었습니다.</div>
      )}
    </div>
  );
}
