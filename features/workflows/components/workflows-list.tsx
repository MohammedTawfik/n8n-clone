'use client';
import EntityHeader from '@/components/entity-header';
import {
    useCreateWorkflow,
    useSuspenseWorkflows,
} from '../hooks/use-workflows';
import EntityContainer from '@/components/entity-container';
import { generateSlug } from 'random-word-slugs';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useUpgradeModel } from '@/hooks/use upgrade-model';
import Search from './search';
import EntityPagination from '@/components/entity-pagination';
import { useWorkflowsParams } from '../hooks/use-workflows-params';
export const WorkflowsList = () => {
    const { data: workflows } = useSuspenseWorkflows();

    return (
        <div>
            {workflows.items.map((workflow) => (
                <div key={workflow.id}>{workflow.name}</div>
            ))}
        </div>
    );
};

export const WorkflowsListHeader = ({ isDisable }: { isDisable: boolean }) => {
    const createWorkflow = useCreateWorkflow();
    const { modal, handleError } = useUpgradeModel();
    const router = useRouter();
    const handleCreateWorkflow = () => {
        console.log('creating workflow');
        createWorkflow.mutate(
            {
                name: generateSlug(3),
            },
            {
                onSuccess: (data) => {
                    router.push(`/workflows/${data.id}`);
                },
                onError: (error) => {
                    console.error(error, 'error in create workflow');
                    if (handleError(error)) {
                        return;
                    }
                    toast.error(error.message);
                },
            }
        );
    };
    return (
        <>
            {modal}
            <EntityHeader
                title="Workflows"
                description="Manage your workflows"
                createButtonLabel="Create Workflow"
                isDisabled={isDisable}
                isCreating={createWorkflow.isPending}
                onNew={handleCreateWorkflow}
            />
        </>
    );
};

export const WorkflowsListContainer = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const workflows = useSuspenseWorkflows();
    const [params, setParams] = useWorkflowsParams();
    return (
        <EntityContainer
            header={<WorkflowsListHeader isDisable={false} />}
            search={<Search />}
            pagination={
                <EntityPagination
                    page={workflows.data?.page}
                    pageSize={workflows.data?.pageSize}
                    totalPages={workflows.data?.totalPages}
                    onPageChange={(page) => setParams({ ...params, page })}
                    onPageSizeChange={(pageSize) => setParams({ ...params, pageSize })}
                    isDisabled={workflows.isFetching}
                />
            }
        >
            {children}
        </EntityContainer>
    );
};
