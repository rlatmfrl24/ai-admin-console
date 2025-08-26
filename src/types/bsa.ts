type BSAFilter = {
  stream?: string;
  module?: string;
  status?: string;
  search?: string;
};

type BSATableProps = {
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
};

export type { BSAFilter, BSATableProps };
