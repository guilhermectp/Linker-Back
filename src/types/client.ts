import { TGetPontoConexao } from "./connectionPoint";

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
