export type Role = 'user' | 'admin';

export type AnswerMode = 'document_only' | 'document_general';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
  documentsCount?: number;
  queriesCount?: number;
}

export interface DocumentChunk {
  id: string;
  documentId: string;
  filename: string;
  pageNumber: number;
  chunkIndex: number;
  text: string;
  vector?: number[];
  tokenCount: number;
}

export interface DocumentAnalysis {
  summary: string;
  keyPoints: string[];
  importantTopics: string[];
  keywords: string[];
  readingTimeMinutes: number;
  pageCount: number;
  totalChunks: number;
  suggestedQuestions: string[];
}

export interface UploadedDocument {
  id: string;
  userId: string;
  filename: string;
  originalName: string;
  fileSize: number;
  pageCount: number;
  chunkCount: number;
  uploadDate: string;
  status: 'processing' | 'indexed' | 'error';
  errorMessage?: string;
  analysis?: DocumentAnalysis;
  extractedText?: string;
}

export interface SourceCitation {
  documentId: string;
  filename: string;
  pageNumber: number;
  chunkIndex: number;
  passage: string;
  relevanceScore: number;
  matchType: 'vector' | 'keyword' | 'hybrid';
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  sender: 'user' | 'bot' | 'system';
  text: string;
  timestamp: string;
  mode?: AnswerMode;
  sources?: SourceCitation[];
  isGeneralKnowledge?: boolean;
  modelUsed?: string;
  retrievalLatencyMs?: number;
  generationLatencyMs?: number;
  suggestedFollowUps?: string[];
}

export interface ChatSession {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
  selectedDocumentIds: string[]; // empty means all documents
  mode: AnswerMode;
}

export interface RAGConfig {
  ollamaBaseUrl: string;
  ollamaModel: string;
  embedModel: string;
  chunkSize: number;
  chunkOverlap: number;
  topK: number;
  relevanceThreshold: number;
  hybridAlpha: number; // 0.7 = 70% vector + 30% keyword
  maxFileSizeMB: number;
  strictAntiHallucination: boolean;
}

export interface DashboardStats {
  totalDocuments: number;
  totalPages: number;
  totalChunks: number;
  totalQuestionsAsked: number;
  activeSessions: number;
  averageLatencyMs: number;
  storageUsedBytes: number;
  recentDocuments: UploadedDocument[];
  recentQueries: {
    query: string;
    timestamp: string;
    mode: AnswerMode;
    sourcesFound: number;
  }[];
}

export interface SystemUserStats {
  users: User[];
  totalUsers: number;
  adminCount: number;
  totalSystemChunks: number;
  totalSystemQueries: number;
}
