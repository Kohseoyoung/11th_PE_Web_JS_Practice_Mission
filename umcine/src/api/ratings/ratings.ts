import { authApi } from "../auth-api";

interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

export interface Rating {
  ratingId: number;
  movieId: number;
  score: number;
  comment: string | null;
}

export interface CreateRatingRequest {
  movieId: number;
  score: number;
  comment: string | null;
}

export interface UpdateRatingRequest {
  ratingId: number;
  score: number;
  comment: string | null;
}

// GET /members/{memberId}/ratings: 회원이 남긴 평점 목록
// 응답이 { result: [...] }로 감싸져 있든, 배열이 바로 오든 모두 처리
export async function getMemberRatings(memberId: number): Promise<Rating[]> {
  const data = await authApi
    .get(`members/${memberId}/ratings`)
    .json<ApiResponse<Rating[]> | Rating[]>();

  if (Array.isArray(data)) return data;
  return data.result ?? [];
}

// POST /ratings: 평점 등록 (memberId는 서버가 토큰에서 꺼냄)
export async function createRating(body: CreateRatingRequest) {
  await authApi.post("ratings", { json: body });
}

// PATCH /ratings/{ratingId}: 평점 수정
export async function updateRating({ ratingId, ...body }: UpdateRatingRequest) {
  await authApi.patch(`ratings/${ratingId}`, { json: body });
}

// DELETE /ratings/{ratingId}: 평점 삭제
export async function deleteRating(ratingId: number) {
  await authApi.delete(`ratings/${ratingId}`);
}