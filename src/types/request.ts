export interface PaginationParams {
  pagina?: number;
  itemsPorPagina?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    pagina: number;
    itemsPorPagina: number;
    total: number;
  };
}
