import prisma from "@/lib/db";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

export const workflowRouter = createTRPCRouter({
    createWorkflow: protectedProcedure
        .mutation(async ({ ctx }) => {   
        return prisma.workflow.create({
            data: {
                name: "New Workflow",
                userId: ctx.userSession.user.id,
            },
        });
    }),
});