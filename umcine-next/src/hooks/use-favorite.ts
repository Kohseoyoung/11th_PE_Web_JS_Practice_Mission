import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation"; // ✅
import {
  addFavorite,
  getFavorites,
  getFavoriteStatus,
  removeFavorite,
} from "@/api/favorites/favorites";
import { useMemberId } from "@/hooks/use-member-id";

// [리뷰 반영] 회원 ID를 key에 넣어 계정마다 캐시를 분리
export const favoriteKeys = {
  list: (memberId: number | null) => ["favorites", "list", memberId] as const,
  status: (memberId: number | null, movieId: number) =>
    ["favorites", "status", memberId, movieId] as const,
};

// 내 즐겨찾기 목록 (GET /favorites)
export function useFavoritesQuery() {
  const memberId = useMemberId();

  return useQuery({
    queryKey: favoriteKeys.list(memberId),
    queryFn: getFavorites,
    enabled: memberId !== null,
    retry: false,
  });
}

// 영화 상세: 이 영화를 즐겨찾기했는지 (GET /favorites/{movieId})
export function useFavoriteStatusQuery(movieId: number) {
  const memberId = useMemberId();

  return useQuery({
    queryKey: favoriteKeys.status(memberId, movieId),
    queryFn: () => getFavoriteStatus(movieId),
    enabled: memberId !== null,
    retry: false,
  });
}

// 즐겨찾기 등록·해제
export function useToggleFavoriteMutation() {
  const queryClient = useQueryClient();
  const memberId = useMemberId();

  return useMutation({
    mutationFn: ({ movieId, isFavorite }: { movieId: number; isFavorite: boolean }) =>
      isFavorite ? removeFavorite(movieId) : addFavorite(movieId),
    onSuccess: async (_data, { movieId, isFavorite }) => {
      const statusKey = favoriteKeys.status(memberId, movieId);

      // 늦게 도착한 이전 조회가 새 상태를 덮어쓰지 않도록 취소한 뒤 직접 갱신
      await queryClient.cancelQueries({ queryKey: statusKey });
      queryClient.setQueryData(statusKey, !isFavorite);

      // [리뷰 반영] 목록 재조회가 끝날 때까지 기다림
      // → 그동안 isPending이 유지되어, 옛 목록으로 같은 요청을 다시 보내지 않음
      await queryClient.invalidateQueries({ queryKey: favoriteKeys.list(memberId) });
    },
    onError: () => {
      alert("즐겨찾기 변경에 실패했어요. 다시 시도해 주세요.");
    },
  });
}

// 영화 목록·검색 페이지용: 내 즐겨찾기 영화 ID 목록과 토글 함수
export function useFavoriteMovies() {
  const router = useRouter(); // ✅
  const memberId = useMemberId();
  const favoritesQuery = useFavoritesQuery();
  const toggleMutation = useToggleFavoriteMutation();

  const favoriteMovieIds =
    favoritesQuery.data?.map((favorite) => favorite.movieId) ?? [];

  const toggleFavorite = (movieId: number) => {
    // 로그인 전이면 로그인 페이지로
    if (memberId === null) {
      router.push("/login"); // ✅
      return;
    }

    // [리뷰 반영] 목록 조회에 성공하기 전에는 토글하지 않음
    // 데이터가 없다는 것이 "즐겨찾기가 없다"는 뜻은 아니기 때문
    if (!favoritesQuery.isSuccess) {
      if (favoritesQuery.isError) {
        alert("즐겨찾기 목록을 불러오지 못했어요. 다시 불러올게요.");
        favoritesQuery.refetch();
      }
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