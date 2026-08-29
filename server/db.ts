import crypto from 'crypto';
import { User, UploadedDocument, DocumentChunk, ChatSession, ChatMessage, DashboardStats } from '../src/types';
import { SAMPLE_DOCUMENTS_SEED } from '../src/lib/constants';

interface DBState {
  users: (User & { passwordHash: string })[];
  documents: UploadedDocument[];
  chunks: DocumentChunk[];
  sessions: ChatSession[];
  queryLogs: {
    id: string;
    userId: string;
    query: string;
    timestamp: string;
    mode: 'document_only' | 'document_general';
    sourcesFound: number;
    latencyMs: number;
  }[];
}

function hashPassword(password: string): string {
  const salt = 'mca_rag_secure_salt_2026';
  return crypto.createHash('sha256').update(password + salt).digest('hex');
}

// Initial In-Memory State seeded with demo users and sample indexed documents
const state: DBState = {
  users: [
    {
      id: 'admin-001',
      name: 'System Administrator',
      email: 'admin@ragproject.edu',
      role: 'admin',
      createdAt: new Date(Date.now() - 3600000 * 24 * 30).toISOString(),
      passwordHash: hashPassword('admin123'),
      documentsCount: 2,
      queriesCount: 14
    },
    {
      id: 'user-001',
      name: 'Research Scholar',
      email: 'student@ragproject.edu',
      role: 'user',
      createdAt: new Date(Date.now() - 3600000 * 24 * 7).toISOString(),
      passwordHash: hashPassword('student123'),
      documentsCount: 2,
      queriesCount: 8
    }
  ],
  documents: [],
  chunks: [],
  sessions: [],
  queryLogs: [
    {
      id: 'log-1',
      userId: 'user-001',
      query: 'What is the three-tier approval workflow for curriculum updates?',
      timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
      mode: 'document_only',
      sourcesFound: 2,
      latencyMs: 340
    },
    {
      id: 'log-2',
      userId: 'user-001',
      query: 'How does Hybrid Retrieval combine dense vector search with BM25?',
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
      mode: 'document_only',
      sourcesFound: 3,
      latencyMs: 290
    }
  ]
};

// Seed sample documents into DBState
function seedInitialDocuments() {
  SAMPLE_DOCUMENTS_SEED.forEach(sample => {
    const docId = sample.id;
    const doc: UploadedDocument = {
      id: docId,
      userId: 'user-001',
      filename: sample.filename,
      originalName: sample.originalName,
      fileSize: sample.fileSize,
      pageCount: sample.pageCount,
      chunkCount: sample.chunkCount,
      uploadDate: sample.uploadDate,
      status: sample.status,
      analysis: sample.analysis
    };
    state.documents.push(doc);

    // Create chunks
    sample.samplePages.forEach((p, idx) => {
      state.chunks.push({
        id: `chunk-${docId}-${idx}`,
        documentId: docId,
        filename: sample.filename,
        pageNumber: p.pageNumber,
        chunkIndex: idx,
        text: p.text,
        tokenCount: p.text.split(/\s+/).length
      });
    });
  });

  // Seed default chat session
  const defaultSession: ChatSession = {
    id: 'session-default-01',
    userId: 'user-001',
    title: 'University & RAG Architecture Exploration',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 1).toISOString(),
    mode: 'document_only',
    selectedDocumentIds: [],
    messages: [
      {
        id: 'msg-1',
        sessionId: 'session-default-01',
        sender: 'user',
        text: 'What is the three-tier approval workflow for curriculum updates?',
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
        mode: 'document_only'
      },
      {
        id: 'msg-2',
        sessionId: 'session-default-01',
        sender: 'bot',
        text: 'According to the university workflow manual, syllabus revisions and curriculum updates follow a strict three-tier role-based approval pipeline:\n\n1. **Department Board of Studies (BOS)**: Comprising internal professors and two external subject matter experts who draft and formulate modifications.\n2. **Faculty Board**: Reviews the proposal for cross-disciplinary alignment.\n3. **Academic Council**: Holds the ultimate statutory authority to formally ratify academic programs.',
        timestamp: new Date(Date.now() - 3600000 * 2 + 1500).toISOString(),
        mode: 'document_only',
        sources: [
          {
            documentId: 'doc-seed-1',
            filename: 'University_Workflow_and_Governance.pdf',
            pageNumber: 12,
            chunkIndex: 1,
            passage: 'Section 4: Curriculum Revision and Approval Hierarchy. The university workflow uses role-based approval pipelines for any syllabus revision... Step 1: Department Board of Studies (BOS)... Step 2: Faculty Board... Step 3: Academic Council...',
            relevanceScore: 0.94,
            matchType: 'hybrid'
          }
        ],
        isGeneralKnowledge: false,
        retrievalLatencyMs: 45,
        generationLatencyMs: 280,
        suggestedFollowUps: [
          'What are the weightages for CIE and SEE examinations?',
          'What criteria are used in the Academic Performance Index (API)?',
          'Who are the statutory authorities on the Academic Council?'
        ]
      }
    ]
  };
  state.sessions.push(defaultSession);
}

seedInitialDocuments();

export const db = {
  // User Management
  findUserByEmail(email: string) {
    return state.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  },
  findUserById(id: string) {
    const user = state.users.find(u => u.id === id);
    if (!user) return null;
    const { passwordHash: _, ...safeUser } = user;
    return safeUser;
  },
  createUser(name: string, email: string, password: string, role: 'user' | 'admin' = 'user'): User {
    const existing = this.findUserByEmail(email);
    if (existing) throw new Error('A user with this email address already exists.');
    const newUser = {
      id: `usr-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name,
      email: email.toLowerCase(),
      role,
      createdAt: new Date().toISOString(),
      passwordHash: hashPassword(password),
      documentsCount: 0,
      queriesCount: 0
    };
    state.users.push(newUser);
    const { passwordHash: _, ...safeUser } = newUser;
    return safeUser;
  },
  verifyUser(email: string, password: string): User | null {
    const user = this.findUserByEmail(email);
    if (!user) return null;
    if (user.passwordHash !== hashPassword(password)) return null;
    const { passwordHash: _, ...safeUser } = user;
    return safeUser;
  },
  getAllUsers(): User[] {
    return state.users.map(({ passwordHash: _, ...u }) => ({
      ...u,
      documentsCount: state.documents.filter(d => d.userId === u.id).length,
      queriesCount: state.queryLogs.filter(q => q.userId === u.id).length
    }));
  },

  // Document Management
  getDocumentsByUser(userId: string): UploadedDocument[] {
    return state.documents.filter(d => d.userId === userId || d.userId === 'user-001');
  },
  getDocumentById(docId: string): UploadedDocument | undefined {
    return state.documents.find(d => d.id === docId);
  },
  addDocument(doc: UploadedDocument, chunks: DocumentChunk[]) {
    // Check duplicates for this user
    const existingIdx = state.documents.findIndex(d => d.userId === doc.userId && d.originalName === doc.originalName);
    if (existingIdx !== -1) {
      // Remove previous version
      const oldId = state.documents[existingIdx].id;
      state.documents.splice(existingIdx, 1);
      state.chunks = state.chunks.filter(c => c.documentId !== oldId);
    }
    state.documents.push(doc);
    state.chunks.push(...chunks);
  },
  deleteDocument(docId: string, userId: string): boolean {
    const idx = state.documents.findIndex(d => d.id === docId && (d.userId === userId || userId === 'admin-001'));
    if (idx === -1) return false;
    state.documents.splice(idx, 1);
    state.chunks = state.chunks.filter(c => c.documentId !== docId);
    return true;
  },
  clearAllDocuments(userId: string): number {
    const beforeCount = state.documents.length;
    const toRemove = state.documents.filter(d => d.userId === userId);
    const removeIds = new Set(toRemove.map(d => d.id));
    state.documents = state.documents.filter(d => !removeIds.has(d.id));
    state.chunks = state.chunks.filter(c => !removeIds.has(c.documentId));
    return beforeCount - state.documents.length;
  },
  getChunks(docIds?: string[]): DocumentChunk[] {
    if (!docIds || docIds.length === 0) return state.chunks;
    const set = new Set(docIds);
    return state.chunks.filter(c => set.has(c.documentId));
  },

  // Sessions and Chat Memory
  getSessionsByUser(userId: string): ChatSession[] {
    return state.sessions.filter(s => s.userId === userId || s.userId === 'user-001').sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  },
  getSessionById(sessionId: string): ChatSession | undefined {
    return state.sessions.find(s => s.id === sessionId);
  },
  saveSession(session: ChatSession) {
    const idx = state.sessions.findIndex(s => s.id === session.id);
    if (idx !== -1) {
      state.sessions[idx] = session;
    } else {
      state.sessions.unshift(session);
    }
  },
  deleteSession(sessionId: string): boolean {
    const idx = state.sessions.findIndex(s => s.id === sessionId);
    if (idx === -1) return false;
    state.sessions.splice(idx, 1);
    return true;
  },
  logQuery(userId: string, query: string, mode: 'document_only' | 'document_general', sourcesFound: number, latencyMs: number) {
    state.queryLogs.unshift({
      id: `log-${Date.now()}`,
      userId,
      query,
      timestamp: new Date().toISOString(),
      mode,
      sourcesFound,
      latencyMs
    });
  },

  // Dashboard Stats
  getDashboardStats(userId: string): DashboardStats {
    const userDocs = this.getDocumentsByUser(userId);
    const userDocIds = new Set(userDocs.map(d => d.id));
    const userChunks = state.chunks.filter(c => userDocIds.has(c.documentId));
    const userQueries = state.queryLogs.filter(q => q.userId === userId || q.userId === 'user-001');
    const userSessions = state.sessions.filter(s => s.userId === userId || s.userId === 'user-001');

    const totalPages = userDocs.reduce((acc, d) => acc + (d.pageCount || 1), 0);
    const storageUsedBytes = userDocs.reduce((acc, d) => acc + (d.fileSize || 0), 0);
    const avgLatency = userQueries.length > 0 
      ? Math.round(userQueries.reduce((acc, q) => acc + q.latencyMs, 0) / userQueries.length) 
      : 240;

    return {
      totalDocuments: userDocs.length,
      totalPages,
      totalChunks: userChunks.length,
      totalQuestionsAsked: userQueries.length,
      activeSessions: userSessions.length,
      averageLatencyMs: avgLatency,
      storageUsedBytes,
      recentDocuments: userDocs.slice(0, 5),
      recentQueries: userQueries.slice(0, 6).map(q => ({
        query: q.query,
        timestamp: q.timestamp,
        mode: q.mode,
        sourcesFound: q.sourcesFound
      }))
    };
  }
};
