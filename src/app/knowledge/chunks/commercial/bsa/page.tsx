"use client";

/**
 * [인수인계 메모]
 * - 역할: BSA(기본 슬롯 배정) 목록 페이지. 검색폼 + 목록 그리드 표시.
 * - 현재 데이터 소스: faker를 이용한 로컬 목 데이터(rows).
 * - API 교체 포인트:
 *   1) onSubmit에서 검색 조건으로 서버 API 호출(예: GET /api/bsa?query=...)
 *   2) rows 생성부(faker 사용)을 서버 응답 데이터로 교체
 * - 유의사항:
 *   - 그리드 행 클릭 시 상세로 이동(router.push). API 연동 시, 목록 데이터와 상세 데이터의 스키마를 일관되게 유지하세요.
 *   - 날짜/버전/파일경로 필드는 서버 스키마에 맞춰 매핑 필요.
 */

import { COLORS } from "@/lib/theme";
import { Box, Button, IconButton } from "@mui/material";
import SelectWithLabel from "@/components/common/Select";
import InputWithLabel from "@/components/common/Input";
import { useForm } from "react-hook-form";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";
import { BSAFilter, BSATableProps } from "@/lib/types/bsa";
// 목 데이터 전용(faker) - API 연동 시 제거
import { faker } from "@faker-js/faker";
import { useRouter } from "next/navigation";
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

export default function BSA() {
  const { register, handleSubmit } = useForm<BSAFilter>();
  const router = useRouter();
  const setSelectedRow = useBSAStore((s) => s.setSelectedRow);
  const onSubmit = (data: BSAFilter) => {
    // [API 교체] 현재는 콘솔만 출력합니다. 다음과 같이 서버에서 목록을 가져오세요.
    // 예) fetch(`/api/bsa?stream=${data.stream}&module=${data.module}&status=${data.status}&search=${data.search}`)
    //   .then(res => res.json())
    //   .then((result: BSATableProps[]) => setRows(result));
    //   .catch(() => {/* 에러 토스트/리트라이 버튼 등 */});
    console.log(data);
  };

  // [faker 사용 구간] API 연동 시 아래 rows는 서버 응답으로 대체하세요.
  // - 파일명/언어/날짜/버전/경로 등의 스키마를 서버와 동일하게
  // - 페이지 전환 시 선택 행을 Zustand에 저장(setSelectedRow)
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
        // [서버 페이징/정렬 예시]
        // pagination
        // paginationMode="server"
        // onPaginationModelChange={(m) => fetchWith({ page: m.page, pageSize: m.pageSize })}
        // sorting
        // sortingMode="server"
        // onSortModelChange={(m) => fetchWith({ sort: m })}
        onRowClick={(params) => {
          // [API 연결 지점] 목록에서 선택한 행을 스토어에 저장해 상세 초기화에 사용
          // - 서버에서 상세 API 호출 시, 필요시 여기서 prefetch도 고려
          console.log(params.row);
          setSelectedRow(params.row);
          router.push(`/knowledge/chunks/commercial/bsa/${params.row.id}`);
        }}
      />
    </Box>
  );
}
