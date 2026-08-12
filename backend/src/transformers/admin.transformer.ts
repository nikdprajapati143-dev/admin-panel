import { IAdmin } from "../models/admin.model.js";
import { RoleTransformer } from "./role.transformer.js";

export class AdminTransformer {
    static transform(admin: IAdmin | Record<string, any>) {
        if (!admin) return null;
        const obj = typeof (admin as any).toObject === "function" ? (admin as any).toObject() : admin;

        let role = obj.role;
        if (role && typeof role === "object" && (role._id || role.name)) {
            role = RoleTransformer.transform(role);
        } else if (role) {
            role = role.toString();
        }

        return {
            id: obj._id ? obj._id.toString() : obj.id,
            _id: obj._id ? obj._id.toString() : obj.id,
            name: obj.name,
            email: obj.email,
            avatar: obj.avatar,
            role,
            status: obj.status,
            isDeleted: obj.isDeleted ?? false,
            deletedAt: obj.deletedAt || null,
            createdAt: obj.createdAt,
            updatedAt: obj.updatedAt,
        };
    }

    static transformMany(admins: (IAdmin | Record<string, any>)[]) {
        return admins.map((admin) => this.transform(admin));
    }
}
