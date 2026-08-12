import { Document, Schema, Types, model } from "mongoose";

export enum AdminStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
}

export const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

export interface IAdmin extends Document {
    name: string;
    email: string;
    avatar: string;
    password?: string;
    role: Types.ObjectId;
    status: AdminStatus;
    refreshToken?: string | null;
    passwordResetToken?: string | null;
    passwordResetExpires?: Date | null;
    isDeleted: boolean;
    deletedAt?: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

const adminSchema = new Schema<IAdmin>(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
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
        avatar: {
            type: String,
            default: DEFAULT_AVATAR,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            select: false,
        },
        role: {
            type: Schema.Types.ObjectId,
            ref: "Role",
            required: [true, "Role is required"],
            index: true,
        },
        status: {
            type: String,
            enum: Object.values(AdminStatus),
            default: AdminStatus.ACTIVE,
        },
        refreshToken: {
            type: String,
            select: false,
            default: null,
        },
        passwordResetToken: {
            type: String,
            select: false,
            default: null,
        },
        passwordResetExpires: {
            type: Date,
            select: false,
            default: null,
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

export const Admin = model<IAdmin>("Admin", adminSchema);
