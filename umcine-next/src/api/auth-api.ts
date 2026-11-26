import { useAuthStore } from "../stores/auth-store";
import { apiClient } from "./api-client";

export const authApi = apiClient.extend({
  hooks: {
    beforeRequest: [
      ({ request }) => {
        const accessToken = useAuthStore.getState().accessToken;
        if (accessToken) {
          request.headers.set("Authorization", `Bearer ${accessToken}`);
        }
      },
    ],
    afterResponse: [
      ({ request, response }) => {
        if (response.status !== 401) return;

        // [리뷰 반영] 만료된 토큰(T1)으로 보낸 요청의 401이 재로그인 후에 늦게 도착하면
        // 새 토큰(T2)까지 지워 버릴 수 있음
        // → 이 요청에 실어 보낸 토큰이 지금 토큰과 같을 때만 지움
        const { accessToken, setAccessToken } = useAuthStore.getState();
        const sentAuthorization = request.headers.get("Authorization");

        if (accessToken && sentAuthorization === `Bearer ${accessToken}`) {
          setAccessToken(null);
        }
      },
    ],
  },
});