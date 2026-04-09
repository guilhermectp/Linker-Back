import * as z from "zod";

const enderecoBaseSchema = z.object({
  complemento: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

const urbanAddressSchema = enderecoBaseSchema.extend({
  tipoEndereco: z.literal("URBANO"),
  cep: z.string().length(10, "CEP deve conter 8 dígitos"),
  cidade: z.string().min(2, "Cidade é obrigatória"),
  bairro: z.string().min(2, "Bairro é obrigatório"),
  rua: z.string().min(2, "Rua é obrigatório"),
  numero: z.number().int().positive("Número inválido"),
});

const ruralAddressSchema = enderecoBaseSchema.extend({
  tipoEndereco: z.literal("RURAL"),
  nomeLocal: z.string().min(2, "Nome do local é obrigatório"),
  cidadeReferencia: z
    .string()
    .min(2, "Referência de proximidade é obrigatório"),
});

const createEnderecoSchema = z.discriminatedUnion("tipoEndereco", [
  urbanAddressSchema,
  ruralAddressSchema,
]);

const updateEnderecoSchema = z.union([
  urbanAddressSchema,
  ruralAddressSchema,
  enderecoBaseSchema,
]);

const planBaseSchema = z.object({
  planoId: z.uuid("Plano inválido"),
  diaVencimento: z.number().int().min(1).max(31),
  loginMK: z.string().min(8, "O login deve ter pelo menos 8 caracteres"),
});

export const createConnectionPointSchema = z.object({
  ponto: z.object({
    ...planBaseSchema.shape,
    senhaMK: z.string().min(8, "A senha deve ter pelo menos 8 caracteres"),
    endereco: createEnderecoSchema,
  }),
});

export const updateConnectionPointSchema = z.object({
  ponto: z
    .object({
      ...planBaseSchema.shape,
      endereco: updateEnderecoSchema,
    })
    .partial(),
});

export type TCreateConnectionPoint = z.infer<
  typeof createConnectionPointSchema
>;
export type TUpdateConnectionPoint = z.infer<
  typeof updateConnectionPointSchema
>;
