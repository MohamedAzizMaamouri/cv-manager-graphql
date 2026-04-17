import { cvs, users, skills } from "./db";

export interface AppContext {
    db: {
        cvs:    typeof cvs;
        users:  typeof users;
        skills: typeof skills;
    };
}

export const context = async (): Promise<AppContext> => ({
    db: { cvs, users, skills },
});