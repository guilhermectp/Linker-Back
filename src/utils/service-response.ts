export enum ServiceErrorCode {
  NOT_FOUND = "NOT_FOUND",
  CONFLICT = "CONFLICT",
  UNPROCESSABLE = "UNPROCESSABLE",
  INTERNAL_ERROR = "INTERNAL_ERROR",
}

export type TServiceResponse<T = any> =
  | { success: true; statusCode: 200 | 201; data: T }
  | {
      success: false;
      statusCode: number;
      error: { code: ServiceErrorCode; message: string };
    };

export const serviceSuccess = <T>(
  data: T,
  created = false,
): TServiceResponse<T> => ({
  success: true,
  statusCode: created ? 201 : 200,
  data,
});

export const serviceError = (
  code: ServiceErrorCode,
  message: string,
): TServiceResponse<never> => {
  const statusMap: Record<ServiceErrorCode, number> = {
    [ServiceErrorCode.NOT_FOUND]: 404,
    [ServiceErrorCode.CONFLICT]: 409,
    [ServiceErrorCode.UNPROCESSABLE]: 422,
    [ServiceErrorCode.INTERNAL_ERROR]: 500,
  };

  return {
    success: false,
    statusCode: statusMap[code],
    error: { code, message },
  };
};
