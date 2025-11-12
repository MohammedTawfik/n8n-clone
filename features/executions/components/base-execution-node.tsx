import { LucideIcon } from 'lucide-react';
import { memo } from 'react';
import WorkflowNode from '../../../components/react-flow/workflow-node';
import { BaseNode, BaseNodeContent } from '../../../components/react-flow/base-node';
import Image from 'next/image';
import { Position } from '@xyflow/react';
import { BaseHandle } from '../../../components/react-flow/base-handle';

interface BaseExecutionNodeProps {
    id: string;
    name: string;
    description?: string;
    icon: LucideIcon | string;
    //status: NodeStatus
    children: React.ReactNode;
    onSettingsClick?: () => void;
    onDoubleClick?: () => void;
}

export const BaseExecutionNode = memo(
    ({
        id,
        name,
        description,
        icon,
        children,
        onSettingsClick,
        onDoubleClick,
    }: BaseExecutionNodeProps) => {
        const handleDelete = () => { };
        const Icon = typeof icon === 'string' ? null : icon;

        return (
            <WorkflowNode
                name={name}
                description={description}
                onDelete={handleDelete}
                onShowSettings={onSettingsClick}
            >
                <BaseNode id={id} onDoubleClick={onDoubleClick}>
                    <BaseNodeContent>
                        {typeof icon === 'string' ? (
                            <Image
                                src={icon}
                                alt={name}
                                width={16}
                                height={16}
                            />
                        ) : (
                            Icon && <Icon className="size-6 text-muted-foreground" />
                        )}
                        {children}
                        <BaseHandle
                            id="target-1"
                            type="target"
                            position={Position.Left}
                        />
                        <BaseHandle
                            id="source-1"
                            type="source"
                            position={Position.Right}
                        />
                    </BaseNodeContent>
                </BaseNode>
            </WorkflowNode>
        );
    }
);

BaseExecutionNode.displayName = 'BaseExecutionNode';
