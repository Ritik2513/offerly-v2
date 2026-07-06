import { ZodTypeAny, ZodError } from "zod";
import { Request, Response, NextFunction } from "express";
import ApiError from "../utils/ApiError.js";

const validate =
  (schema: ZodTypeAny) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      });

      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const errors: Record<string, string[]> = {};

        err.issues.forEach((issue) => {
          const field = issue.path[1] as string;

          if (!errors[field]) {
            errors[field] = [];
          }

          errors[field].push(issue.message);
        });

        return next(new ApiError(400, "Validation failed", errors));
      }

      next(err);
    }
  };

export default validate;
