import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod/v3";

export const validate = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          error: {
            message: "Erro de validação",
            details: error.errors.map((err) => ({
              field: err.path.join("."),
              message: err.message,
            })),
          },
        });
      }

      return res.status(500).json({
        success: false,
        error: { message: "Erro interno no servidor" },
      });
    }
  };
};
