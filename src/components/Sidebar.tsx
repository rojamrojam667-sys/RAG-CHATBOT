import React from 'react';
import { ChatSession, UploadedDocument, User } from '../types';
import { 
  Plus, MessageSquare, Upload, FileText, Trash2, Moon, Sun, 
  BarChart3, Award, Code2, Sliders, Shield, PanelLeftClose, Sparkles
} from 'lucide-react';

interface SidebarProps {
  sessions: ChatSession[];
  currentSessionId: string | null;
  documents: UploadedDocument[];
  selectedDocIds: string[];
  currentUser: User;
  isDark: boolean;
  activeView: 'chat' | 'dashboard' | 'admin';
  isOpen: boolean;
  onToggleOpen: () => void;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onDeleteSession: (id: string, e: React.MouseEvent) => void;
  onOpenUpload: () => void;
  onToggleDocSelection: (id: string) => void;
  onSelectAllDocs: () => void;
  onOpenAcademicHub: () => void;
  onOpenCodeExplorer: () => void;
  onOpenSettings: () => void;
  onOpenAuth: () => void;
  onToggleTheme: () => void;
  onNavigateView: (view: 'chat' | 'dashboard' | 'admin') => void;
  onOpenDocAnalysis: (doc: UploadedDocument) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  sessions,
  currentSessionId,
  documents,
  selectedDocIds,
  currentUser,
  isDark,
  activeView,
  isOpen,
  onToggleOpen,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  onOpenUpload,
  onToggleDocSelection,
  onSelectAllDocs,
  onOpenAcademicHub,
  onOpenCodeExplorer,
  onOpenSettings,
  onOpenAuth,
  onToggleTheme,
  onNavigateView,
  onOpenDocAnalysis
}) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onToggleOpen}
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Bento Grid Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 flex flex-col w-64 bg-[#0f172a] text-slate-300 border-r border-slate-800 transition-transform duration-300 ease-in-out shrink-0 select-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-md shadow-blue-500/20 shrink-0">
              R
            </div>
            <h1 className="text-lg font-bold text-white tracking-tight leading-none truncate">
              RAG Intellect
            </h1>
          </div>

          <button
            onClick={onToggleOpen}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 md:hidden"
          >
            <PanelLeftClose className="w-5 h-5" />
          </button>
        </div>

        {/* Primary Action Button */}
        <div className="px-4 mb-4 space-y-2">
          <button
            onClick={onNewChat}
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-md shadow-blue-600/30 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>New Analysis</span>
          </button>

          <button
            onClick={onOpenUpload}
            className="w-full py-2 px-3 bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-medium border border-slate-700/60 transition-all flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Upload className="w-3.5 h-3.5 text-blue-400" />
              <span>Knowledge Store</span>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-blue-950 text-blue-300 text-[10px] font-mono font-bold">
              {documents.length} Docs
            </span>
          </button>
        </div>

        {/* Document Scope List */}
        <nav className="flex-1 px-3 space-y-4 overflow-y-auto">
          <div className="space-y-1">
            <div className="flex items-center justify-between px-3 py-1 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <span>Documents</span>
              <button
                onClick={onSelectAllDocs}
                className="text-[10px] text-blue-400 hover:text-blue-300 lowercase font-mono cursor-pointer"
              >
                {selectedDocIds.length === 0 ? 'filter' : 'all'}
              </button>
            </div>

            <div className="space-y-1">
              {documents.map((doc, idx) => {
                const isSelected = selectedDocIds.length === 0 || selectedDocIds.includes(doc.id);
                const dotColor = idx % 3 === 0 ? 'bg-green-400' : idx % 3 === 1 ? 'bg-blue-400' : 'bg-amber-400';

                return (
                  <div
                    key={doc.id}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-all group ${
                      isSelected
                        ? 'bg-slate-800/50 text-white'
                        : 'text-slate-400 hover:bg-slate-800/30 opacity-60'
                    }`}
                  >
                    <button
                      onClick={() => onToggleDocSelection(doc.id)}
                      className="flex items-center gap-3 min-w-0 text-left flex-1 cursor-pointer"
                    >
                      <div className={`w-2 h-2 rounded-full shrink-0 ${isSelected ? dotColor : 'bg-slate-500'}`} />
                      <span className="text-sm truncate" title={doc.filename}>
                        {doc.filename}
                      </span>
                    </button>

                    <button
                      onClick={() => onOpenDocAnalysis(doc)}
                      className="p-1 text-slate-500 hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Quick Document Intelligence"
                    >
                      <Sparkles className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chat History Sessions */}
          <div className="space-y-1">
            <div className="px-3 py-1 text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
              <span>Chat History</span>
              <span className="font-mono text-[10px]">{sessions.length}</span>
            </div>

            <div className="space-y-1">
              {sessions.length === 0 ? (
                <div className="px-3 py-3 text-center text-slate-500 text-xs">
                  No chat history yet.
                </div>
              ) : (
                sessions.map((sess) => {
                  const isCurrent = currentSessionId === sess.id && activeView === 'chat';
                  return (
                    <div
                      key={sess.id}
                      onClick={() => {
                        onSelectSession(sess.id);
                        onNavigateView('chat');
                      }}
                      className={`group flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-all ${
                        isCurrent
                          ? 'bg-blue-600/20 text-blue-300 font-semibold border border-blue-500/30 shadow-xs'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isCurrent ? 'text-blue-400' : 'text-slate-500'}`} />
                        <span className="truncate text-xs">
                          {sess.title || 'Untitled Research Chat'}
                        </span>
                      </div>

                      <button
                        onClick={(e) => onDeleteSession(sess.id, e)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition-opacity"
                        title="Delete Session"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </nav>

        {/* Feature Navigation Bar */}
        <div className="p-3 border-t border-slate-800 space-y-1 bg-slate-950/40 text-xs">
          <button
            onClick={() => onNavigateView('dashboard')}
            className={`w-full px-3 py-2 rounded-lg flex items-center gap-2.5 transition-colors cursor-pointer ${
              activeView === 'dashboard'
                ? 'bg-blue-600/20 text-blue-300 font-semibold border border-blue-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-blue-400" />
            <span>Control Dashboard</span>
          </button>

          <button
            onClick={onOpenAcademicHub}
            className="w-full px-3 py-2 rounded-lg flex items-center gap-2.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-colors cursor-pointer"
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span>Academic Viva Dossier</span>
          </button>

          <button
            onClick={onOpenCodeExplorer}
            className="w-full px-3 py-2 rounded-lg flex items-center gap-2.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-colors cursor-pointer"
          >
            <Code2 className="w-4 h-4 text-emerald-400" />
            <span>Python Source Files</span>
          </button>

          {currentUser.role === 'admin' && (
            <button
              onClick={() => onNavigateView('admin')}
              className={`w-full px-3 py-2 rounded-lg flex items-center gap-2.5 transition-colors cursor-pointer ${
                activeView === 'admin'
                  ? 'bg-purple-600/20 text-purple-300 font-semibold border border-purple-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Shield className="w-4 h-4 text-purple-400" />
              <span>Admin RBAC</span>
            </button>
          )}

          <div className="flex items-center gap-1 pt-1">
            <button
              onClick={onOpenSettings}
              className="flex-1 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 text-xs cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5 text-slate-400" />
              <span>RAG Config</span>
            </button>

            <button
              onClick={onToggleTheme}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 cursor-pointer"
              title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
            </button>
          </div>
        </div>

        {/* User Profile Bento Box */}
        <div className="p-4 border-t border-slate-800">
          <div
            onClick={onOpenAuth}
            className="flex items-center gap-3 p-2 hover:bg-slate-800 rounded-lg cursor-pointer transition-all"
          >
            <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0">
              {currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{currentUser.name}</p>
              <p className="text-[10px] text-slate-500 truncate">
                {currentUser.role === 'admin' ? 'System Administrator' : 'Research Scholar'}
              </p>
            </div>
          </div>
        </div>

      </aside>
    </>
  );
};

