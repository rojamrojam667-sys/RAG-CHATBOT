import React, { useState, useEffect } from 'react';
import { 
  User, UploadedDocument, ChatSession, AnswerMode, RAGConfig, DashboardStats 
} from './types';
import { DEFAULT_RAG_CONFIG, SAMPLE_DOCUMENTS_SEED } from './lib/constants';
import { Sidebar } from './components/Sidebar';
import { ChatView } from './components/ChatView';
import { DashboardView } from './components/DashboardView';
import { AdminView } from './components/AdminView';
import { DocumentManagerModal } from './components/DocumentManagerModal';
import { DocumentAnalysisModal } from './components/DocumentAnalysisModal';
import { AcademicHubModal } from './components/AcademicHubModal';
import { CodeExplorerModal } from './components/CodeExplorerModal';
import { SettingsModal } from './components/SettingsModal';
import { AuthModal } from './components/AuthModal';

export function App() {
  // Theme state
  const [isDark, setIsDark] = useState<boolean>(() => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // User & RBAC state
  const [currentUser, setCurrentUser] = useState<User>({
    id: 'user-001',
    name: 'Research Scholar',
    email: 'student@ragproject.edu',
    role: 'user',
    createdAt: new Date().toISOString()
  });

  // Navigation View
  const [activeView, setActiveView] = useState<'chat' | 'dashboard' | 'admin'>('chat');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Core Data States
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [selectedDocIds, setSelectedDocIds] = useState<string[]>([]);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [ragConfig, setRagConfig] = useState<RAGConfig>(DEFAULT_RAG_CONFIG);
  const [stats, setStats] = useState<DashboardStats | null>(null);

  // Async States
  const [isAsking, setIsAsking] = useState(false);

  // Modal States
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAnalysisDoc, setShowAnalysisDoc] = useState<UploadedDocument | null>(null);
  const [showAcademicHub, setShowAcademicHub] = useState(false);
  const [showCodeExplorer, setShowCodeExplorer] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  // Apply dark mode class to html document
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Initial Data Fetch
  const refreshDocuments = async () => {
    try {
      const res = await fetch(`/api/documents?userId=${currentUser.id}`);
      const data = await res.json();
      if (data.documents) {
        setDocuments(data.documents);
      }
    } catch (err) {
      console.warn('Using initial seed documents:', err);
      // Fallback
      setDocuments(SAMPLE_DOCUMENTS_SEED.map(s => ({
        id: s.id,
        userId: currentUser.id,
        filename: s.filename,
        originalName: s.originalName,
        fileSize: s.fileSize,
        pageCount: s.pageCount,
        chunkCount: s.chunkCount,
        uploadDate: s.uploadDate,
        status: s.status,
        analysis: s.analysis
      })));
    }
  };

  const refreshSessions = async () => {
    try {
      const res = await fetch(`/api/chat/sessions?userId=${currentUser.id}`);
      const data = await res.json();
      if (data.sessions) {
        setSessions(data.sessions);
        if (!currentSessionId && data.sessions.length > 0) {
          setCurrentSessionId(data.sessions[0].id);
        }
      }
    } catch (err) {
      console.warn('Failed to load chat sessions:', err);
    }
  };

  const refreshStats = async () => {
    try {
      const res = await fetch(`/api/dashboard/stats?userId=${currentUser.id}`);
      const data = await res.json();
      if (data.stats) {
        setStats(data.stats);
      }
    } catch (err) {
      console.warn('Failed to load dashboard stats:', err);
    }
  };

  useEffect(() => {
    refreshDocuments();
    refreshSessions();
    refreshStats();
  }, [currentUser.id]);

  const activeSession = sessions.find(s => s.id === currentSessionId) || (sessions.length > 0 ? sessions[0] : null);

  // Handlers
  const handleNewChat = async () => {
    try {
      const res = await fetch('/api/chat/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          title: 'New Research Chat',
          mode: 'document_only',
          selectedDocumentIds: selectedDocIds
        })
      });
      const data = await res.json();
      if (data.session) {
        setSessions(prev => [data.session, ...prev]);
        setCurrentSessionId(data.session.id);
        setActiveView('chat');
        setSidebarOpen(false);
      }
    } catch (err) {
      console.error('Error creating new session:', err);
    }
  };

  const handleDeleteSession = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await fetch(`/api/chat/sessions/${sessionId}`, { method: 'DELETE' });
      setSessions(prev => prev.filter(s => s.id !== sessionId));
      if (currentSessionId === sessionId) {
        const remaining = sessions.filter(s => s.id !== sessionId);
        setCurrentSessionId(remaining.length > 0 ? remaining[0].id : null);
      }
    } catch (err) {
      console.error('Error deleting session:', err);
    }
  };

  const handleSendMessage = async (query: string, mode: AnswerMode) => {
    setIsAsking(true);
    try {
      const res = await fetch('/api/chat/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          sessionId: currentSessionId,
          query,
          mode,
          selectedDocumentIds: selectedDocIds,
          config: ragConfig
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to get answer.');
      }

      if (data.session) {
        setSessions(prev => {
          const idx = prev.findIndex(s => s.id === data.session.id);
          if (idx !== -1) {
            const copy = [...prev];
            copy[idx] = data.session;
            return copy;
          }
          return [data.session, ...prev];
        });
        setCurrentSessionId(data.session.id);
      }
      refreshStats();
    } catch (err) {
      console.error('Failed to ask question:', err);
    } finally {
      setIsAsking(false);
    }
  };

  const handleClearCurrentSession = () => {
    if (!currentSessionId) return;
    if (confirm('Clear messages in this chat session?')) {
      setSessions(prev => prev.map(s => {
        if (s.id === currentSessionId) {
          return { ...s, messages: [] };
        }
        return s;
      }));
    }
  };

  const handleToggleDocSelection = (docId: string) => {
    setSelectedDocIds(prev => {
      if (prev.includes(docId)) {
        return prev.filter(id => id !== docId);
      } else {
        return [...prev, docId];
      }
    });
  };

  const handleSelectAllDocs = () => {
    if (selectedDocIds.length === 0) {
      // Switch to filtering individual
      setSelectedDocIds(documents.map(d => d.id));
    } else {
      // Clear filter (meaning all docs active)
      setSelectedDocIds([]);
    }
  };

  const handleDeleteDocument = async (docId: string) => {
    try {
      await fetch(`/api/documents/${docId}?userId=${currentUser.id}`, { method: 'DELETE' });
      setDocuments(prev => prev.filter(d => d.id !== docId));
      setSelectedDocIds(prev => prev.filter(id => id !== docId));
      refreshStats();
    } catch (err) {
      console.error('Failed to delete doc:', err);
    }
  };

  const handleClearAllDocs = async () => {
    try {
      await fetch('/api/documents/clear-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id })
      });
      setDocuments([]);
      setSelectedDocIds([]);
      refreshStats();
    } catch (err) {
      console.error('Failed to clear docs:', err);
    }
  };

  const handleStartChatWithDoc = (docId: string) => {
    setSelectedDocIds([docId]);
    handleNewChat();
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100 dark:bg-slate-950 font-sans antialiased text-slate-900 dark:text-slate-100">
      
      {/* Sidebar Navigation */}
      <Sidebar
        sessions={sessions}
        currentSessionId={currentSessionId}
        documents={documents}
        selectedDocIds={selectedDocIds}
        currentUser={currentUser}
        isDark={isDark}
        activeView={activeView}
        isOpen={sidebarOpen}
        onToggleOpen={() => setSidebarOpen(!sidebarOpen)}
        onSelectSession={(id) => {
          setCurrentSessionId(id);
          setActiveView('chat');
          setSidebarOpen(false);
        }}
        onNewChat={handleNewChat}
        onDeleteSession={handleDeleteSession}
        onOpenUpload={() => setShowUploadModal(true)}
        onToggleDocSelection={handleToggleDocSelection}
        onSelectAllDocs={handleSelectAllDocs}
        onOpenAcademicHub={() => setShowAcademicHub(true)}
        onOpenCodeExplorer={() => setShowCodeExplorer(true)}
        onOpenSettings={() => setShowSettings(true)}
        onOpenAuth={() => setShowAuth(true)}
        onToggleTheme={() => setIsDark(!isDark)}
        onNavigateView={(view) => {
          setActiveView(view);
          setSidebarOpen(false);
        }}
        onOpenDocAnalysis={(doc) => setShowAnalysisDoc(doc)}
      />

      {/* Main View Area */}
      <main className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {activeView === 'chat' && (
          <ChatView
            session={activeSession}
            documents={documents}
            selectedDocIds={selectedDocIds}
            ragConfig={ragConfig}
            onSendMessage={handleSendMessage}
            onClearSession={handleClearCurrentSession}
            onOpenSidebar={() => setSidebarOpen(true)}
            onOpenDocAnalysis={(doc) => setShowAnalysisDoc(doc)}
            onOpenUploadModal={() => setShowUploadModal(true)}
            isAsking={isAsking}
          />
        )}

        {activeView === 'dashboard' && stats && (
          <DashboardView
            stats={stats}
            onSelectDocument={(doc) => setShowAnalysisDoc(doc)}
            onOpenAnalysis={(doc) => setShowAnalysisDoc(doc)}
            onStartNewChatWithDoc={handleStartChatWithDoc}
            onGoToChat={() => setActiveView('chat')}
          />
        )}

        {activeView === 'admin' && (
          <AdminView currentUser={currentUser} />
        )}
      </main>

      {/* Modals & Dialogs */}
      {showUploadModal && (
        <DocumentManagerModal
          documents={documents}
          userId={currentUser.id}
          onClose={() => setShowUploadModal(false)}
          onUploadSuccess={(newDoc) => {
            setDocuments(prev => [newDoc, ...prev]);
            refreshStats();
          }}
          onDeleteDocument={handleDeleteDocument}
          onClearAll={handleClearAllDocs}
        />
      )}

      {showAnalysisDoc && (
        <DocumentAnalysisModal
          document={showAnalysisDoc}
          onClose={() => setShowAnalysisDoc(null)}
          onSelectQuestion={(q) => {
            setActiveView('chat');
            handleSendMessage(q, 'document_only');
          }}
        />
      )}

      {showAcademicHub && (
        <AcademicHubModal onClose={() => setShowAcademicHub(false)} />
      )}

      {showCodeExplorer && (
        <CodeExplorerModal onClose={() => setShowCodeExplorer(false)} />
      )}

      {showSettings && (
        <SettingsModal
          config={ragConfig}
          onSave={(newCfg) => setRagConfig(newCfg)}
          onClose={() => setShowSettings(false)}
        />
      )}

      {showAuth && (
        <AuthModal
          onLoginSuccess={(user) => {
            setCurrentUser(user);
            refreshDocuments();
            refreshSessions();
            refreshStats();
          }}
          onClose={() => setShowAuth(false)}
        />
      )}

    </div>
  );
}

export default App;
