import { Request, Response } from "express";
import { CustomerService } from "../services/customer.service.js";
import { CustomerTransformer } from "../transformers/customer.transformer.js";
import { createdResponse, successResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const customerService = new CustomerService();

export class CustomerController {
    createCustomer = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const avatar = req.file ? `/uploads/${req.file.filename}` : req.body.avatar;
        const newCustomer = await customerService.createCustomer({
            ...req.body,
            ...(avatar && { avatar }),
        });
        createdResponse(res, "Customer created successfully", CustomerTransformer.transform(newCustomer));
    });

    getCustomerById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const id = req.params.id as string;
        const customer = await customerService.getCustomerById(id);
        successResponse(res, "Customer details retrieved", CustomerTransformer.transform(customer));
    });

    getAllCustomers = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const { docs, meta } = await customerService.getAllCustomers(req.query);
        successResponse(res, "Customers list retrieved successfully", CustomerTransformer.transformMany(docs), meta);
    });

    updateCustomer = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const id = req.params.id as string;
        const avatar = req.file ? `/uploads/${req.file.filename}` : req.body.avatar;
        const updatedCustomer = await customerService.updateCustomer(id, {
            ...req.body,
            ...(avatar && { avatar }),
        });
        successResponse(res, "Customer updated successfully", CustomerTransformer.transform(updatedCustomer));
    });

    updateCustomerStatus = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const id = req.params.id as string;
        const { status } = req.body;
        const updatedCustomer = await customerService.updateCustomerStatus(id, status);
        successResponse(res, `Customer status updated to ${status} successfully`, CustomerTransformer.transform(updatedCustomer));
    });

    deleteCustomer = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const id = req.params.id as string;
        await customerService.softDeleteCustomer(id);
        successResponse(res, "Customer soft-deleted successfully");
    });
}
