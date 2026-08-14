import { Customer, ICustomer } from "../models/customer.model.js";
import { PaginationOptions } from "../utils/pagination.js";

export class CustomerRepository {
    async create(data: Partial<ICustomer>): Promise<ICustomer> {
        return await Customer.create(data);
    }

    async findById(id: string): Promise<ICustomer | null> {
        return await Customer.findOne({ _id: id, isDeleted: false });
    }

    async findByEmail(email: string): Promise<ICustomer | null> {
        return await Customer.findOne({ email: email.toLowerCase(), isDeleted: false });
    }

    async findAll(
        filter: Record<string, unknown> = {},
        pagination?: PaginationOptions,
    ): Promise<{ docs: ICustomer[]; totalDocs: number }> {
        const queryFilter = { ...filter, isDeleted: false };
        const totalDocs = await Customer.countDocuments(queryFilter);

        let query = Customer.find(queryFilter);

        if (pagination) {
            query = query
                .sort({ [pagination.sortBy]: pagination.sortOrder })
                .skip(pagination.skip)
                .limit(pagination.limit);
        }

        const docs = await query.exec();
        return { docs, totalDocs };
    }

    async update(id: string, updateData: Partial<ICustomer>): Promise<ICustomer | null> {
        return await Customer.findOneAndUpdate(
            { _id: id, isDeleted: false },
            { $set: updateData },
            { returnDocument: "after", runValidators: true },
        );
    }

    async softDelete(id: string): Promise<ICustomer | null> {
        return await Customer.findOneAndUpdate(
            { _id: id, isDeleted: false },
            { $set: { isDeleted: true, deletedAt: new Date() } },
            { returnDocument: "after" },
        );
    }
}
