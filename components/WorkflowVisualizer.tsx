'use client';

import { motion } from 'framer-motion';
import { AGENTS, SPECIALIST_IDS } from '@/lib/agents';
import { AgentId, AgentStatus, RoutingDecision } from '@/lib/types';
import { ConductorNode } from './ConductorNode';
import { AgentCard } from './AgentCard';
import { FlowConnectors } from './FlowConnector';

interface WorkflowVisualizerProps {
  phase: 'idle' | 'analyzing' | 'routing' | 'consulting' | 'synthesizing' | 'complete' | 'error';
  agentStatuses: Record<AgentId, AgentStatus>;
  routingDecision: RoutingDecision | null;
  streamingContent: Record<AgentId, string>;
}

export function WorkflowVisualizer({
  phase,
  agentStatuses,
  routingDecision,
  streamingContent,
}: WorkflowVisualizerProps) {
  const selectedAgents = routingDecision?.selectedAgents || [];
  const isActive = phase !== 'idle';

  return (
    <div className="relative w-full">
      {/* Routing Decision Banner */}
      {routingDecision && phase !== 'idle' && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-[#111118] border border-[#1f1f2e] rounded-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-zinc-400">Problem Type</div>
              <div className="font-semibold text-white">{routingDecision.problemType}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-zinc-400">Consulting</div>
              <div className="flex gap-2">
                {selectedAgents.map((id) => (
                  <span
                    key={id}
                    className="px-2 py-0.5 text-xs rounded-full"
                    style={{
                      backgroundColor: `${AGENTS[id].color}20`,
                      color: AGENTS[id].color,
                    }}
                  >
                    {AGENTS[id].name}
                  </span>
                ))}
              </div>
            </div>
          </div>
          {routingDecision.reasoning && (
            <div className="mt-3 text-sm text-zinc-400 border-t border-[#1f1f2e] pt-3">
              {routingDecision.reasoning}
            </div>
          )}
        </motion.div>
      )}

      {/* Conductor Section */}
      <div className="relative flex justify-center mb-8">
        <ConductorNode status={agentStatuses.conductor} phase={phase} />

        {/* Flow connectors (only visible during active phases) */}
        {isActive && (
          <FlowConnectors
            selectedAgents={selectedAgents}
            agentStatuses={agentStatuses}
            phase={phase}
          />
        )}
      </div>

      {/* Conductor Analysis */}
      {streamingContent.conductor && phase !== 'idle' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-4 bg-[#111118] border border-conductor/30 rounded-xl"
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">🎯</span>
            <span className="font-semibold text-conductor">Conductor Analysis</span>
          </div>
          <div className="text-sm text-zinc-300 whitespace-pre-wrap">
            {streamingContent.conductor}
          </div>
        </motion.div>
      )}

      {/* Specialist Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SPECIALIST_IDS.map((id) => (
          <motion.div
            key={id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: SPECIALIST_IDS.indexOf(id) * 0.1 }}
          >
            <AgentCard
              agent={AGENTS[id]}
              status={agentStatuses[id]}
              content={streamingContent[id]}
              isSelected={selectedAgents.includes(id)}
              tokenCount={streamingContent[id] ? Math.ceil(streamingContent[id].length / 4) : undefined}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
