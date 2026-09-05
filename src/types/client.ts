import { TGetPontoConexao, TTipoEndereco } from "./connectionPoint";
import { PaginationParams } from "./request";

export type TClienteFilters = PaginationParams & {
  busca?: string; // nome, cpf ou login MikroTik
  situacao?: TClienteStatus;
  tipoEndereco?: TTipoEndereco;
};

export type TClienteStatus = "ATIVO" | "SUSPENSO" | "INATIVO";

export type TGetCliente = {
  id: string;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  status: TClienteStatus;
  pontos: TGetPontoConexao[];
};
