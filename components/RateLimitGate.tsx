'use client';

import { motion } from 'framer-motion';
import { Lock, Mail, ExternalLink } from 'lucide-react';

interface RateLimitGateProps {
  usageCount: number;
  maxFreeRuns: number;
  onRequestDemo: () => void;
}

export function RateLimitGate({ usageCount, maxFreeRuns, onRequestDemo }: RateLimitGateProps) {
  const remaining = maxFreeRuns - usageCount;
  const isLimited = remaining <= 0;

  if (!isLimited) {
    return (
      <div className="flex items-center gap-2 text-sm text-zinc-400">
        <span className="w-2 h-2 rounded-full bg-emerald-400" />
        <span>
          {remaining} free {remaining === 1 ? 'run' : 'runs'} remaining
        </span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="max-w-md w-full bg-[#111118] border border-[#1f1f2e] rounded-2xl p-8 text-center"
      >
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-conductor/20 flex items-center justify-center">
          <Lock className="w-8 h-8 text-conductor" />
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">
          Demo Limit Reached
        </h2>
        <p className="text-zinc-400 mb-6">
          You've used all {maxFreeRuns} free orchestration runs.
          Request access to continue exploring multi-agent AI.
        </p>

        <div className="space-y-3">
          <button
            onClick={onRequestDemo}
            className="w-full py-3 px-4 bg-conductor hover:bg-conductor-light
                       text-white font-medium rounded-xl
                       flex items-center justify-center gap-2
                       transition-colors"
          >
            <Mail className="w-4 h-4" />
            Request Full Demo Access
          </button>

          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 border border-[#1f1f2e] hover:border-zinc-600
                       text-zinc-300 font-medium rounded-xl
                       flex items-center justify-center gap-2
                       transition-colors block"
          >
            <ExternalLink className="w-4 h-4" />
            View Source Code
          </a>
        </div>

        <p className="mt-6 text-xs text-zinc-500">
          This limit helps manage demo resources.
          <br />
          Contact us for enterprise or production access.
        </p>
      </motion.div>
    </motion.div>
  );
}

export function UsageIndicator({ usageCount, maxFreeRuns }: { usageCount: number; maxFreeRuns: number }) {
  const remaining = maxFreeRuns - usageCount;
  const percentage = (usageCount / maxFreeRuns) * 100;

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{
            backgroundColor: remaining > 1 ? '#10b981' : remaining === 1 ? '#f59e0b' : '#ef4444',
          }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
      <span className="text-xs text-zinc-400 whitespace-nowrap">
        {remaining > 0 ? `${remaining} left` : 'Limit reached'}
      </span>
    </div>
  );
}
