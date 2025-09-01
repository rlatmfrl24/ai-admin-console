"use client";

import { Box, Breadcrumbs, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import {
  useBSASelectionStore,
  useHeaderStore,
} from "@/app/knowledge/store/headerStore";
import { InsertDriveFileOutlined } from "@mui/icons-material";
import { GridColDef, useGridApiRef } from "@mui/x-data-grid";
import { BSATableProps, BSAMenuTreeItemProps, ChunkProps } from "@/types/bsa";
import { DataGrid } from "@mui/x-data-grid";
import { dataGridTheme } from "@/theme";
import { COLORS } from "@/constants/color";
import MenuTree from "@/app/knowledge/chunks/commercial/bsa/MenuTree";
import { BSA_MENU_TREE, makeRandomChunk } from "@/constants/bsa";
import ChunkCard from "../ChunkCard";
import SegmentedTabs from "@/components/common/SegmentedTabs";

function findIndexPath(
  nodes: BSAMenuTreeItemProps[],
  targetId: string,
  acc: number[] = []
): number[] | null {
  for (const n of nodes) {
    const nextAcc = [...acc, n.index];
    if (n.id === targetId) return nextAcc;
    if (n.children?.length) {
      const found = findIndexPath(n.children, targetId, nextAcc);
      if (found) return found;
    }
  }
  return null;
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
  const [chunks, setChunks] = useState<ChunkProps[]>([]);
  const [selectedChunk, setSelectedChunk] = useState<ChunkProps | null>(null);
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

  const selectedData = useMemo(() => {
    if (selectedRow) return selectedRow;
    return {
      id: 0,
      stream: "-",
      module: "-",
      fileName: "-",
      pageName: "-",
      category: "-",
      chunk: "-",
      semanticTitle: "-",
      semanticSummary: "-",
      semanticChunk: "-",
      language: "-",
      date: new Date(),
      version: "-",
      filePath: "-",
    } as BSATableProps;
  }, [selectedRow]);

  useEffect(() => {
    const header = (
      <Box display={"inline-flex"} flex={1} justifyContent={"space-between"}>
        <Breadcrumbs>
          <Box />
          <Box display={"flex"} alignItems={"center"} p={0.5} gap={0.5}>
            <Typography lineHeight={1} fontSize={12} color="text.primary">
              Basic Slot Allocation ({selectedData.fileName})
            </Typography>
          </Box>
          {selectedChunk && (
            <Box display={"flex"} alignItems={"center"} p={0.5} gap={0.5}>
              <Typography lineHeight={1} fontSize={12} color="text.primary">
                {selectedChunk.title}
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
    apiRef.current?.selectRow(selectedData.id, true, true);
    return () => setHeaderNode(null);
  }, [setHeaderNode, apiRef, selectedData, selectedChunk]);

  useEffect(() => {
    setChunks(Array.from({ length: 10 }, () => makeRandomChunk()));
  }, [selectedTreeItem]);

  const [activeTab, setActiveTab] = useState<string>("edit");

  return (
    <Box
      flex={1}
      sx={{ minHeight: 0 }}
      height={"100%"}
      display={"flex"}
      flexDirection={"column"}
      gap={1.5}
    >
      {!selectedChunk ? (
        <Box>
          <DataGrid
            apiRef={apiRef}
            rows={[selectedData]}
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
        <Box
          aria-label="BSA Menu Tree"
          borderRight={1}
          borderColor={COLORS.blueGrey[100]}
          width={"264px"}
        >
          <MenuTree
            items={BSA_MENU_TREE}
            ariaLabel="BSA Menu Tree"
            defaultExpandedIds={initialExpandedIds}
            selectedId={selectedTreeItem?.id}
            onSelect={(_, item) => setSelectedTreeItem(item)}
          />
        </Box>
        <Box
          flex={selectedChunk ? 0 : 1}
          flexBasis={"560px"}
          p={2}
          borderRight={selectedChunk ? 1 : 0}
          borderColor={COLORS.blueGrey[100]}
        >
          <Typography fontSize={14} fontWeight={500} color="text.primary">
            {findIndexPath(BSA_MENU_TREE, selectedTreeItem?.id ?? "")?.join(
              "."
            ) +
              ". " +
              selectedTreeItem?.label}
          </Typography>
          <Box
            mt={1.5}
            display={"grid"}
            gridTemplateColumns={"repeat(auto-fill, minmax(252px, 1fr))"}
            gap={1.5}
          >
            {chunks.map((chunk) => (
              <ChunkCard
                key={chunk.title}
                chunk={chunk}
                selected={selectedChunk?.title === chunk.title}
                onSelect={setSelectedChunk}
              />
            ))}
          </Box>
        </Box>
        {selectedChunk && (
          <Box flex={1} display={"flex"} p={2} gap={2}>
            <Box flex={1} display={"flex"} flexDirection={"column"} gap={1}>
              <Typography fontSize={14} fontWeight={500} color="text.primary">
                Edit Data
              </Typography>
              <Box
                flex={1}
                border={2}
                borderColor={"primary.main"}
                borderRadius={2}
              ></Box>
            </Box>
            <Box flex={1} display={"flex"} flexDirection={"column"} gap={1}>
              <Typography fontSize={14} fontWeight={500} color="text.primary">
                Embedding Data
              </Typography>
              <Box flex={1} bgcolor={COLORS.grey[100]} borderRadius={2}></Box>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}
