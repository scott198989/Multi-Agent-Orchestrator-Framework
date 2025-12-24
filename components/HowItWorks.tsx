'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, GitBranch, Cpu, MessageSquare, Combine, Lightbulb } from 'lucide-react';

interface HowItWorksProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HowItWorks({ isOpen, onClose }: HowItWorksProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2
                       md:w-full md:max-w-3xl md:max-h-[85vh]
                       bg-[#111118] border border-[#1f1f2e] rounded-2xl
                       overflow-hidden z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#1f1f2e]">
              <div>
                <h2 className="text-xl font-bold text-white">How Multi-Agent Orchestration Works</h2>
                <p className="text-sm text-zinc-400 mt-1">Understanding AI team coordination</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-zinc-400" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Architecture Overview */}
              <section className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <GitBranch className="w-5 h-5 text-conductor" />
                  The Orchestration Pattern
                </h3>
                <div className="bg-[#0a0a0f] border border-[#1f1f2e] rounded-xl p-4">
                  <pre className="text-sm text-zinc-300 overflow-x-auto">
{`┌─────────────────────────────────────────────────┐
│                  User Problem                    │
└─────────────────────────────────────────────────┘
                        │
                        ▼
              ┌──────────────────┐
              │    CONDUCTOR     │  ← Analyzes & Routes
              │   (Orchestrator) │
              └────────┬─────────┘
                       │
         ┌─────────────┼─────────────┐
         │             │             │
         ▼             ▼             ▼
   ┌──────────┐  ┌──────────┐  ┌──────────┐
   │ Specialist│  │ Specialist│  │ Specialist│
   │    A     │  │     B    │  │     C    │
   └────┬─────┘  └────┬─────┘  └────┬─────┘
        │             │             │
        └─────────────┼─────────────┘
                      │
                      ▼
              ┌──────────────────┐
              │    CONDUCTOR     │  ← Synthesizes
              │   (Synthesizer)  │
              └──────────────────┘
                      │
                      ▼
         ┌─────────────────────────┐
         │    Unified Response     │
         └─────────────────────────┘`}
                  </pre>
                </div>
              </section>

              {/* Key Concepts */}
              <section className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-conductor" />
                  Key Concepts
                </h3>
                <div className="grid gap-4">
                  <div className="bg-[#0a0a0f] border border-[#1f1f2e] rounded-xl p-4">
                    <h4 className="font-medium text-conductor mb-2">1. Problem Decomposition</h4>
                    <p className="text-sm text-zinc-400">
                      The Conductor analyzes the incoming problem to identify which domains of expertise
                      are needed. This is similar to how a project manager assigns tasks to team members
                      based on their skills.
                    </p>
                  </div>
                  <div className="bg-[#0a0a0f] border border-[#1f1f2e] rounded-xl p-4">
                    <h4 className="font-medium text-process mb-2">2. Parallel Consultation</h4>
                    <p className="text-sm text-zinc-400">
                      Specialist agents are invoked in parallel, each bringing their unique perspective.
                      This simulates a real engineering team where the controls engineer, process engineer,
                      and architect work simultaneously.
                    </p>
                  </div>
                  <div className="bg-[#0a0a0f] border border-[#1f1f2e] rounded-xl p-4">
                    <h4 className="font-medium text-systems mb-2">3. Synthesis & Conflict Resolution</h4>
                    <p className="text-sm text-zinc-400">
                      The Conductor reviews all specialist responses, identifies agreements and conflicts,
                      and produces a unified recommendation. It acknowledges trade-offs rather than
                      hiding disagreements.
                    </p>
                  </div>
                </div>
              </section>

              {/* When to Use */}
              <section className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-conductor" />
                  When Multi-Agent Architectures Help
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="text-emerald-400 mt-0.5">✓</span>
                    <div>
                      <span className="text-white font-medium">Complex, Multi-Domain Problems</span>
                      <p className="text-sm text-zinc-400">
                        When a problem spans multiple areas of expertise (controls + process + architecture)
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-emerald-400 mt-0.5">✓</span>
                    <div>
                      <span className="text-white font-medium">Trade-off Analysis</span>
                      <p className="text-sm text-zinc-400">
                        When different perspectives may lead to different recommendations
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-emerald-400 mt-0.5">✓</span>
                    <div>
                      <span className="text-white font-medium">Quality Through Diversity</span>
                      <p className="text-sm text-zinc-400">
                        Multiple specialized prompts can catch issues a single generalist might miss
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-red-400 mt-0.5">✗</span>
                    <div>
                      <span className="text-white font-medium">Simple, Single-Domain Questions</span>
                      <p className="text-sm text-zinc-400">
                        Adds latency and cost without benefit for straightforward queries
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Technical Implementation */}
              <section>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-conductor" />
                  Implementation Notes
                </h3>
                <div className="bg-[#0a0a0f] border border-[#1f1f2e] rounded-xl p-4 space-y-3 text-sm">
                  <p className="text-zinc-400">
                    <span className="text-white font-medium">This demo uses simulated responses</span> to
                    demonstrate the orchestration pattern without API costs. In production, you would:
                  </p>
                  <ul className="list-disc list-inside text-zinc-400 space-y-1.5">
                    <li>Make parallel API calls to Claude with different system prompts per agent</li>
                    <li>Stream responses using Server-Sent Events for real-time updates</li>
                    <li>Implement rate limiting and caching for cost control</li>
                    <li>Use semantic routing (embeddings) for smarter agent selection</li>
                    <li>Add memory/context persistence for multi-turn conversations</li>
                  </ul>
                  <p className="text-zinc-500 border-t border-[#1f1f2e] pt-3">
                    The pattern demonstrated here is similar to AutoGPT, CrewAI, and LangGraph agent architectures.
                  </p>
                </div>
              </section>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-[#1f1f2e] bg-[#0a0a0f]">
              <button
                onClick={onClose}
                className="w-full py-2.5 bg-conductor hover:bg-conductor-light text-white font-medium rounded-xl transition-colors"
              >
                Got It
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
