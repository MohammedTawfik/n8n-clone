import { useTRPC } from "@/trpc/client";
import {
	useMutation,
	useQuery,
	useQueryClient,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { useWorkflowsParams } from "./use-workflows-params";

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
					trpc.workflows.getUserWorkflows.queryOptions({}),
				);
			},
			onError: (error) => {
				toast.error(error.message);
				console.error(error);
			},
		}),
	);
	return createWorkflow;
};

/**
 *  Hook to delete a workflow
 */
export const useDeleteWorkflow = () => {
	const trpc = useTRPC();
	const queryClient = useQueryClient();
	const deleteWorkflow = useMutation(
		trpc.workflows.deleteWorkflow.mutationOptions({
			onSuccess: (data) => {
				toast.success(`Workflow "${data.name}" deleted successfully`);
				queryClient.invalidateQueries(
					trpc.workflows.getUserWorkflows.queryOptions({}),
				);
			},
			onError: (error) => {
				toast.error(error.message);
				console.error(error);
			},
		}),
	);
	return deleteWorkflow;
};

/**
 *  Hook to get a workflow by id
 */
export const useSuspenseGetWorkflowById = (id: string) => {
	const trpc = useTRPC();
	const getWorkflowById = useSuspenseQuery(
		trpc.workflows.getWorkflowById.queryOptions({ id: id }),
	);
	return getWorkflowById;
};

/**
 *  Hook to update workflow name
 */
export const useUpdateWorkflowName = () => {
	const trpc = useTRPC();
	const queryClient = useQueryClient();
	const updateWorkflowName = useMutation(
		trpc.workflows.updateWorkflowName.mutationOptions({
			onSuccess: (data) => {
				toast.success(`Workflow "${data.name}" updated successfully`);
				queryClient.invalidateQueries(
					trpc.workflows.getWorkflowById.queryOptions({ id: data.id }),
				);
				queryClient.invalidateQueries(
					trpc.workflows.getUserWorkflows.queryOptions({}),
				);
			},
			onError: (error) => {
				toast.error(error.message);
				console.error(error);
			},
		}),
	);
	return updateWorkflowName;
};
