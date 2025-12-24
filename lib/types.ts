export type AgentId = 'conductor' | 'controls' | 'process' | 'systems' | 'pragmatist';

export type AgentStatus = 'idle' | 'thinking' | 'responding' | 'complete' | 'error';

export interface AgentPersona {
  id: AgentId;
  name: string;
  title: string;
  expertise: string[];
  color: string;
  colorClass: string;
  glowClass: string;
  icon: string;
  systemPrompt: string;
}

export interface AgentResponse {
  agentId: AgentId;
  content: string;
  tokenCount: number;
  timestamp: number;
}

export interface RoutingDecision {
  selectedAgents: AgentId[];
  reasoning: string;
  problemType: string;
}

export interface OrchestrationState {
  status: 'idle' | 'analyzing' | 'routing' | 'consulting' | 'synthesizing' | 'complete' | 'error';
  problem: string;
  conductorAnalysis: string | null;
  routingDecision: RoutingDecision | null;
  agentStatuses: Record<AgentId, AgentStatus>;
  agentResponses: AgentResponse[];
  synthesis: string | null;
  totalTokens: number;
  estimatedCost: number;
  error: string | null;
}

export interface OrchestrationEvent {
  type:
    | 'conductor-start'
    | 'conductor-analysis'
    | 'routing-decision'
    | 'specialist-start'
    | 'specialist-chunk'
    | 'specialist-complete'
    | 'synthesis-start'
    | 'synthesis-chunk'
    | 'synthesis-complete'
    | 'complete'
    | 'error';
  data: unknown;
  timestamp: number;
}

export interface DemoProblem {
  id: string;
  title: string;
  problem: string;
  tags: string[];
}

export const DEMO_PROBLEMS: DemoProblem[] = [
  {
    id: 'conveyor',
    title: 'Conveyor Control System',
    problem: 'Design a control system for a variable-speed conveyor that responds to upstream sensor input. The system needs to handle products of varying sizes and weights while maintaining consistent spacing.',
    tags: ['Controls', 'Sensors', 'Automation'],
  },
  {
    id: 'extruder',
    title: 'Extruder Quality Issue',
    problem: 'Why might an extruder be producing inconsistent wall thickness despite stable temperature and pressure settings? We\'ve checked the die and it appears clean with no visible wear.',
    tags: ['Process', 'Troubleshooting', 'Quality'],
  },
  {
    id: 'retrofit',
    title: 'PLC vs Microcontroller',
    problem: 'Evaluate the tradeoffs between PLC and microcontroller for a packaging line retrofit. The line runs 16 hours/day, has 24 I/O points, and needs to communicate with an existing SCADA system.',
    tags: ['Architecture', 'Integration', 'Cost'],
  },
];
