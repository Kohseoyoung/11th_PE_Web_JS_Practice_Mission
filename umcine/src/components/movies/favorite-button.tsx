import { useNavigate } from "@tanstack/react-router";
import {
  useFavoriteStatusQuery,
  useToggleFavoriteMutation,
} from "@/hooks/use-favorite";
import { useMemberId } from "@/hooks/use-member-id";
import { cn } from "@/utils/cn";

export function FavoriteButton({ movieId }: { movieId: number }) {
  const navigate = useNavigate();
  const memberId = useMemberId();
  const isLoggedIn = memberId !== null;

  const statusQuery = useFavoriteStatusQuery(movieId);
  const toggleMutation = useToggleFavoriteMutation();

  const isFavorite = statusQuery.data ?? false;
  // [리뷰 반영] 로그인 상태에서는 상태 조회에 성공해야 누를 수 있음
  const isBusy =
    (isLoggedIn && !statusQuery.isSuccess) || toggleMutation.isPending;

  const handleClick = () => {
    // 로그인 전이면 로그인 페이지로
    if (!isLoggedIn) {
      navigate({ to: "/login" });
      return;
    }
    if (isBusy) return;
    toggleMutation.mutate({ movieId, isFavorite });
  };

  // [리뷰 반영] 조회 실패를 "미등록"으로 보지 않고 다시 시도하게 함
  if (isLoggedIn && statusQuery.isError) {
    return (
      <button
        type="button"
        onClick={() => statusQuery.refetch()}
        className="inline-flex h-8 items-center rounded-md border border-gray-300 bg-white px-3 text-xs font-semibold text-gray-600"
      >
        즐겨찾기 상태를 불러오지 못했어요 · 다시 시도
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isBusy}
      aria-pressed={isFavorite}
      className={cn(
        "inline-flex h-8 items-center gap-1.5 rounded-md border border-blue-600 px-3 text-xs font-semibold disabled:opacity-60",
        isFavorite ? "bg-blue-600 text-white" : "bg-white text-blue-600",
      )}
    >
      <img
        className={cn(isFavorite && "brightness-0 invert")}
        src="/icons/bookmark-outline.svg"
        alt=""
        width={12}
        height={12}
      />
      {isFavorite ? "즐겨찾기 해제" : "즐겨찾기"}
    </button>
  );
}