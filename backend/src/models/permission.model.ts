import { Document, Schema, model } from "mongoose";

export interface IPermission extends Document {
    name: string;
    code: string;
    module: string;
    description?: string;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const permissionSchema = new Schema<IPermission>(
    {
        name: {
            type: String,
            required: [true, "Permission name is required"],
            trim: true,
        },
        code: {
            type: String,
            required: [true, "Permission code is required"],
            unique: true,
            trim: true,
        },
        module: {
            type: String,
            required: [true, "Permission module is required"],
            trim: true,
            uppercase: true,
        },
        description: {
            type: String,
            trim: true,
        },
        isDeleted: {
            type: Boolean,
            default: false,
            index: true,
        },
    },
    {
        timestamps: true,
    },
);

export const Permission = model<IPermission>("Permission", permissionSchema);
