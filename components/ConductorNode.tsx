'use client';

import { motion } from 'framer-motion';
import { AgentStatus } from '@/lib/types';
import clsx from 'clsx';

interface ConductorNodeProps {
  status: AgentStatus;
  phase: 'idle' | 'analyzing' | 'routing' | 'consulting' | 'synthesizing' | 'complete' | 'error';
}

export function ConductorNode({ status, phase }: ConductorNodeProps) {
  const isActive = status === 'thinking' || status === 'responding';
  const isComplete = status === 'complete' || phase === 'complete';

  const phaseLabels: Record<string, string> = {
    idle: 'Ready',
    analyzing: 'Analyzing Problem',
    routing: 'Routing to Specialists',
    consulting: 'Coordinating',
    synthesizing: 'Synthesizing',
    complete: 'Complete',
    error: 'Error',
  };

  return (
    <motion.div
      className="relative flex flex-col items-center"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
    >
      {/* Outer glow rings */}
      {isActive && (
        <>
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, transparent 70%)',
              transform: 'scale(2)',
            }}
            animate={{
              opacity: [0.3, 0.6, 0.3],
              scale: [1.8, 2.2, 1.8],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="absolute inset-0 rounded-full border border-conductor/30"
            style={{ transform: 'scale(1.5)' }}
            animate={{
              opacity: [0.2, 0.5, 0.2],
              scale: [1.4, 1.6, 1.4],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </>
      )}

      {/* Main node */}
      <motion.div
        className={clsx(
          'relative w-24 h-24 rounded-full flex items-center justify-center',
          'border-2 transition-all duration-300',
          isActive && 'glow-conductor border-conductor bg-conductor/20',
          isComplete && 'border-emerald-500 bg-emerald-500/20',
          !isActive && !isComplete && 'border-zinc-600 bg-zinc-800/50'
        )}
        animate={isActive ? {
          boxShadow: [
            '0 0 20px rgba(99, 102, 241, 0.3)',
            '0 0 40px rgba(99, 102, 241, 0.5)',
            '0 0 20px rgba(99, 102, 241, 0.3)',
          ],
        } : {}}
        transition={{
          duration: 1.5,
          repeat: isActive ? Infinity : 0,
          ease: 'easeInOut',
        }}
      >
        {/* Icon */}
        <motion.span
          className="text-4xl"
          animate={isActive ? { rotate: [0, 5, -5, 0] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        >
          🎯
        </motion.span>

        {/* Activity indicator */}
        {isActive && (
          <motion.div
            className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-conductor"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
            }}
          />
        )}

        {isComplete && (
          <motion.div
            className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            <span className="text-[10px]">✓</span>
          </motion.div>
        )}
      </motion.div>

      {/* Label */}
      <div className="mt-3 text-center">
        <div className="font-semibold text-conductor">Conductor</div>
        <motion.div
          key={phase}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className={clsx(
            'text-xs',
            isActive ? 'text-amber-400' : isComplete ? 'text-emerald-400' : 'text-zinc-500'
          )}
        >
          {phaseLabels[phase]}
        </motion.div>
      </div>
    </motion.div>
  );
}
