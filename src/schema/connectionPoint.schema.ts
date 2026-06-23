import * as z from "zod";

const urbanAddressSchema = z.object({
  tipoEndereco: z.literal("URBANO"),
  cep: z.string().length(10, "CEP deve conter 8 dígitos"),
  cidade: z.string().min(2, "Cidade é obrigatória"),
  bairro: z.string().min(2, "Bairro é obrigatório"),
  rua: z.string().min(2, "Rua é obrigatório"),
  numero: z.number("Número inválido").int().positive("Número inválido"),
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

export const connectionPointAddressSchema = z.discriminatedUnion(
  "tipoEndereco",
  [urbanAddressSchema, ruralAddressSchema],
);

export const connectionPointPlanSchema = z.object({
  planoId: z.uuid("Plano inválido"),
  diaVencimento: z.number().int().min(1).max(31),
});

export const connectionPointMicrotikSchema = z.object({
  loginMK: z.string().min(8, "O login deve ter pelo menos 8 caracteres"),
  senhaMK: z.string().min(8, "A senha deve ter pelo menos 8 caracteres"),
});

export const connectionPointUpdateMicrotikSchema = z.object({
  loginMK: z
    .string()
    .trim()
    .min(8, "O login deve ter pelo menos 8 caracteres")
    .optional(),
  senhaMK: z
    .union([
      z.string().min(8, "A senha deve ter pelo menos 8 caracteres"),
      z.literal(""),
    ])
    .optional(),
});

export const connectionPointFullSchema = z.object({
  plano: connectionPointPlanSchema,
  microtik: connectionPointMicrotikSchema,
  endereco: connectionPointAddressSchema,
});

export type TConnectionPointCreate = z.infer<typeof connectionPointFullSchema>;

// Para criar e atualizar
export type TConnectionPointPlan = z.infer<typeof connectionPointPlanSchema>;

export type TConnectionPointAddress = z.infer<
  typeof connectionPointAddressSchema
>;

export type TConnectionPointMicrotik = z.infer<
  typeof connectionPointMicrotikSchema
>;
