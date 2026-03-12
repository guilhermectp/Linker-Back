import axios, { AxiosRequestConfig } from "axios";

const mkClient = axios.create({
  baseURL: "http://192.168.15.2/rest",
  timeout: 5000,
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

    return response.data;
  } catch (error) {
    throw error;
  }
};
