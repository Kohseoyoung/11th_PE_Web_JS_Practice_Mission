import { useNavigate } from "@tanstack/react-router";
import {
  useFavoriteStatusQuery,
  useToggleFavoriteMutation,
} from "@/hooks/use-favorite";
import { useAuthStore } from "@/stores/auth-store";
import { cn } from "@/utils/cn";

export function FavoriteButton({ movieId }: { movieId: number }) {
  const navigate = useNavigate();
  const accessToken = useAuthStore((state) => state.accessToken);

  const statusQuery = useFavoriteStatusQuery(movieId, Boolean(accessToken));
  const toggleMutation = useToggleFavoriteMutation();

  const isFavorite = statusQuery.data ?? false;
  const isBusy = statusQuery.isLoading || toggleMutation.isPending;

  const handleClick = () => {
    // 로그인 전이면 로그인 페이지로
    if (!accessToken) {
      navigate({ to: "/login" });
      return;
    }
    if (isBusy) return;
    toggleMutation.mutate({ movieId, isFavorite });
  };

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