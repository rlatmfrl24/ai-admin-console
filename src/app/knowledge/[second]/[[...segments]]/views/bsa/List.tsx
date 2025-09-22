"use client";

import { Box, Button, IconButton } from "@mui/material";
import { useForm } from "react-hook-form";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { DataGrid, type GridRowsProp, type GridColDef } from "@mui/x-data-grid";
import { faker } from "@faker-js/faker";
import { useRouter } from "next/navigation";

import { BSAFilter, BSATableProps } from "@/lib/types/bsa";
import InputWithLabel from "@/components/common/Input";
import SelectWithLabel from "@/components/common/Select";
import { COLORS } from "@/lib/theme";
import { useBSAStore } from "@/lib/store/bsaStore";

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

export default function BSAList() {
  const { register, handleSubmit } = useForm<BSAFilter>();
  const router = useRouter();
  const setSelectedRow = useBSAStore((s) => s.setSelectedRow);
  const onSubmit = (data: BSAFilter) => {
    console.log(data);
  };

  const rows: GridRowsProp<BSATableProps> = Array.from(
    { length: 100 },
    (_, index) => ({
      id: index + 1,
      stream: "Commercial",
      module: "Basic Slot Allocation",
      fileName:
        faker.lorem.word() + faker.helpers.arrayElement([".png", ".pdf"]),
      pageName: faker.lorem.word(),
      category: faker.lorem.word(),
      chunk: "BSA",
      semanticTitle: faker.lorem.word(),
      semanticSummary: faker.lorem.word(),
      semanticChunk: faker.lorem.word(),
      language: faker.location.language().name,
      date: faker.date.past(),
      version: faker.string.numeric(3),
      filePath: faker.system.filePath(),
    })
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
          style={{ display: "flex", alignItems: "center", gap: "8px" }}
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
            label="Module 01"
            size="small"
            sx={{ minWidth: 160 }}
            defaultValue={"all"}
            options={MODULE_OPTIONS}
            {...register("module")}
          />
          <SelectWithLabel
            label="Module 02"
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
          <SelectWithLabel
            label="Category"
            size="small"
            sx={{ minWidth: 160 }}
            defaultValue={"all"}
            options={MODULE_OPTIONS}
            {...register("module")}
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
        sx={{ flexGrow: 1, mt: 1.5, height: 0 }}
        onRowClick={(params) => {
          console.log(params.row);
          setSelectedRow(params.row);
          router.push(`/knowledge/chunks/commercial/bsa/${params.row.id}`);
        }}
      />
    </Box>
  );
}
