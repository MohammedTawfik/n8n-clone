import { Separator } from '@/components/ui/separator';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { NodeType } from '@/lib/generated/prisma/enums';
import { GlobeIcon, MousePointerIcon } from 'lucide-react';
import Image from 'next/image';
import React, { useCallback } from 'react';
import { useReactFlow } from '@xyflow/react';
import { toast } from 'sonner';
import { createId } from '@paralleldrive/cuid2';

export type NodeTypeOptions = {
    label: string;
    type: NodeType;
    description: string;
    icon: React.ComponentType<{ className?: string }> | string;
};

const nodeTriggerOptions: NodeTypeOptions[] = [
    {
        label: 'Manual Trigger',
        type: NodeType.MANUAL_TRIGGER,
        description: 'A node that triggers when a user manually triggers it',
        icon: MousePointerIcon,
    },
];

const nodesExecutionOptions: NodeTypeOptions[] = [
    {
        label: 'HTTP Request',
        type: NodeType.HTTP_REQUEST,
        description: 'A node that executes an HTTP request',
        icon: GlobeIcon,
    },
];

interface NodeSelectorProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: React.ReactNode;
}

export const NodeSelector = ({
    open,
    onOpenChange,
    children,
}: NodeSelectorProps) => {
    const { setNodes, getNodes, screenToFlowPosition } = useReactFlow();

    const handleNodeTypeSelection = useCallback(
        (selectedNodeType: NodeTypeOptions) => {
            if (selectedNodeType.label === 'Manual Trigger') {
                const nodes = getNodes();
                const manualTriggerNode = nodes.some(
                    (node) => node.type === NodeType.MANUAL_TRIGGER
                );
                if (manualTriggerNode) {
                    toast.error('Manual Trigger node already exists');
                    return;
                }
            }

            setNodes((nodes) => {
                const initialNode = nodes.some(
                    (node) => node.type === NodeType.INITIAL
                );

                const centerX = window.innerWidth / 2;
                const centerY = window.innerHeight / 2;

                const flowPosition = screenToFlowPosition({
                    x: centerX + (Math.random() - 0.5) * 200,
                    y: centerY + (Math.random() - 0.5) * 200,
                });

                const newNode = {
                    id: createId(),
                    data: {},
                    position: flowPosition,
                    type: selectedNodeType.type,
                };

                if (initialNode) {
                    return [newNode];
                }

                return [...nodes, newNode];
            });

            onOpenChange(false);
        },
        [setNodes, getNodes, screenToFlowPosition, onOpenChange]
    );
    return (
        <Sheet
            open={open}
            onOpenChange={onOpenChange}
        >
            <SheetTrigger asChild>{children}</SheetTrigger>
            <SheetContent
                side="right"
                className="w-full sm:max-w-md overflow-y-auto"
            >
                <SheetHeader>
                    <SheetTitle>What Triggers This Workflow?</SheetTitle>
                    <SheetDescription>
                        Select the node that will trigger this workflow.
                    </SheetDescription>
                </SheetHeader>
                <div>
                    {nodeTriggerOptions.map((option) => (
                        <div
                            key={option.type}
                            onClick={() => handleNodeTypeSelection(option)}
                            className="w-full justify-start h-auto py-5 px-4 rounded-none cursor-pointer 
                            border-l-2 border-transparent hover:border-l-primary"
                        >
                            <div className="flex items-center gap-6 w-full overflow-hidden">
                                {typeof option.icon === 'string' ? (
                                    <Image
                                        src={option.icon}
                                        alt={option.label}
                                        className="size-5 object-contain rounded-sm"
                                        width={5}
                                        height={5}
                                    />
                                ) : (
                                    <option.icon className="size-6 text-muted-foreground" />
                                )}
                                <div className="flex flex-col items-start text-left">
                                    <span className="font-medium text-sm">{option.label}</span>
                                    <span className="text-xs text-muted-foreground">
                                        {option.description}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <Separator />
                <div>
                    {nodesExecutionOptions.map((option) => (
                        <div
                            key={option.type}
                            onClick={() => handleNodeTypeSelection(option)}
                            className="w-full justify-start h-auto py-5 px-4 rounded-none cursor-pointer 
                            border-l-2 border-transparent hover:border-l-primary"
                        >
                            <div className="flex items-center gap-6 w-full overflow-hidden">
                                {typeof option.icon === 'string' ? (
                                    <Image
                                        src={option.icon}
                                        alt={option.label}
                                        className="size-5 object-contain rounded-sm"
                                        width={5}
                                        height={5}
                                    />
                                ) : (
                                    <option.icon className="size-6 text-muted-foreground" />
                                )}
                                <div className="flex flex-col items-start text-left">
                                    <span className="font-medium text-sm">{option.label}</span>
                                    <span className="text-xs text-muted-foreground">
                                        {option.description}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </SheetContent>
        </Sheet>
    );
};
