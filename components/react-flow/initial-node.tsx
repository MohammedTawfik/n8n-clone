import type { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { PlaceholderNode } from "./placeholder-node";
import { PlusIcon } from "lucide-react";
import WorkflowNode from "./workflow-node";
import { NodeSelector } from "@/features/editor/components/node-selector";



export const InitialNode = memo((props: NodeProps) => {
    const [isOpen, setIsOpen] = useState(false)
    return (
        <NodeSelector open={isOpen} onOpenChange={setIsOpen}>
            <WorkflowNode showToolbar={false} >
                <PlaceholderNode {...props} onClick={() => setIsOpen(true)}>
                    <div className="flex items-center justify-center cursor-pointer" >
                        <PlusIcon className="size-4" />
                    </div>
                </PlaceholderNode>
            </WorkflowNode>
        </NodeSelector>
    )
});

InitialNode.displayName = "InitialNode";