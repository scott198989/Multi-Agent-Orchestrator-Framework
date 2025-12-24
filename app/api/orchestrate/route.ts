import { NextRequest } from 'next/server';
import { analyzeAndRoute, getMockResponse, generateSynthesis, estimateTokens, calculateCost } from '@/lib/orchestrator';
import { AGENTS } from '@/lib/agents';
import { AgentId, AgentResponse } from '@/lib/types';

// Simulate streaming delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Stream text character by character with delay
async function* streamText(text: string, chunkSize: number = 3, delayMs: number = 10) {
  for (let i = 0; i < text.length; i += chunkSize) {
    yield text.slice(i, i + chunkSize);
    await delay(delayMs);
  }
}

export async function POST(request: NextRequest) {
  const encoder = new TextEncoder();

  try {
    const { problem, sessionId } = await request.json();

    if (!problem || typeof problem !== 'string') {
      return new Response(JSON.stringify({ error: 'Problem is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Check rate limit (simple in-memory for demo)
    // In production, use Redis or database
    const rateLimitKey = sessionId || 'anonymous';

    const stream = new ReadableStream({
      async start(controller) {
        const send = (event: string, data: unknown) => {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ event, data, timestamp: Date.now() })}\n\n`)
          );
        };

        try {
          let totalTokens = 0;

          // Phase 1: Conductor Analysis
          send('conductor-start', { status: 'analyzing' });
          await delay(500);

          const conductorResponse = getMockResponse(problem, 'conductor');
          send('conductor-analysis', { content: conductorResponse });
          totalTokens += estimateTokens(conductorResponse);
          await delay(300);

          // Phase 2: Routing Decision
          const routing = analyzeAndRoute(problem);
          send('routing-decision', {
            selectedAgents: routing.selectedAgents,
            reasoning: routing.reasoning,
            problemType: routing.problemType,
          });
          await delay(500);

          // Phase 3: Parallel Specialist Consultation (simulated)
          const agentResponses: AgentResponse[] = [];

          // Start all specialists
          for (const agentId of routing.selectedAgents) {
            send('specialist-start', { agentId });
          }
          await delay(200);

          // Stream responses with simulated parallelism
          // In reality, we process sequentially but with interleaved chunks
          const responseTexts = routing.selectedAgents.map(agentId => ({
            agentId,
            text: getMockResponse(problem, agentId),
            position: 0,
          }));

          const chunkSize = 50;
          let allComplete = false;

          while (!allComplete) {
            allComplete = true;

            for (const response of responseTexts) {
              if (response.position < response.text.length) {
                allComplete = false;
                const chunk = response.text.slice(
                  response.position,
                  response.position + chunkSize
                );
                response.position += chunkSize;

                send('specialist-chunk', {
                  agentId: response.agentId,
                  chunk,
                  done: response.position >= response.text.length,
                });
              }
            }

            await delay(30);
          }

          // Mark all specialists complete
          for (const response of responseTexts) {
            const tokens = estimateTokens(response.text);
            totalTokens += tokens;

            agentResponses.push({
              agentId: response.agentId as AgentId,
              content: response.text,
              tokenCount: tokens,
              timestamp: Date.now(),
            });

            send('specialist-complete', {
              agentId: response.agentId,
              tokenCount: tokens,
            });
          }

          await delay(500);

          // Phase 4: Synthesis
          send('synthesis-start', { status: 'synthesizing' });
          await delay(300);

          const synthesis = generateSynthesis(problem, agentResponses);

          // Stream synthesis
          for await (const chunk of streamText(synthesis, 20, 15)) {
            send('synthesis-chunk', { chunk });
          }

          totalTokens += estimateTokens(synthesis);

          send('synthesis-complete', {
            content: synthesis,
            tokenCount: estimateTokens(synthesis),
          });

          // Phase 5: Complete
          const estimatedCost = calculateCost(totalTokens);
          send('complete', {
            totalTokens,
            estimatedCost: estimatedCost.toFixed(4),
            agentCount: routing.selectedAgents.length + 1, // +1 for conductor
          });

          controller.close();
        } catch (error) {
          send('error', { message: error instanceof Error ? error.message : 'Unknown error' });
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
