import { authApi } from "../auth-api";

interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

export interface Favorite {
  favoriteId: number;
  movieId: number;
}

// GET /favorites: 내 즐겨찾기 목록 (영화 ID만 담겨 있음)
export async function getFavorites(): Promise<Favorite[]> {
  const response = await authApi.get("favorites").json<ApiResponse<Favorite[]>>();
  return response.result;
}

// GET /favorites/{movieId}: 이 영화를 즐겨찾기했는지
export async function getFavoriteStatus(movieId: number): Promise<boolean> {
  const response = await authApi
    .get(`favorites/${movieId}`)
    .json<ApiResponse<{ isFavorite: boolean }>>();
  return response.result.isFavorite;
}

// POST /favorites: 즐겨찾기 등록
export async function addFavorite(movieId: number) {
  await authApi.post("favorites", { json: { movieId } });
}

// DELETE /favorites/{movieId}: 즐겨찾기 해제
export async function removeFavorite(movieId: number) {
  await authApi.delete(`favorites/${movieId}`);
}