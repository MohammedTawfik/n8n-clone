import { Button } from "@/components/ui/button";
import { useExecuteWorkflow } from "@/features/workflows/hooks/use-workflows";
import { FlaskConicalIcon } from "lucide-react";

interface ExecuteWorkflowButtonProps {

    workflowId: string;
}
const ExecuteWorkflowButton = ({ workflowId }: ExecuteWorkflowButtonProps) => {
    const executeWorkflow = useExecuteWorkflow();
    const handleExecuteWorkflow = () => {
        executeWorkflow.mutate({ workflowId });
    }
    return (
        <Button size="lg" disabled={executeWorkflow.isPending} onClick={handleExecuteWorkflow}>
            <FlaskConicalIcon className="size-4" />
            <span>Execute Workflow</span>
        </Button>
    )
}
export default ExecuteWorkflowButton