import { NodeType } from "./generated/prisma/enums";
import type {NodeTypes} from "@xyflow/react";
import { InitialNode } from "@/components/react-flow/initial-node";

export const NODE_TYPES_MAPPING = {
	[NodeType.INITIAL]: InitialNode
} as const satisfies NodeTypes;

export type RegisteredNodeTypes = keyof typeof NODE_TYPES_MAPPING;