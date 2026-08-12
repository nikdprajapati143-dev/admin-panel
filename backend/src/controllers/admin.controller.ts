import { Request, Response } from "express";
import { AdminService } from "../services/admin.service.js";
import { AdminTransformer } from "../transformers/admin.transformer.js";
import { createdResponse, successResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const adminService = new AdminService();

export class AdminController {
    createAdmin = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const avatar = req.file ? `/uploads/${req.file.filename}` : req.body.avatar;
        const currentUserRoleName = req.user!.role.name;
        const newAdmin = await adminService.createAdmin(
            {
                ...req.body,
                ...(avatar && { avatar }),
            },
            currentUserRoleName,
        );
        createdResponse(res, "Admin created successfully", AdminTransformer.transform(newAdmin));
    });

    getAdminById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const id = req.params.id as string;
        const currentUserRoleName = req.user!.role.name;
        const admin = await adminService.getAdminById(id, currentUserRoleName);
        successResponse(res, "Admin details retrieved", AdminTransformer.transform(admin));
    });

    getAllAdmins = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const currentUserRoleName = req.user!.role.name;
        const { docs, meta } = await adminService.getAllAdmins(req.query, currentUserRoleName);
        successResponse(res, "Admins list retrieved successfully", AdminTransformer.transformMany(docs), meta);
    });

    updateAdmin = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const id = req.params.id as string;
        const avatar = req.file ? `/uploads/${req.file.filename}` : req.body.avatar;
        const currentUserRoleName = req.user!.role.name;
        const updatedAdmin = await adminService.updateAdmin(
            id,
            {
                ...req.body,
                ...(avatar && { avatar }),
            },
            currentUserRoleName,
        );
        successResponse(res, "Admin updated successfully", AdminTransformer.transform(updatedAdmin));
    });

    deleteAdmin = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const id = req.params.id as string;
        const currentAdminId = req.user!._id.toString();
        const currentUserRoleName = req.user!.role.name;
        await adminService.softDeleteAdmin(id, currentAdminId, currentUserRoleName);
        successResponse(res, "Admin soft-deleted successfully");
    });
}
