'use client';

import { motion } from 'framer-motion';
import { Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface SynthesisPanelProps {
  content: string;
  isStreaming: boolean;
}

export function SynthesisPanel({ content, isStreaming }: SynthesisPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!content) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8 rounded-2xl border-2 border-conductor/50 bg-gradient-to-br from-[#111118] to-[#0d0d14] overflow-hidden"
    >
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-[#16161f] transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-conductor/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-conductor" />
          </div>
          <div className="text-left">
            <div className="font-semibold text-white flex items-center gap-2">
              Synthesized Recommendation
              {isStreaming && (
                <span className="px-2 py-0.5 text-xs bg-amber-500/20 text-amber-400 rounded-full animate-pulse">
                  Generating...
                </span>
              )}
            </div>
            <div className="text-sm text-zinc-400">
              Combined insights from all consulted specialists
            </div>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-zinc-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-zinc-400" />
        )}
      </button>

      {/* Content */}
      {isExpanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="border-t border-[#1f1f2e]"
        >
          <div className="p-6">
            <div
              className="prose prose-invert prose-lg max-w-none
                         prose-headings:text-white prose-headings:font-semibold prose-headings:mt-6 prose-headings:mb-3
                         prose-h2:text-xl prose-h2:text-conductor prose-h2:border-b prose-h2:border-[#1f1f2e] prose-h2:pb-2
                         prose-h3:text-lg prose-h3:text-zinc-200
                         prose-p:text-zinc-300 prose-p:leading-relaxed
                         prose-li:text-zinc-300 prose-li:my-1
                         prose-ul:my-2 prose-ol:my-2
                         prose-code:text-conductor prose-code:bg-[#1a1a24] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
                         prose-pre:bg-[#0a0a0f] prose-pre:border prose-pre:border-[#1f1f2e] prose-pre:rounded-lg
                         prose-table:text-sm prose-th:bg-[#1a1a24] prose-th:text-zinc-200 prose-th:font-medium prose-th:px-4 prose-th:py-2
                         prose-td:px-4 prose-td:py-2 prose-td:border-t prose-td:border-[#1f1f2e] prose-td:text-zinc-400
                         prose-strong:text-white prose-strong:font-semibold
                         prose-a:text-conductor prose-a:no-underline hover:prose-a:underline"
              dangerouslySetInnerHTML={{
                __html: formatMarkdown(content),
              }}
            />

            {isStreaming && (
              <motion.span
                className="inline-block w-2 h-5 bg-conductor ml-1"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

// Simple markdown to HTML conversion
function formatMarkdown(text: string): string {
  return text
    // Headers
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    // Bold
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    // Code blocks
    .replace(/```(\w+)?\n([\s\S]*?)```/gim, '<pre><code>$2</code></pre>')
    // Inline code
    .replace(/`([^`]+)`/gim, '<code>$1</code>')
    // Tables
    .replace(/^\|(.+)\|$/gim, (match) => {
      const cells = match.split('|').filter(Boolean);
      if (cells.every(c => c.trim().match(/^[-:]+$/))) {
        return '';
      }
      const row = cells.map(c => `<td>${c.trim()}</td>`).join('');
      return `<tr>${row}</tr>`;
    })
    // Checkboxes
    .replace(/✅/g, '<span class="text-emerald-400">✅</span>')
    .replace(/✓/g, '<span class="text-emerald-400">✓</span>')
    // Lists
    .replace(/^\- (.*$)/gim, '<li>$1</li>')
    .replace(/^\d+\. (.*$)/gim, '<li>$1</li>')
    // Line breaks
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br />');
}
