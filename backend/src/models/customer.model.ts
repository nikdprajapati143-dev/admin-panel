import { Document, Schema, model } from "mongoose";
import { DEFAULT_AVATAR } from "./admin.model.js";

export enum CustomerStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
}

export interface ICustomer extends Document {
    firstName: string;
    lastName: string;
    email: string;
    countryCode: string;
    phone: string;
    avatar: string;
    status: CustomerStatus;
    isDeleted: boolean;
    deletedAt?: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

const customerSchema = new Schema<ICustomer>(
    {
        firstName: {
            type: String,
            required: [true, "First name is required"],
            trim: true,
        },
        lastName: {
            type: String,
            required: [true, "Last name is required"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        countryCode: {
            type: String,
            default: "+965",
            trim: true,
        },
        phone: {
            type: String,
            required: [true, "Phone number is required"],
            trim: true,
        },
        avatar: {
            type: String,
            default: DEFAULT_AVATAR,
        },
        status: {
            type: String,
            enum: Object.values(CustomerStatus),
            default: CustomerStatus.ACTIVE,
        },
        isDeleted: {
            type: Boolean,
            default: false,
            index: true,
        },
        deletedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    },
);

export const Customer = model<ICustomer>("Customer", customerSchema);
