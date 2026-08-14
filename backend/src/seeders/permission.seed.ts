import { SYSTEM_PERMISSIONS } from "../constants/permissions.js";
import { Permission } from "../models/permission.model.js";

export const seedPermissions = async (): Promise<void> => {
    console.log("Cleaning old permissions and seeding system permissions...");
    await Permission.deleteMany({});

    for (const perm of SYSTEM_PERMISSIONS) {
        await Permission.create(perm);
    }

    console.log(`Seeded ${SYSTEM_PERMISSIONS.length} clean system permissions`);
};
