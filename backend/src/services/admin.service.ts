import { AdminStatus, DEFAULT_AVATAR, IAdmin } from "../models/admin.model.js";
import { IRole } from "../models/role.model.js";
import { AdminRepository } from "../repositories/admin.repository.js";
import { RoleRepository } from "../repositories/role.repository.js";
import { AppError } from "../utils/appError.js";
import { formatPaginatedMeta, getPaginationOptions, PaginationQuery } from "../utils/pagination.js";
import { hashPassword } from "../utils/password.js";

export class AdminService {
    private adminRepository: AdminRepository;
    private roleRepository: RoleRepository;

    constructor() {
        this.adminRepository = new AdminRepository();
        this.roleRepository = new RoleRepository();
    }

    async createAdmin(
        data: {
            name: string;
            email: string;
            password: string;
            role: string;
            avatar?: string;
            status?: AdminStatus;
        },
        currentUserRoleName: string,
    ): Promise<IAdmin> {
        const role = await this.roleRepository.findById(data.role);
        if (!role) {
            throw new AppError("Specified role does not exist", 404);
        }

        if (role.name === "SUPER_ADMIN" && currentUserRoleName !== "SUPER_ADMIN") {
            throw new AppError("You are not authorized to assign the Super Admin role", 403);
        }

        const existingEmail = await this.adminRepository.findByEmail(data.email);
        if (existingEmail) {
            throw new AppError("Admin with this email already exists", 409);
        }

        const hashedPassword = await hashPassword(data.password);

        const newAdmin = await this.adminRepository.create({
            name: data.name,
            email: data.email,
            password: hashedPassword,
            role: role._id as any,
            avatar: data.avatar || DEFAULT_AVATAR,
            status: data.status || AdminStatus.ACTIVE,
        });

        const adminObj = newAdmin.toObject();
        delete adminObj.password;

        return adminObj as unknown as IAdmin;
    }

    async getAdminById(id: string, currentUserRoleName: string): Promise<IAdmin> {
        const admin = await this.adminRepository.findById(id);
        if (!admin) {
            throw new AppError("Admin not found", 404);
        }

        const targetRole = admin.role as unknown as IRole;
        if (targetRole && targetRole.name === "SUPER_ADMIN" && currentUserRoleName !== "SUPER_ADMIN") {
            throw new AppError("You are not authorized to view or modify Super Admin accounts", 403);
        }

        return admin;
    }

    async getAllAdmins(
        query: PaginationQuery,
        currentUserRoleName: string,
    ): Promise<{ docs: IAdmin[]; meta: unknown }> {
        const pagination = getPaginationOptions(query, "createdAt");
        const filter: Record<string, unknown> = {};

        // Non-super admins cannot view super admin accounts in the list
        if (currentUserRoleName !== "SUPER_ADMIN") {
            const superAdminRole = await this.roleRepository.findByName("SUPER_ADMIN");
            if (superAdminRole) {
                filter.role = { $ne: superAdminRole._id };
            }
        }

        if (query.search) {
            filter.$or = [
                { name: { $regex: query.search, $options: "i" } },
                { email: { $regex: query.search, $options: "i" } },
            ];
        }

        const { docs, totalDocs } = await this.adminRepository.findAll(filter, pagination);
        const meta = formatPaginatedMeta(totalDocs, pagination.page, pagination.limit);

        return { docs, meta };
    }

    async updateAdmin(
        id: string,
        data: {
            name?: string;
            email?: string;
            role?: string;
            avatar?: string;
            status?: AdminStatus;
        },
        currentUserRoleName: string,
    ): Promise<IAdmin> {
        const admin = await this.adminRepository.findById(id);
        if (!admin) {
            throw new AppError("Admin not found", 404);
        }

        const targetRole = admin.role as unknown as IRole;
        if (targetRole && targetRole.name === "SUPER_ADMIN" && currentUserRoleName !== "SUPER_ADMIN") {
            throw new AppError("You are not authorized to view or modify Super Admin accounts", 403);
        }

        const updatePayload: Partial<IAdmin> = {};

        if (data.email && data.email.toLowerCase() !== admin.email.toLowerCase()) {
            const existingEmail = await this.adminRepository.findByEmail(data.email);
            if (existingEmail) {
                throw new AppError("Admin with this email already exists", 409);
            }
            updatePayload.email = data.email.toLowerCase();
        }

        if (data.role) {
            const role = await this.roleRepository.findById(data.role);
            if (!role) {
                throw new AppError("Specified role does not exist", 404);
            }
            if (role.name === "SUPER_ADMIN" && currentUserRoleName !== "SUPER_ADMIN") {
                throw new AppError("You are not authorized to assign the Super Admin role", 403);
            }
            updatePayload.role = role._id as any;
        }

        if (data.name !== undefined) updatePayload.name = data.name;
        if (data.avatar !== undefined) updatePayload.avatar = data.avatar;
        if (data.status !== undefined) updatePayload.status = data.status;

        const updated = await this.adminRepository.update(id, updatePayload);
        if (!updated) {
            throw new AppError("Failed to update admin", 400);
        }

        return updated;
    }

    async softDeleteAdmin(
        id: string,
        currentAdminId: string,
        currentUserRoleName: string,
    ): Promise<void> {
        if (id === currentAdminId) {
            throw new AppError("You cannot soft-delete your own account", 400);
        }

        const admin = await this.adminRepository.findById(id);
        if (!admin) {
            throw new AppError("Admin not found", 404);
        }

        const targetRole = admin.role as unknown as IRole;
        if (targetRole && targetRole.name === "SUPER_ADMIN" && currentUserRoleName !== "SUPER_ADMIN") {
            throw new AppError("You are not authorized to view or modify Super Admin accounts", 403);
        }

        await this.adminRepository.softDelete(id);
    }
}
