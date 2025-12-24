'use client';

import { motion } from 'framer-motion';
import { Coins, TrendingUp, Zap } from 'lucide-react';

interface TokenCounterProps {
  totalTokens: number;
  estimatedCost: number;
  agentCount: number;
  isActive: boolean;
}

export function TokenCounter({ totalTokens, estimatedCost, agentCount, isActive }: TokenCounterProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="fixed bottom-6 right-6 z-50"
    >
      <div className="glass border border-[#1f1f2e] rounded-2xl p-4 shadow-xl min-w-[200px]">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#1f1f2e]">
          <Zap className="w-4 h-4 text-conductor" />
          <span className="text-sm font-medium text-zinc-300">Usage Metrics</span>
          {isActive && (
            <motion.span
              className="w-2 h-2 rounded-full bg-emerald-400"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}
        </div>

        <div className="space-y-3">
          {/* Tokens */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5 text-zinc-500" />
              <span className="text-xs text-zinc-400">Tokens</span>
            </div>
            <motion.span
              key={totalTokens}
              initial={{ scale: 1.2, color: '#6366f1' }}
              animate={{ scale: 1, color: '#fafafa' }}
              className="text-sm font-mono font-medium"
            >
              {totalTokens.toLocaleString()}
            </motion.span>
          </div>

          {/* Estimated Cost */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Coins className="w-3.5 h-3.5 text-zinc-500" />
              <span className="text-xs text-zinc-400">Est. Cost</span>
            </div>
            <motion.span
              key={estimatedCost}
              initial={{ scale: 1.2, color: '#10b981' }}
              animate={{ scale: 1, color: '#fafafa' }}
              className="text-sm font-mono font-medium"
            >
              ${estimatedCost.toFixed(4)}
            </motion.span>
          </div>

          {/* Agents Used */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 text-center text-xs">🤖</span>
              <span className="text-xs text-zinc-400">Agents</span>
            </div>
            <span className="text-sm font-mono font-medium text-white">
              {agentCount}
            </span>
          </div>
        </div>

        {/* Note */}
        <div className="mt-3 pt-2 border-t border-[#1f1f2e]">
          <p className="text-[10px] text-zinc-500 leading-relaxed">
            Simulated metrics for demo. Real usage would vary.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
