import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMe } from "@/api/members/update-me";
import type { MemberInfo } from "@/api/members/me";
import { memberKeys } from "@/hooks/use-me-query";
import { useMemberId } from "@/hooks/use-member-id";

export function useUpdateMeMutation() {
  const queryClient = useQueryClient();
  const memberId = useMemberId();

  return useMutation({
    mutationFn: updateMe,
    onSuccess: async (response) => {
      // [리뷰 반영] 수정 전에 보낸 내 정보 조회가 늦게 도착하면
      // 새 닉네임을 이전 값으로 덮어쓸 수 있으므로 먼저 취소
      await queryClient.cancelQueries({ queryKey: memberKeys.me(memberId) });
      queryClient.setQueryData<MemberInfo>(memberKeys.me(memberId), response.result);
      alert("내 정보 수정에 성공했어요.");
    },
    onError: () => {
      alert("내 정보 수정에 실패했어요. 다시 시도해 주세요.");
    },
  });
}