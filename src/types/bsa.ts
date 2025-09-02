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
