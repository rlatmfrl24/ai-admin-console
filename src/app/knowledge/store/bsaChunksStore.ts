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
  setSelectedChunk: (chunk) => set({ selectedChunk: chunk }),
  reset: () => set({ chunks: [] }),
}));
