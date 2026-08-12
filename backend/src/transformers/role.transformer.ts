import { IRole } from "../models/role.model.js";

export class RoleTransformer {
    static transform(role: IRole | Record<string, any>) {
        if (!role) return null;
        const obj = typeof (role as any).toObject === "function" ? (role as any).toObject() : role;
        return {
            id: obj._id ? obj._id.toString() : obj.id,
            _id: obj._id ? obj._id.toString() : obj.id,
            name: obj.name,
            description: obj.description || "",
            permissions: obj.permissions || [],
            isDeleted: obj.isDeleted ?? false,
            deletedAt: obj.deletedAt || null,
            createdAt: obj.createdAt,
            updatedAt: obj.updatedAt,
        };
    }

    static transformMany(roles: (IRole | Record<string, any>)[]) {
        return roles.map((role) => this.transform(role));
    }
}
