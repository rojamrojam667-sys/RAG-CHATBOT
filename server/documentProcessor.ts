import { DocumentChunk, DocumentAnalysis, UploadedDocument } from '../src/types';

export function splitTextIntoChunks(
  text: string,
  docId: string,
  filename: string,
  chunkSize: number = 1000,
  chunkOverlap: number = 200
): { chunks: DocumentChunk[]; pageCount: number } {
  // Check if text has explicit page boundaries (e.g. from PDF parser or form feeds)
  const pageDelimiters = [/\f/, /\n--- Page (\d+) ---\n/, /\nPage (\d+)\n/];
  let pages: { pageNum: number; text: string }[] = [];

  let matchedDelimiter = false;
  for (const delim of pageDelimiters) {
    if (delim.test(text)) {
      const rawPages = text.split(delim).filter(p => p && p.trim().length > 0);
      pages = rawPages.map((p, idx) => ({ pageNum: idx + 1, text: p.trim() }));
      matchedDelimiter = true;
      break;
    }
  }

  // If no explicit page markers, estimate roughly 1800-2200 chars per page
  if (!matchedDelimiter) {
    const charsPerPage = 2000;
    const totalEstPages = Math.max(1, Math.ceil(text.length / charsPerPage));
    for (let p = 0; p < totalEstPages; p++) {
      const pageSlice = text.slice(p * charsPerPage, (p + 1) * charsPerPage);
      if (pageSlice.trim().length > 0) {
        pages.push({ pageNum: p + 1, text: pageSlice });
      }
    }
  }

  const chunks: DocumentChunk[] = [];
  let chunkGlobalIndex = 0;

  pages.forEach(page => {
    const pageText = page.text;
    if (!pageText || pageText.trim().length === 0) return;

    // Recursive Character Chunking
    const paragraphs = pageText.split(/\n\n+/);
    let currentChunk = '';

    paragraphs.forEach(para => {
      const cleanPara = para.trim();
      if (!cleanPara) return;

      if ((currentChunk + '\n\n' + cleanPara).length <= chunkSize) {
        currentChunk = currentChunk ? currentChunk + '\n\n' + cleanPara : cleanPara;
      } else {
        if (currentChunk) {
          chunks.push({
            id: `chunk-${docId}-${chunkGlobalIndex++}`,
            documentId: docId,
            filename,
            pageNumber: page.pageNum,
            chunkIndex: chunkGlobalIndex,
            text: currentChunk,
            tokenCount: currentChunk.split(/\s+/).length
          });
        }

        // If paragraph itself exceeds chunkSize, break by sentences or words
        if (cleanPara.length > chunkSize) {
          const sentences = cleanPara.split(/(?<=[.?!])\s+/);
          let sentenceBuffer = '';
          sentences.forEach(sent => {
            if ((sentenceBuffer + ' ' + sent).length <= chunkSize) {
              sentenceBuffer = sentenceBuffer ? sentenceBuffer + ' ' + sent : sent;
            } else {
              if (sentenceBuffer) {
                chunks.push({
                  id: `chunk-${docId}-${chunkGlobalIndex++}`,
                  documentId: docId,
                  filename,
                  pageNumber: page.pageNum,
                  chunkIndex: chunkGlobalIndex,
                  text: sentenceBuffer,
                  tokenCount: sentenceBuffer.split(/\s+/).length
                });
                // Handle overlap
                const words = sentenceBuffer.split(/\s+/);
                const overlapWords = words.slice(-Math.max(5, Math.floor(chunkOverlap / 6))).join(' ');
                sentenceBuffer = overlapWords + ' ' + sent;
              } else {
                sentenceBuffer = sent;
              }
            }
          });
          currentChunk = sentenceBuffer;
        } else {
          // Carry overlap from previous chunk
          const words = currentChunk.split(/\s+/);
          const overlapWords = words.slice(-Math.max(5, Math.floor(chunkOverlap / 6))).join(' ');
          currentChunk = overlapWords + ' ' + cleanPara;
        }
      }
    });

    if (currentChunk && currentChunk.trim().length > 0) {
      chunks.push({
        id: `chunk-${docId}-${chunkGlobalIndex++}`,
        documentId: docId,
        filename,
        pageNumber: page.pageNum,
        chunkIndex: chunkGlobalIndex,
        text: currentChunk.trim(),
        tokenCount: currentChunk.split(/\s+/).length
      });
    }
  });

  return { chunks, pageCount: Math.max(1, pages.length) };
}

export function generateDocumentAnalyticsFromText(
  filename: string,
  text: string,
  pageCount: number,
  totalChunks: number
): DocumentAnalysis {
  const words = text.split(/\s+/).filter(w => w.length > 2);
  const readingTime = Math.max(1, Math.ceil(words.length / 200));

  // Extract key sentences
  const cleanSentences = text
    .split(/(?<=[.?!])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 40 && s.length < 250 && !s.includes('---'));

  // Determine subject matters
  const topSentences = cleanSentences.slice(0, 4);

  // Extract frequent keywords
  const stopWords = new Set(['this', 'that', 'with', 'from', 'have', 'were', 'which', 'their', 'about', 'these', 'there', 'would', 'could', 'should', 'other', 'into']);
  const freqMap: Record<string, number> = {};
  words.forEach(w => {
    const clean = w.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (clean.length > 4 && !stopWords.has(clean)) {
      freqMap[clean] = (freqMap[clean] || 0) + 1;
    }
  });

  const sortedKeywords = Object.entries(freqMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([w]) => w.charAt(0).toUpperCase() + w.slice(1));

  const summary = cleanSentences.length > 0
    ? `This document "${filename}" contains ${pageCount} pages and ${totalChunks} semantic chunks. ${cleanSentences.slice(0, 2).join(' ')}`
    : `The document "${filename}" encompasses ${pageCount} structured pages discussing operational workflows, technical architectures, and evaluation criteria.`;

  const keyPoints = topSentences.length >= 3
    ? topSentences.slice(0, 3)
    : [
        `Detailed procedural protocols and operational methodologies across ${pageCount} pages.`,
        `Formalized criteria and structural frameworks for domain-specific evaluation.`,
        `Systematic guidelines addressing compliance, validation, and execution standards.`
      ];

  const suggestedQuestions = [
    `What are the primary objectives outlined in ${filename}?`,
    `Explain the key methodology and step-by-step workflow described.`,
    `What are the most significant findings or governance rules presented?`,
    `How does the document address evaluation criteria and metrics?`
  ];

  return {
    summary,
    keyPoints,
    importantTopics: sortedKeywords.length >= 3 ? sortedKeywords.slice(0, 5) : ['Architecture', 'Methodology', 'Workflow', 'Governance', 'Evaluation'],
    keywords: sortedKeywords.length > 0 ? sortedKeywords : ['Analysis', 'Protocol', 'Framework', 'Standards', 'Operations'],
    readingTimeMinutes: readingTime,
    pageCount,
    totalChunks,
    suggestedQuestions
  };
}
