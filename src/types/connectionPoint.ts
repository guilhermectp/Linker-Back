import { TPlan } from "./plan";

export type TPontoConexaoStatus =
  | "ATIVO"
  | "REDUZIDO"
  | "BLOQUEADO"
  | "CANCELADO";

type TTipoEndereco = "URBANO" | "RURAL";

type TEnderecoBase = {
  tipoEndereco: TTipoEndereco;
  latitude?: number;
  longitude?: number;
  complemento?: string;
};

type TEnderecoUrbano = TEnderecoBase & {
  tipoEndereco: "URBANO";
  cep: string;
  cidade: string;
  bairro: string;
  rua: string;
  numero: number;
};

type TEnderecoRural = TEnderecoBase & {
  tipoEndereco: "RURAL";
  cidadeReferencia: string;
  nomeLocal: string;
};

export type TGetPontoConexao = {
  id: string;
  status: TPontoConexaoStatus;
  diaVencimento: number;
  diaUltimoPagamento: string;
  loginMK: string;
  plano: TPlan;
  endereco: TEnderecoUrbano | TEnderecoRural;
};
