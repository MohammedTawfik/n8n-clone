import { inngest } from './client';
import { NonRetriableError } from 'inngest';
import prisma from '@/lib/db';
import { sortNodes } from './utils/utils';
import { getExecutor } from '@/features/executions/lib/executor-registry';

export const executeAiQuery = inngest.createFunction(
  { id: 'execute-workflow' },
  { event: 'workflow/execute' },
  async ({ event, step }) => {
    const workflowId = event.data.workflowId;
    if (!workflowId) {
      throw new NonRetriableError('Workflow ID is required');
    }
    const nodes = await step.run('get-nodes', async () => {
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where: {
          id: workflowId,
          userId: event.data.userId,
        },
        include: {
          nodes: true,
          connections: true,
        },
      });
      if (!workflow) {
        throw new NonRetriableError('Workflow not found');
      }
      return sortNodes(workflow.nodes, workflow.connections);
    });

    // Initialize the context  with any initial data from the trigger
    let context = event.data.initialData || {};

    for (const node of nodes) {
      const executor = getExecutor(node.type);
      context = await executor({
        data: node.data as Record<string, unknown>,
        nodeId: node.id,
        context,
        step
      });
    }

    return context;
  }
);
