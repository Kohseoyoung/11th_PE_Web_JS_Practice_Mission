import { apiClient } from "../api-client";

export interface CheckNicknameDuplicateResponse {
  available: boolean;
}

export function checkNicknameDuplicate(nickname: string) {
  return apiClient
    .get(`members/nickname/${encodeURIComponent(nickname)}`)
    .json<CheckNicknameDuplicateResponse>();
}