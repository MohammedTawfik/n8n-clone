import type { NodeExecutor } from '@/features/executions/lib/executor-registry';

type ManualTriggerNodeData = Record<string, unknown>;

export const manualTriggerExecutor: NodeExecutor<ManualTriggerNodeData> = async ({ context, step }) => {
  const result = await step.run('manual-trigger', async () => {
    return context;
  });
  return result;
};
