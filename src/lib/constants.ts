import { RAGConfig } from '../types';

export const DEFAULT_RAG_CONFIG: RAGConfig = {
  ollamaBaseUrl: 'http://localhost:11434',
  ollamaModel: 'llama3',
  embedModel: 'nomic-embed-text',
  chunkSize: 1000,
  chunkOverlap: 200,
  topK: 4,
  relevanceThreshold: 0.30,
  hybridAlpha: 0.65, // 65% vector similarity + 35% keyword BM25
  maxFileSizeMB: 16,
  strictAntiHallucination: true,
};

export const SAMPLE_DOCUMENTS_SEED = [
  {
    id: 'doc-seed-1',
    filename: 'University_Workflow_and_Governance.pdf',
    originalName: 'University_Workflow_and_Governance.pdf',
    fileSize: 245800,
    pageCount: 18,
    chunkCount: 14,
    uploadDate: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    status: 'indexed' as const,
    analysis: {
      summary: 'This document defines the administrative governance, academic approval pipelines, and role-based workflows for undergraduate and postgraduate degree curricula, examination grading, and faculty tenure review committees.',
      keyPoints: [
        'Curriculum updates require three-tier approval: Department Board of Studies (BOS), Academic Council, and the Board of Management.',
        'Continuous Internal Evaluation (CIE) accounts for 40% of the total aggregate score, while Semester End Examination (SEE) accounts for 60%.',
        'Faculty appraisal uses the Academic Performance Index (API) scored across research publications, teaching hours, and institutional consultancy.'
      ],
      importantTopics: ['Academic Governance', 'Curriculum Approval', 'Grading & Evaluation', 'Role-Based Workflow', 'Faculty Appraisal'],
      keywords: ['Board of Studies', 'CIE', 'SEE', 'Approval Matrix', 'Academic Council', 'Governance'],
      readingTimeMinutes: 7,
      pageCount: 18,
      totalChunks: 14,
      suggestedQuestions: [
        'What is the three-tier approval workflow for curriculum updates?',
        'How are CIE and SEE evaluation percentages weighted?',
        'What criteria are used in the Academic Performance Index (API) for faculty appraisal?',
        'Explain the role of the Department Board of Studies.'
      ]
    },
    samplePages: [
      {
        pageNumber: 1,
        text: 'UNIVERSITY WORKFLOW AND GOVERNANCE MANUAL\nSection 1: Institutional Structure and Statutory Bodies\nThe university administrative framework is governed by the statutory authorities including the Executive Council, Academic Council, and Finance Committee. All academic policies originate at the departmental level and progress through formal review cycles.'
      },
      {
        pageNumber: 12,
        text: 'Section 4: Curriculum Revision and Approval Hierarchy\nThe university workflow uses role-based approval pipelines for any syllabus revision or academic restructuring. Step 1: The Department Board of Studies (BOS), consisting of internal professors and two external subject matter experts, drafts the syllabus modifications. Step 2: The proposal is forwarded to the Faculty Board for cross-disciplinary alignment. Step 3: The Academic Council holds final authority to ratify academic programs.'
      },
      {
        pageNumber: 18,
        text: 'Section 7: Examination and Evaluation Norms\nThe academic grading scheme balances formative and summative metrics. Continuous Internal Evaluation (CIE) carries 40% weightage, comprising quizzes, term papers, and two mid-term tests. Semester End Examination (SEE) carries 60% weightage and is evaluated through double-blind grading protocols.'
      }
    ]
  },
  {
    id: 'doc-seed-2',
    filename: 'Distributed_Systems_and_RAG_Architecture.pdf',
    originalName: 'Distributed_Systems_and_RAG_Architecture.pdf',
    fileSize: 382400,
    pageCount: 24,
    chunkCount: 19,
    uploadDate: new Date(Date.now() - 3600000 * 5).toISOString(),
    status: 'indexed' as const,
    analysis: {
      summary: 'Comprehensive analysis of modern Retrieval-Augmented Generation (RAG) system engineering, covering recursive chunking, vector indexing in FAISS, hybrid dense-sparse retrieval, and hallucination reduction techniques.',
      keyPoints: [
        'Hybrid retrieval merges dense semantic vector similarity with sparse BM25 keyword matching via Reciprocal Rank Fusion (RRF).',
        'Anti-hallucination guardrails constrain the generation pipeline with strict grounded prompt templates and relevance score thresholds.',
        'Context window optimization uses metadata filtering and token-budget compression before prompt synthesis.'
      ],
      importantTopics: ['Vector Databases', 'FAISS Indexing', 'Hybrid Search', 'BM25 Matching', 'Anti-Hallucination Prompting', 'Context Compression'],
      keywords: ['FAISS', 'Embeddings', 'Reciprocal Rank Fusion', 'Top-K Retrieval', 'Cosine Similarity', 'Ollama LLM'],
      readingTimeMinutes: 11,
      pageCount: 24,
      totalChunks: 19,
      suggestedQuestions: [
        'How does Hybrid Retrieval combine dense vector search with BM25 keyword matching?',
        'What methods are utilized to prevent LLM hallucinations during document Q&A?',
        'What are the advantages of using FAISS for high-dimensional vector search?',
        'Explain the role of chunk size and overlap in information retrieval.'
      ]
    },
    samplePages: [
      {
        pageNumber: 3,
        text: 'Chapter 2: Vector Space Modeling and FAISS Indexing\nIn high-dimensional retrieval, documents are partitioned into semantic fragments. Dense embedding models such as nomic-embed-text convert text chunks into 768-dimensional normalized vectors. The FAISS (Facebook AI Similarity Search) index performs Euclidean or Cosine distance lookups in logarithmic time complexity.'
      },
      {
        pageNumber: 8,
        text: 'Chapter 4: Hybrid Search and Reciprocal Rank Fusion\nPure vector similarity can occasionally miss exact acronyms or specific code names. Hybrid retrieval couples dense vector embeddings with sparse inverted index scoring (BM25). The resulting ranks are fused using: Score = alpha * CosineSimilarity(q, c) + (1 - alpha) * NormalizedBM25(q, c).'
      },
      {
        pageNumber: 15,
        text: 'Chapter 6: Anti-Hallucination Verification Framework\nTo eliminate generative hallucinations, the system applies two-layer guardrails: First, candidate chunks must exceed an empirical relevance threshold (tau >= 0.30). Second, the prompt explicitly instructs the LLM: "Answer exclusively using the supplied context. If the context does not contain the answer, reply: The answer could not be found in the uploaded documents."'
      }
    ]
  }
];
