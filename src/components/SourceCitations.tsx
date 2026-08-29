import React, { useState } from 'react';
import { SourceCitation } from '../types';
import { FileText, Bookmark, ChevronDown, ChevronUp, Sparkles, Hash, ExternalLink } from 'lucide-react';

interface SourceCitationsProps {
  sources: SourceCitation[];
}

export const SourceCitations: React.FC<SourceCitationsProps> = ({ sources }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  if (!sources || sources.length === 0) return null;

  return (
    <div className="mt-4 pt-3 border-t border-slate-200/80 dark:border-slate-800">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          Verified Source Citations ({sources.length})
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {sources.map((src, idx) => {
          const isExpanded = expandedIndex === idx;
          const matchPercent = Math.round(src.relevanceScore * 100);

          return (
            <div
              key={`${src.documentId}-${src.pageNumber}-${idx}`}
              className={`text-left rounded-xl border transition-all duration-200 overflow-hidden ${
                isExpanded
                  ? 'bg-blue-50/70 border-blue-200 shadow-sm dark:bg-blue-950/30 dark:border-blue-800'
                  : 'bg-white border-slate-200 hover:border-blue-300 dark:bg-slate-900/90 dark:border-slate-800 dark:hover:border-slate-700'
              }`}
            >
              <button
                type="button"
                onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                className="w-full p-3 flex items-start justify-between gap-2 text-left cursor-pointer"
              >
                <div className="flex items-start gap-2 min-w-0">
                  <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 shrink-0 mt-0.5">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-medium text-slate-900 dark:text-slate-100 truncate max-w-[200px]" title={src.filename}>
                      {src.filename}
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-slate-700 dark:text-slate-300">
                        <Bookmark className="w-3 h-3 text-blue-500" />
                        Page {src.pageNumber}
                      </span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                        {matchPercent}% Match
                      </span>
                      <span className="text-[10px] uppercase font-mono px-1 rounded bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300">
                        {src.matchType}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-slate-400 dark:text-slate-500 p-1 shrink-0">
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {isExpanded && (
                <div className="px-3 pb-3 pt-1 border-t border-blue-100 dark:border-blue-900/40 bg-slate-50/50 dark:bg-slate-950/40">
                  <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                    <Hash className="w-3 h-3" />
                    Indexed Passage Excerpt:
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800">
                    "{src.passage}"
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
