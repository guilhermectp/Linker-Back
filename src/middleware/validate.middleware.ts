import { Request, Response, NextFunction } from "express";
import * as z from "zod";
import { ServiceErrorCode } from "../utils/send-response";

export const validate = (schema: z.ZodTypeAny) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(422).json({
          code: ServiceErrorCode.UNPROCESSABLE,
          message: error.issues.map((err) => err.message).join(", "),
        });
      }

      return res.status(500).json({
        code: ServiceErrorCode.INTERNAL_ERROR,
        message: "Erro interno no servidor.",
      });
    }
  };
};
