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
  sources: AnswerSource[];
}

interface AnswerSource {
  sourceRank: number;
  sourceType: "retrieval" | "api" | "chat" | "pim";
  sourceId: string;
  sourceName: string;
  sourceMessage: {
    title: string;
    content: string;
  };
  sourceDescription: string;
  duration: number;
}

interface RetrievalAnswerSource extends AnswerSource {
  fileName: string;
  previewFiles: File[];
  keywords: string[];
}

interface ApiAnswerSource extends AnswerSource {
  specificFields: {
    [key: string]: string;
    json: string;
  };
}

interface PimAnswerSource extends AnswerSource {
  keywords: string[];
}

interface ChatAnswerSource extends AnswerSource {
  context: string[];
}

interface Thread {
  threadId: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  messages: ChatMessage[];
}

export type {
  ChatMessage,
  ChatAnswer,
  Thread,
  AnswerSource,
  RetrievalAnswerSource,
  ApiAnswerSource,
  PimAnswerSource,
  ChatAnswerSource,
};
