import { create } from 'zustand';

interface HeaderState {
  headerNode: React.ReactNode | null;
  setHeaderNode: (node: React.ReactNode | null) => void;
}

export const useHeaderStore = create<HeaderState>((set) => ({
  headerNode: null,
  setHeaderNode: (node) => set({ headerNode: node }),
}));
