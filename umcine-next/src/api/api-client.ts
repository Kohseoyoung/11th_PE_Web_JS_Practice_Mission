import ky from "ky";
import { env } from "../config/env";

console.log("apiBaseUrl:", env.apiBaseUrl); // 확인용

export const apiClient = ky.create({ baseUrl: env.apiBaseUrl });