import * as z from "zod";

export const createPlanSchema = z.object({
  nome: z
    .string("Nome do plano é obrigatório")
    .trim()
    .min(5, "Precisa ter ao menos 10 caracteres"),
  uploadMB: z
    .number("Velocidade de Upload é obrigatório")
    .positive("Upload deve ser maior que 0")
    .max(10000, "Upload não pode exceder 10000 MB"),
  downloadMB: z
    .number("Velocidade de Download é obrigatório")
    .positive("Upload deve ser maior que 0")
    .max(10000, "Upload não pode exceder 10000 MB"),
  descricao: z
    .string()
    .trim()
    .max(100, "Descrição muito longa")
    .nullish()
    .transform((v) => (v === "" || v == null ? null : v)),
  valor: z
    .number("Valor é obrigatório")
    .min(0, "Precisa ser ao menos 0")
    .max(999999.99, "Valor muito alto"),
});

export const updatePlanSchema = z.object({
  nome: z
    .string("Nome do plano é obrigatório")
    .trim()
    .min(5, "Precisa ter ao menos 10 caracteres")
    .optional(),
  uploadMB: z
    .number("Velocidade de Upload é obrigatório")
    .positive("Upload deve ser maior que 0")
    .max(10000, "Upload não pode exceder 10000 MB")
    .optional(),
  downloadMB: z
    .number("Velocidade de Download é obrigatório")
    .positive("Upload deve ser maior que 0")
    .max(10000, "Upload não pode exceder 10000 MB")
    .optional(),
  descricao: z
    .string()
    .trim()
    .max(100, "Descrição muito longa")
    .nullish()
    .transform((v) => (v === "" || v == null ? null : v))
    .optional(),
  valor: z
    .number("Valor é obrigatório")
    .min(0, "Precisa ser ao menos 0")
    .max(999999.99, "Valor muito alto")
    .optional(),
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
  comment?: string | null;
};
