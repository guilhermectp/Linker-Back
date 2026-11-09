import {
  TGetPontoConexao,
  TPontoConexaoStatus,
  TTipoEndereco,
} from "./connectionPoint";
import { PaginationParams } from "./request";

export type TClienteFilters = PaginationParams & {
  busca?: string; // nome, cpf ou login MikroTik
  situacao?: TPontoConexaoStatus;
  tipoEndereco?: TTipoEndereco;
};

export type TGetCliente = {
  id: string;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  pontos: TGetPontoConexao[];
};
