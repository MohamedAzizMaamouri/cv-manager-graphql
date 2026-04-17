import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    // Create users
    const adam = await prisma.user.create({
        data: {
            id: "u1",
            name: "Adam",
            email: "adam@mail.com",
            role: "ADMIN",
        },
    });

    const aziz = await prisma.user.create({
        data: {
            id: "u2",
            name: "Aziz",
            email: "aziz@mail.com",
            role: "USER",
        },
    });

    const abdou = await prisma.user.create({
        data: {
            id: "u3",
            name: "Abdou",
            email: "abdou@mail.com",
            role: "USER",
        },
    });

    // Create skills
    const ts = await prisma.skill.create({
        data: {
            id: "s1",
            designation: "TypeScript",
        },
    });

    const gql = await prisma.skill.create({
        data: {
            id: "s2",
            designation: "GraphQL",
        },
    });

    const react = await prisma.skill.create({
        data: {
            id: "s3",
            designation: "React",
        },
    });

    const node = await prisma.skill.create({
        data: {
            id: "s4",
            designation: "Node.js",
        },
    });

    const prismaSkill = await prisma.skill.create({
        data: {
            id: "s5",
            designation: "Prisma",
        },
    });

    // Create CVs with skills
    await prisma.cv.create({
        data: {
            id: "cv1",
            name: "FullStack Dev",
            age: 28,
            job: "Freelancer",
            ownerId: "u1",
            skills: {
                create: [
                    { skillId: "s1" },
                    { skillId: "s2" },
                    { skillId: "s4" },
                ],
            },
        },
    });

    await prisma.cv.create({
        data: {
            id: "cv2",
            name: "Frontend Dev",
            age: 24,
            job: "Engineer",
            ownerId: "u2",
            skills: {
                create: [
                    { skillId: "s3" },
                    { skillId: "s1" },
                ],
            },
        },
    });

    await prisma.cv.create({
        data: {
            id: "cv3",
            name: "Backend Dev",
            age: 32,
            job: "Lead Dev",
            ownerId: "u3",
            skills: {
                create: [
                    { skillId: "s4" },
                    { skillId: "s5" },
                    { skillId: "s2" },
                ],
            },
        },
    });

    console.log("Seeding completed");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
