import { PaginationParams } from "./request";

export type TPlan = {
  id: string;
  nome: string;
  uploadMB: number;
  downloadMB: number;
  valor: number;
  descricao?: string;
};

export type TPlanFilters = PaginationParams & {
  busca?: string; // nome
};
