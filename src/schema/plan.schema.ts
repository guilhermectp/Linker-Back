import * as z from "zod";

export const createPlanSchema = z.object({
  nome: z.string().trim().min(3, "Nome deve ter no mínimo 3 caracteres"),
  uploadMB: z
    .number()
    .positive("Upload deve ser maior que 0")
    .max(10000, "Upload não pode exceder 10000 MB"),
  downloadMB: z
    .number()
    .positive("Download deve ser maior que 0")
    .max(10000, "Download não pode exceder 10000 MB"),
  valor: z
    .number()
    .positive("Valor deve ser maior que 0")
    .max(999999.99, "Valor muito alto"),
  descricao: z.string().max(100, "Descrição muito longa").optional(),
});

export const updatePlanSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(3, "Nome deve ter no mínimo 3 caracteres")
    .optional(),
  uploadMB: z
    .number()
    .positive("Upload deve ser maior que 0")
    .max(10000, "Upload não pode exceder 10000 MB")
    .optional(),
  downloadMB: z
    .number()
    .positive("Download deve ser maior que 0")
    .max(10000, "Download não pode exceder 10000 MB")
    .optional(),
  valor: z
    .number()
    .positive("Valor deve ser maior que 0")
    .max(999999.99, "Valor muito alto")
    .optional(),
  descricao: z.string().max(100, "Descrição muito longa").optional(),
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
