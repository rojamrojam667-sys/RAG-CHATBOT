import React from 'react';
import { RAGConfig } from '../types';
import { Sliders, Check, X, RotateCcw, ShieldAlert, Cpu } from 'lucide-react';
import { DEFAULT_RAG_CONFIG } from '../lib/constants';

interface SettingsModalProps {
  config: RAGConfig;
  onSave: (newConfig: RAGConfig) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  config,
  onSave,
  onClose
}) => {
  const [localConfig, setLocalConfig] = React.useState<RAGConfig>({ ...config });

  const handleReset = () => {
    setLocalConfig({ ...DEFAULT_RAG_CONFIG });
  };

  const handleSave = () => {
    onSave(localConfig);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-900/70">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                RAG Pipeline & Model Configuration
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Configure chunking, hybrid retrieval weights, and model parameters
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

        {/* Settings Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-800 dark:text-slate-200">
          
          {/* Section 1: Ollama & Models */}
          <div className="space-y-3">
            <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 uppercase tracking-wider text-[11px] text-blue-600 dark:text-blue-400">
              <Cpu className="w-3.5 h-3.5" />
              Model & Embedding Engine
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Ollama Model
                </label>
                <input
                  type="text"
                  value={localConfig.ollamaModel}
                  onChange={(e) => setLocalConfig({ ...localConfig, ollamaModel: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Embedding Model
                </label>
                <input
                  type="text"
                  value={localConfig.embedModel}
                  onChange={(e) => setLocalConfig({ ...localConfig, embedModel: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono text-xs"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Chunking & Indexing */}
          <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <div className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[11px] text-blue-600 dark:text-blue-400">
              Recursive Chunking Parameters
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Chunk Size (Characters): {localConfig.chunkSize}
                </label>
                <input
                  type="range"
                  min="400"
                  max="2000"
                  step="100"
                  value={localConfig.chunkSize}
                  onChange={(e) => setLocalConfig({ ...localConfig, chunkSize: Number(e.target.value) })}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Chunk Overlap: {localConfig.chunkOverlap}
                </label>
                <input
                  type="range"
                  min="50"
                  max="500"
                  step="25"
                  value={localConfig.chunkOverlap}
                  onChange={(e) => setLocalConfig({ ...localConfig, chunkOverlap: Number(e.target.value) })}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Hybrid Retrieval Weights */}
          <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <div className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[11px] text-blue-600 dark:text-blue-400">
              Hybrid Search Rank Fusion
            </div>

            <div>
              <div className="flex justify-between font-medium mb-1">
                <span>Dense Vector ({Math.round(localConfig.hybridAlpha * 100)}%)</span>
                <span>Sparse BM25 Keyword ({Math.round((1 - localConfig.hybridAlpha) * 100)}%)</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="0.9"
                step="0.05"
                value={localConfig.hybridAlpha}
                onChange={(e) => setLocalConfig({ ...localConfig, hybridAlpha: Number(e.target.value) })}
                className="w-full accent-blue-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 mt-2">
              <div>
                <label className="block font-medium mb-1">
                  Top-K Retrieved Chunks: {localConfig.topK}
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={localConfig.topK}
                  onChange={(e) => setLocalConfig({ ...localConfig, topK: Number(e.target.value) })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">
                  Relevance Threshold: {localConfig.relevanceThreshold}
                </label>
                <input
                  type="number"
                  min="0.1"
                  max="0.8"
                  step="0.05"
                  value={localConfig.relevanceThreshold}
                  onChange={(e) => setLocalConfig({ ...localConfig, relevanceThreshold: Number(e.target.value) })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Anti-Hallucination Toggle */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between p-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40">
            <div className="space-y-0.5">
              <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                Strict Anti-Hallucination Guardrail
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Enforces zero-tolerance fallback when document context is absent.
              </p>
            </div>
            <input
              type="checkbox"
              checked={localConfig.strictAntiHallucination}
              onChange={(e) => setLocalConfig({ ...localConfig, strictAntiHallucination: e.target.checked })}
              className="w-4 h-4 accent-blue-600 rounded"
            />
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 flex justify-between items-center">
          <button
            onClick={handleReset}
            className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Defaults
          </button>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-1.5 text-xs rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              Save Configuration
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
