import axios, { AxiosRequestConfig } from "axios";

const mkClient = axios.create({
  baseURL: "http://192.168.0.200/rest",
  auth: {
    username: "admin",
    password: "",
  },
  headers: {
    "Content-Type": "application/json",
  },
});

export const useApi = async (
  path: string,
  options: AxiosRequestConfig = {},
) => {
  try {
    const response = await mkClient({
      url: path,
      ...options,
    });

    return { data: response.data, error: null };
  } catch (error: any) {
    const status = error?.response?.status;
    const statusText = error?.response?.statusText;
    const message =
      error?.response?.data?.message || error?.message || "Erro desconhecido";

    return {
      data: null,
      error: {
        status,
        statusText,
        message,
        raw: error,
      },
    };
  }
};
