import { create } from "zustand";

import { ChatMessage, Thread, ChatAnswer, AnswerSource } from "../types/chat";

type SearchMatch = {
  chatId: string;
  section: "body" | "source-title" | "source-content";
  sourceKey?: string; // `${sourceType}:${sourceId}` when section starts with 'source-'
  occurrence: number; // 1-based occurrence within the section text
};

interface ChatStoreState {
  threadHistory: Thread[];
  currentThreadId: string | null;

  // Getters
  getCurrentThread: () => Thread | null;

  // Mutations
  createThread: (name?: string, description?: string) => string; // returns new threadId
  addThread: (thread: Thread) => void;
  renameThread: (threadId: string, name: string) => void;
  removeThread: (threadId: string) => void;
  setCurrentThread: (threadId: string) => void;
  addMessage: (message: ChatMessage) => void; // add to current thread
  clear: () => void;

  // UI/Async state
  isAwaitingResponse: boolean;
  setAwaitingResponse: (awaiting: boolean) => void;

  // Search state
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  searchCaseSensitive: boolean;
  setSearchCaseSensitive: (v: boolean) => void;
  searchUseRegex: boolean;
  setSearchUseRegex: (v: boolean) => void;

  // Search navigation state
  searchMatches: SearchMatch[]; // flattened occurrences in render order
  setSearchMatches: (matches: SearchMatch[]) => void;
  searchCurrentMatchIndex: number;
  setSearchCurrentMatchIndex: (idx: number) => void;

  // Selection state
  selectedAnswer: ChatAnswer | null;
  selectedSourceTypes: AnswerSource["sourceType"][];
  setSelectedAnswer: (answer: ChatAnswer | null) => void;
  toggleSelectedSourceType: (type: AnswerSource["sourceType"]) => void;
  setSelectedSourceTypes: (types: AnswerSource["sourceType"][]) => void;
  selectOnlySourceType: (type: AnswerSource["sourceType"]) => void;

  // JSON Viewer state
  isJsonViewerOpen: boolean;
  jsonViewerData: string | null;
  openJsonViewer: (data: string) => void;
  closeJsonViewer: () => void;
}

function generateThreadId(): string {
  const randomSuffix = Math.random().toString(36).slice(2, 10);
  return `thr_${Date.now()}_${randomSuffix}`;
}

export const useChatStore = create<ChatStoreState>((set, get) => ({
  threadHistory: [],
  currentThreadId: null,
  isAwaitingResponse: false,
  selectedAnswer: null,
  selectedSourceTypes: [],
  isJsonViewerOpen: false,
  jsonViewerData: null,
  searchQuery: "",
  searchCaseSensitive: false,
  searchUseRegex: false,
  searchMatches: [],
  searchCurrentMatchIndex: 0,

  getCurrentThread: () => {
    const { currentThreadId, threadHistory } = get();
    if (!currentThreadId) return null;
    return threadHistory.find((t) => t.threadId === currentThreadId) || null;
  },

  createThread: (name = "New Chat", description = "") => {
    const now = new Date();
    const threadId = generateThreadId();
    const newThread: Thread = {
      threadId,
      name,
      description,
      createdAt: now,
      updatedAt: now,
      messages: [],
    };
    set((state) => ({
      threadHistory: [...state.threadHistory, newThread],
      currentThreadId: threadId,
      // Reset selection/JSON viewer when a new chat is created
      selectedAnswer: null,
      selectedSourceTypes: [],
      isJsonViewerOpen: false,
      jsonViewerData: null,
    }));
    return threadId;
  },

  addThread: (thread: Thread) =>
    set((state) => ({
      threadHistory: [...state.threadHistory, thread],
      currentThreadId: thread.threadId,
      // Reset selection/JSON viewer when a new chat is added/opened
      selectedAnswer: null,
      selectedSourceTypes: [],
      isJsonViewerOpen: false,
      jsonViewerData: null,
    })),

  renameThread: (threadId: string, name: string) =>
    set((state) => ({
      threadHistory: state.threadHistory.map((t) =>
        t.threadId === threadId ? { ...t, name, updatedAt: new Date() } : t
      ),
    })),

  removeThread: (threadId: string) =>
    set((state) => {
      const filtered = state.threadHistory.filter(
        (t) => t.threadId !== threadId
      );
      const isRemovingCurrent = state.currentThreadId === threadId;
      return {
        threadHistory: filtered,
        currentThreadId: isRemovingCurrent
          ? filtered.length > 0
            ? filtered[filtered.length - 1].threadId
            : null
          : state.currentThreadId,
      };
    }),

  setCurrentThread: (threadId: string) =>
    set((state) => ({
      currentThreadId: state.threadHistory.some((t) => t.threadId === threadId)
        ? threadId
        : state.currentThreadId,
      // Reset selection/JSON viewer when switching to another thread
      selectedAnswer: null,
      selectedSourceTypes: [],
      isJsonViewerOpen: false,
      jsonViewerData: null,
    })),

  addMessage: (message: ChatMessage) =>
    set((state) => {
      let { currentThreadId, threadHistory } = state;
      const didBootstrap = !currentThreadId;

      // Ensure there's a current thread to append to
      if (!currentThreadId) {
        const newId = generateThreadId();
        const now = new Date();
        const bootstrapThread: Thread = {
          threadId: newId,
          name: "New Chat",
          description: "",
          createdAt: now,
          updatedAt: now,
          messages: [],
        };
        threadHistory = [...threadHistory, bootstrapThread];
        currentThreadId = newId;
      }

      const updatedHistory = threadHistory.map((t) =>
        t.threadId === currentThreadId
          ? { ...t, messages: [...t.messages, message], updatedAt: new Date() }
          : t
      );

      return {
        threadHistory: updatedHistory,
        currentThreadId,
        ...(didBootstrap
          ? {
              // Reset selection/JSON viewer when a chat is bootstrapped implicitly
              selectedAnswer: null,
              selectedSourceTypes: [],
              isJsonViewerOpen: false,
              jsonViewerData: null,
            }
          : {}),
      };
    }),

  setAwaitingResponse: (awaiting: boolean) =>
    set(() => ({ isAwaitingResponse: awaiting })),

  setSearchQuery: (q: string) => set(() => ({ searchQuery: q })),
  setSearchCaseSensitive: (v: boolean) =>
    set(() => ({ searchCaseSensitive: v })),
  setSearchUseRegex: (v: boolean) => set(() => ({ searchUseRegex: v })),
  setSearchMatches: (matches: SearchMatch[]) =>
    set(() => ({ searchMatches: matches })),
  setSearchCurrentMatchIndex: (idx: number) =>
    set(() => ({ searchCurrentMatchIndex: idx })),

  setSelectedAnswer: (answer: ChatAnswer | null) =>
    set(() => ({ selectedAnswer: answer })),

  toggleSelectedSourceType: (type: AnswerSource["sourceType"]) =>
    set((state) => {
      const hasType = state.selectedSourceTypes.includes(type);
      return {
        selectedSourceTypes: hasType
          ? state.selectedSourceTypes.filter((t) => t !== type)
          : [...state.selectedSourceTypes, type],
      };
    }),

  setSelectedSourceTypes: (types: AnswerSource["sourceType"][]) =>
    set(() => ({ selectedSourceTypes: Array.from(new Set(types)) })),

  selectOnlySourceType: (type: AnswerSource["sourceType"]) =>
    set(() => ({ selectedSourceTypes: [type] })),

  openJsonViewer: (data: string) =>
    set(() => ({ isJsonViewerOpen: true, jsonViewerData: data })),

  closeJsonViewer: () =>
    set(() => ({ isJsonViewerOpen: false, jsonViewerData: null })),

  clear: () => set({ threadHistory: [], currentThreadId: null }),
}));
