import { env } from "../config/env.js";
import { Admin, AdminStatus } from "../models/admin.model.js";
import { Role } from "../models/role.model.js";
import { hashPassword } from "../utils/password.js";

export const seedAdmins = async (): Promise<void> => {
    const superAdminName = env.SUPER_ADMIN_NAME || "Super Admin";
    const superAdminEmail = (env.SUPER_ADMIN_EMAIL || "superadmin@admin.com").toLowerCase();
    const superAdminPassword = env.SUPER_ADMIN_PASSWORD || "SuperAdmin@123";

    const subAdminName = env.SUB_ADMIN_NAME || "Sub Admin";
    const subAdminEmail = (env.SUB_ADMIN_EMAIL || "subadmin@admin.com").toLowerCase();
    const subAdminPassword = env.SUB_ADMIN_PASSWORD || "SubAdmin@123";

    const superAdminRole = await Role.findOne({ name: "SUPER_ADMIN", isDeleted: false });
    const subAdminRole = await Role.findOne({ name: "SUB_ADMIN", isDeleted: false });

    if (!superAdminRole || !subAdminRole) {
        throw new Error("Cannot seed admin users before roles are seeded");
    }

    // Seed Super Admin User
    let superAdminUser = await Admin.findOne({ email: superAdminEmail, isDeleted: false });

    if (!superAdminUser) {
        const hashedPassword = await hashPassword(superAdminPassword);
        await Admin.create({
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

    // Seed Sub Admin User
    let subAdminUser = await Admin.findOne({ email: subAdminEmail, isDeleted: false });

    if (!subAdminUser) {
        const hashedPassword = await hashPassword(subAdminPassword);
        await Admin.create({
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
};
