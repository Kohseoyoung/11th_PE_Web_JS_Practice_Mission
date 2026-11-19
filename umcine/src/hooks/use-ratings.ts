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

// 등록·수정·삭제 모두 성공하면 평점 목록을 다시 조회해요.
// (응답에 수정된 목록이 없으므로 setQueryData 대신 invalidateQueries)
function useInvalidateRatings(memberId: number | null) {
  const queryClient = useQueryClient();
  return () =>
    queryClient.invalidateQueries({ queryKey: ratingKeys.byMember(memberId) });
}

export function useCreateRatingMutation(memberId: number | null) {
  const invalidate = useInvalidateRatings(memberId);
  return useMutation({
    mutationFn: createRating,
    onSuccess: () => {
      invalidate();
      alert("평점을 저장했어요.");
    },
    onError: () => alert("평점 저장에 실패했어요. 다시 시도해 주세요."),
  });
}

export function useUpdateRatingMutation(memberId: number | null) {
  const invalidate = useInvalidateRatings(memberId);
  return useMutation({
    mutationFn: updateRating,
    onSuccess: () => {
      invalidate();
      alert("평점을 수정했어요.");
    },
    onError: () => alert("평점 수정에 실패했어요. 다시 시도해 주세요."),
  });
}

export function useDeleteRatingMutation(memberId: number | null) {
  const invalidate = useInvalidateRatings(memberId);
  return useMutation({
    mutationFn: deleteRating,
    onSuccess: () => {
      invalidate();
      alert("평점을 삭제했어요.");
    },
    onError: () => alert("평점 삭제에 실패했어요. 다시 시도해 주세요."),
  });
}