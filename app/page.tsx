'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, RotateCcw, Github, Zap } from 'lucide-react';
import { ProblemInput } from '@/components/ProblemInput';
import { WorkflowVisualizer } from '@/components/WorkflowVisualizer';
import { SynthesisPanel } from '@/components/SynthesisPanel';
import { TokenCounter } from '@/components/TokenCounter';
import { HowItWorks } from '@/components/HowItWorks';
import { useOrchestration } from '@/hooks/useOrchestration';

export default function Home() {
  const { state, streamingContent, synthesisContent, orchestrate, reset } = useOrchestration();
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  const handleSubmit = (problem: string) => {
    orchestrate(problem);
  };

  const handleReset = () => {
    reset();
  };

  const isProcessing = ['analyzing', 'routing', 'consulting', 'synthesizing'].includes(state.status);
  const isComplete = state.status === 'complete';

  return (
    <main className="min-h-screen bg-[#0a0a0f]">
      {/* Header */}
      <header className="border-b border-[#1f1f2e] bg-[#0a0a0f]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-conductor to-systems flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-white text-lg">Multi-Agent Orchestrator</h1>
                <p className="text-xs text-zinc-500">AI Team Coordination Demo</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowHowItWorks(true)}
                className="px-3 py-2 text-sm text-zinc-400 hover:text-white
                           hover:bg-zinc-800 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Info className="w-4 h-4" />
                <span className="hidden sm:inline">How It Works</span>
              </button>

              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section - Only show when idle */}
        <AnimatePresence>
          {state.status === 'idle' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="gradient-text">AI-Powered</span>
                <br />
                <span className="text-white">Engineering Problem Solving</span>
              </h2>
              <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
                Watch a team of specialized AI agents collaborate to analyze complex
                industrial and engineering challenges. The Conductor routes problems
                to experts and synthesizes their insights.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Problem being analyzed */}
        {state.problem && state.status !== 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 bg-[#111118] border border-[#1f1f2e] rounded-xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1">
                  Problem Statement
                </div>
                <p className="text-white">{state.problem}</p>
              </div>
              {isComplete && (
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-3 py-2 text-sm
                             text-zinc-400 hover:text-white hover:bg-zinc-800
                             rounded-lg transition-colors shrink-0"
                >
                  <RotateCcw className="w-4 h-4" />
                  New Problem
                </button>
              )}
            </div>
          </motion.div>
        )}

        {/* Input Section - Show when idle or complete */}
        <AnimatePresence>
          {(state.status === 'idle' || state.status === 'complete') && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mb-12"
            >
              <ProblemInput
                onSubmit={handleSubmit}
                isLoading={isProcessing}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Workflow Visualization */}
        {state.status !== 'idle' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <WorkflowVisualizer
              phase={state.status}
              agentStatuses={state.agentStatuses}
              routingDecision={state.routingDecision}
              streamingContent={streamingContent}
            />

            {/* Synthesis */}
            {(state.status === 'synthesizing' || state.status === 'complete') && (
              <SynthesisPanel
                content={synthesisContent || state.synthesis || ''}
                isStreaming={state.status === 'synthesizing'}
              />
            )}
          </motion.div>
        )}

        {/* Error State */}
        {state.status === 'error' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 p-6 bg-red-500/10 border border-red-500/30 rounded-xl text-center"
          >
            <p className="text-red-400 mb-4">{state.error || 'An error occurred'}</p>
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300
                         rounded-lg transition-colors"
            >
              Try Again
            </button>
          </motion.div>
        )}
      </div>

      {/* Token Counter - Only show during/after processing */}
      {state.status !== 'idle' && (
        <TokenCounter
          totalTokens={state.totalTokens}
          estimatedCost={state.estimatedCost}
          agentCount={state.routingDecision?.selectedAgents.length ? state.routingDecision.selectedAgents.length + 1 : 1}
          isActive={isProcessing}
        />
      )}

      {/* How It Works Modal */}
      <HowItWorks isOpen={showHowItWorks} onClose={() => setShowHowItWorks(false)} />

      {/* Footer */}
      <footer className="border-t border-[#1f1f2e] mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-zinc-500">
              Multi-Agent Orchestration Demo — Simulating collaborative AI problem-solving
            </div>
            <div className="flex items-center gap-6 text-sm text-zinc-500">
              <button
                onClick={() => setShowHowItWorks(true)}
                className="hover:text-white transition-colors"
              >
                How It Works
              </button>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                Source Code
              </a>
              <span>
                Built with Next.js + Claude
              </span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
