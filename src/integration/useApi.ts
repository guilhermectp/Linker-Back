import axios, { AxiosRequestConfig } from "axios";
import dotenv from "dotenv";
dotenv.config();

const MICROTIK_IP = process.env.MICROTIK_IP;

const mkClient = axios.create({
  baseURL: `http://${MICROTIK_IP}/rest`,
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
