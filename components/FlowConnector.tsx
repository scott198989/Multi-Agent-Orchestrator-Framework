'use client';

import { motion } from 'framer-motion';
import clsx from 'clsx';

interface FlowConnectorProps {
  from: 'conductor';
  to: 'controls' | 'process' | 'systems' | 'pragmatist';
  isActive: boolean;
  isComplete: boolean;
  direction: 'outgoing' | 'incoming';
}

// Positions for each specialist relative to conductor
const POSITIONS = {
  controls: { angle: -60, x: -180, y: 80 },
  process: { angle: -30, x: -60, y: 120 },
  systems: { angle: 30, x: 60, y: 120 },
  pragmatist: { angle: 60, x: 180, y: 80 },
};

export function FlowConnector({ from, to, isActive, isComplete, direction }: FlowConnectorProps) {
  const pos = POSITIONS[to];

  // Calculate path for curved line
  const midX = pos.x / 2;
  const midY = pos.y / 2 - 20;

  const pathD = `M 0 0 Q ${midX} ${midY} ${pos.x} ${pos.y}`;

  const colors = {
    controls: '#f59e0b',
    process: '#10b981',
    systems: '#8b5cf6',
    pragmatist: '#ef4444',
  };

  const color = colors[to];

  return (
    <svg
      className="absolute pointer-events-none"
      style={{
        left: '50%',
        top: '50%',
        width: '400px',
        height: '300px',
        transform: 'translate(-50%, -20%)',
        overflow: 'visible',
      }}
    >
      <defs>
        <linearGradient
          id={`gradient-${to}-${direction}`}
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1="0"
          x2={pos.x}
          y2={pos.y}
        >
          {direction === 'outgoing' ? (
            <>
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor={color} />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor={color} />
              <stop offset="100%" stopColor="#6366f1" />
            </>
          )}
        </linearGradient>
      </defs>

      {/* Background line */}
      <path
        d={pathD}
        fill="none"
        stroke="#1f1f2e"
        strokeWidth="2"
        transform={`translate(200, 50)`}
      />

      {/* Animated line */}
      {(isActive || isComplete) && (
        <motion.path
          d={pathD}
          fill="none"
          stroke={`url(#gradient-${to}-${direction})`}
          strokeWidth="2"
          strokeLinecap="round"
          transform={`translate(200, 50)`}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{
            pathLength: 1,
            opacity: 1,
          }}
          transition={{
            pathLength: { duration: 0.5, ease: 'easeOut' },
            opacity: { duration: 0.2 },
          }}
        />
      )}

      {/* Flow particles */}
      {isActive && (
        <motion.circle
          r="3"
          fill={direction === 'outgoing' ? '#6366f1' : color}
          transform={`translate(200, 50)`}
        >
          <animateMotion
            dur={direction === 'outgoing' ? '1s' : '1s'}
            repeatCount="indefinite"
            path={pathD}
            keyPoints={direction === 'outgoing' ? '0;1' : '1;0'}
            keyTimes="0;1"
          />
        </motion.circle>
      )}
    </svg>
  );
}

interface FlowConnectorsProps {
  selectedAgents: string[];
  agentStatuses: Record<string, string>;
  phase: string;
}

export function FlowConnectors({ selectedAgents, agentStatuses, phase }: FlowConnectorsProps) {
  const isConsulting = phase === 'consulting';
  const isSynthesizing = phase === 'synthesizing';
  const isComplete = phase === 'complete';

  return (
    <div className="absolute inset-0 pointer-events-none">
      {(['controls', 'process', 'systems', 'pragmatist'] as const).map((agent) => {
        const isSelected = selectedAgents.includes(agent);
        const agentStatus = agentStatuses[agent];
        const isAgentActive = agentStatus === 'thinking' || agentStatus === 'responding';
        const isAgentComplete = agentStatus === 'complete';

        return (
          <FlowConnector
            key={agent}
            from="conductor"
            to={agent}
            isActive={isSelected && (isConsulting || isSynthesizing) && (isAgentActive || isSynthesizing)}
            isComplete={isSelected && (isAgentComplete || isComplete)}
            direction={isSynthesizing ? 'incoming' : 'outgoing'}
          />
        );
      })}
    </div>
  );
}
