export enum Role {
    USER  = "USER",
    ADMIN = "ADMIN",
}
export interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
}
export interface Cv {
    id: string;
    name: string;
    age: number;
    job: string;
    ownerId: string;       // FK → User
    skillIds: string[];    // FK[] → Skill (many-to-many)
}
export interface Skill {
    id: string;
    designation: string;
}




export const users: User[] = [
    { id: "u1", name: "Alice",   email: "alice@mail.com",  role: Role.ADMIN },
    { id: "u2", name: "Bob",     email: "bob@mail.com",    role: Role.USER  },
    { id: "u3", name: "Charlie", email: "charlie@mail.com",role: Role.USER  },
];
export const skills: Skill[] = [
    { id: "s1", designation: "TypeScript" },
    { id: "s2", designation: "GraphQL"    },
    { id: "s3", designation: "React"      },
    { id: "s4", designation: "Node.js"    },
    { id: "s5", designation: "Prisma"     },
];
export const cvs: Cv[] = [
    {
        id: "cv1", name: "FullStack Dev", age: 28, job: "Freelancer",
        ownerId: "u1", skillIds: ["s1", "s2", "s4"],
    },
    {
        id: "cv2", name: "Frontend Dev", age: 24, job: "Engineer",
        ownerId: "u2", skillIds: ["s3", "s1"],
    },
    {
        id: "cv3", name: "Backend Dev", age: 32, job: "Lead Dev",
        ownerId: "u3", skillIds: ["s4", "s5", "s2"],
    },
]