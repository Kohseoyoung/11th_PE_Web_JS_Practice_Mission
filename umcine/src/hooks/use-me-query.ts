import { useQuery } from "@tanstack/react-query";
import { getMe } from "@/api/members/me";
import { useMemberId } from "@/hooks/use-member-id";

// [리뷰 반영] 회원 ID를 key에 넣어 계정마다 캐시를 분리
// A 계정의 정보가 B 계정 화면에 보이지 않음
export const memberKeys = {
  me: (memberId: number | null) => ["members", "me", memberId] as const,
};

export function useMeQuery() {
  const memberId = useMemberId();

  return useQuery({
    queryKey: memberKeys.me(memberId),
    queryFn: getMe,
    enabled: memberId !== null,
    staleTime: 5 * 60 * 1000,
    // 401로 토큰을 지운 뒤 같은 조회를 자동 재시도하지 않도록
    retry: false,
  });
}