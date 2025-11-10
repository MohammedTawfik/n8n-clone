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
export const WorkflowsList = () => {
    const { data: workflows } = useSuspenseWorkflows();

    return (
        <div>
            {workflows.map((workflow) => (
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
        console.log("creating workflow");
        createWorkflow.mutate(
            {
                name: generateSlug(3),
            },
            {
                onSuccess: (data) => {
                    router.push(`/workflows/${data.id}`);
                },
                onError: (error) => {
                    console.error(error, "error in create workflow");
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
    return (
        <EntityContainer
            header={<WorkflowsListHeader isDisable={false} />}
            search={<></>}
            pagination={<></>}
        >
            {children}
        </EntityContainer>
    );
};
