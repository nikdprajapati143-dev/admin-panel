import { IRole } from "../models/role.model.js";
import { RoleRepository } from "../repositories/role.repository.js";
import { AppError } from "../utils/appError.js";
import { formatPaginatedMeta, getPaginationOptions, PaginationQuery } from "../utils/pagination.js";

const SYSTEM_ROLES = ["SUPER_ADMIN", "SUB_ADMIN"];

export class RoleService {
    private roleRepository: RoleRepository;

    constructor() {
        this.roleRepository = new RoleRepository();
    }

    async createRole(data: {
        name: string;
        description?: string;
        permissions: string[];
    }): Promise<IRole> {
        const uppercaseName = data.name.toUpperCase();
        const existingRole = await this.roleRepository.findByName(uppercaseName);

        if (existingRole) {
            throw new AppError(`Role '${uppercaseName}' already exists`, 409);
        }

        const rolePayload: Partial<IRole> = {
            name: uppercaseName,
            permissions: data.permissions,
        };

        if (data.description !== undefined) {
            rolePayload.description = data.description;
        }

        return await this.roleRepository.create(rolePayload);
    }

    async getRoleById(id: string): Promise<IRole> {
        const role = await this.roleRepository.findById(id);
        if (!role) {
            throw new AppError("Role not found", 404);
        }
        return role;
    }

    async getAllRoles(query: PaginationQuery): Promise<{ docs: IRole[]; meta: unknown }> {
        const pagination = getPaginationOptions(query, "createdAt");
        const filter: Record<string, unknown> = {};

        if (query.search) {
            filter.$or = [
                { name: { $regex: query.search, $options: "i" } },
                { description: { $regex: query.search, $options: "i" } },
            ];
        }

        const { docs, totalDocs } = await this.roleRepository.findAll(filter, pagination);
        const meta = formatPaginatedMeta(totalDocs, pagination.page, pagination.limit);

        return { docs, meta };
    }

    async updateRole(
        id: string,
        data: {
            name?: string;
            description?: string;
            permissions?: string[];
        },
    ): Promise<IRole> {
        const role = await this.roleRepository.findById(id);
        if (!role) {
            throw new AppError("Role not found", 404);
        }

        const updatePayload: Partial<IRole> = {};

        if (data.name) {
            const uppercaseName = data.name.toUpperCase();
            if (SYSTEM_ROLES.includes(role.name) && uppercaseName !== role.name) {
                throw new AppError(`Cannot rename system role '${role.name}'`, 400);
            }

            if (uppercaseName !== role.name) {
                const existing = await this.roleRepository.findByName(uppercaseName);
                if (existing) {
                    throw new AppError(`Role '${uppercaseName}' already exists`, 409);
                }
            }
            updatePayload.name = uppercaseName;
        }

        if (data.description !== undefined) {
            updatePayload.description = data.description;
        }

        if (data.permissions !== undefined) {
            updatePayload.permissions = data.permissions;
        }

        const updatedRole = await this.roleRepository.update(id, updatePayload);
        if (!updatedRole) {
            throw new AppError("Failed to update role", 400);
        }

        return updatedRole;
    }

    async softDeleteRole(id: string): Promise<void> {
        const role = await this.roleRepository.findById(id);
        if (!role) {
            throw new AppError("Role not found", 404);
        }

        if (SYSTEM_ROLES.includes(role.name)) {
            throw new AppError(`System role '${role.name}' cannot be deleted`, 400);
        }

        await this.roleRepository.softDelete(id);
    }
}
