/**
 * [인수인계 보강 - 타입/직렬화]
 * - 서버 응답 직렬화 주의: Date 필드는 API에서 문자열(ISO)로 전달됩니다.
 *   UI에서는 Date 객체로 쓰고 있으므로, 페치 시 파싱 단계에서 변환이 필요합니다.
 *   예) new Date(row.date)
 * - 파일 첨부: 현재 `attachedFile.file`은 File 타입으로 정의되어 있으나,
 *   서버 저장 후에는 URL(string)로 내려올 수 있습니다. 연동 시 매핑 레이어에서
 *   `{ file: File | string }` 형태를 내부 모델로 흡수하거나, 표시 전환 시 분기하세요.
 * - 식별자: `progressId`는 서버가 부여/보장하도록 설계합니다(클라이언트 생성 지양).
 */
type BSAFilter = {
  stream?: string;
  module?: string;
  status?: string;
  search?: string;
};

interface BSATableProps {
  id: number;
  stream: string;
  module: string;
  fileName: string;
  pageName: string;
  category: string;
  chunk: string;
  semanticTitle: string;
  semanticSummary: string;
  semanticChunk: string;
  language: string;
  date: Date;
  version: string;
  filePath: string;
}

type BSAMenuTreeItemProps = {
  id: string;
  index: number;
  label: string;
  children: BSAMenuTreeItemProps[];
};

interface ChunkProps {
  title: string;
  status: "done" | "in-progress" | "completed" | "draft";
  content: string;
  progressId: string;
  attachedFile: {
    file: File;
    description: string;
  }[];
  embeddingAt: Date | null;
  updatedAt: Date;
  createdAt: Date;
  isNew?: boolean;
}

type BSAChunksState = {
  chunks: ChunkProps[];
  selectedChunk: ChunkProps | null;
  setChunks: (chunks: ChunkProps[]) => void;
  updateChunk: (updated: ChunkProps) => void;
  setSelectedChunk: (chunk: ChunkProps | null) => void;
  addChunk: (chunk: ChunkProps) => void;
  removeChunk: (progressId: string) => void;
  cleanupNewEmptyChunks: (excludeProgressId?: string) => void;
  reset: () => void;
};

export type {
  BSAFilter,
  BSATableProps,
  BSAMenuTreeItemProps,
  ChunkProps,
  BSAChunksState,
};
