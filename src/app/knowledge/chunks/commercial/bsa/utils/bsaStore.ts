import { create } from "zustand";
import type { BSATableProps, ChunkProps } from "@/lib/types/bsa";

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
