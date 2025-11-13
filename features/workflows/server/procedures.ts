import prisma from "@/lib/db";
import {
	createTRPCRouter,
	premiumProcedure,
	protectedProcedure,
} from "@/trpc/init";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { PAGINATION } from "@/utils/constants";
import type { Edge, Node, XYPosition } from "@xyflow/react";
import { NodeType } from "@/lib/generated/prisma/enums";

export const workflowRouter = createTRPCRouter({
	createWorkflow: premiumProcedure
		.input(z.object({ name: z.string() }))
		.mutation(async ({ ctx, input }) => {
			return prisma.workflow.create({
				data: {
					name: input.name,
					userId: ctx.userSession.user.id,
					nodes: {
						create: {
							name: NodeType.INITIAL,
							type: NodeType.INITIAL,
							position: { x: 0, y: 0 }
						},
					},
				},
			});
		}),
	getUserWorkflows: protectedProcedure
		.input(
			z.object({
				page: z.number().default(PAGINATION.DEFAULT_PAGE),
				pageSize: z
					.number()
					.min(PAGINATION.MIN_PAGE_SIZE)
					.max(PAGINATION.MAX_PAGE_SIZE)
					.default(PAGINATION.DEFAULT_PAGE_SIZE),
				search: z.string().default(""),
			}),
		)
		.query(async ({ ctx, input }) => {
			const { page, pageSize, search } = input;
			const [items, count] = await Promise.all([
				prisma.workflow.findMany({
					skip: (page - 1) * pageSize,
					take: pageSize,
					where: {
						userId: ctx.userSession.user.id,
						name: {
							contains: search,
							mode: "insensitive",
						},
					},
					orderBy: {
						createdAt: "desc",
					},
				}),
				prisma.workflow.count({
					where: {
						userId: ctx.userSession.user.id,
						name: {
							contains: search,
							mode: "insensitive",
						},
					},
				}),
			]);
			const totalPages = Math.ceil(count / pageSize);
			const hasNextPage = page < totalPages;
			const hasPreviousPage = page > 1;
			return {
				items,
				count,
				page,
				pageSize,
				totalPages,
				hasNextPage,
				hasPreviousPage,
			};
		}),
	getWorkflowById: protectedProcedure
		.input(z.object({ id: z.string() }))
		.query(async ({ ctx, input }) => {
			const workflow = await prisma.workflow.findUniqueOrThrow({
				where: {
					id: input.id,
					userId: ctx.userSession.user.id,
				},
				include: {
					nodes: true,
					connections: true,
				},
			});

			const nodes : Node[] = workflow.nodes.map((node) => ({
				id: node.id,
				type: node.type,
				position: node.position as XYPosition,
				data: node.data as Record<string, unknown>,
			}));

			const edges : Edge[] = workflow.connections.map((connection) => ({
				id: connection.id,
				source: connection.sourceNodeId,
				target: connection.targetNodeId,
				sourceHandle: connection.fromOutput,
				targetHandle: connection.toInput,
			}));
			return {
				workflow,
				nodes,
				edges,
			};
		}),
	updateWorkflowName: protectedProcedure
		.input(
			z.object({
				id: z.string(),
				name: z.string(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			return prisma.workflow.update({
				where: {
					id: input.id,
					userId: ctx.userSession.user.id,
				},
				data: {
					name: input.name,
				},
			});
		}),
		updateWorkflow: protectedProcedure
		.input(
			z.object({
				id: z.string(),
				nodes: z.array(z.object({
					id: z.string(),
					type: z.string(),
					data: z.record(z.string(), z.any()).optional(),
					position: z.object({
						x: z.number(),
						y: z.number(),
					}),
				})),
				edges: z.array(z.object({
					source: z.string(),
					target: z.string(),
					sourceHandle: z.string().nullish().optional(),
					targetHandle: z.string().nullish().optional(),
				})),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { id, nodes, edges } = input;
			const workflow = await prisma.workflow.findUniqueOrThrow({
				where: {
					id,
					userId: ctx.userSession.user.id,
				},
			});

			if (!workflow) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Workflow not found or you are not the owner of this workflow",
				});
			}
			return await prisma.$transaction(async (tx)=> {
				//Delete all connections linked to the workflow
				await tx.connection.deleteMany({
					where: {
						workflowId: id,
					},
				});
				//Delete all nodes linked to the workflow
				await tx.node.deleteMany({
					where: {
						workflowId: id,
					},
				});
				await tx.node.createMany({
					data: nodes.map((node) => ({
						id: node.id,
						workflowId: id,
						name: node.type,
						type: node.type as NodeType,
						position: node.position,
						data: node.data,

					})),
				});
				await tx.connection.createMany({	
					data: edges.map((edge) => ({
						workflowId: id,
						sourceNodeId: edge.source,
						targetNodeId: edge.target,
						fromOutput: edge.sourceHandle ?? "main",
						toInput: edge.targetHandle ?? "main",
					})),
				});

				return tx.workflow.update({
					where: { id },
					data: {
						updatedAt: new Date(),
					},
				});
			})
		}),
	deleteWorkflow: protectedProcedure
		.input(z.string())
		.mutation(async ({ ctx, input }) => {
			if (!ctx.userSession.user.id) {
				throw new TRPCError({ code: "UNAUTHORIZED", message: "Unauthorized" });
			}
			const workflow = await prisma.workflow.findUnique({
				where: {
					id: input,
					userId: ctx.userSession.user.id,
				},
			});
			if (!workflow) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message:
						"Workflow not found or you are not the owner of this workflow",
				});
			}

			return prisma.workflow.delete({
				where: {
					id: input,
					userId: ctx.userSession.user.id,
				},
			});
		}),
});
