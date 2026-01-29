export enum ServiceResponseType {
  SUCCESS = "SUCCESS",
  CREATED = "CREATED",
  NOT_FOUND = "NOT_FOUND",
  CONFLICT = "CONFLICT",
  UNPROCESSABLE = "UNPROCESSABLE",
  INTERNAL_ERROR = "INTERNAL_ERROR",
}

export interface TServiceResponse<T = any> {
  type: ServiceResponseType;
  data?: T;
  error?: string | any;
}

export const mapHttpStatus = (type: ServiceResponseType): number => {
  const statusMap: Record<ServiceResponseType, number> = {
    [ServiceResponseType.SUCCESS]: 200,
    [ServiceResponseType.CREATED]: 201,
    [ServiceResponseType.NOT_FOUND]: 404,
    [ServiceResponseType.CONFLICT]: 409,
    [ServiceResponseType.UNPROCESSABLE]: 422,
    [ServiceResponseType.INTERNAL_ERROR]: 500,
  };
  return statusMap[type] || 500;
};
