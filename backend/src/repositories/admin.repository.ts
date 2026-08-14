import { Admin, IAdmin } from "../models/admin.model.js";
import { PaginationOptions } from "../utils/pagination.js";

export class AdminRepository {
    async create(data: Partial<IAdmin>): Promise<IAdmin> {
        const admin = await Admin.create(data);
        return await admin.populate("role");
    }

    async findById(id: string): Promise<IAdmin | null> {
        return await Admin.findOne({ _id: id, isDeleted: false }).populate("role");
    }

    async findByEmail(
        email: string,
        includePassword = false,
        includeRefreshToken = false,
    ): Promise<IAdmin | null> {
        let query = Admin.findOne({ email: email.toLowerCase(), isDeleted: false }).populate("role");

        if (includePassword) {
            query = query.select("+password");
        }
        if (includeRefreshToken) {
            query = query.select("+refreshToken");
        }

        return await query.exec();
    }

    async findByResetToken(hashedToken: string): Promise<IAdmin | null> {
        return await Admin.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: new Date() },
            isDeleted: false,
        }).select("+passwordResetToken +passwordResetExpires");
    }

    async findAll(
        filter: Record<string, unknown> = {},
        pagination?: PaginationOptions,
    ): Promise<{ docs: IAdmin[]; totalDocs: number }> {
        const queryFilter = { ...filter, isDeleted: false };
        const totalDocs = await Admin.countDocuments(queryFilter);

        let query = Admin.find(queryFilter).populate("role");

        if (pagination) {
            query = query
                .sort({ [pagination.sortBy]: pagination.sortOrder })
                .skip(pagination.skip)
                .limit(pagination.limit);
        }

        const docs = await query.exec();
        return { docs, totalDocs };
    }

    async update(id: string, updateData: Partial<IAdmin>): Promise<IAdmin | null> {
        return await Admin.findOneAndUpdate(
            { _id: id, isDeleted: false },
            { $set: updateData },
            { returnDocument: "after", runValidators: true },
        ).populate("role");
    }

    async updateRefreshToken(id: string, refreshToken: string | null): Promise<void> {
        await Admin.updateOne({ _id: id }, { $set: { refreshToken } });
    }

    async setPasswordResetToken(
        id: string,
        hashedToken: string | null,
        expiresAt: Date | null,
    ): Promise<void> {
        await Admin.updateOne(
            { _id: id },
            {
                $set: {
                    passwordResetToken: hashedToken,
                    passwordResetExpires: expiresAt,
                },
            },
        );
    }

    async updatePassword(id: string, hashedPassword: string): Promise<void> {
        await Admin.updateOne(
            { _id: id },
            {
                $set: {
                    password: hashedPassword,
                    passwordResetToken: null,
                    passwordResetExpires: null,
                    refreshToken: null,
                },
            },
        );
    }

    async softDelete(id: string): Promise<IAdmin | null> {
        return await Admin.findOneAndUpdate(
            { _id: id, isDeleted: false },
            { $set: { isDeleted: true, deletedAt: new Date() } },
            { returnDocument: "after" },
        );
    }
}
