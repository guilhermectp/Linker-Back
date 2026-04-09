import * as z from "zod";
import { createConnectionPointSchema } from "./pointConnection.schema";

const infoSchema = z.object({
  nome: z.string().trim().min(2, "Nome é obrigatório"),
  cpf: z.string().length(14, "O CPF deve ter 11 dígitos"),
  email: z.email("E-mail inválido"),
  telefone: z.string().length(15, "O telefone deve conter 10 dígitos"),
  senhaCentralCliente: z
    .string()
    .min(8, "A senha deve ter pelo menos 8 caracteres"),
});

export const createClientSchema = z.object({
  ...infoSchema.shape,
  ...createConnectionPointSchema.shape,
});

export const updatePersonalInfoSchema = z.object({
  nome: z.string().trim().min(2, "Nome é obrigatório").optional(),
  email: z.email("E-mail inválido").optional(),
  telefone: z
    .string()
    .length(15, "O telefone deve conter 10 dígitos")
    .optional(),
});

export const updateCustomerCentralPasswordSchema = z.object({
  senhaCentralCliente: z
    .string()
    .min(8, "A senha deve ter pelo menos 8 caracteres"),
});

export type TCreateClient = z.infer<typeof createClientSchema>;
export type TUpdateClientPersonalInfo = z.infer<
  typeof updatePersonalInfoSchema
>;
export type TUpdateCustomerCentralPassword = z.infer<
  typeof updateCustomerCentralPasswordSchema
>;
