import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createRating,
  deleteRating,
  getMemberRatings,
  updateRating,
} from "@/api/ratings/ratings";

export const ratingKeys = {
  byMember: (memberId: number | null) => ["ratings", "member", memberId] as const,
};

// 내가 남긴 평점 목록
export function useMyRatingsQuery(memberId: number | null) {
  return useQuery({
    queryKey: ratingKeys.byMember(memberId),
    queryFn: () => getMemberRatings(memberId as number),
    enabled: memberId !== null,
    retry: false,
  });
}

// 등록·수정·삭제 모두 성공하면 평점 목록을 다시 조회
function useInvalidateRatings(memberId: number | null) {
  const queryClient = useQueryClient();
  return () =>
    queryClient.invalidateQueries({ queryKey: ratingKeys.byMember(memberId) });
}

// [리뷰 반영] onSuccess에서 재조회를 기다림
// → 재조회가 끝나야 isPending이 풀리고, 그 뒤에 입력값을 초기화하므로
//   옛 점수가 잠깐 다시 보이거나 옛 점수로 덮어쓰는 문제가 생기지 않음

export function useCreateRatingMutation(memberId: number | null) {
  const invalidate = useInvalidateRatings(memberId);
  return useMutation({
    mutationFn: createRating,
    onSuccess: async () => {
      await invalidate();
      alert("평점을 저장했어요.");
    },
    onError: () => alert("평점 저장에 실패했어요. 다시 시도해 주세요."),
  });
}

export function useUpdateRatingMutation(memberId: number | null) {
  const invalidate = useInvalidateRatings(memberId);
  return useMutation({
    mutationFn: updateRating,
    onSuccess: async () => {
      await invalidate();
      alert("평점을 수정했어요.");
    },
    onError: () => alert("평점 수정에 실패했어요. 다시 시도해 주세요."),
  });
}

export function useDeleteRatingMutation(memberId: number | null) {
  const invalidate = useInvalidateRatings(memberId);
  return useMutation({
    mutationFn: deleteRating,
    onSuccess: async () => {
      await invalidate();
      alert("평점을 삭제했어요.");
    },
    onError: () => alert("평점 삭제에 실패했어요. 다시 시도해 주세요."),
  });
}