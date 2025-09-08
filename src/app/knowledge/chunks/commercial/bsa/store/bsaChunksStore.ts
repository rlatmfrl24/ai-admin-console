import { create } from "zustand";
import type { BSAChunksState } from "@/types/bsa";

export const useBSAChunksStore = create<BSAChunksState>((set, get) => ({
  chunks: [],
  selectedChunk: null,
  setChunks: (chunks) => set({ chunks }),
  updateChunk: (updated) =>
    set({
      chunks: get().chunks.map((c) =>
        c.progressId === updated.progressId ? updated : c
      ),
    }),
  addChunk: (chunk) =>
    set({
      chunks: [chunk, ...get().chunks],
    }),
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
  reset: () => set({ chunks: [] }),
}));
