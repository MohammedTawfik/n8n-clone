import type { inferInput } from "@trpc/tanstack-react-query";
import { prefetch, trpc } from "@/trpc/server";

type paramsType = inferInput<typeof trpc.workflows.getUserWorkflows>;

export const prefetchWorkflows = (input: paramsType) => {
	prefetch(trpc.workflows.getUserWorkflows.queryOptions(input));
};

export const prefetchWorkflowById = (id: string) => {
	prefetch(trpc.workflows.getWorkflowById.queryOptions({ id }));
};
