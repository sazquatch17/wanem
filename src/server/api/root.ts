import { createTRPCRouter } from "~/server/api/trpc";
import { migrainesRouter } from "./routers/migraines";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  migraines: migrainesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
