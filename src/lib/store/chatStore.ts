import { ChatMessage, Thread, ChatAnswer, AnswerSource } from "../types/chat";
import { create } from "zustand";

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

  // Selection state
  selectedAnswer: ChatAnswer | null;
  selectedSourceType: AnswerSource["sourceType"] | null;
  setSelectedAnswer: (answer: ChatAnswer | null) => void;
  setSelectedSourceType: (type: AnswerSource["sourceType"] | null) => void;
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
  selectedSourceType: null,

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
    }));
    return threadId;
  },

  addThread: (thread: Thread) =>
    set((state) => ({
      threadHistory: [...state.threadHistory, thread],
      currentThreadId: thread.threadId,
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
    })),

  addMessage: (message: ChatMessage) =>
    set((state) => {
      let { currentThreadId, threadHistory } = state;

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
      };
    }),

  setAwaitingResponse: (awaiting: boolean) =>
    set(() => ({ isAwaitingResponse: awaiting })),

  setSelectedAnswer: (answer: ChatAnswer | null) =>
    set(() => ({ selectedAnswer: answer })),

  setSelectedSourceType: (type: AnswerSource["sourceType"] | null) =>
    set(() => ({ selectedSourceType: type })),

  clear: () => set({ threadHistory: [], currentThreadId: null }),
}));
