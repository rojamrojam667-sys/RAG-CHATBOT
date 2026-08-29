export const ACADEMIC_PROJECT_INFO = {
  title: "Intelligent Multi-Document RAG Chatbot with AI-Powered Document Analysis",
  degree: "Master of Computer Applications (MCA)",
  projectType: "Major Final-Year Project (AI & Natural Language Processing)",
  academicYear: "2025-2026",
  abstract: `Traditional large language models (LLMs) frequently suffer from factual hallucinations and knowledge cutoffs when answering specialized institutional questions. This project presents an Intelligent Multi-Document Retrieval-Augmented Generation (RAG) system with AI-powered document analytics, hybrid dense-sparse retrieval, anti-hallucination guardrails, and role-based access control. Implemented using Python, Flask, LangChain, Ollama (Llama 3 & nomic-embed-text), FAISS vector store, SQLite, and a modern React interface, the system enables isolated multi-user document processing, citation-backed conversational querying, and automated analytical document breakdown.`,
  
  problemStatement: `Organizations, universities, and enterprises handle vast repositories of unstructured PDF documents (syllabi, policy manuals, technical specifications). Conventional keyword search fails to capture semantic meaning, while standard generative AI models hallucinate non-existent citations and answers due to lack of localized context. There is a critical need for an isolated, verifiable, citation-grounded multi-document intelligence system that prevents data leakage and ensures zero-hallucination document querying.`,
  
  objectives: [
    "Design and implement a multi-user isolated document ingestion and chunking pipeline with configurable token limits and overlap.",
    "Integrate high-dimensional vector embeddings with FAISS indexing for millisecond-latency semantic similarity search.",
    "Implement a Hybrid Retrieval Engine combining dense semantic vector search with sparse keyword matching (BM25) via weighted Rank Fusion.",
    "Engineer an Anti-Hallucination Prompting & Relevance Thresholding layer to guarantee verified source citations (document name, page number, passage).",
    "Provide automated Document Analysis (executive summaries, key points, keyword extraction, and AI-suggested questions).",
    "Maintain multi-turn conversational memory with coreference resolution for contextual follow-up inquiries.",
    "Establish Role-Based Access Control (RBAC) separating regular Users from Administrative overseers.",
    "Support dual answer modes (Strict Document-Only Mode vs Document + General Knowledge Mode) and formatted PDF/TXT chat export."
  ],

  existingVsProposed: [
    {
      feature: "Search Mechanism",
      existing: "Simple exact keyword grep or basic single-mode cosine lookup.",
      proposed: "Hybrid Retrieval combining FAISS dense vector search with sparse BM25 keyword matching via Reciprocal Rank Fusion."
    },
    {
      feature: "Hallucination Control",
      existing: "None; LLM generates plausible-sounding but fictitious facts and citations.",
      proposed: "Two-layer guardrail: strict relevance threshold (tau >= 0.30) + grounded prompt instructing strict fallback if facts are absent."
    },
    {
      feature: "Source Citations",
      existing: "Vague references or non-clickable page estimates.",
      proposed: "Exact document metadata tracking: filename, verified page numbers, relevance match scores, and expandable passage citations."
    },
    {
      feature: "Document Analytics",
      existing: "Manual reading required to formulate questions.",
      proposed: "Automated executive summary, extracted key takeaways, reading time estimation, and dynamically generated starter questions."
    },
    {
      feature: "Multi-Document Scope",
      existing: "Single document in-memory scratchpad with no multi-user isolation.",
      proposed: "Multi-tenant persistent storage with isolated vector indexes per user and cross-document aggregation."
    },
    {
      feature: "Conversation Context",
      existing: "Single-turn stateless query-response pairs.",
      proposed: "Multi-turn conversation buffer with rolling context and query reformulation for pronouns/coreferences."
    }
  ],

  systemArchitecture: {
    layers: [
      {
        name: "1. Presentation Layer (Frontend)",
        tech: "React 19, TypeScript, Tailwind CSS, Lucide Icons, Motion",
        description: "Responsive ChatGPT-style interface with Dark/Light modes, drag-and-drop document upload, real-time citation cards, dashboard statistics, and export generators."
      },
      {
        name: "2. Application & API Routing Layer",
        tech: "Python Flask / Express REST API, JWT Authentication, RBAC Middleware",
        description: "Handles secure user authentication, file validation, rate limiting, and RESTful routing for documents, chat sessions, analytics, and admin metrics."
      },
      {
        name: "3. Document Ingestion & Chunking Service",
        tech: "PyPDFLoader, RecursiveCharacterTextSplitter",
        description: "Extracts textual content with page boundaries, sanitizes input, and decomposes text into overlapping semantic chunks (default 1000 characters, 200 overlap)."
      },
      {
        name: "4. Hybrid Retrieval & Vector Indexing Engine",
        tech: "Ollama (nomic-embed-text / Gemini Embeddings), FAISS (IndexFlatIP / IndexIVFFlat), BM25 Sparse Index",
        description: "Generates 768-dimensional normalized dense vectors and combines vector cosine similarity with BM25 keyword matching via linear alpha weighting."
      },
      {
        name: "5. Grounded Generation & Guardrail Layer",
        tech: "Ollama (Llama 3 8B) / Gemini 3.7 Flash, Grounded Prompt Engineering",
        description: "Synthesizes final responses in Document-Only or Hybrid Mode, enforcing strict non-hallucination constraints and appending exact source citations."
      },
      {
        name: "6. Persistence & Metadata Storage",
        tech: "SQLite 3, Serialized Vector Indexes, Local Secure Disk Storage",
        description: "Stores user credentials (hashed with SHA-256/Bcrypt), chat transcripts, document records, and isolated vector store indexes."
      }
    ]
  },

  algorithms: [
    {
      name: "Recursive Character Chunking",
      formula: "C_i = Chunk(Text, Size=1000, Overlap=200, Separators=['\\n\\n', '\\n', ' ', ''])",
      description: "Splits large documents hierarchically along paragraph and sentence boundaries to preserve semantic coherence while respecting chunk size constraints."
    },
    {
      name: "Cosine Similarity Metric",
      formula: "Sim(q, d) = (v_q . v_d) / (||v_q|| * ||v_d||)",
      description: "Measures the angular distance between normalized query vector v_q and document chunk vector v_d in 768-dimensional latent embedding space."
    },
    {
      name: "Sparse BM25 Keyword Scoring",
      formula: "BM25(q, D) = Sum(IDF(q_i) * (f(q_i, D) * (k1 + 1)) / (f(q_i, D) + k1 * (1 - b + b * (|D| / avgdl))))",
      description: "Computes term frequency-inverse document frequency weighting to capture exact nomenclature, acronyms, and alphanumeric identifiers."
    },
    {
      name: "Hybrid Rank Fusion (Linear Combination)",
      formula: "Score_Hybrid(c) = alpha * Score_Dense(c) + (1 - alpha) * Score_Sparse(c)",
      description: "Balances dense conceptual semantic match (alpha = 0.65) with sparse exact keyword match (1 - alpha = 0.35) before top-k selection."
    }
  ],

  databaseSchema: [
    {
      table: "users",
      columns: "id (TEXT PK), name (TEXT), email (TEXT UNIQUE), password_hash (TEXT), role (TEXT: 'user'|'admin'), created_at (DATETIME)"
    },
    {
      table: "documents",
      columns: "id (TEXT PK), user_id (TEXT FK), filename (TEXT), original_name (TEXT), file_size (INTEGER), page_count (INTEGER), chunk_count (INTEGER), upload_date (DATETIME), status (TEXT), analysis_json (TEXT)"
    },
    {
      table: "document_chunks",
      columns: "id (TEXT PK), document_id (TEXT FK), filename (TEXT), page_number (INTEGER), chunk_index (INTEGER), text_content (TEXT), token_count (INTEGER)"
    },
    {
      table: "chat_sessions",
      columns: "id (TEXT PK), user_id (TEXT FK), title (TEXT), created_at (DATETIME), updated_at (DATETIME), mode (TEXT)"
    },
    {
      table: "chat_messages",
      columns: "id (TEXT PK), session_id (TEXT FK), sender (TEXT), message_text (TEXT), timestamp (DATETIME), sources_json (TEXT), is_general_knowledge (BOOLEAN)"
    }
  ]
};
