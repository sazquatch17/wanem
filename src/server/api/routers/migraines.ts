import type { User } from "@clerk/nextjs/dist/api";
import { clerkClient } from "@clerk/nextjs/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const filerUserForClient = (user: User) => {
  return {
    id: user.id,
    username: user.username,
    profileImageUrl: user.profileImageUrl,
  };
}

export const migrainesRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const migraines = await ctx.prisma.migrane.findMany({
      take: 100,
    });

    const users = (await clerkClient.users.getUserList({
      userId: migraines.map((migraine) => migraine.userId),
      limit: 100,
    })).map(filerUserForClient);

    return migraines.map((migraine) => ({
      migraine,
      user: users.find((user) => user.id === migraine.userId),
    }));

  }),
});
