import * as z from "zod";

const urbanAddressSchema = z.object({
  tipoEndereco: z.literal("URBANO"),
  cep: z.string().length(10, "CEP deve conter 8 dígitos"),
  cidade: z.string().min(2, "Cidade é obrigatória"),
  bairro: z.string().min(2, "Bairro é obrigatório"),
  rua: z.string().min(2, "Rua é obrigatório"),
  numero: z.number().int().positive("Número inválido"),
  complemento: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

const ruralAddressSchema = z.object({
  tipoEndereco: z.literal("RURAL"),
  nomeLocal: z.string().min(2, "Nome do local é obrigatório"),
  cidadeReferencia: z
    .string()
    .min(2, "Referência de proximidade é obrigatório"),
  complemento: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

const addressSchema = z.object({
  ponto: z.object({
    endereco: z.discriminatedUnion("tipoEndereco", [
      urbanAddressSchema,
      ruralAddressSchema,
    ]),
  }),
});

const planSchema = z.object({
  ponto: z.object({
    planoId: z.uuid("Plano inválido"),
    diaVencimento: z
      .number()
      .int()
      .min(1, "Dia mínimo é 1")
      .max(31, "Dia máximo é 31"),
    loginMK: z.string().min(8, "O login deve ter pelo menos 8 caracteres"),
    senhaMK: z.string().min(8, "A senha deve ter pelo menos 8 caracteres"),
  }),
});

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
  ponto: z.object({
    ...planSchema.shape.ponto.shape,
    ...addressSchema.shape.ponto.shape,
  }),
});

export const updateClientSchema = z.object({
  nome: z.string().trim().min(2, "Nome é obrigatório"),
  cpf: z.string().length(14, "O CPF deve ter 11 dígitos"),
  email: z.email("E-mail inválido"),
  telefone: z.string().length(15, "O telefone deve conter 10 dígitos"),
});

export const updateConnectionPoint = z.object({
  ponto: z.object({
    ...planSchema.shape.ponto.shape,
    ...addressSchema.shape.ponto.shape,
  }),
});

export type TCreateClient = z.infer<typeof createClientSchema>;
export type TUpdateClientPersonalInfo = z.infer<typeof infoSchema>;
export type TUpdateClientConnectionPointPlan = z.infer<typeof planSchema>;
export type TUpdateClientConnectionPointAddress = z.infer<typeof addressSchema>;
