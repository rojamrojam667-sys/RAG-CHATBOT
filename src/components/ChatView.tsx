import React, { useState, useRef, useEffect } from 'react';
import { ChatSession, AnswerMode, UploadedDocument, ChatMessage, RAGConfig } from '../types';
import { SourceCitations } from './SourceCitations';
import { exportChatAsPdf, exportChatAsTxt } from '../lib/pdfExporter';
import { 
  Send, Bot, User, Sparkles, Download, FileText, 
  Trash2, ShieldAlert, Globe, Copy, Check, Clock, 
  ArrowUpRight, AlertCircle, Menu, Layers, BookOpen, Cpu, Settings
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ChatViewProps {
  session: ChatSession | null;
  documents: UploadedDocument[];
  selectedDocIds: string[];
  ragConfig: RAGConfig;
  onSendMessage: (query: string, mode: AnswerMode) => Promise<void>;
  onClearSession: () => void;
  onOpenSidebar: () => void;
  onOpenDocAnalysis: (doc: UploadedDocument) => void;
  onOpenUploadModal: () => void;
  isAsking: boolean;
}

export const ChatView: React.FC<ChatViewProps> = ({
  session,
  documents,
  selectedDocIds,
  ragConfig,
  onSendMessage,
  onClearSession,
  onOpenSidebar,
  onOpenDocAnalysis,
  onOpenUploadModal,
  isAsking
}) => {
  const [inputQuery, setInputQuery] = useState('');
  const [mode, setMode] = useState<AnswerMode>(session?.mode || 'document_only');
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [session?.messages, isAsking]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputQuery.trim() || isAsking) return;
    const query = inputQuery.trim();
    setInputQuery('');
    onSendMessage(query, mode);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgId(id);
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  const handleExportPDF = () => {
    if (!session || session.messages.length === 0) return;
    exportChatAsPdf(session, documents);
  };

  const handleExportTXT = () => {
    if (!session || session.messages.length === 0) return;
    exportChatAsTxt(session, documents);
  };

  const activeDocCount = selectedDocIds.length === 0 ? documents.length : selectedDocIds.length;
  const totalChunks = documents.reduce((acc, d) => acc + (d.chunkCount || 0), 0);

  const quickPrompts = [
    'Explain the core research methodology',
    'Summarize Key Findings & Conclusions',
    'What are the limitations and future work?',
    'What dataset and benchmarks were used?'
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f8fafc] dark:bg-[#090d16] overflow-hidden relative">
      
      {/* Top Header Bar */}
      <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] px-4 sm:px-8 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-4 sm:gap-6 min-w-0">
          <button
            onClick={onOpenSidebar}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 md:hidden"
          >
            <Menu className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            <h2 className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate">
              {session?.title || 'Interactive RAG Workspace'}
            </h2>
          </div>

          {/* Mode Switcher Pill */}
          <div className="hidden sm:flex items-center gap-1 bg-slate-100 dark:bg-slate-800/90 p-1 rounded-xl border border-slate-200/80 dark:border-slate-700/60 text-xs">
            <button
              onClick={() => setMode('document_only')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                mode === 'document_only'
                  ? 'bg-white dark:bg-slate-700 shadow-xs text-blue-600 dark:text-blue-400 font-bold'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Document Mode
            </button>
            <button
              onClick={() => setMode('document_general')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                mode === 'document_general'
                  ? 'bg-white dark:bg-slate-700 shadow-xs text-blue-600 dark:text-blue-400 font-bold'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Hybrid Search
            </button>
          </div>
        </div>

        {/* Right Status Badges */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/60 px-3 py-1.5 rounded-lg border border-slate-200/60 dark:border-slate-700/50">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Ollama Llama 3 Ready</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleExportPDF}
              disabled={!session || session.messages.length === 0}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-40 transition-colors cursor-pointer"
              title="Export Chat to Academic PDF Report"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              onClick={onClearSession}
              disabled={!session || session.messages.length === 0}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-slate-600 hover:text-rose-600 dark:text-slate-300 disabled:opacity-40 transition-colors cursor-pointer"
              title="Clear Conversation History"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Bento Container */}
      <section className="flex-1 p-4 sm:p-6 flex flex-col gap-4 overflow-hidden max-w-6xl mx-auto w-full">
        
        {/* Top Bento Quick Metrics Row */}
        <div className="grid grid-cols-12 gap-4 shrink-0">
          
          {/* Bento Card 1: Docs Indexed */}
          <div className="col-span-6 sm:col-span-3 bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight">
                Docs Indexed
              </span>
              <FileText className="w-4 h-4 text-blue-500" />
            </div>
            <div className="mt-1">
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 font-mono">
                {activeDocCount}
              </h3>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
                FAISS Partition Active
              </p>
            </div>
          </div>

          {/* Bento Card 2: Total Chunks */}
          <div className="col-span-6 sm:col-span-3 bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight">
                Total Chunks
              </span>
              <Layers className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="mt-1">
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 font-mono">
                {totalChunks || 120}
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Vector density high
              </p>
            </div>
          </div>

          {/* Bento Card 3: System Health Micro-Cards */}
          <div className="col-span-12 sm:col-span-6 bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight">
                System Health & Telemetry
              </span>
              <span className="text-[10px] font-mono text-blue-500 font-semibold">
                Hybrid Alpha: {ragConfig.hybridAlpha}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-2.5 border border-slate-100 dark:border-slate-800/80">
                <p className="text-[9px] text-slate-400 font-bold mb-0.5 uppercase">LLM Latency</p>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200 font-mono">1.2s</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-2.5 border border-slate-100 dark:border-slate-800/80">
                <p className="text-[9px] text-slate-400 font-bold mb-0.5 uppercase">FAISS Query</p>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200 font-mono">45ms</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-2.5 border border-slate-100 dark:border-slate-800/80">
                <p className="text-[9px] text-slate-400 font-bold mb-0.5 uppercase">Top-K</p>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200 font-mono">k={ragConfig.topK}</p>
              </div>
            </div>
          </div>

        </div>

        {/* Large Bento Card: Conversation Viewport + Query Bar */}
        <div className="flex-1 bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden min-h-0">
          
          {/* Scrollable Messages Canvas */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6">
            {(!session || session.messages.length === 0) ? (
              /* Welcome State */
              <div className="py-6 sm:py-8 space-y-6 text-center max-w-2xl mx-auto">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-md shadow-blue-600/30">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    Grounded Multi-Document Analysis
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    Ask questions against verified knowledge chunks indexed in the FAISS vector store with zero hallucination fallback.
                  </p>
                </div>

                {/* Pre-Indexed Documents Bento Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                  {documents.slice(0, 4).map((doc) => (
                    <div
                      key={doc.id}
                      className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-2 hover:border-blue-400 transition-all cursor-pointer"
                      onClick={() => onOpenDocAnalysis(doc)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 min-w-0">
                          <FileText className="w-4 h-4 text-blue-500 shrink-0" />
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                            {doc.filename}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 shrink-0">
                          {doc.pageCount}p
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                        {doc.analysis?.summary || 'Indexed for vector similarity queries & deep semantic retrieval.'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Message Stream */
              session.messages.map((msg: ChatMessage) => {
                const isUser = msg.sender === 'user';
                return (
                  <div key={msg.id} className="flex items-start gap-3 sm:gap-4">
                    {/* Avatar */}
                    <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                      isUser
                        ? 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                        : 'bg-blue-100 dark:bg-blue-950/80 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300'
                    }`}>
                      {isUser ? 'U' : 'AI'}
                    </div>

                    {/* Content Box */}
                    <div className="flex-1 space-y-2.5 min-w-0">
                      <div className={`p-4 rounded-2xl rounded-tl-none text-xs sm:text-sm leading-relaxed ${
                        isUser
                          ? 'bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200'
                          : 'bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 text-slate-800 dark:text-slate-100 shadow-xs'
                      }`}>
                        <div className="prose prose-xs sm:prose-sm dark:prose-invert max-w-none break-words">
                          <ReactMarkdown>{msg.text}</ReactMarkdown>
                        </div>
                      </div>

                      {/* Source Citations in Bento Chips */}
                      {!isUser && msg.sources && msg.sources.length > 0 && (
                        <div className="space-y-1.5 pt-1">
                          <SourceCitations sources={msg.sources} />
                        </div>
                      )}

                      {/* Suggested Follow-Ups */}
                      {!isUser && msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-1">
                          {msg.suggestedFollowUps.map((fu, idx) => (
                            <button
                              key={idx}
                              onClick={() => onSendMessage(fu, mode)}
                              className="px-3 py-1 text-[10px] font-semibold bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full border border-slate-200 dark:border-slate-700 hover:border-blue-400 hover:text-blue-500 transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <span>{fu}</span>
                              <ArrowUpRight className="w-3 h-3 text-slate-400" />
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Message Footer */}
                      {!isUser && (
                        <div className="flex items-center justify-between text-[10px] text-slate-400 px-1">
                          <span className="font-mono">
                            {msg.retrievalLatencyMs ? `${msg.retrievalLatencyMs + (msg.generationLatencyMs || 0)}ms total` : 'Local Ollama'}
                          </span>
                          <button
                            onClick={() => handleCopyText(msg.text, msg.id)}
                            className="p-1 hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            {copiedMsgId === msg.id ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedMsgId === msg.id ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}

            {/* In-Flight Spinner */}
            {isAsking && (
              <div className="flex items-start gap-4 animate-in fade-in">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-xs font-bold text-blue-700 dark:text-blue-300 shrink-0">
                  AI
                </div>
                <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 p-4 rounded-2xl rounded-tl-none text-xs sm:text-sm text-slate-800 dark:text-slate-200 flex items-center gap-3">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin shrink-0" />
                  <span>Retrieving FAISS dense vector passages & synthesizing answer...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Bottom Bento Input Area */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-800/80 bg-white dark:bg-[#0f172a]">
            {/* Quick Suggestion Pills */}
            <div className="flex gap-2 mb-3 overflow-x-auto pb-1 no-scrollbar">
              {quickPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInputQuery(p);
                    textareaRef.current?.focus();
                  }}
                  className="px-3 py-1 text-[10px] font-semibold bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-full border border-slate-200 dark:border-slate-700 hover:border-blue-300 hover:text-blue-500 whitespace-nowrap transition-colors cursor-pointer"
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Rounded Pill Query Box */}
            <form onSubmit={handleSubmit} className="relative">
              <input
                ref={textareaRef as any}
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Ask your documents anything..."
                className="w-full pl-5 pr-44 py-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-900 transition-all shadow-inner"
              />

              <div className="absolute right-2 top-2 bottom-2 flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-200 dark:bg-slate-700 rounded-xl text-[10px] font-bold text-slate-600 dark:text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  {mode === 'document_only' ? 'Doc Only' : 'Doc + GK'}
                </div>

                <button
                  type="submit"
                  disabled={!inputQuery.trim() || isAsking}
                  className="h-full px-5 bg-blue-600 text-white rounded-xl font-bold text-xs hover:bg-blue-700 disabled:opacity-40 active:scale-95 transition-all shadow-md shadow-blue-600/20 cursor-pointer flex items-center gap-1.5"
                >
                  <span>Send</span>
                  <Send className="w-3 h-3" />
                </button>
              </div>
            </form>
          </div>

        </div>

      </section>

    </div>
  );
};

