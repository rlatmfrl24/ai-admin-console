import { Box, Breadcrumbs, Typography } from "@mui/material";
import { useEffect } from "react";
import { useHeaderStore } from "@/app/knowledge/store/headerStore";
import { InsertDriveFileOutlined } from "@mui/icons-material";
import { GridColDef } from "@mui/x-data-grid";
import { BSATableProps } from "@/types/bsa";
import { DataGrid } from "@mui/x-data-grid";
import { dataGridTheme } from "@/theme";

export default function BSAManualList() {
  const setHeaderNode = useHeaderStore((s) => s.setHeaderNode);
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

  const selectedData = {
    id: 1,
    stream: "stream",
    module: "module",
    fileName: "fileName",
    pageName: "pageName",
    category: "category",
    chunk: "chunk",
    semanticTitle: "semanticTitle",
    semanticSummary: "semanticSummary",
    semanticChunk: "semanticChunk",
    language: "language",
    date: new Date(),
    version: "version",
    filePath: "filePath",
  };

  useEffect(() => {
    const header = (
      <Box display={"inline-flex"} flex={1} justifyContent={"space-between"}>
        <Breadcrumbs>
          <Box />
          <Box display={"flex"} alignItems={"center"} p={0.5} gap={0.5}>
            <Typography lineHeight={1} fontSize={12} color="text.primary">
              Basic Slot Allocation (Manual.PDF)
            </Typography>
          </Box>
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
    return () => setHeaderNode(null);
  }, [setHeaderNode]);

  return (
    <Box flex={1} sx={{ minHeight: 0 }}>
      <DataGrid
        rows={[selectedData]}
        columns={columns}
        hideFooter
        sx={{ ...dataGridTheme.sx, height: "114px" }}
        rowHeight={dataGridTheme.rowHeight}
        columnHeaderHeight={dataGridTheme.columnHeaderHeight}
      />
    </Box>
  );
}
