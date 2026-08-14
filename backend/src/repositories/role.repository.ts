import { IRole, Role } from "../models/role.model.js";
import { PaginationOptions } from "../utils/pagination.js";

export class RoleRepository {
    async create(data: Partial<IRole>): Promise<IRole> {
        return await Role.create(data);
    }

    async findById(id: string): Promise<IRole | null> {
        return await Role.findOne({ _id: id, isDeleted: false });
    }

    async findByName(name: string): Promise<IRole | null> {
        return await Role.findOne({ name: name.toUpperCase(), isDeleted: false });
    }

    async findAll(
        filter: Record<string, unknown> = {},
        pagination?: PaginationOptions,
    ): Promise<{ docs: IRole[]; totalDocs: number }> {
        const queryFilter = { ...filter, isDeleted: false };
        const totalDocs = await Role.countDocuments(queryFilter);

        let query = Role.find(queryFilter);

        if (pagination) {
            query = query
                .sort({ [pagination.sortBy]: pagination.sortOrder })
                .skip(pagination.skip)
                .limit(pagination.limit);
        }

        const docs = await query.exec();
        return { docs, totalDocs };
    }

    async update(id: string, updateData: Partial<IRole>): Promise<IRole | null> {
        return await Role.findOneAndUpdate(
            { _id: id, isDeleted: false },
            { $set: updateData },
            { returnDocument: "after", runValidators: true },
        );
    }

    async softDelete(id: string): Promise<IRole | null> {
        return await Role.findOneAndUpdate(
            { _id: id, isDeleted: false },
            { $set: { isDeleted: true, deletedAt: new Date() } },
            { returnDocument: "after" },
        );
    }
}
