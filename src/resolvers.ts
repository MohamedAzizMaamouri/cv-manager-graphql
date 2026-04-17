import { PubSub } from "graphql-subscriptions";
import { v4 as uuid } from "uuid";
import type { AppContext } from "./context";
export const pubsub = new PubSub();
const CV_CHANGED = "CV_CHANGED";
export const resolvers = {
// ■■ Field resolvers ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
    Cv: {
        user: (parent: any, _: any, ctx: AppContext) =>
            ctx.db.users.find(u => u.id === parent.ownerId) ?? null,
        skills: (parent: any, _: any, ctx: AppContext) =>
            ctx.db.skills.filter(s => parent.skillIds.includes(s.id)),
    },
// ■■ Queries ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
    Query: {
        cvs: (_: any, __: any, ctx: AppContext) => ctx.db.cvs,
        cv: (_: any, { id }: { id: string }, ctx: AppContext) =>
            ctx.db.cvs.find(c => c.id === id) ?? null,
    },

    Mutation: {
        createCv: (_: any, { input }: any, ctx: AppContext) => {
            const owner = ctx.db.users.find(u => u.id === input.ownerId);
            if (!owner) throw new Error(`User ${input.ownerId} introuvable`);

            const validSkills = input.skillIds.every((sid: string) =>
                ctx.db.skills.some(s => s.id === sid),
            );
            if (!validSkills) throw new Error("Un ou plusieurs skills invalides");

            const newCv = { id: uuid(), ...input };
            ctx.db.cvs.push(newCv);
            pubsub.publish(CV_CHANGED, { cvChanged: { type: "ADDED", cv: newCv } });
            return newCv;
        },
        updateCv: (_: any, { id, input }: any, ctx: AppContext) => {
            const idx = ctx.db.cvs.findIndex(c => c.id === id);
            if (idx === -1) throw new Error(`CV ${id} introuvable`);

            if (input.ownerId) {
                const owner = ctx.db.users.find(u => u.id === input.ownerId);
                if (!owner) throw new Error(`User ${input.ownerId} introuvable`);
            }

            if (input.skillIds) {
                const valid = input.skillIds.every((sid: string) =>
                    ctx.db.skills.some(s => s.id === sid),
                );
                if (!valid) throw new Error("Un ou plusieurs skills invalides");
            }

            ctx.db.cvs[idx] = { ...ctx.db.cvs[idx], ...input };
            pubsub.publish(CV_CHANGED, {
                cvChanged: { type: "UPDATED", cv: ctx.db.cvs[idx] },
            });
            return ctx.db.cvs[idx];
        },
        deleteCv: (_: any, { id }: any, ctx: AppContext) => {
            const idx = ctx.db.cvs.findIndex(c => c.id === id);
            if (idx === -1) throw new Error(`CV ${id} introuvable`);

            const [deleted] = ctx.db.cvs.splice(idx, 1);
            pubsub.publish(CV_CHANGED, {
                cvChanged: { type: "DELETED", cv: deleted },
            });
            return true;
        },
    },

    Subscription: {
        cvChanged: {
            subscribe: () => pubsub.asyncIterator([CV_CHANGED]),
        },
    },
};
