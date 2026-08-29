import { jsPDF } from 'jspdf';
import { ChatMessage, ChatSession, UploadedDocument } from '../types';

export function exportChatAsTxt(session: ChatSession, documents: UploadedDocument[]): void {
  let content = `================================================================================\n`;
  content += ` INTELLIGENT MULTI-DOCUMENT RAG CHATBOT - TRANSCRIPT REPORT\n`;
  content += ` Session Title: ${session.title}\n`;
  content += ` Exported Date: ${new Date().toLocaleString()}\n`;
  content += ` Mode: ${session.mode === 'document_only' ? 'Document Only (Strict Grounding)' : 'Document + General Knowledge'}\n`;
  content += ` Attached Documents: ${documents.map(d => d.filename).join(', ') || 'All User Documents'}\n`;
  content += `================================================================================\n\n`;

  session.messages.forEach((msg, idx) => {
    const role = msg.sender === 'user' ? 'USER' : msg.sender === 'bot' ? 'ASSISTANT' : 'SYSTEM';
    content += `[${idx + 1}] ${role} (${new Date(msg.timestamp).toLocaleTimeString()}):\n`;
    content += `${msg.text}\n\n`;

    if (msg.sources && msg.sources.length > 0) {
      content += `   >>> VERIFIED SOURCE CITATIONS <<<\n`;
      msg.sources.forEach((src, sIdx) => {
        content += `   [Source ${sIdx + 1}]: ${src.filename} | Page: ${src.pageNumber} | Relevance: ${Math.round(src.relevanceScore * 100)}%\n`;
        content += `   Excerpt: "${src.passage.replace(/\n/g, ' ')}"\n`;
      });
      content += `\n`;
    }
    content += `--------------------------------------------------------------------------------\n\n`;
  });

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `RAG_Chat_${session.title.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportChatAsPdf(session: ChatSession, documents: UploadedDocument[]): void {
  const doc = new jsPDF({
    unit: 'pt',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 40;
  const maxWidth = pageWidth - margin * 2;
  let y = 50;

  // Title Banner
  doc.setFillColor(30, 58, 138); // Deep Blue
  doc.rect(margin, y - 20, maxWidth, 45, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text('Intelligent Multi-Document RAG Chatbot - Report', margin + 15, y + 8);

  y += 50;
  doc.setTextColor(50, 50, 50);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Session: ${session.title}`, margin, y);
  doc.text(`Date: ${new Date().toLocaleString()}`, margin + 250, y);
  y += 15;
  doc.text(`Mode: ${session.mode === 'document_only' ? 'Document Only Mode' : 'Doc + General Knowledge'}`, margin, y);
  doc.text(`Total Turns: ${session.messages.length}`, margin + 250, y);
  y += 20;
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, y, pageWidth - margin, y);
  y += 20;

  session.messages.forEach((msg) => {
    // Check for page overflow
    if (y > 750) {
      doc.addPage();
      y = 50;
    }

    const isUser = msg.sender === 'user';
    const roleLabel = isUser ? 'USER QUESTION' : 'AI GROUNDED RESPONSE';
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    if (isUser) {
      doc.setTextColor(15, 23, 42);
    } else {
      doc.setTextColor(37, 99, 235);
    }
    doc.text(roleLabel, margin, y);
    y += 14;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(30, 41, 59);

    const splitText = doc.splitTextToSize(msg.text, maxWidth - 10);
    doc.text(splitText, margin + 5, y);
    y += splitText.length * 12 + 8;

    // Citations if any
    if (msg.sources && msg.sources.length > 0) {
      if (y > 720) {
        doc.addPage();
        y = 50;
      }
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105);
      doc.text('VERIFIED SOURCE CITATIONS:', margin + 5, y);
      y += 12;

      msg.sources.forEach((src) => {
        if (y > 740) {
          doc.addPage();
          y = 50;
        }
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);
        doc.text(`• ${src.filename} (Page ${src.pageNumber}) - Score: ${Math.round(src.relevanceScore * 100)}%`, margin + 10, y);
        y += 10;
        
        const excerpt = doc.splitTextToSize(`"${src.passage.slice(0, 180)}..."`, maxWidth - 30);
        doc.text(excerpt, margin + 15, y);
        y += excerpt.length * 10 + 6;
      });
    }

    y += 10;
    doc.setDrawColor(240, 240, 240);
    doc.line(margin, y, pageWidth - margin, y);
    y += 15;
  });

  doc.save(`RAG_Report_${session.title.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.pdf`);
}
