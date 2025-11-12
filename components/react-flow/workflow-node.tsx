import { NodeToolbar, Position } from '@xyflow/react';
import React from 'react';
import { Button } from '../ui/button';
import { SettingsIcon, TrashIcon } from 'lucide-react';

interface WorkflowNodeProps {
    name?: string;
    description?: string;
    children: React.ReactNode;
    showToolbar?: boolean;
    onDelete?: () => void;
    onShowSettings?: () => void;
}

const WorkflowNode = ({
    name,
    description,
    children,
    showToolbar = true,
    onDelete,
    onShowSettings,
}: WorkflowNodeProps) => {
    return (
        <>
            {showToolbar && (
                <NodeToolbar>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onShowSettings}
                    >
                        <SettingsIcon className="size-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onDelete}
                    >
                        <TrashIcon className="size-4" />
                    </Button>
                </NodeToolbar>
            )}
            {children}
            {name && (
                <NodeToolbar position={Position.Bottom} isVisible className='text-center max-w-[200px]'>
                    <p className='text-medium'>{name}</p>
                    {description && (
                        <p className='text-sm truncate text-muted-foreground'>{description}</p>
                    )}
                </NodeToolbar>
            )}
        </>
    );
};

export default WorkflowNode;
