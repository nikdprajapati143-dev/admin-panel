import connectDatabase from "../config/database.js";
import { env } from "../config/env.js";
import { Admin, AdminStatus } from "../models/admin.model.js";
import { Role } from "../models/role.model.js";
import { hashPassword } from "../utils/password.js";

export const seedDatabase = async (): Promise<void> => {
    try {
        console.log(" Starting database seeding...");
        await connectDatabase();

        // Fallback default values if env variables are blank
        const superAdminName = env.SUPER_ADMIN_NAME || "Super Admin";
        const superAdminEmail = (env.SUPER_ADMIN_EMAIL || "superadmin@admin.com").toLowerCase();
        const superAdminPassword = env.SUPER_ADMIN_PASSWORD || "SuperAdmin@123";

        const subAdminName = env.SUB_ADMIN_NAME || "Sub Admin";
        const subAdminEmail = (env.SUB_ADMIN_EMAIL || "subadmin@admin.com").toLowerCase();
        const subAdminPassword = env.SUB_ADMIN_PASSWORD || "SubAdmin@123";

        // 1. Seed SUPER_ADMIN Role
        let superAdminRole = await Role.findOne({ name: "SUPER_ADMIN", isDeleted: false });

        if (!superAdminRole) {
            superAdminRole = await Role.create({
                name: "SUPER_ADMIN",
                description: "Super Administrator with full unrestricted system privileges",
                permissions: ["*"],
            });
            console.log(" Created SUPER_ADMIN role");
        } else {
            console.log("ℹ  SUPER_ADMIN role already exists");
        }

        // 2. Seed SUB_ADMIN Role
        let subAdminRole = await Role.findOne({ name: "SUB_ADMIN", isDeleted: false });

        if (!subAdminRole) {
            subAdminRole = await Role.create({
                name: "SUB_ADMIN",
                description: "Sub Administrator with management privileges",
                permissions: [
                    "admin:read",
                    "admin:list",
                    "role:read",
                    "role:list",
                    "customer:create",
                    "customer:read",
                    "customer:list",
                    "customer:edit",
                    "customer:status",
                    "customer:delete",
                ],
            });
            console.log(" Created SUB_ADMIN role");
        } else {
            console.log("ℹ  SUB_ADMIN role already exists");
        }

        // 3. Seed Super Admin User
        let superAdminUser = await Admin.findOne({ email: superAdminEmail, isDeleted: false });

        if (!superAdminUser) {
            const hashedPassword = await hashPassword(superAdminPassword);
            superAdminUser = await Admin.create({
                name: superAdminName,
                email: superAdminEmail,
                password: hashedPassword,
                role: superAdminRole._id,
                status: AdminStatus.ACTIVE,
            });
            console.log(` Created Super Admin user (${superAdminEmail})`);
        } else {
            console.log(`ℹ  Super Admin user (${superAdminEmail}) already exists`);
        }

        // 4. Seed Sub Admin User
        let subAdminUser = await Admin.findOne({ email: subAdminEmail, isDeleted: false });

        if (!subAdminUser) {
            const hashedPassword = await hashPassword(subAdminPassword);
            subAdminUser = await Admin.create({
                name: subAdminName,
                email: subAdminEmail,
                password: hashedPassword,
                role: subAdminRole._id,
                status: AdminStatus.ACTIVE,
            });
            console.log(` Created Sub Admin user (${subAdminEmail})`);
        } else {
            console.log(`ℹ  Sub Admin user (${subAdminEmail}) already exists`);
        }

        console.log(" Database seeding completed successfully!");
        process.exit(0);
    } catch (error) {
        console.error(" Error during database seeding:", error);
        process.exit(1);
    }
};

void seedDatabase();
