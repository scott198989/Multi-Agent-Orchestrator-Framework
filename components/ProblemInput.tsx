'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Sparkles, Loader2 } from 'lucide-react';
import { DEMO_PROBLEMS } from '@/lib/types';

interface ProblemInputProps {
  onSubmit: (problem: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export function ProblemInput({ onSubmit, isLoading, disabled }: ProblemInputProps) {
  const [problem, setProblem] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (problem.trim() && !isLoading && !disabled) {
      onSubmit(problem.trim());
    }
  };

  const handleExampleClick = (example: string) => {
    setProblem(example);
    onSubmit(example);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <textarea
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            placeholder="Describe your engineering challenge..."
            className="w-full h-32 px-6 py-4 bg-[#111118] border border-[#1f1f2e] rounded-2xl
                       text-white placeholder-zinc-500 resize-none
                       focus:outline-none focus:border-conductor focus:ring-1 focus:ring-conductor/50
                       transition-all duration-200"
            disabled={isLoading || disabled}
          />
          <button
            type="submit"
            disabled={!problem.trim() || isLoading || disabled}
            className="absolute bottom-4 right-4 px-5 py-2.5
                       bg-conductor hover:bg-conductor-light disabled:bg-zinc-700
                       text-white font-medium rounded-xl
                       flex items-center gap-2
                       transition-all duration-200
                       disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Analyze
              </>
            )}
          </button>
        </div>
      </form>

      <div className="mt-6">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-conductor" />
          <span className="text-sm text-zinc-400">Try an example problem:</span>
        </div>
        <div className="flex flex-wrap gap-3">
          {DEMO_PROBLEMS.map((demo) => (
            <motion.button
              key={demo.id}
              onClick={() => handleExampleClick(demo.problem)}
              disabled={isLoading || disabled}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group px-4 py-3 bg-[#111118] border border-[#1f1f2e] rounded-xl
                         hover:border-conductor/50 hover:bg-[#16161f]
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all duration-200 text-left"
            >
              <div className="font-medium text-white group-hover:text-conductor transition-colors">
                {demo.title}
              </div>
              <div className="flex gap-2 mt-2">
                {demo.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 text-xs bg-zinc-800 text-zinc-400 rounded-md"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
