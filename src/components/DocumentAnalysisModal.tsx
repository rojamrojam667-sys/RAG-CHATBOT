import React from 'react';
import { UploadedDocument } from '../types';
import { FileText, Clock, Layers, Sparkles, BookOpen, Key, HelpCircle, X, CheckCircle2, ArrowRight } from 'lucide-react';

interface DocumentAnalysisModalProps {
  document: UploadedDocument | null;
  onClose: () => void;
  onSelectQuestion: (question: string) => void;
}

export const DocumentAnalysisModal: React.FC<DocumentAnalysisModalProps> = ({
  document,
  onClose,
  onSelectQuestion
}) => {
  if (!document) return null;

  const analysis = document.analysis;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                AI Document Intelligence & Analytics
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-md">
                {document.filename}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 text-center">
              <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1">
                <FileText className="w-3.5 h-3.5 text-blue-500" />
                Total Pages
              </div>
              <div className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                {document.pageCount} Pages
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 text-center">
              <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1">
                <Layers className="w-3.5 h-3.5 text-indigo-500" />
                FAISS Chunks
              </div>
              <div className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                {document.chunkCount} Chunks
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 text-center">
              <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-500" />
                Reading Time
              </div>
              <div className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                ~{analysis?.readingTimeMinutes || 5} mins
              </div>
            </div>
          </div>

          {/* Executive Summary */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              Executive AI Summary
            </h4>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {analysis?.summary || 'Comprehensive document analysis available.'}
            </div>
          </div>

          {/* Key Findings & Takeaways */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              Key Points & Findings
            </h4>
            <div className="space-y-2">
              {analysis?.keyPoints.map((pt, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300"
                >
                  <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{pt}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Topics & Keywords */}
          <div className="space-y-3">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-amber-500" />
                Important Topics & Extracted Keywords
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {analysis?.importantTopics.map((topic, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-900/50"
                  >
                    {topic}
                  </span>
                ))}
                {analysis?.keywords.map((kw, idx) => (
                  <span
                    key={`kw-${idx}`}
                    className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                  >
                    #{kw}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* AI Suggested Questions (Click to Ask) */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-indigo-500" />
              AI Suggested Questions (Click to query RAG)
            </h4>
            <div className="space-y-2">
              {analysis?.suggestedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    onSelectQuestion(q);
                    onClose();
                  }}
                  className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-blue-400 dark:border-slate-800 dark:hover:border-blue-600 bg-white hover:bg-blue-50/40 dark:bg-slate-900 dark:hover:bg-blue-950/20 text-xs text-slate-800 dark:text-slate-200 flex items-center justify-between group transition-all"
                >
                  <span className="font-medium">{q}</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => {
                onSelectQuestion(`Provide a structured summary of ${document.filename} including objectives and key findings.`);
                onClose();
              }}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/50 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-300 transition-colors"
            >
              Generate Summary
            </button>
            <button
              onClick={() => {
                onSelectQuestion(`Extract the key points and evaluation criteria from ${document.filename}.`);
                onClose();
              }}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
            >
              Extract Key Points
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
