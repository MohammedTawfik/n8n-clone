import type { NodeExecutor } from '@/features/executions/lib/executor-registry';
import { manualTriggerChannel } from '@/inngest/channels/manual-trigger';

type ManualTriggerNodeData = Record<string, unknown>;

export const manualTriggerExecutor: NodeExecutor<
  ManualTriggerNodeData
> = async ({ nodeId, context, step, publish }) => {
  await publish(manualTriggerChannel().status({ nodeId, status: 'loading' }));
  try {
    const result = await step.run('manual-trigger', async () => {
      return context;
    });
    await publish(manualTriggerChannel().status({ nodeId, status: 'success' }));
    return result;
  } catch (error) {
    await publish(manualTriggerChannel().status({ nodeId, status: 'error' }));
    throw error;
  }
};
