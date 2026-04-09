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

export type TResPontoConexao = {
  id: string;
  status: TPontoConexaoStatus;
  diaVencimento: number;
  dataUltimoPagamento: Date | null;
  loginMk: string;
  senhaMk: string;
  clienteId: string;
  planoId: string;
  tipoEndereco: string;
  cep: string | null;
  cidade: string | null;
  bairro: string | null;
  rua: string | null;
  numero: string | null;
  nomeLocal: string | null;
  cidadeRefencia: string | null;
  complemento: string | null;
  latitude: number | null;
  longitude: number | null;
  createdAt: Date;
  updatedAt: Date;
};
