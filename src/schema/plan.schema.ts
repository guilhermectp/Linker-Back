import z from "zod/v3";

export const createPlanSchema = z.object({
  nome: z
    .string({
      required_error: "Nome é obrigatório",
      invalid_type_error: "Nome deve ser uma string",
    })
    .min(3, "Nome deve ter no mínimo 3 caracteres")
    .max(50, "Nome deve ter no máximo 50 caracteres")
    .trim(),

  uploadMB: z
    .number({
      required_error: "Upload é obrigatório",
      invalid_type_error: "Upload deve ser um número",
    })
    .positive("Upload deve ser maior que 0")
    .max(10000, "Upload não pode exceder 10000 MB"),

  downloadMB: z
    .number({
      required_error: "Download é obrigatório",
      invalid_type_error: "Download deve ser um número",
    })
    .positive("Download deve ser maior que 0")
    .max(10000, "Download não pode exceder 10000 MB"),

  valor: z
    .number({
      required_error: "Valor é obrigatório",
      invalid_type_error: "Valor deve ser um número",
    })
    .positive("Valor deve ser maior que 0")
    .max(999999.99, "Valor muito alto"),

  descricao: z.string().max(500, "Descrição muito longa").optional(),
});

export const updatePlanSchema = z.object({
  nome: z.string().min(3).max(50).trim(),
  uploadMB: z.number().positive().max(10000).optional(),
  downloadMB: z.number().positive().max(10000).optional(),
  valor: z.number().positive().max(999999.99).optional(),
  descricao: z.string().max(500).optional(),
});

export const deletePlanSchema = z.object({
  nome: z.string().min(3).max(50).trim(),
});

export type TCreatePlanInput = z.infer<typeof createPlanSchema>;
export type TUpdatePlanInput = z.infer<typeof updatePlanSchema>;
export type TDeletePlanInput = z.infer<typeof deletePlanSchema>;

export type TMikrotikPlan = {
  name: string;
  "rate-limit": string;
  comment?: string;
};
