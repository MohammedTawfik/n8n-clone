import { ReactFlowInstance } from "@xyflow/react";
import { atom } from "jotai";

export const reactFlowAtom = atom<ReactFlowInstance | null>(null)