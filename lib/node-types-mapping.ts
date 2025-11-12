import { NodeType } from "./generated/prisma/enums";
import type {NodeTypes} from "@xyflow/react";
import { InitialNode } from "@/components/react-flow/initial-node";
import { HttpRequestNode } from "@/features/executions/components/http-request/http-request-node";
import { ManualTriggerNode } from "@/features/triggers/components/manual-trigger/manual-trigger-node";

export const NODE_TYPES_MAPPING = {
	[NodeType.INITIAL]: InitialNode,
	[NodeType.MANUAL_TRIGGER]: ManualTriggerNode,
	[NodeType.HTTP_REQUEST]: HttpRequestNode,
} as const satisfies NodeTypes;

export type RegisteredNodeTypes = keyof typeof NODE_TYPES_MAPPING;