import { createTRPCRouter } from '../init';
import { workflowRouter } from '@/features/workflows/server/procedures';
export const appRouter = createTRPCRouter({
  workflows: workflowRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
