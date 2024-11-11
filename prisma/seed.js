import { PrismaClient } from "@prisma/client";
import argon2 from "argon2";

const prisma = new PrismaClient();


(async function main() {
    const hashedPassword = argon2.hash("123")
    try {
        const salim = await prisma.users.upsert({
            where: { email: "salimhidayat342@gmail.com" },
            update: {},
            create: {
                full_name: "Salim Hidayat",
                email: "salimhdayat342@gmail.com",
                address: "Cicendo",
                password: JSON.stringify(await hashedPassword),
                username: "salim26",
                phone_number: "085314793866",
                is_active: true,
                is_verified: true,
                created_at: new Date(),
                profile_picture_url: "#URL",
                updated_at: null
            },
        });

        console.log("Create initial users: ", salim);
    } catch (e) {
        console.error(e);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
})();