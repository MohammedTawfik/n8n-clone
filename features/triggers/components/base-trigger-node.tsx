import { LucideIcon } from 'lucide-react';
import { memo } from 'react';
import WorkflowNode from '../../../components/react-flow/workflow-node';
import {
    BaseNode,
    BaseNodeContent,
} from '../../../components/react-flow/base-node';
import Image from 'next/image';
import { Position, useReactFlow } from '@xyflow/react';
import { BaseHandle } from '../../../components/react-flow/base-handle';
import {
    type NodeStatus,
    NodeStatusIndicator,
} from '@/components/react-flow/node-status-indicator';

interface BaseTriggerNodeProps {
    id: string;
    name: string;
    description?: string;
    icon: LucideIcon | string;
    status: NodeStatus;
    children: React.ReactNode;
    onSettingsClick?: () => void;
    onDoubleClick?: () => void;
}

export const BaseTriggerNode = memo(
    ({
        id,
        name,
        description,
        icon,
        status,
        children,
        onSettingsClick,
        onDoubleClick,
    }: BaseTriggerNodeProps) => {
        const { setNodes, setEdges } = useReactFlow();
        const handleDelete = () => {
            setNodes((nodes) => nodes.filter((node) => node.id !== id));
            setEdges((edges) =>
                edges.filter((edge) => edge.source !== id && edge.target !== id)
            );
        };
        const Icon = typeof icon === 'string' ? null : icon;

        return (
            <WorkflowNode
                name={name}
                description={description}
                onDelete={handleDelete}
                onShowSettings={onSettingsClick}
            >
                <NodeStatusIndicator
                    status={status}
                    variant="border"
                    className="rounded-l-2xl"
                >
                    <BaseNode
                        id={id}
                        onDoubleClick={onDoubleClick}
                        status={status}
                        className="rounded-l-2xl relative group"
                    >
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
                                id="source-1"
                                type="source"
                                position={Position.Right}
                            />
                        </BaseNodeContent>
                    </BaseNode>
                </NodeStatusIndicator>
            </WorkflowNode>
        );
    }
);

BaseTriggerNode.displayName = 'BaseTriggerNode';
