import { Button } from "@/components/ui/button";
import { useUpdateWorkflow } from "@/features/workflows/hooks/use-workflows";
import { SaveIcon } from "lucide-react";
import { reactFlowAtom } from "../store/atoms";
import { useAtomValue } from "jotai";
import { XYPosition } from "@xyflow/react";

interface EditorSaveButtonProps {
    workflowId: string;
}

const EditorSaveButton = ({ workflowId }: EditorSaveButtonProps) => {
    const updateWorkflow = useUpdateWorkflow();
    const reactFlow = useAtomValue(reactFlowAtom);
    const handleSave = () => {
        if (!reactFlow) return;
        updateWorkflow.mutate({
            id: workflowId,
            nodes: reactFlow?.getNodes().map((node) => ({
                id: node.id,
                type: node.type ?? "",
                position: node.position as XYPosition,
                data: node.data as Record<string, unknown>,
            })),
            edges: reactFlow?.getEdges(),
        });
    }
    return (
        <div className="ml-auto">
            <Button size="sm" onClick={() => handleSave()} disabled={updateWorkflow.isPending}>
                <SaveIcon className="size-4" />
                Save
            </Button>
        </div>
    )
}

export default EditorSaveButton