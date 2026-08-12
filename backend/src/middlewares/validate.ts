import { NextFunction, Request, Response } from "express";
import { ZodError, ZodSchema } from "zod";

export const validate = (schema: ZodSchema) => {
    return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
        try {
            const parsed = (await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
                cookies: req.cookies,
            })) as Record<string, any>;

            if (parsed.body !== undefined) {
                req.body = parsed.body;
            }

            if (parsed.query !== undefined && req.query) {
                Object.assign(req.query, parsed.query);
            }

            if (parsed.params !== undefined && req.params) {
                Object.assign(req.params, parsed.params);
            }

            next();
        } catch (error) {
            if (error instanceof ZodError) {
                return next(error);
            }
            next(error);
        }
    };
};
