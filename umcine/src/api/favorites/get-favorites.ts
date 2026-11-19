import { authApi } from "../auth-api";

// ⚠️ API 문서의 GET /favorites 응답 예시와 필드 이름을 맞춰 주세요.
export interface FavoriteMovie {
  movieId: number;
  title: string;
  posterPath: string | null;
  releaseDate: string;
}

export interface FavoritesPage {
  content: FavoriteMovie[];
  page: number; // 현재 페이지 (0부터 시작한다고 가정)
  totalPages: number;
}

interface FavoritesResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: FavoritesPage;
}

export async function getFavorites(page: number): Promise<FavoritesPage> {
  const response = await authApi
    .get("favorites", { searchParams: { page, size: 12 } })
    .json<FavoritesResponse>();
  return response.result;
}