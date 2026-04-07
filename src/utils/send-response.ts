export enum ServiceErrorCode {
  BAD_REQUEST = "BAD_REQUEST",
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",
  NOT_FOUND = "NOT_FOUND",
  CONFLICT = "CONFLICT",
  UNPROCESSABLE = "UNPROCESSABLE",
  INTERNAL_ERROR = "INTERNAL_ERROR",
}

const statusMap: Record<ServiceErrorCode, number> = {
  [ServiceErrorCode.BAD_REQUEST]: 400,
  [ServiceErrorCode.UNAUTHORIZED]: 401,
  [ServiceErrorCode.FORBIDDEN]: 403,
  [ServiceErrorCode.NOT_FOUND]: 404,
  [ServiceErrorCode.CONFLICT]: 409,
  [ServiceErrorCode.UNPROCESSABLE]: 422,
  [ServiceErrorCode.INTERNAL_ERROR]: 500,
};

export type TSuccessResponse<T> = {
  statusCode: 200 | 201;
  data: T;
};

export type TErrorResponse = {
  statusCode: number;
  code: ServiceErrorCode;
  message: string;
};

export type TServiceResponse<T = unknown> =
  | TSuccessResponse<T>
  | TErrorResponse;

export const serviceSuccess = <T>(
  data: T,
  created = false,
): TSuccessResponse<T> => ({
  statusCode: created ? 201 : 200,
  data,
});

export const serviceError = (
  code: ServiceErrorCode,
  message: string,
): TErrorResponse => ({
  statusCode: statusMap[code],
  code,
  message,
});

import { Response } from "express";

export const sendResponse = <T>(res: Response, result: TServiceResponse<T>) => {
  if ("data" in result) return res.status(result.statusCode).json(result.data);

  return res.status(result.statusCode).json(result);
};
