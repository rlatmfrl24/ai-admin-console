import { create } from "zustand";
import { BSATableProps } from "@/types/bsa";

interface HeaderState {
  headerNode: React.ReactNode | null;
  setHeaderNode: (node: React.ReactNode | null) => void;
}

export const useHeaderStore = create<HeaderState>((set) => ({
  headerNode: null,
  setHeaderNode: (node) => set({ headerNode: node }),
}));

interface BSASelectionState {
  selectedRow: BSATableProps | null;
  setSelectedRow: (row: BSATableProps | null) => void;
}

export const useBSASelectionStore = create<BSASelectionState>((set) => ({
  selectedRow: null,
  setSelectedRow: (row) => set({ selectedRow: row }),
}));
