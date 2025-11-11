import { Button } from "@/components/ui/button";
import { SaveIcon } from "lucide-react";

interface EditorSaveButtonProps {
    workflowId: string;
}

const EditorSaveButton = ({ workflowId }: EditorSaveButtonProps) => {
    const handleSave = () => {
        console.log('Saving workflow...');
    }
    return (
        <div className="ml-auto">
            <Button size="sm" onClick={() => handleSave()} disabled={false}>
                <SaveIcon className="size-4" />
                Save
            </Button>
        </div>
    )
}

export default EditorSaveButton