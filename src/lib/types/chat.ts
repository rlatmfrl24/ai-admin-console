interface ChatMessage {
  chatId: string;
  message: string | ChatAnswer;
  attachedFiles?: File[];
  role: "user" | "assistant";
  createdAt: Date;
}

interface ChatAnswer extends ChatMessage {
  intent: {
    title: string;
    description: string;
    keywords: string[];
  };
  duration: number;
  sources: ChatAnswerSource[];
}

interface ChatAnswerSource {
  sourceRank: number;
  sourceType: "retrieval" | "api" | "chat" | "pim";
  sourceId: string;
  sourceName: {
    title: string;
    name: string;
  };
  sourceMessage: string;
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
