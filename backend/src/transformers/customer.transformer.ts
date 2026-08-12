import { ICustomer } from "../models/customer.model.js";

export class CustomerTransformer {
    static transform(customer: ICustomer | Record<string, any>) {
        if (!customer) return null;
        const obj = typeof (customer as any).toObject === "function" ? (customer as any).toObject() : customer;
        return {
            id: obj._id ? obj._id.toString() : obj.id,
            _id: obj._id ? obj._id.toString() : obj.id,
            firstName: obj.firstName,
            lastName: obj.lastName,
            email: obj.email,
            countryCode: obj.countryCode || "+965",
            phone: obj.phone,
            avatar: obj.avatar,
            status: obj.status,
            isDeleted: obj.isDeleted ?? false,
            deletedAt: obj.deletedAt || null,
            createdAt: obj.createdAt,
            updatedAt: obj.updatedAt,
        };
    }

    static transformMany(customers: (ICustomer | Record<string, any>)[]) {
        return customers.map((customer) => this.transform(customer));
    }
}
