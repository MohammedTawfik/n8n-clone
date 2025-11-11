'use client';
import { useSuspenseGetWorkflowById } from '@/features/workflows/hooks/use-workflows';

interface WorkflowEditorProps {

    workflowId: string;
}

const WorkflowEditor = ({ workflowId }: WorkflowEditorProps) => {
    const { data: workflow } = useSuspenseGetWorkflowById(workflowId);
    return (
        <div>
            <h1>Workflow Editor</h1>
            <p>Workflow Name: {workflow?.name}</p>
        </div>
    )
}

export default WorkflowEditor