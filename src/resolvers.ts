import { PubSub } from "graphql-subscriptions";
import { v4 as uuid } from "uuid";
import { cvs, users, skills } from "./db";
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
// ... (suite dans Partie 3)
};
