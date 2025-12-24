'use client';

import { useState, useCallback, useRef } from 'react';
import { OrchestrationState, AgentId, AgentStatus, RoutingDecision, AgentResponse } from '@/lib/types';

const initialState: OrchestrationState = {
  status: 'idle',
  problem: '',
  conductorAnalysis: null,
  routingDecision: null,
  agentStatuses: {
    conductor: 'idle',
    controls: 'idle',
    process: 'idle',
    systems: 'idle',
    pragmatist: 'idle',
  },
  agentResponses: [],
  synthesis: null,
  totalTokens: 0,
  estimatedCost: 0,
  error: null,
};

export function useOrchestration() {
  const [state, setState] = useState<OrchestrationState>(initialState);
  const [streamingContent, setStreamingContent] = useState<Record<AgentId, string>>({
    conductor: '',
    controls: '',
    process: '',
    systems: '',
    pragmatist: '',
  });
  const [synthesisContent, setSynthesisContent] = useState('');
  const abortControllerRef = useRef<AbortController | null>(null);

  const updateAgentStatus = useCallback((agentId: AgentId, status: AgentStatus) => {
    setState(prev => ({
      ...prev,
      agentStatuses: {
        ...prev.agentStatuses,
        [agentId]: status,
      },
    }));
  }, []);

  const appendToStreaming = useCallback((agentId: AgentId, chunk: string) => {
    setStreamingContent(prev => ({
      ...prev,
      [agentId]: prev[agentId] + chunk,
    }));
  }, []);

  const reset = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setState(initialState);
    setStreamingContent({
      conductor: '',
      controls: '',
      process: '',
      systems: '',
      pragmatist: '',
    });
    setSynthesisContent('');
  }, []);

  const orchestrate = useCallback(async (problem: string) => {
    reset();

    const sessionId = localStorage.getItem('orchestrator-session') ||
      `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('orchestrator-session', sessionId);

    // Check and update usage count
    const usageCount = parseInt(localStorage.getItem('orchestrator-usage') || '0', 10);
    localStorage.setItem('orchestrator-usage', String(usageCount + 1));

    setState(prev => ({
      ...prev,
      status: 'analyzing',
      problem,
    }));

    updateAgentStatus('conductor', 'thinking');

    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch('/api/orchestrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problem, sessionId }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;

          try {
            const { event, data } = JSON.parse(line.slice(6));

            switch (event) {
              case 'conductor-start':
                setState(prev => ({ ...prev, status: 'analyzing' }));
                updateAgentStatus('conductor', 'thinking');
                break;

              case 'conductor-analysis':
                setState(prev => ({
                  ...prev,
                  conductorAnalysis: data.content,
                }));
                setStreamingContent(prev => ({
                  ...prev,
                  conductor: data.content,
                }));
                updateAgentStatus('conductor', 'complete');
                break;

              case 'routing-decision':
                setState(prev => ({
                  ...prev,
                  status: 'routing',
                  routingDecision: data as RoutingDecision,
                }));
                break;

              case 'specialist-start':
                setState(prev => ({ ...prev, status: 'consulting' }));
                updateAgentStatus(data.agentId, 'thinking');
                break;

              case 'specialist-chunk':
                appendToStreaming(data.agentId, data.chunk);
                if (!data.done) {
                  updateAgentStatus(data.agentId, 'responding');
                }
                break;

              case 'specialist-complete':
                updateAgentStatus(data.agentId, 'complete');
                break;

              case 'synthesis-start':
                setState(prev => ({ ...prev, status: 'synthesizing' }));
                updateAgentStatus('conductor', 'thinking');
                break;

              case 'synthesis-chunk':
                setSynthesisContent(prev => prev + data.chunk);
                updateAgentStatus('conductor', 'responding');
                break;

              case 'synthesis-complete':
                setState(prev => ({
                  ...prev,
                  synthesis: data.content,
                }));
                updateAgentStatus('conductor', 'complete');
                break;

              case 'complete':
                setState(prev => ({
                  ...prev,
                  status: 'complete',
                  totalTokens: data.totalTokens,
                  estimatedCost: parseFloat(data.estimatedCost),
                }));
                break;

              case 'error':
                setState(prev => ({
                  ...prev,
                  status: 'error',
                  error: data.message,
                }));
                break;
            }
          } catch (e) {
            console.error('Error parsing SSE:', e);
          }
        }
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }
      setState(prev => ({
        ...prev,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      }));
    }
  }, [reset, updateAgentStatus, appendToStreaming]);

  const getUsageCount = useCallback(() => {
    if (typeof window === 'undefined') return 0;
    return parseInt(localStorage.getItem('orchestrator-usage') || '0', 10);
  }, []);

  return {
    state,
    streamingContent,
    synthesisContent,
    orchestrate,
    reset,
    getUsageCount,
  };
}
