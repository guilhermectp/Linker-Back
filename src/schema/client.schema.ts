import * as z from "zod";
import { connectionPointFullSchema } from "./connectionPoint.schema";

export const clientCreateInfoSchema = z.object({
  cpf: z.string().length(14, "O CPF deve ter 11 dígitos"),
  nome: z.string().trim().min(2, "Nome é obrigatório"),
  email: z.email("E-mail inválido"),
  telefone: z.string().length(15, "O telefone deve conter 10 dígitos"),
  senhaCentralCliente: z
    .string()
    .min(8, "A senha deve ter pelo menos 8 caracteres"),
});

export const clientCreateFullSchema = z.object({
  ...clientCreateInfoSchema.shape,
  ...connectionPointFullSchema.shape,
});

export const clientUpdateInfoSchema = z.object({
  nome: z.string().trim().min(2, "Nome é obrigatório").optional(),
  email: z.email("E-mail inválido").optional(),
  telefone: z
    .string()
    .length(15, "O telefone deve conter 10 dígitos")
    .optional(),
});

export const clientUpdatePasswordSchema = z.object({
  senhaCentralCliente: z
    .string()
    .min(8, "A senha deve ter pelo menos 8 caracteres"),
});

export type TClientCreate = z.infer<typeof clientCreateFullSchema>;
export type TClientUpdateInfo = z.infer<typeof clientUpdateInfoSchema>;
export type TClientUpdatePassword = z.infer<typeof clientUpdatePasswordSchema>;
