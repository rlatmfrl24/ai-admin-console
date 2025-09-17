"use client";

/**
 * [인수인계 메모]
 * - 역할: BSA 상세(목록 상단 + 좌측 메뉴 + 에디트/임베딩 탭) 컨테이너.
 * - 현재 데이터 소스:
 *   - 상단 단일 행(selectedData): getBsaRowById(목 데이터) 사용
 *   - 하단 chunks 리스트: makeRandomChunk(faker 기반)로 초기화
 * - API 교체 포인트:
 *   1) selectedData: useEffect에서 idParam 기반 상세 API 호출로 대체
 *      예) GET /api/bsa/:id → setSelectedRow + columns에 바인딩
 *   2) chunks 초기화: setChunks(Array.from(...makeRandomChunk())) → GET /api/bsa/:id/chunks
 *   3) 에디트/임베딩에서 저장/처리 시, 아래 컴포넌트로 전달되는 콜백에서 API 호출
 * - 유의사항:
 *   - URL 파라미터(idParam)와 서버의 식별자 타입 일치 필요.
 *   - DataGrid의 열 정의(columns)는 서버 스키마 변경 시 동기화.
 *   - 요청 취소: 섹션/ID 전환 시 이전 요청은 AbortController로 취소하여 레이스 컨디션 방지.
 *   - 오류 처리: Error Boundary/상단 배너를 통해 사용자 가시성 확보. 재시도 정책 합의.
 */

import { Box, Breadcrumbs, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useHeaderStore } from "@/lib/store/headerStore";
import { InsertDriveFileOutlined } from "@mui/icons-material";
import { GridColDef, useGridApiRef } from "@mui/x-data-grid";
import { BSATableProps, BSAMenuTreeItemProps } from "@/lib/types/bsa";
import { DataGrid } from "@mui/x-data-grid";
import { COLORS } from "@/lib/theme";
import {
  getBsaMenuTree,
  makeRandomChunk,
} from "@/app/knowledge/chunks/commercial/bsa/bsaUtil";
import SegmentedTabs from "@/components/common/SegmentedTabs";
import BSAChunkEdit from "./edit";
import BSAChunkEmbedding from "./embedding";
import { useBSAStore } from "@/lib/store/bsaStore";
import { getBsaRowById } from "../bsaUtil";

function getInitialSelection(items: BSAMenuTreeItemProps[]): {
  selected: BSAMenuTreeItemProps | null;
  expandedIds: string[];
} {
  if (!items || items.length === 0) {
    return { selected: null, expandedIds: [] };
  }
  const first = [...items].sort((a, b) => a.index - b.index)[0];
  if (first.children && first.children.length > 0) {
    const firstChild = [...first.children].sort((a, b) => a.index - b.index)[0];
    return { selected: firstChild, expandedIds: [first.id] };
  }
  return { selected: first, expandedIds: [] };
}

export default function BSAChunkList() {
  const apiRef = useGridApiRef();
  const setHeaderNode = useHeaderStore((s) => s.setHeaderNode);
  const params = useParams();
  const idParam = (params as { id?: string })?.id;
  const chunks = useBSAStore((s) => s.chunks);
  const setChunks = useBSAStore((s) => s.setChunks);
  const selectedChunk = useBSAStore((s) => s.selectedChunk);
  const setSelectedChunk = useBSAStore((s) => s.setSelectedChunk);
  const BSA_MENU_TREE = useMemo(() => getBsaMenuTree(), []);
  const { selected: initialSelectedItem } = useMemo(
    () => getInitialSelection(BSA_MENU_TREE),
    [BSA_MENU_TREE]
  );
  const columns: GridColDef<BSATableProps>[] = [
    { field: "stream", headerName: "Stream", width: 150 },
    { field: "module", headerName: "Module", width: 150 },
    { field: "fileName", headerName: "File Name", width: 150 },
    { field: "pageName", headerName: "Page Name", width: 150 },
    { field: "category", headerName: "Category", width: 120 },
    { field: "chunk", headerName: "Chunk", width: 120 },
    { field: "semanticTitle", headerName: "Semantic Title", width: 150 },
    { field: "semanticSummary", headerName: "Semantic Summary", width: 150 },
    { field: "semanticChunk", headerName: "Semantic Chunk", width: 150 },
    { field: "language", headerName: "Language", width: 100 },
    { field: "date", headerName: "Date", width: 150 },
    { field: "version", headerName: "Version", width: 100 },
    { field: "filePath", headerName: "File Path", width: 150 },
  ];

  const [selectedTreeItem, setSelectedTreeItem] =
    useState<BSAMenuTreeItemProps | null>(initialSelectedItem);
  const [activeTab, setActiveTab] = useState<string>("edit");
  const selectedData = useMemo<BSATableProps | null>(() => {
    if (!idParam) return null;
    // [API 교체] 현재는 목 유틸(getBsaRowById)을 사용합니다.
    // 예) fetch(`/api/bsa/${idParam}`).then(r => r.json()).then(setSelectedRow)
    const row = getBsaRowById(idParam);
    return row;
  }, [idParam]);
  if (!selectedData) {
    throw new Error("BSA data not found");
  }

  // Reset selectedChunk only when selectedTreeItem or selectedRow changes
  useEffect(() => {
    setSelectedChunk(null);
  }, [selectedTreeItem, idParam, setSelectedChunk]);

  useEffect(() => {
    const header = (
      <Box display={"inline-flex"} flex={1} justifyContent={"space-between"}>
        <Breadcrumbs>
          <Box />
          <Box display={"flex"} alignItems={"center"} p={0.5} gap={0.5}>
            <Typography lineHeight={1} fontSize={12} color="text.primary">
              Basic Slot Allocation ({selectedData?.fileName ?? "-"})
            </Typography>
          </Box>
          {selectedChunk && activeTab === "edit" && (
            <Box display={"flex"} alignItems={"center"} p={0.5} gap={0.5}>
              <Typography lineHeight={1} fontSize={12} color="text.primary">
                {
                  chunks.find((c) => c.progressId === selectedChunk.progressId)
                    ?.title
                }
              </Typography>
            </Box>
          )}
          {activeTab === "embedding" && (
            <Box display={"flex"} alignItems={"center"} p={0.5} gap={0.5}>
              <Typography lineHeight={1} fontSize={12} color="text.primary">
                Data Embedding
              </Typography>
            </Box>
          )}
        </Breadcrumbs>
        <Box
          display={"flex"}
          alignItems={"center"}
          gap={0.5}
          sx={{
            cursor: "pointer",
            paddingLeft: 1,
            paddingRight: 1,
            borderRadius: 2,
            "&:hover": {
              backgroundColor: "action.hover",
            },
          }}
        >
          <InsertDriveFileOutlined sx={{ fontSize: 16 }} />
          <Typography
            lineHeight={1}
            fontSize={12}
            color="text.primary"
            display={"flex"}
            alignItems={"center"}
            gap={0.5}
          >
            Origin DOC
          </Typography>
        </Box>
      </Box>
    );
    setHeaderNode(header);
    apiRef.current?.selectRow(selectedData.id, true, true);
    return () => setHeaderNode(null);
  }, [setHeaderNode, apiRef, selectedData, selectedChunk, chunks, activeTab]);

  useEffect(() => {
    // [API 교체] 좌측 메뉴 선택 변경 시 서버에서 해당 섹션의 chunks를 재조회하세요.
    // 예) fetch(`/api/bsa/${idParam}/chunks?section=${selectedTreeItem?.id}`)
    //   .then(r => r.json()).then(setChunks)
    //   .catch(() => {/* 배너/토스트로 알림 및 리트라이 제공 */})
    setChunks(Array.from({ length: 10 }, () => makeRandomChunk()));
  }, [selectedTreeItem, setChunks]);

  // Guard: Keep selectedChunk in sync with chunks; reset only if missing
  useEffect(() => {
    if (!selectedChunk) return;
    const latest = chunks.find(
      (c) => c.progressId === selectedChunk.progressId
    );
    if (!latest) {
      setSelectedChunk(null);
      return;
    }
    // Only sync when persisted data changed (e.g., after Save/Embedding)
    if (
      latest.updatedAt !== selectedChunk.updatedAt ||
      latest.embeddingAt !== selectedChunk.embeddingAt
    ) {
      setSelectedChunk(latest);
    }
  }, [chunks, selectedChunk, setSelectedChunk]);

  return (
    <Box
      flex={1}
      sx={{ minHeight: 0 }}
      height={"100%"}
      display={"flex"}
      flexDirection={"column"}
      gap={1.5}
    >
      {!selectedChunk && activeTab === "edit" ? (
        <Box>
          <DataGrid
            apiRef={apiRef}
            rows={[selectedData]}
            columns={columns}
            hideFooter
            sx={{ height: "114px" }}
          />
        </Box>
      ) : (
        <SegmentedTabs
          value={activeTab}
          onChange={setActiveTab}
          ariaLabel="BSA Tabs"
          items={[
            { value: "edit", label: "Data Edit" },
            { value: "embedding", label: "Data Embedding" },
          ]}
        />
      )}
      <Box
        border={1}
        flexGrow={1}
        height={0}
        minHeight={0}
        borderRadius={2}
        borderColor={COLORS.blueGrey[100]}
        display={"flex"}
        overflow={"hidden"}
      >
        {activeTab === "edit" ? (
          <BSAChunkEdit
            selectedData={selectedData}
            selectedTreeItem={selectedTreeItem}
            setSelectedTreeItem={setSelectedTreeItem}
            onNext={() => setActiveTab("embedding")}
          />
        ) : (
          <BSAChunkEmbedding />
        )}
      </Box>
    </Box>
  );
}
