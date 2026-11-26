import { useAuthStore } from "@/stores/auth-store";
import { getMemberIdFromToken } from "@/utils/auth/get-member-id";

// 현재 로그인한 회원 ID (토큰에서 계산, 로그인 전이면 null)
// query key에 넣어서 계정마다 캐시를 분리하는 데 사용
export function useMemberId() {
  const accessToken = useAuthStore((state) => state.accessToken);
  return getMemberIdFromToken(accessToken);
}