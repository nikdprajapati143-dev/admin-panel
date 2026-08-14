import connectDatabase from "../config/database.js";
import { seedPermissions } from "./permission.seed.js";
import { seedRoles } from "./role.seed.js";
import { seedAdmins } from "./admin.seed.js";

export const seedDatabase = async (): Promise<void> => {
    try {
        console.log(" Starting database seeding...");
        await connectDatabase();

        await seedPermissions();
        await seedRoles();
        await seedAdmins();

        console.log(" Database seeding completed successfully!");
        process.exit(0);
    } catch (error) {
        console.error(" Error during database seeding:", error);
        process.exit(1);
    }
};

void seedDatabase();
