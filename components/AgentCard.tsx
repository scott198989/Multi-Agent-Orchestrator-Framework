'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Loader2, Check, Circle } from 'lucide-react';
import { useState } from 'react';
import { AgentPersona, AgentStatus } from '@/lib/types';
import clsx from 'clsx';

interface AgentCardProps {
  agent: AgentPersona;
  status: AgentStatus;
  content: string;
  isSelected: boolean;
  tokenCount?: number;
}

export function AgentCard({ agent, status, content, isSelected, tokenCount }: AgentCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const statusConfig = {
    idle: {
      icon: <Circle className="w-3 h-3" />,
      text: 'Standby',
      className: 'text-zinc-500',
    },
    thinking: {
      icon: <Loader2 className="w-3 h-3 animate-spin" />,
      text: 'Thinking...',
      className: 'text-amber-400',
    },
    responding: {
      icon: <Loader2 className="w-3 h-3 animate-spin" />,
      text: 'Responding...',
      className: 'text-blue-400',
    },
    complete: {
      icon: <Check className="w-3 h-3" />,
      text: 'Complete',
      className: 'text-emerald-400',
    },
    error: {
      icon: <Circle className="w-3 h-3" />,
      text: 'Error',
      className: 'text-red-400',
    },
  };

  const currentStatus = statusConfig[status];
  const isActive = status === 'thinking' || status === 'responding';
  const hasContent = content.length > 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={clsx(
        'relative rounded-xl border transition-all duration-300',
        isActive && agent.glowClass,
        isSelected
          ? 'bg-[#111118] border-[#2a2a3e]'
          : 'bg-[#0d0d12] border-[#1a1a24] opacity-50',
        isActive && 'thinking-pulse'
      )}
    >
      {/* Header */}
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
              style={{ backgroundColor: `${agent.color}20` }}
            >
              {agent.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={clsx('font-semibold', agent.colorClass)}>
                  {agent.name}
                </span>
                <span className={clsx('flex items-center gap-1 text-xs', currentStatus.className)}>
                  {currentStatus.icon}
                  {currentStatus.text}
                </span>
              </div>
              <div className="text-xs text-zinc-500">{agent.title}</div>
            </div>
          </div>

          {tokenCount && (
            <div className="text-xs text-zinc-500">
              {tokenCount.toLocaleString()} tokens
            </div>
          )}
        </div>

        {/* Expertise Tags */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {agent.expertise.map((exp) => (
            <span
              key={exp}
              className="px-2 py-0.5 text-xs rounded-md"
              style={{
                backgroundColor: `${agent.color}15`,
                color: agent.color,
              }}
            >
              {exp}
            </span>
          ))}
        </div>
      </div>

      {/* Expandable Content */}
      {hasContent && (
        <>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full px-4 py-2 border-t border-[#1f1f2e]
                       flex items-center justify-between
                       text-sm text-zinc-400 hover:text-white hover:bg-[#16161f]
                       transition-colors"
          >
            <span>View Response</span>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="p-4 border-t border-[#1f1f2e] bg-[#0a0a0f]">
                  <div className="prose prose-invert prose-sm max-w-none
                                  prose-headings:text-white prose-headings:font-semibold
                                  prose-p:text-zinc-300 prose-li:text-zinc-300
                                  prose-code:text-conductor prose-code:bg-[#1a1a24] prose-code:px-1 prose-code:rounded
                                  prose-pre:bg-[#0d0d12] prose-pre:border prose-pre:border-[#1f1f2e]
                                  prose-table:text-sm prose-th:text-zinc-300 prose-td:text-zinc-400
                                  prose-strong:text-white">
                    <div
                      className="max-h-96 overflow-y-auto custom-scrollbar"
                      dangerouslySetInnerHTML={{
                        __html: formatMarkdown(content),
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      {/* Active indicator line */}
      {isActive && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-xl"
          style={{ backgroundColor: agent.color }}
          layoutId={`active-${agent.id}`}
        />
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
    // Tables (simplified)
    .replace(/\|(.+)\|/gim, (match) => {
      const cells = match.split('|').filter(Boolean);
      if (cells.every(c => c.trim().match(/^[-:]+$/))) {
        return ''; // Skip separator row
      }
      const row = cells.map(c => `<td>${c.trim()}</td>`).join('');
      return `<tr>${row}</tr>`;
    })
    // Lists
    .replace(/^\- (.*$)/gim, '<li>$1</li>')
    .replace(/^\d+\. (.*$)/gim, '<li>$1</li>')
    // Warning/note icons
    .replace(/⚠️/g, '<span class="text-amber-400">⚠️</span>')
    .replace(/✅/g, '<span class="text-emerald-400">✅</span>')
    .replace(/📊/g, '<span>📊</span>')
    .replace(/🔧/g, '<span>🔧</span>')
    .replace(/🌡️/g, '<span>🌡️</span>')
    .replace(/🤷/g, '<span>🤷</span>')
    // Line breaks
    .replace(/\n/g, '<br />');
}
