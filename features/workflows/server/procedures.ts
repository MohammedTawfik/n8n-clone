import prisma from '@/lib/db';
import {
  createTRPCRouter,
  premiumProcedure,
  protectedProcedure,
} from '@/trpc/init';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

export const workflowRouter = createTRPCRouter({
  createWorkflow: premiumProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return prisma.workflow.create({
        data: {
          name: input.name,
          userId: ctx.userSession.user.id,
        },
      });
    }),
  getUserWorkflows: protectedProcedure.query(async ({ ctx }) => {
    return prisma.workflow.findMany({
      where: {
        userId: ctx.userSession.user.id,
      },
    });
  }),
  getWorkflowById: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return prisma.workflow.findUnique({
        where: {
          id: input,
          userId: ctx.userSession.user.id,
        },
      });
    }),
  updateWorkflowName: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
      })
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
  deleteWorkflow: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      if (!ctx.userSession.user.id) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Unauthorized' });
      }
      const workflow = await prisma.workflow.findUnique({
        where: {
          id: input,
          userId: ctx.userSession.user.id,
        },
      });
      if (!workflow) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message:
            'Workflow not found or you are not the owner of this workflow',
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
