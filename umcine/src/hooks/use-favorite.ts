import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  addFavorite,
  getFavorites,
  getFavoriteStatus,
  removeFavorite,
} from "@/api/favorites/favorites";
import { useAuthStore } from "@/stores/auth-store";

export const favoriteKeys = {
  list: ["favorites", "list"] as const,
  status: (movieId: number) => ["favorites", "status", movieId] as const,
};

// 영화 상세: 이 영화를 즐겨찾기했는지 조회 (GET /favorites/{movieId})
export function useFavoriteStatusQuery(movieId: number, enabled: boolean) {
  return useQuery({
    queryKey: favoriteKeys.status(movieId),
    queryFn: () => getFavoriteStatus(movieId),
    enabled,
    retry: false,
  });
}

// 즐겨찾기 등록·해제: movieId와 현재 상태를 받아서 처리
export function useToggleFavoriteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ movieId, isFavorite }: { movieId: number; isFavorite: boolean }) =>
      isFavorite ? removeFavorite(movieId) : addFavorite(movieId),
    onSuccess: (_data, { movieId, isFavorite }) => {
      // 상세 페이지의 상태 캐시는 결과를 알고 있으니 직접 바꿔요 (추가 GET 없음)
      queryClient.setQueryData(favoriteKeys.status(movieId), !isFavorite);
      // 목록(영화 목록·검색·마이페이지가 함께 씀)은 다시 조회해요
      queryClient.invalidateQueries({ queryKey: favoriteKeys.list });
    },
    onError: () => {
      alert("즐겨찾기 변경에 실패했어요. 다시 시도해 주세요.");
    },
  });
}

// 영화 목록·검색 페이지용: 내 즐겨찾기 영화 ID 목록과 토글 함수
export function useFavoriteMovies() {
  const navigate = useNavigate();
  const accessToken = useAuthStore((state) => state.accessToken);

  const favoritesQuery = useQuery({
    queryKey: favoriteKeys.list,
    queryFn: getFavorites,
    enabled: Boolean(accessToken),
    retry: false,
  });
  const toggleMutation = useToggleFavoriteMutation();

  const favoriteMovieIds =
    favoritesQuery.data?.map((favorite) => favorite.movieId) ?? [];

  const toggleFavorite = (movieId: number) => {
    // 로그인 전이면 로그인 페이지로
    if (!accessToken) {
      navigate({ to: "/login" });
      return;
    }
    if (toggleMutation.isPending) return;
    toggleMutation.mutate({
      movieId,
      isFavorite: favoriteMovieIds.includes(movieId),
    });
  };

  return { favoriteMovieIds, toggleFavorite };
}