import { z } from 'zod';
import { baseProcedure, createTRPCRouter } from '../init';
import { inngest } from '@/inngest/client';
export const appRouter = createTRPCRouter({
  executeAiQuery: baseProcedure.mutation(async () => {
    const response = await inngest.send({
      name: 'ai/execute-query',
    });
    return response;
  }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
