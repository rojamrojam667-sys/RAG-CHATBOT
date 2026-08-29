import React, { useState, useRef } from 'react';
import { UploadedDocument } from '../types';
import { Upload, FileText, Trash2, AlertCircle, CheckCircle, FilePlus, X, HardDrive, Layers } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DocumentManagerModalProps {
  documents: UploadedDocument[];
  onClose: () => void;
  onUploadSuccess: (doc: UploadedDocument) => void;
  onDeleteDocument: (id: string) => void;
  onClearAll: () => void;
  userId: string;
}

export const DocumentManagerModal: React.FC<DocumentManagerModalProps> = ({
  documents,
  onClose,
  onUploadSuccess,
  onDeleteDocument,
  onClearAll,
  userId
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'list' | 'paste'>('upload');
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [pastedTitle, setPastedTitle] = useState('');
  const [pastedContent, setPastedContent] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsUploading(true);

    const file = files[0];

    // File validation
    if (!file.name.toLowerCase().endsWith('.pdf') && !file.type.includes('pdf') && !file.type.includes('text')) {
      setErrorMsg('Invalid file format. Please upload a valid PDF document.');
      setIsUploading(false);
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setErrorMsg('File exceeds 20MB limit. Please upload a smaller document.');
      setIsUploading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', userId);

      const res = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to upload document.');
      }

      setSuccessMsg(`Document "${file.name}" indexed successfully into FAISS!`);
      onUploadSuccess(data.document);
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
      setTimeout(() => {
        setActiveTab('list');
      }, 1000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error processing document.');
    } finally {
      setIsUploading(false);
    }
  };

  const handlePastedTextUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pastedContent.trim()) {
      setErrorMsg('Please paste some text content.');
      return;
    }

    setIsUploading(true);
    setErrorMsg(null);

    try {
      const filename = pastedTitle.trim() ? `${pastedTitle.trim().replace(/\.pdf$/i, '')}.pdf` : 'Research_Paper_Notes.pdf';
      const res = await fetch('/api/documents/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          filename,
          text: pastedContent
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to index text.');

      setSuccessMsg(`Text document "${filename}" vectorized and stored into FAISS.`);
      onUploadSuccess(data.document);
      setPastedTitle('');
      setPastedContent('');
      confetti({ particleCount: 30, spread: 50 });
      setTimeout(() => {
        setActiveTab('list');
      }, 800);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error parsing pasted text.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[88vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                Multi-Document Knowledge Base Manager
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Manage PDF documents, text vectors, and FAISS index partitions
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

        {/* Tab Navigation */}
        <div className="px-6 pt-3 border-b border-slate-200 dark:border-slate-800 flex gap-4">
          <button
            onClick={() => setActiveTab('upload')}
            className={`pb-2.5 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'upload'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <Upload className="w-4 h-4" />
            Upload PDF
          </button>

          <button
            onClick={() => setActiveTab('paste')}
            className={`pb-2.5 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'paste'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <FilePlus className="w-4 h-4" />
            Paste Text/Syllabus
          </button>

          <button
            onClick={() => setActiveTab('list')}
            className={`pb-2.5 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'list'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <FileText className="w-4 h-4" />
            Document Store ({documents.length})
          </button>
        </div>

        {/* Feedback Messages */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-500" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-1">
          
          {/* TAB 1: Upload PDF */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  handleFileUpload(e.dataTransfer.files);
                }}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
                  isDragging
                    ? 'border-blue-500 bg-blue-50/60 dark:bg-blue-950/30'
                    : 'border-slate-300 dark:border-slate-700 hover:border-blue-400 bg-slate-50/50 dark:bg-slate-800/30'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => handleFileUpload(e.target.files)}
                  accept=".pdf,application/pdf"
                  className="hidden"
                />

                <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <Upload className="w-6 h-6" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    Click to select PDF or drag & drop here
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Supports multi-page research papers, institutional manuals, and course materials (up to 20MB)
                  </p>
                </div>

                {isUploading && (
                  <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 mt-2">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    Extracting text, chunking & creating FAISS vector embeddings...
                  </div>
                )}
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-1.5">
                <div className="font-semibold text-slate-700 dark:text-slate-300">
                  RAG Pipeline Ingestion Details:
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  Text Splitter: RecursiveCharacterTextSplitter (1000 chunk size, 200 overlap)
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  Embedding Engine: Nomic-Embed-Text / High-Density Normalized Latent Vectors
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  Index: FAISS IndexFlatIP with metadata preserving page numbers & filename
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Paste Text */}
          {activeTab === 'paste' && (
            <form onSubmit={handlePastedTextUpload} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Document Title
                </label>
                <input
                  type="text"
                  value={pastedTitle}
                  onChange={(e) => setPastedTitle(e.target.value)}
                  placeholder="e.g. Distributed_Computing_Notes.pdf"
                  className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Text Content (Syllabus / Article / Policy Excerpt)
                </label>
                <textarea
                  rows={7}
                  value={pastedContent}
                  onChange={(e) => setPastedContent(e.target.value)}
                  placeholder="Paste multi-paragraph text or documentation here..."
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={isUploading || !pastedContent.trim()}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium text-xs shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isUploading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Chunking & Generating Vector Embeddings...
                  </>
                ) : (
                  <>
                    <Layers className="w-4 h-4" />
                    Vectorize and Add to FAISS Store
                  </>
                )}
              </button>
            </form>
          )}

          {/* TAB 3: Document Store List */}
          {activeTab === 'list' && (
            <div className="space-y-3">
              {documents.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  No documents uploaded yet. Upload a PDF or paste text to begin.
                </div>
              ) : (
                <div className="space-y-2">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 flex items-center justify-between gap-3 hover:border-slate-300 dark:hover:border-slate-700 transition-all"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                            {doc.filename}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            <span>{doc.pageCount} Pages</span>
                            <span>•</span>
                            <span>{doc.chunkCount} Chunks</span>
                            <span>•</span>
                            <span>{(doc.fileSize / 1024).toFixed(1)} KB</span>
                            <span>•</span>
                            <span>{new Date(doc.uploadDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => onDeleteDocument(doc.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors shrink-0"
                        title="Delete Document"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end">
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to clear all uploaded documents?')) {
                          onClearAll();
                        }
                      }}
                      className="px-3 py-1.5 rounded-lg border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-medium transition-colors"
                    >
                      Clear All Documents
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center text-[11px] text-slate-500 dark:text-slate-400">
          <span>Isolated User Partition: <code className="font-mono text-blue-600 dark:text-blue-400">{userId}</code></span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 font-medium transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
