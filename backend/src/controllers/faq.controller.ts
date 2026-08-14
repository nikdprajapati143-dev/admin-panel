import { Request, Response } from "express";
import { FaqService } from "../services/faq.service.js";
import { FaqTransformer } from "../transformers/faq.transformer.js";
import { createdResponse, successResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const faqService = new FaqService();

export class FaqController {
    createFaq = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const newFaq = await faqService.createFaq(req.body);
        createdResponse(res, "FAQ created successfully", FaqTransformer.transform(newFaq));
    });

    getFaqById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const id = req.params.id as string;
        const faq = await faqService.getFaqById(id);
        successResponse(res, "FAQ details retrieved", FaqTransformer.transform(faq));
    });

    getAllFaqs = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const { docs, meta } = await faqService.getAllFaqs(req.query);
        successResponse(res, "FAQs list retrieved successfully", FaqTransformer.transformMany(docs), meta);
    });

    updateFaq = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const id = req.params.id as string;
        const updatedFaq = await faqService.updateFaq(id, req.body);
        successResponse(res, "FAQ updated successfully", FaqTransformer.transform(updatedFaq));
    });

    updateFaqStatus = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const id = req.params.id as string;
        const { status } = req.body;
        const updatedFaq = await faqService.updateFaqStatus(id, status);
        successResponse(res, `FAQ status updated to ${status} successfully`, FaqTransformer.transform(updatedFaq));
    });

    deleteFaq = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const id = req.params.id as string;
        await faqService.softDeleteFaq(id);
        successResponse(res, "FAQ soft-deleted successfully");
    });

    getCategories = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
        const categories = await faqService.getCategories();
        successResponse(res, "FAQ categories retrieved", categories);
    });
}
