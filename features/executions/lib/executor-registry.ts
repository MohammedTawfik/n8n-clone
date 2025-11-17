import { NodeType } from '@/lib/generated/prisma/enums';
import { GetStepTools, Inngest } from 'inngest';
import { manualTriggerExecutor } from '@/features/triggers/components/manual-trigger/executor';
import { httpRequestExecutor } from '../components/http-request/executor';

export type WorkflowContext = Record<string, unknown>; //is used to pass data from one node to another so its type is dynamic

export type StepTools = GetStepTools<Inngest.Any>;

export interface NodeExecutorParams<TData = Record<string, unknown>> {
  data: TData;
  nodeId: string;
  context: WorkflowContext;
  step: StepTools;
}

export type NodeExecutor<TData = Record<string, unknown>> = (
  params: NodeExecutorParams<TData>
) => Promise<WorkflowContext>;

export const EXECUTOR_REGISTRY: Record<NodeType, NodeExecutor> = {
    [NodeType.HTTP_REQUEST]: httpRequestExecutor,
  [NodeType.MANUAL_TRIGGER]: manualTriggerExecutor,
  [NodeType.INITIAL]: async (params) => {
    return params.context;
  },
};

export const getExecutor = (nodeType: NodeType): NodeExecutor => {
  const executor = EXECUTOR_REGISTRY[nodeType];
  if (!executor) {
    throw new Error(`Executor for node type ${nodeType} not found`);
  }
  return executor;
};
