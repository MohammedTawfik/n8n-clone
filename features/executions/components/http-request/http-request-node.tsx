import { Node, NodeProps, useReactFlow } from '@xyflow/react';
import { memo, useState } from 'react';
import { BaseExecutionNode } from '../base-execution-node';
import { GlobeIcon } from 'lucide-react';
import { HttpRequestSettings, HttpRequestSettingsDialog } from './settings-dialog';

type HttpRequestNodeData = {
    endpoint: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    body?: string;
    [key: string]: unknown;
};

type HttpRequestNodeType = Node<HttpRequestNodeData>;

export const HttpRequestNode = memo((props: NodeProps<HttpRequestNodeType>) => {
    const [openSettingsDialog, setOpenSettingsDialog] = useState(false);
    const nodeData = props.data;
    const description = nodeData?.endpoint
        ? `HTTP ${nodeData.method || 'GET'}: ${nodeData.endpoint}`
        : 'Not configured';

    const status = 'initial';
    const { setNodes } = useReactFlow();

    const handleSubmit = (values: HttpRequestSettings) => {
        setNodes((nodes) =>
            nodes.map((node) => {
                if (node.id === props.id) {
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            endpoint: values.endpoint,
                            method: values.method,
                            body: values.body,
                        },
                    };
                }
                return node;
            })
        );
        setOpenSettingsDialog(false);
    };
    return (
        <>
            <HttpRequestSettingsDialog
                open={openSettingsDialog}
                onOpenChange={setOpenSettingsDialog}
                onSubmit={handleSubmit}
                defaultMethod={nodeData?.method}
                defaultEndpoint={nodeData?.endpoint}
                defaultBody={nodeData?.body}
            />
            <BaseExecutionNode
                {...props}
                status={status}
                name="HTTP Request"
                icon={GlobeIcon}
                description={description}
                id={props.id}
                onDoubleClick={() => {
                    setOpenSettingsDialog(true);
                }}
                onSettingsClick={() => {
                    setOpenSettingsDialog(true);
                }}
            >
                {null}
            </BaseExecutionNode>
        </>
    );
});

HttpRequestNode.displayName = 'HttpRequestNode';
