import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  useCreateRatingMutation,
  useDeleteRatingMutation,
  useMyRatingsQuery,
  useUpdateRatingMutation,
} from "@/hooks/use-ratings";
import { useAuthStore } from "@/stores/auth-store";
import { getMemberIdFromToken } from "@/utils/auth/get-member-id";
import { cn } from "@/utils/cn";

const STARS = [1, 2, 3, 4, 5];

export function MyRatingPanel({ movieId }: { movieId: number }) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const memberId = getMemberIdFromToken(accessToken);

  // 내 평점 목록에서 이 영화의 평점을 찾음
  const ratingsQuery = useMyRatingsQuery(memberId);
  const myRating = ratingsQuery.data?.find((rating) => rating.movieId === movieId);

  // 사용자가 입력하기 전(null)에는 저장된 평점을 보여줌
  const [scoreInput, setScoreInput] = useState<number | null>(null);
  const [commentInput, setCommentInput] = useState<string | null>(null);
  const score = scoreInput ?? myRating?.score ?? 0;
  const comment = commentInput ?? myRating?.comment ?? "";

  const createMutation = useCreateRatingMutation(memberId);
  const updateMutation = useUpdateRatingMutation(memberId);
  const deleteMutation = useDeleteRatingMutation(memberId);
  const isPending =
    createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  const canSubmit = score >= 1 && !isPending;

  // 저장·삭제가 끝나면 입력값을 비우고 서버 값을 다시 보여줌
  const resetInputs = () => {
    setScoreInput(null);
    setCommentInput(null);
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    const body = { score, comment: comment.trim() || null };

    if (myRating) {
      updateMutation.mutate(
        { ratingId: myRating.ratingId, ...body },
        { onSuccess: resetInputs },
      );
    } else {
      createMutation.mutate({ movieId, ...body }, { onSuccess: resetInputs });
    }
  };

  const handleDelete = () => {
    if (!myRating || isPending) return;
    if (!window.confirm("평점을 삭제할까요?")) return;
    deleteMutation.mutate(myRating.ratingId, { onSuccess: resetInputs });
  };

  return (
    <aside className="flex w-[360px] shrink-0 flex-col gap-2 border-l border-gray-200 pb-[41px] pl-[30px]">
      <h2 className="text-base font-bold">내 평점</h2>

      {!accessToken ? (
        <p className="text-xs text-gray-500">
          평점을 남기려면{" "}
          <Link to="/login" className="font-semibold text-blue-600">
            로그인
          </Link>
          해 주세요.
        </p>
      ) : (
        <>
          <p className="text-[11px] leading-3.5 text-gray-400">
            별점은 필수, 후기는 선택이에요.
          </p>

          <div className="flex h-[38px] items-center gap-1">
            {STARS.map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setScoreInput(star)}
                disabled={isPending}
                aria-label={`${star}점`}
                aria-pressed={star <= score}
                className="flex size-[38px] items-center justify-center rounded-lg border border-gray-200 bg-white"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  className={star <= score ? "fill-yellow-400" : "fill-gray-300"}
                >
                  <path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1L12 2z" />
                </svg>
              </button>
            ))}
          </div>

          <textarea
            value={comment}
            onChange={(e) => setCommentInput(e.target.value)}
            disabled={isPending}
            className="h-[102px] w-full resize-none rounded-md border border-gray-200 bg-white px-3 pt-4 pb-[18px] text-xs"
            placeholder="영화를 보고 느낀 점을 남겨보세요."
            aria-label="평점 후기"
          />

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="h-[42px] flex-1 rounded-md bg-gray-900 px-4 text-xs font-semibold text-white disabled:bg-gray-300"
            >
              {createMutation.isPending || updateMutation.isPending
                ? "저장 중"
                : myRating
                  ? "평점 수정"
                  : "평점 저장"}
            </button>
            {myRating && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isPending}
                className={cn(
                  "h-[42px] rounded-md border border-red-300 bg-white px-4 text-xs font-semibold text-red-600",
                  "disabled:opacity-60",
                )}
              >
                {deleteMutation.isPending ? "삭제 중" : "삭제"}
              </button>
            )}
          </div>
        </>
      )}
    </aside>
  );
}