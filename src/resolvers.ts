import { PubSub } from "graphql-subscriptions";
import type { AppContext } from "./context";
export const pubsub = new PubSub();
const CV_CHANGED = "CV_CHANGED";
export const resolvers = {
// Field resolvers 
    Cv: {
        user: (parent: any) => parent.owner,
        skills: (parent: any) => parent.skills.map((cs: any) => cs.skill),
    },
// Queries
    Query: {
        cvs: async (_: any, __: any, ctx: AppContext) =>
            ctx.db.cv.findMany({
                include: {
                    owner: true,
                    skills: { include: { skill: true } },
                },
            }),
        cv: async (_: any, { id }: { id: string }, ctx: AppContext) =>
            ctx.db.cv.findUnique({
                where: { id },
                include: {
                    owner: true,
                    skills: { include: { skill: true } },
                },
            }),
    },

    Mutation: {
        createCv: async (_: any, { input }: any, ctx: AppContext) => {
            const owner = await ctx.db.user.findUnique({ where: { id: input.ownerId } });
            if (!owner) throw new Error(`User ${input.ownerId} introuvable`);

            const skills = await ctx.db.skill.findMany({
                where: { id: { in: input.skillIds } },
            });
            if (skills.length !== input.skillIds.length)
                throw new Error("Un ou plusieurs skills invalides");

            const newCv = await ctx.db.cv.create({
                data: {
                    name: input.name,
                    age: input.age,
                    job: input.job,
                    ownerId: input.ownerId,
                    skills: {
                        create: input.skillIds.map((skillId: string) => ({
                            skillId,
                        })),
                    },
                },
                include: {
                    owner: true,
                    skills: { include: { skill: true } },
                },
            });
            pubsub.publish(CV_CHANGED, { cvChanged: { type: "ADDED", cv: newCv } });
            return newCv;
        },
        updateCv: async (_: any, { id, input }: any, ctx: AppContext) => {
            const existing = await ctx.db.cv.findUnique({ where: { id } });
            if (!existing) throw new Error(`CV ${id} introuvable`);

            if (input.ownerId) {
                const owner = await ctx.db.user.findUnique({ where: { id: input.ownerId } });
                if (!owner) throw new Error(`User ${input.ownerId} introuvable`);
            }

            if (input.skillIds) {
                const skills = await ctx.db.skill.findMany({
                    where: { id: { in: input.skillIds } },
                });
                if (skills.length !== input.skillIds.length)
                    throw new Error("Un ou plusieurs skills invalides");
            }

            const updatedCv = await ctx.db.cv.update({
                where: { id },
                data: {
                    ...input,
                    skills: input.skillIds
                        ? {
                              deleteMany: {},
                              create: input.skillIds.map((skillId: string) => ({
                                  skillId,
                              })),
                          }
                        : undefined,
                },
                include: {
                    owner: true,
                    skills: { include: { skill: true } },
                },
            });
            pubsub.publish(CV_CHANGED, {
                cvChanged: { type: "UPDATED", cv: updatedCv },
            });
            return updatedCv;
        },
        deleteCv: async (_: any, { id }: any, ctx: AppContext) => {
            const existing = await ctx.db.cv.findUnique({ where: { id } });
            if (!existing) throw new Error(`CV ${id} introuvable`);

            await ctx.db.cv.delete({ where: { id } });
            pubsub.publish(CV_CHANGED, {
                cvChanged: { type: "DELETED", cv: existing },
            });
            return true;
        },
    },

    Subscription: {
        cvChanged: {
            subscribe: () => pubsub.asyncIterableIterator([CV_CHANGED]),
        },
    },
};
