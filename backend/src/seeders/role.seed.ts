import { Role } from "../models/role.model.js";

export const seedRoles = async (): Promise<void> => {
    // 1. Seed SUPER_ADMIN Role
    let superAdminRole = await Role.findOne({ name: "SUPER_ADMIN", isDeleted: false });

    if (!superAdminRole) {
        await Role.create({
            name: "SUPER_ADMIN",
            description: "Super Administrator with full unrestricted system privileges",
            permissions: ["*"],
        });
        console.log(" Created SUPER_ADMIN role");
    } else {
        console.log("ℹ  SUPER_ADMIN role already exists");
    }

    // 2. Seed SUB_ADMIN Role
    const subAdminPermissions = [
        "admin:list",
        "role:list",
        "customer:list",
        "customer:create",
        "customer:delete",
    ];

    let subAdminRole = await Role.findOne({ name: "SUB_ADMIN", isDeleted: false });

    if (!subAdminRole) {
        await Role.create({
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
};
