"use client";

import { Box, Breadcrumbs, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  useBSASelectionStore,
  useHeaderStore,
} from "@/app/knowledge/store/headerStore";
import { InsertDriveFileOutlined } from "@mui/icons-material";
import { GridColDef, useGridApiRef } from "@mui/x-data-grid";
import { BSATableProps, BSAMenuTreeItemProps } from "@/types/bsa";
import { DataGrid } from "@mui/x-data-grid";
import { dataGridTheme } from "@/theme";
import { COLORS } from "@/constants/color";
import { BSA_MENU_TREE, makeRandomChunk } from "@/constants/bsa";
import SegmentedTabs from "@/components/common/SegmentedTabs";
import BSAChunkEdit from "./edit";
import BSAChunkEmbedding from "./embedding";
import { useBSAChunksStore } from "@/app/knowledge/store/bsaChunksStore";

function getAncestorIds(
  items: BSAMenuTreeItemProps[],
  targetId: string,
  acc: string[] = []
): string[] {
  for (const node of items) {
    if (node.id === targetId) return acc;
    if (node.children && node.children.length > 0) {
      const found = getAncestorIds(node.children, targetId, [...acc, node.id]);
      if (found.length > 0 || (found.length === 0 && node.id === targetId)) {
        return found;
      }
    }
  }
  return [];
}

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
  const selectedRow = useBSASelectionStore((s) => s.selectedRow);
  const router = useRouter();
  const chunks = useBSAChunksStore((s) => s.chunks);
  const setChunks = useBSAChunksStore((s) => s.setChunks);
  const selectedChunk = useBSAChunksStore((s) => s.selectedChunk);
  const setSelectedChunk = useBSAChunksStore((s) => s.setSelectedChunk);
  const { selected: initialSelectedItem, expandedIds: initialExpandedIds } =
    useMemo(() => getInitialSelection(BSA_MENU_TREE), []);
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
    return selectedRow ?? null;
  }, [selectedRow]);

  const expandedIdsForSelected = useMemo(() => {
    if (selectedTreeItem) {
      return getAncestorIds(BSA_MENU_TREE, selectedTreeItem.id);
    }
    return initialExpandedIds;
  }, [selectedTreeItem, initialExpandedIds]);

  useEffect(() => {
    if (!selectedRow) {
      router.replace("/knowledge/chunks/commercial/bsa");
    }
  }, [selectedRow, router]);

  // Reset selectedChunk only when selectedTreeItem or selectedRow changes
  useEffect(() => {
    setSelectedChunk(null);
  }, [selectedTreeItem, selectedRow, setSelectedChunk]);

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
        <Box display={"flex"} alignItems={"center"} gap={0.5}>
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
    if (selectedData) {
      apiRef.current?.selectRow(selectedData.id, true, true);
    }
    return () => setHeaderNode(null);
  }, [setHeaderNode, apiRef, selectedData, selectedChunk, chunks, activeTab]);

  useEffect(() => {
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
            rows={selectedData ? [selectedData] : []}
            columns={columns}
            hideFooter
            sx={{ ...dataGridTheme.sx, height: "114px" }}
            rowHeight={dataGridTheme.rowHeight}
            columnHeaderHeight={dataGridTheme.columnHeaderHeight}
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
        overflow={"auto"}
        borderRadius={2}
        borderColor={COLORS.blueGrey[100]}
        display={"flex"}
      >
        {activeTab === "edit" ? (
          <BSAChunkEdit
            selectedData={selectedData}
            selectedTreeItem={selectedTreeItem}
            setSelectedTreeItem={setSelectedTreeItem}
            initialExpandedIds={expandedIdsForSelected}
            onNext={() => setActiveTab("embedding")}
          />
        ) : (
          <BSAChunkEmbedding />
        )}
      </Box>
    </Box>
  );
}
