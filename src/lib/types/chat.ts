interface ChatMessage {
  chatId: string;
  message: string | ChatAnswer;
  isLoading?: boolean;
  attachedFiles?: File[];
  role: "user" | "assistant";
  createdAt: Date;
}

interface ChatAnswer extends ChatMessage {
  intent: string;
  agents: string[];
  duration: number;
  sources: ChatAnswerSource[];
}

interface ChatAnswerSource {
  sourceType: "retrieval" | "api" | "chat" | "pim";
  sourceId: string;
  sourceName: {
    title: string;
    name: string;
  };
  sourceDescription: string;
  duration: number;
}

interface Thread {
  threadId: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  messages: ChatMessage[];
}

export type { ChatMessage, ChatAnswer, ChatAnswerSource, Thread };
