import connectDatabase from "../config/database.js";
import { env } from "../config/env.js";
import { Admin, AdminStatus } from "../models/admin.model.js";
import { Permission } from "../models/permission.model.js";
import { Role } from "../models/role.model.js";
import { hashPassword } from "../utils/password.js";

const DEFAULT_PERMISSIONS = [
    // Admin Management Permissions
    { name: "Create Admins", code: "admin:create", module: "ADMIN", description: "Create new administrator accounts" },
    { name: "View Admins", code: "admin:read", module: "ADMIN", description: "View details of administrators" },
    { name: "List Admins", code: "admin:list", module: "ADMIN", description: "List all administrator accounts" },
    { name: "Edit Admins", code: "admin:edit", module: "ADMIN", description: "Modify existing administrator details" },
    { name: "Delete Admins", code: "admin:delete", module: "ADMIN", description: "Soft-delete administrator accounts" },

    // Customer Management Permissions
    { name: "Create Customers", code: "customer:create", module: "CUSTOMER", description: "Register new customer accounts" },
    { name: "View Customers", code: "customer:read", module: "CUSTOMER", description: "View details of customer profiles" },
    { name: "List Customers", code: "customer:list", module: "CUSTOMER", description: "List all customer accounts" },
    { name: "Edit Customers", code: "customer:edit", module: "CUSTOMER", description: "Update customer details and status" },
    { name: "Delete Customers", code: "customer:delete", module: "CUSTOMER", description: "Soft-delete customer records" },

    // Role Management Permissions (No View Roles since there is no role detail page)
    { name: "Create Roles", code: "role:create", module: "ROLE", description: "Create new custom roles" },
    { name: "List Roles", code: "role:list", module: "ROLE", description: "List all roles and permission matrix" },
    { name: "Edit Roles", code: "role:edit", module: "ROLE", description: "Modify role details and permission matrix" },
    { name: "Delete Roles", code: "role:delete", module: "ROLE", description: "Delete custom roles" },
];

export const seedDatabase = async (): Promise<void> => {
    try {
        console.log(" Starting database seeding...");
        await connectDatabase();

        // 1. Wipe & Seed Clean Permissions in Database
        console.log(" Cleaning old permissions and seeding system permissions...");
        await Permission.deleteMany({});
        for (const perm of DEFAULT_PERMISSIONS) {
            await Permission.create(perm);
        }
        console.log(` Seeded ${DEFAULT_PERMISSIONS.length} clean system permissions`);

        // Fallback default values if env variables are blank
        const superAdminName = env.SUPER_ADMIN_NAME || "Super Admin";
        const superAdminEmail = (env.SUPER_ADMIN_EMAIL || "superadmin@admin.com").toLowerCase();
        const superAdminPassword = env.SUPER_ADMIN_PASSWORD || "SuperAdmin@123";

        const subAdminName = env.SUB_ADMIN_NAME || "Sub Admin";
        const subAdminEmail = (env.SUB_ADMIN_EMAIL || "subadmin@admin.com").toLowerCase();
        const subAdminPassword = env.SUB_ADMIN_PASSWORD || "SubAdmin@123";

        // 2. Seed SUPER_ADMIN Role
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

        // 3. Seed SUB_ADMIN Role
        const subAdminPermissions = [
            "admin:list",
            "role:list",
            "customer:list",
            "customer:create",
            "customer:delete",
        ];

        let subAdminRole = await Role.findOne({ name: "SUB_ADMIN", isDeleted: false });

        if (!subAdminRole) {
            subAdminRole = await Role.create({
                name: "SUB_ADMIN",
                description: "Sub Administrator with management privileges",
                permissions: subAdminPermissions,
            });
            console.log(" Created SUB_ADMIN role");
        } else {
            subAdminRole.permissions = subAdminPermissions;
            await subAdminRole.save();
            console.log("ℹ  Updated SUB_ADMIN role permissions");
        }

        // 4. Seed Super Admin User
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

        // 5. Seed Sub Admin User
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
