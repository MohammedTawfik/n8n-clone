'use client';
import { useSuspenseGetWorkflowById } from '@/features/workflows/hooks/use-workflows';
import { useState, useCallback, useMemo } from 'react';
import {
    ReactFlow,
    applyNodeChanges,
    applyEdgeChanges,
    addEdge,
    Edge,
    NodeChange,
    EdgeChange,
    Connection,
    Node,
    Background,
    MiniMap,
    Controls,
    Panel,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { NODE_TYPES_MAPPING } from '@/lib/node-types-mapping';
import { AddNodeButton } from './add-node-button';
import { reactFlowAtom } from '../store/atoms';
import { useSetAtom } from 'jotai';
import { NodeType } from '@/lib/generated/prisma/enums';
import ExecuteWorkflowButton from './execute-workflow-button';

interface WorkflowEditorProps {
    workflowId: string;
}

const WorkflowEditor = ({ workflowId }: WorkflowEditorProps) => {
    const { data: workflow } = useSuspenseGetWorkflowById(workflowId);
    const [nodes, setNodes] = useState<Node[]>(workflow.nodes);
    const [edges, setEdges] = useState<Edge[]>(workflow.edges);

    const setReactFlow = useSetAtom(reactFlowAtom);

    const hasManualTrigger = useMemo(() => {
        return nodes.some((node) => node.type === NodeType.MANUAL_TRIGGER);
    }, [nodes]);
    const onNodesChange = useCallback(
        (changes: NodeChange[]) =>
            setNodes((nodesSnapshot: Node[]) => applyNodeChanges(changes, nodesSnapshot)),
        []
    );
    const onEdgesChange = useCallback(
        (changes: EdgeChange[]) =>
            setEdges((edgesSnapshot: Edge[]) => applyEdgeChanges(changes, edgesSnapshot)),
        []
    );
    const onConnect = useCallback(
        (params: Connection) =>
            setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
        []
    );

    return (
        <div className="size-full">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
                proOptions={{
                    hideAttribution: true,
                }}
                nodeTypes={NODE_TYPES_MAPPING}
                onInit={setReactFlow}
                snapGrid={[15, 15]}
                snapToGrid
                panOnDrag
                panOnScroll
                selectionOnDrag

            >
                <Background />
                <MiniMap />
                <Controls />
                <Panel position="top-right">
                    <AddNodeButton />
                </Panel>
                {hasManualTrigger && (
                    <Panel position="bottom-center">
                        <ExecuteWorkflowButton workflowId={workflowId} />
                    </Panel>
                )}
            </ReactFlow>
        </div>
    );
};

export default WorkflowEditor;
