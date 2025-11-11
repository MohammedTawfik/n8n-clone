import EntityItem from "@/components/entity-item"
import type { Workflow } from "@/lib/generated/prisma/client"
import { WorkflowIcon } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useDeleteWorkflow } from "../hooks/use-workflows"

interface WorkflowItemProps {

    workflow: Workflow
}
const WorkflowItem = ({ workflow }: WorkflowItemProps) => {
    const deleteWorkflow = useDeleteWorkflow();
    return (
        <EntityItem
            href={`/workflows/${workflow.id}`}
            title={workflow.name}
            subTitle={<>
                Updated {formatDistanceToNow(workflow.updatedAt, { addSuffix: true })}
                &bull;
                Created {formatDistanceToNow(workflow.createdAt, { addSuffix: true })}
            </>}
            image={
                <div className="size-8 flex items-center justify-center">
                    <WorkflowIcon className="size-4 text-muted-foreground" />
                </div>
            }
            onRemove={() => { deleteWorkflow.mutate(workflow.id) }}
            isRemoving={deleteWorkflow.isPending}
        />
    )
}

export default WorkflowItem    