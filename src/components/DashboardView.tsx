import React from 'react';
import { DashboardStats, UploadedDocument } from '../types';
import { FileText, Layers, MessageSquare, Clock, HardDrive, Cpu, Activity, ArrowRight, ShieldCheck, Sparkles, BookOpen } from 'lucide-react';

interface DashboardViewProps {
  stats: DashboardStats;
  onSelectDocument: (doc: UploadedDocument) => void;
  onOpenAnalysis: (doc: UploadedDocument) => void;
  onStartNewChatWithDoc: (docId: string) => void;
  onGoToChat: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  onSelectDocument,
  onOpenAnalysis,
  onStartNewChatWithDoc,
  onGoToChat
}) => {
  const statCards = [
    {
      title: 'Total Documents',
      value: stats.totalDocuments,
      unit: 'PDFs Indexed',
      icon: FileText,
      color: 'blue'
    },
    {
      title: 'Total Pages',
      value: stats.totalPages,
      unit: 'Extracted Pages',
      icon: BookOpen,
      color: 'indigo'
    },
    {
      title: 'Vector Chunks',
      value: stats.totalChunks,
      unit: 'FAISS Dense Vectors',
      icon: Layers,
      color: 'emerald'
    },
    {
      title: 'Questions Answered',
      value: stats.totalQuestionsAsked,
      unit: 'RAG Inquiries',
      icon: MessageSquare,
      color: 'amber'
    },
    {
      title: 'Average Latency',
      value: `${stats.averageLatencyMs}ms`,
      unit: 'Retrieval + Synthesis',
      icon: Clock,
      color: 'sky'
    },
    {
      title: 'Knowledge Store',
      value: `${(stats.storageUsedBytes / 1024).toFixed(1)} KB`,
      unit: 'Isolated Storage',
      icon: HardDrive,
      color: 'purple'
    }
  ];

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 max-w-6xl mx-auto w-full bg-[#f8fafc] dark:bg-[#090d16]">
      
      {/* Bento Header Banner */}
      <div className="rounded-2xl p-6 bg-[#0f172a] text-white border border-slate-800 shadow-md relative overflow-hidden flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            MCA Final Year Research Project Demo
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Intelligent Multi-Document RAG Control Panel
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Hybrid dense-sparse retrieval combining FAISS 768-dimensional vector similarity with BM25 keyword matching, anti-hallucination guardrails, and automated document analysis.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0 z-10">
          <button
            onClick={onGoToChat}
            className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-md shadow-blue-600/20 flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <span>Open Chat Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bento Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight truncate">
                  {card.title}
                </span>
                <div className="p-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-blue-500">
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold text-slate-800 dark:text-slate-100 font-mono">
                  {card.value}
                </div>
                <div className="text-[10px] text-slate-400 dark:text-slate-400 font-medium mt-0.5 truncate">
                  {card.unit}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Two Column Layout: Recent Documents & Recent Query Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        
        {/* Card 1: Indexed Documents Knowledge Base */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-500" />
              Indexed Documents Knowledge Base
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              {stats.recentDocuments.length} Documents
            </span>
          </div>

          <div className="space-y-2.5">
            {stats.recentDocuments.map((doc) => (
              <div
                key={doc.id}
                className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:border-blue-300 dark:hover:border-blue-800 transition-all flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate" title={doc.filename}>
                    {doc.filename}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                    <span className="px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-semibold font-mono">
                      {doc.pageCount} Pages
                    </span>
                    <span>{doc.chunkCount} Chunks</span>
                    <span>•</span>
                    <span>~{doc.analysis?.readingTimeMinutes || 5} min read</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onOpenAnalysis(doc)}
                    className="px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                    title="View AI Summary & Extracted Topics"
                  >
                    <Sparkles className="w-3 h-3" />
                    Analyze
                  </button>

                  <button
                    onClick={() => onStartNewChatWithDoc(doc.id)}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                    title="Start Chat with this document"
                  >
                    <MessageSquare className="w-3 h-3" />
                    Chat
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card 2: Recent RAG Queries & Latency Telemetry */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-500" />
              Recent Grounded Inquiries
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              Telemetry Log
            </span>
          </div>

          <div className="space-y-2.5">
            {stats.recentQueries.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400">
                No inquiries logged yet. Ask questions in the chat to see real-time query telemetry.
              </div>
            ) : (
              stats.recentQueries.map((q, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-1.5"
                >
                  <div className="text-xs font-medium text-slate-800 dark:text-slate-200 leading-snug">
                    "{q.query}"
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
                    <span className="font-mono">
                      {new Date(q.timestamp).toLocaleTimeString()}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold">
                        {q.sourcesFound} Sources Verified
                      </span>
                      <span className="uppercase font-mono text-[9px] px-1 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold">
                        {q.mode === 'document_only' ? 'Doc Only' : 'Doc + GK'}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
