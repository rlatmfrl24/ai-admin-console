import { create } from "zustand";

import type { BSATableProps, ChunkProps } from "@/lib/types/bsa";

// [인수인계 메모]
// - 역할: BSA 화면의 전역 상태 관리(Zustand).
// - API 연동 가이드:
//   - 목록/상세 조회 후 setSelectedRow, setChunks로 상태 초기화
//   - 저장/삭제/임베딩 처리 후 updateChunk/removeChunk로 반영
//   - 낙관적 업데이트 사용 시 실패 롤백 처리 고려
// - 유의: progressId는 서버가 발급하도록 설계하고, 클라이언트 생성은 피함.
// - 성능/일관성:
//   - 셀렉터 사용 및 얕은 비교(shallow)로 불필요 렌더 최소화.
//   - 영속성 필요 시 middleware(persist) 고려. 단, 서버 데이터와 충돌 방지 정책 합의.

type BSAState = {
  // selection (detail target)
  selectedRow: BSATableProps | null;
  setSelectedRow: (row: BSATableProps | null) => void;
  // chunks collection + selection
  chunks: ChunkProps[];
  selectedChunk: ChunkProps | null;
  setChunks: (chunks: ChunkProps[]) => void;
  updateChunk: (updated: ChunkProps) => void;
  addChunk: (chunk: ChunkProps) => void;
  removeChunk: (progressId: string) => void;
  cleanupNewEmptyChunks: (excludeProgressId?: string) => void;
  setSelectedChunk: (chunk: ChunkProps | null) => void;
  reset: () => void;
};

export const useBSAStore = create<BSAState>((set, get) => ({
  selectedRow: null,
  setSelectedRow: (row) => set({ selectedRow: row }),

  chunks: [],
  selectedChunk: null,
  setChunks: (chunks) => set({ chunks }),
  updateChunk: (updated) =>
    set({
      chunks: get().chunks.map((c) =>
        c.progressId === updated.progressId ? updated : c
      ),
    }),
  addChunk: (chunk) => set({ chunks: [chunk, ...get().chunks] }),
  removeChunk: (progressId) =>
    set({
      chunks: get().chunks.filter((c) => c.progressId !== progressId),
      selectedChunk:
        get().selectedChunk?.progressId === progressId
          ? null
          : get().selectedChunk,
    }),
  cleanupNewEmptyChunks: (excludeProgressId) =>
    set({
      chunks: get().chunks.filter((c) => {
        const isExcluded =
          excludeProgressId && c.progressId === excludeProgressId;
        if (isExcluded) return true;
        const isNew = !!c.isNew;
        const isEmptyTitle = !c.title || c.title.trim().length === 0;
        const isEmptyContent = !c.content || c.content.trim().length === 0;
        const isEmptyFiles = !c.attachedFile || c.attachedFile.length === 0;
        return !(isNew && isEmptyTitle && isEmptyContent && isEmptyFiles);
      }),
    }),
  setSelectedChunk: (chunk) => set({ selectedChunk: chunk }),
  reset: () => set({ selectedRow: null, selectedChunk: null, chunks: [] }),
}));
