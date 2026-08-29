import React from 'react';
import { ACADEMIC_PROJECT_INFO } from '../lib/academicDocs';
import { BookOpen, CheckCircle, ShieldCheck, Cpu, Database, Award, X, Printer } from 'lucide-react';

interface AcademicHubModalProps {
  onClose: () => void;
}

export const AcademicHubModal: React.FC<AcademicHubModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-900/70">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Academic Project Documentation & viva-Voce Dossier
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {ACADEMIC_PROJECT_INFO.degree} • {ACADEMIC_PROJECT_INFO.projectType} • Academic Year {ACADEMIC_PROJECT_INFO.academicYear}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors flex items-center gap-1 text-xs"
              title="Print Documentation"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Academic Dossier Content */}
        <div className="p-6 overflow-y-auto space-y-8 text-slate-800 dark:text-slate-200 text-xs leading-relaxed">
          
          {/* Title Banner */}
          <div className="p-5 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 space-y-2">
            <h1 className="text-base sm:text-lg font-bold text-blue-950 dark:text-blue-200">
              {ACADEMIC_PROJECT_INFO.title}
            </h1>
            <p className="text-slate-700 dark:text-slate-300">
              <strong>Abstract:</strong> {ACADEMIC_PROJECT_INFO.abstract}
            </p>
          </div>

          {/* Section 1: Problem Statement & Objectives */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              1. Problem Statement & Project Objectives
            </h2>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
              <p className="mb-3 text-slate-700 dark:text-slate-300">{ACADEMIC_PROJECT_INFO.problemStatement}</p>
              <div className="space-y-1.5 mt-2">
                <strong className="text-slate-900 dark:text-slate-100 block mb-1">Key Research Objectives:</strong>
                {ACADEMIC_PROJECT_INFO.objectives.map((obj, i) => (
                  <div key={i} className="flex items-start gap-2 text-slate-600 dark:text-slate-300">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{obj}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 2: Existing vs Proposed System */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-2">
              <Cpu className="w-4 h-4" />
              2. Comparative Analysis: Existing vs. Proposed System
            </h2>
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-3 w-1/4">Evaluation Dimension</th>
                    <th className="p-3 w-3/8 text-rose-700 dark:text-rose-400">Existing Conventional System</th>
                    <th className="p-3 w-3/8 text-emerald-700 dark:text-emerald-400">Proposed Intelligent RAG System</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {ACADEMIC_PROJECT_INFO.existingVsProposed.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/50">
                      <td className="p-3 font-semibold text-slate-900 dark:text-slate-100">{row.feature}</td>
                      <td className="p-3 text-slate-600 dark:text-slate-400">{row.existing}</td>
                      <td className="p-3 text-slate-800 dark:text-slate-200 font-medium">{row.proposed}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: Mathematical Foundations & Algorithms */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              3. Mathematical Models & RAG Algorithms
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ACADEMIC_PROJECT_INFO.algorithms.map((algo, i) => (
                <div key={i} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
                  <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center justify-between">
                    <span>{algo.name}</span>
                  </div>
                  <div className="p-2 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[11px] text-blue-700 dark:text-blue-300">
                    {algo.formula}
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                    {algo.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: System Architecture & Data Layers */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-2">
              <Database className="w-4 h-4" />
              4. System Architecture & Six-Tier Module Hierarchy
            </h2>
            <div className="space-y-2">
              {ACADEMIC_PROJECT_INFO.systemArchitecture.layers.map((layer, i) => (
                <div key={i} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                  <div className="flex items-center justify-between font-bold text-slate-900 dark:text-slate-100 mb-1">
                    <span>{layer.name}</span>
                    <span className="font-mono text-[11px] text-blue-600 dark:text-blue-400">{layer.tech}</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400">{layer.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Database Design Schema */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-2">
              <Database className="w-4 h-4" />
              5. Relational SQLite Schema
            </h2>
            <div className="space-y-2 font-mono text-[11px]">
              {ACADEMIC_PROJECT_INFO.databaseSchema.map((sch, i) => (
                <div key={i} className="p-2.5 rounded-lg bg-slate-900 text-slate-100 border border-slate-800">
                  <span className="text-emerald-400 font-bold">TABLE {sch.table}</span> ({sch.columns})
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 flex justify-between items-center text-xs">
          <span className="text-slate-500">Prepared for MCA Final-Year Project Evaluation Committee</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 font-medium transition-colors"
          >
            Close Dossier
          </button>
        </div>

      </div>
    </div>
  );
};
