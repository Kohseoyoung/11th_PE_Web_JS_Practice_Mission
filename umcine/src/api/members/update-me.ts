import { authApi } from "../auth-api";
import type { MemberInfo } from "./me";

export interface UpdateMeRequest {
  nickname: string;
}

interface UpdateMeResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: MemberInfo;
}

export function updateMe(body: UpdateMeRequest) {
  return authApi.patch("members/me", { json: body }).json<UpdateMeResponse>();
}