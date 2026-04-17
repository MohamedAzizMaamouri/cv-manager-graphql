import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface AppContext {
    db: PrismaClient;
}

export const context = async (): Promise<AppContext> => ({
    db: prisma,
});