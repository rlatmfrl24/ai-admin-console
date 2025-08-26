"use client";

import { COLORS } from "@/constants/color";
import { Box, Button, IconButton } from "@mui/material";
import SelectWithLabel from "@/components/common/Select";
import InputWithLabel from "@/components/common/Input";
import { useForm } from "react-hook-form";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";
import { BSAFilter, BSATableProps } from "@/types/bsa";

const STREAM_OPTIONS = [
  { label: "All", value: "all" },
  { label: "Commercial", value: "commercial" },
  { label: "Customer Service", value: "customer-service" },
  { label: "Logistics", value: "logistics" },
  { label: "Equipment", value: "equipment" },
];
const MODULE_OPTIONS = [
  { label: "All", value: "all" },
  { label: "Basic Slot Allocation", value: "basic-slot-allocation" },
  { label: "Vessel Space Control", value: "vessel-space-control" },
  { label: "Freight Contract", value: "freight-contract" },
];
const STATUS_OPTIONS = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

export default function BSA() {
  const { register, handleSubmit } = useForm<BSAFilter>();

  const onSubmit = (data: BSAFilter) => {
    console.log(data);
  };

  const rows: GridRowsProp<BSATableProps> = Array.from(
    { length: 100 },
    (_, index) => ({
      id: index + 1,
      stream: "Commercial",
      module: "Basic Slot Allocation",
      fileName: "bsa.pdf",
      pageName: "BSA",
      category: "BSA",
      chunk: "BSA",
      semanticTitle: "BSA",
      semanticSummary: "BSA",
      semanticChunk: "BSA",
      language: "English",
      date: new Date(),
      version: "1.0.0",
      filePath: "bsa.pdf",
    })
  );

  const columns: GridColDef<BSATableProps>[] = [
    { field: "stream", headerName: "Stream", width: 150 },
    { field: "module", headerName: "Module", width: 150 },
    { field: "fileName", headerName: "File Name", width: 150 },
    { field: "pageName", headerName: "Page Name", width: 150 },
    { field: "category", headerName: "Category", width: 150 },
    { field: "chunk", headerName: "Chunk", width: 150 },
    { field: "semanticTitle", headerName: "Semantic Title", width: 150 },
    { field: "semanticSummary", headerName: "Semantic Summary", width: 150 },
    { field: "semanticChunk", headerName: "Semantic Chunk", width: 150 },
    { field: "language", headerName: "Language", width: 150 },
    { field: "date", headerName: "Date", width: 150 },
    { field: "version", headerName: "Version", width: 150 },
    { field: "filePath", headerName: "File Path", width: 150 },
  ];

  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      height={"100%"}
      sx={{ minHeight: 0 }}
    >
      <Box
        border={1}
        borderColor={COLORS.blueGrey[100]}
        borderRadius={2}
        p={1.5}
      >
        <form
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
          onSubmit={handleSubmit(onSubmit)}
        >
          <SelectWithLabel
            label="Stream"
            size="small"
            sx={{ minWidth: 160 }}
            defaultValue={"all"}
            options={STREAM_OPTIONS}
            {...register("stream")}
          />
          <SelectWithLabel
            label="Module"
            size="small"
            sx={{ minWidth: 160 }}
            defaultValue={"all"}
            options={MODULE_OPTIONS}
            {...register("module")}
          />
          <SelectWithLabel
            label="Status"
            size="small"
            sx={{ minWidth: 160 }}
            defaultValue={"all"}
            options={STATUS_OPTIONS}
            {...register("status")}
          />
          <InputWithLabel
            label="Search"
            sx={{ minWidth: 320 }}
            size="small"
            placeholder="Please enter your search item"
            {...register("search")}
          />
          <Box flex={1} />
          <IconButton
            size="small"
            sx={{
              border: 1,
              borderColor: COLORS.blueGrey[100],
              width: 32,
              height: 32,
            }}
          >
            <RestartAltIcon />
          </IconButton>
          <Button type="submit" variant="contained" size="small">
            Search
          </Button>
        </form>
      </Box>
      <DataGrid
        rows={rows}
        columns={columns}
        hideFooter
        rowHeight={30}
        columnHeaderHeight={32}
        sx={{
          flexGrow: 1,
          height: 0,
          mt: 1.5,
          border: 1,
          px: 1,
          py: 0.5,
          borderColor: COLORS.blueGrey[100],
          "& .MuiDataGrid-columnHeader": {
            fontSize: 13,
            fontWeight: 600,
          },
          "& .MuiDataGrid-cell": {
            fontSize: 13,
          },
        }}
      />
    </Box>
  );
}
