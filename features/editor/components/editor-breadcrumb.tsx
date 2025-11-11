import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Input } from '@/components/ui/input';
import {
    useSuspenseGetWorkflowById,
    useUpdateWorkflowName,
} from '@/features/workflows/hooks/use-workflows';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

interface EditorBreadcrumbProps {
    workflowId: string;
}

const EditorBreadcrumb = ({ workflowId }: EditorBreadcrumbProps) => {
    const { data: workflow } = useSuspenseGetWorkflowById(workflowId);
    const [isEditing, setIsEditing] = useState(false);
    // Initialize with workflow.name, will be reset when workflowId changes (component remounts)
    const [newName, setNewName] = useState(() => workflow.name);
    const updateWorkflowName = useUpdateWorkflowName();

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);

    const handleUpdateWorkflowName = async () => {
        try {
            if (newName && newName.trim() !== workflow.name) {
                const result = await updateWorkflowName.mutateAsync({
                    id: workflowId,
                    name: newName,
                });
                // Use the mutation result to update state immediately
                // This avoids using stale workflow.name from query
                setNewName(result.name);
            } else {
                // If no change, just reset to current workflow.name
                setNewName(workflow.name);
            }
            setIsEditing(false);
        } catch (error) {
            console.error(error);
            // On error, reset to current workflow.name
            setNewName(workflow.name);
            setIsEditing(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleUpdateWorkflowName();
        }
        if (e.key === 'Escape') {
            setIsEditing(false);
            setNewName(workflow.name);
        }
    }

    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link href="/workflows">Workflows</Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                {isEditing ? (
                    <BreadcrumbItem>
                        <Input
                            ref={inputRef}
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            onKeyDown={handleKeyDown}
                            onBlur={handleUpdateWorkflowName}
                            className='h-7 w-auto min-w-100 px-2'
                        />
                    </BreadcrumbItem>
                ) : (
                    <BreadcrumbItem>
                        <BreadcrumbLink
                            className="cursor-pointer hover:text-foreground transition-colors"
                            onClick={() => {
                                // Sync newName with latest workflow.name when starting to edit
                                setNewName(workflow.name);
                                setIsEditing(true);
                            }}
                        >
                            {workflow.name}
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                )}

            </BreadcrumbList>
        </Breadcrumb>
    );
};

export default EditorBreadcrumb;
