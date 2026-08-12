import { DEFAULT_AVATAR } from "../models/admin.model.js";
import { CustomerStatus, ICustomer } from "../models/customer.model.js";
import { CustomerRepository } from "../repositories/customer.repository.js";
import { AppError } from "../utils/appError.js";
import { formatPaginatedMeta, getPaginationOptions, PaginationQuery } from "../utils/pagination.js";

export interface CustomerFilterQuery extends PaginationQuery {
    status?: CustomerStatus;
}

export class CustomerService {
    private customerRepository: CustomerRepository;

    constructor() {
        this.customerRepository = new CustomerRepository();
    }

    async createCustomer(data: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        countryCode?: string;
        avatar?: string;
        status?: CustomerStatus;
    }): Promise<ICustomer> {
        const existingEmail = await this.customerRepository.findByEmail(data.email);
        if (existingEmail) {
            throw new AppError("Customer with this email address already exists", 409);
        }

        const customerPayload: Partial<ICustomer> = {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email.toLowerCase(),
            countryCode: data.countryCode || "+965",
            phone: data.phone,
            avatar: data.avatar || DEFAULT_AVATAR,
            status: data.status || CustomerStatus.ACTIVE,
        };

        return await this.customerRepository.create(customerPayload);
    }

    async getCustomerById(id: string): Promise<ICustomer> {
        const customer = await this.customerRepository.findById(id);
        if (!customer) {
            throw new AppError("Customer not found", 404);
        }
        return customer;
    }

    async getAllCustomers(query: CustomerFilterQuery): Promise<{ docs: ICustomer[]; meta: unknown }> {
        const pagination = getPaginationOptions(query, "createdAt");
        const filter: Record<string, unknown> = {};

        if (query.status) {
            filter.status = query.status;
        }

        if (query.search) {
            filter.$or = [
                { firstName: { $regex: query.search, $options: "i" } },
                { lastName: { $regex: query.search, $options: "i" } },
                { email: { $regex: query.search, $options: "i" } },
                { phone: { $regex: query.search, $options: "i" } },
            ];
        }

        const { docs, totalDocs } = await this.customerRepository.findAll(filter, pagination);
        const meta = formatPaginatedMeta(totalDocs, pagination.page, pagination.limit);

        return { docs, meta };
    }

    async updateCustomer(
        id: string,
        data: {
            firstName?: string;
            lastName?: string;
            email?: string;
            phone?: string;
            countryCode?: string;
            avatar?: string;
            status?: CustomerStatus;
        },
    ): Promise<ICustomer> {
        const customer = await this.customerRepository.findById(id);
        if (!customer) {
            throw new AppError("Customer not found", 404);
        }

        const updatePayload: Partial<ICustomer> = {};

        if (data.email && data.email.toLowerCase() !== customer.email.toLowerCase()) {
            const existingEmail = await this.customerRepository.findByEmail(data.email);
            if (existingEmail) {
                throw new AppError("Customer with this email address already exists", 409);
            }
            updatePayload.email = data.email.toLowerCase();
        }

        if (data.firstName !== undefined) updatePayload.firstName = data.firstName;
        if (data.lastName !== undefined) updatePayload.lastName = data.lastName;
        if (data.countryCode !== undefined) updatePayload.countryCode = data.countryCode;
        if (data.phone !== undefined) updatePayload.phone = data.phone;
        if (data.avatar !== undefined) updatePayload.avatar = data.avatar;
        if (data.status !== undefined) updatePayload.status = data.status;

        const updatedCustomer = await this.customerRepository.update(id, updatePayload);
        if (!updatedCustomer) {
            throw new AppError("Failed to update customer", 400);
        }

        return updatedCustomer;
    }

    async softDeleteCustomer(id: string): Promise<void> {
        const customer = await this.customerRepository.findById(id);
        if (!customer) {
            throw new AppError("Customer not found", 404);
        }

        await this.customerRepository.softDelete(id);
    }
}
