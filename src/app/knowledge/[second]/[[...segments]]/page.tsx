import { notFound } from "next/navigation";
import { isValidPath } from "@/lib/navigation";
import BSAList from "./views/bsa/List";
import BSADetail from "./views/bsa/Detail";

type PageProps = {
  params: Promise<{ second: string; segments?: string[] }>;
};

export default async function Page({ params }: PageProps) {
  const { second, segments } = await params;

  // 실제 표시용 경로 문자열
  const displayPath =
    "/" + ["knowledge", second, ...(segments ?? [])].join("/");

  // 내비게이션 유효성 검증 시, 동적 ID 등 NAV 트리에 없는 꼬리 세그먼트는 제외하여 검증한다
  let idsForValidation = ["knowledge", second, ...(segments ?? [])];
  if (second === "chunks" && Array.isArray(segments)) {
    // 예: /knowledge/chunks/commercial/bsa/[id] → 검증은 bsa까지로 제한
    if (segments[0] === "commercial" && segments[1] === "bsa") {
      idsForValidation = ["knowledge", second, "commercial", "bsa"];
    }
  }

  if (!isValidPath(idsForValidation)) return notFound();

  const isBsaType =
    second === "chunks" &&
    Array.isArray(segments) &&
    segments[0] === "commercial" &&
    segments[1] === "bsa";

  return (
    <div style={{ padding: 0, height: "100%" }}>
      {isBsaType ? (
        segments && segments.length >= 3 ? (
          <BSADetail />
        ) : (
          <BSAList />
        )
      ) : (
        <CommonPlaceholder path={displayPath} />
      )}
    </div>
  );
}

function CommonPlaceholder({ path }: { path: string }) {
  return <div>현재 경로: {path}</div>;
}
