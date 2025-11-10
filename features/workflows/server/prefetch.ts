import { trpc, prefetch } from '@/trpc/server';
import { inferInput } from '@trpc/tanstack-react-query';

type paramsType = inferInput<typeof trpc.workflows.getUserWorkflows>;

export const prefetchWorkflows = (input: paramsType) => {
  prefetch(trpc.workflows.getUserWorkflows.queryOptions(input));
};
