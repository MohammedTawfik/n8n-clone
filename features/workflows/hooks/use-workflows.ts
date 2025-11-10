import { useTRPC } from '@/trpc/client';
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { toast } from 'sonner';
import { useWorkflowsParams } from './use-workflows-params';

/**
 * Hook to get the workflows for the current user
 */
export const useSuspenseWorkflows = () => {
  const trpc = useTRPC();
  const [params] = useWorkflowsParams();
  return useSuspenseQuery(trpc.workflows.getUserWorkflows.queryOptions(params));
};

/**
 *  Hook to create a new workflow
 */
export const useCreateWorkflow = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const createWorkflow = useMutation(
    trpc.workflows.createWorkflow.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Workflow ${data.name} created successfully`);
        queryClient.invalidateQueries(
          trpc.workflows.getUserWorkflows.queryOptions({})
        );
      },
      onError: (error) => {
        toast.error(error.message);
        console.error(error);
      },
    })
  );
  return createWorkflow;
};
