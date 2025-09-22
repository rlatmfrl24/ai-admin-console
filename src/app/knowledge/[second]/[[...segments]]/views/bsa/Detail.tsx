"use client";

import { Box, Breadcrumbs, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useHeaderStore } from "@/lib/store/headerStore";
import { InsertDriveFileOutlined } from "@mui/icons-material";
import { GridColDef, DataGrid, useGridApiRef } from "@mui/x-data-grid";
import { BSATableProps, BSAMenuTreeItemProps } from "@/lib/types/bsa";
import { COLORS } from "@/lib/theme";
import { getBsaMenuTree, makeRandomChunk, getBsaRowById } from "./bsaUtil";
import SegmentedTabs from "@/components/common/SegmentedTabs";
import BSAChunkEdit from "./Edit";
import BSAChunkEmbedding from "./Embedding";
import { useBSAStore } from "@/lib/store/bsaStore";

function getInitialSelection(items: BSAMenuTreeItemProps[]): {
  selected: BSAMenuTreeItemProps | null;
  expandedIds: string[];
} {
  if (!items || items.length === 0) return { selected: null, expandedIds: [] };
  const first = [...items].sort((a, b) => a.index - b.index)[0];
  if (first.children && first.children.length > 0) {
    const firstChild = [...first.children].sort((a, b) => a.index - b.index)[0];
    return { selected: firstChild, expandedIds: [first.id] };
  }
  return { selected: first, expandedIds: [] };
}

export default function BSADetail() {
  const apiRef = useGridApiRef();
  const setHeaderNode = useHeaderStore((s) => s.setHeaderNode);
  const params = useParams();
  const segments = (params as { segments?: string[] })?.segments;
  const idParam = useMemo(() => {
    if (!Array.isArray(segments)) return undefined;
    const idx = segments.findIndex((s) => s === "bsa");
    if (idx >= 0 && segments[idx + 1]) return segments[idx + 1];
    // 기본 패턴: ["commercial", "bsa", ":id"] → 2번째 인덱스가 ID
    if (segments.length >= 3) return segments[2];
    return undefined;
  }, [segments]);
  const chunks = useBSAStore((s) => s.chunks);
  const setChunks = useBSAStore((s) => s.setChunks);
  const selectedChunk = useBSAStore((s) => s.selectedChunk);
  const setSelectedChunk = useBSAStore((s) => s.setSelectedChunk);
  const BSA_MENU_TREE = useMemo(() => getBsaMenuTree(), []);
  const { selected: initialSelectedItem } = useMemo(
    () => getInitialSelection(BSA_MENU_TREE),
    [BSA_MENU_TREE]
  );
  const [selectedTreeItem, setSelectedTreeItem] =
    useState<BSAMenuTreeItemProps | null>(initialSelectedItem);
  const [activeTab, setActiveTab] = useState<string>("edit");

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

  const selectedData = useMemo<BSATableProps | null>(() => {
    if (!idParam) return null;
    return getBsaRowById(idParam);
  }, [idParam]);

  useEffect(() => {
    if (!selectedData) return;
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
            "&:hover": { backgroundColor: "action.hover" },
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
    if (!selectedTreeItem) return;
    setChunks(Array.from({ length: 10 }, () => makeRandomChunk()));
  }, [selectedTreeItem, setChunks]);

  useEffect(() => {
    if (!selectedChunk) return;
    const latest = chunks.find(
      (c) => c.progressId === selectedChunk.progressId
    );
    if (!latest) {
      setSelectedChunk(null);
      return;
    }
    if (
      latest.updatedAt !== selectedChunk.updatedAt ||
      latest.embeddingAt !== selectedChunk.embeddingAt
    ) {
      setSelectedChunk(latest);
    }
  }, [chunks, selectedChunk, setSelectedChunk]);

  if (!selectedData) throw new Error("BSA data not found");

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
