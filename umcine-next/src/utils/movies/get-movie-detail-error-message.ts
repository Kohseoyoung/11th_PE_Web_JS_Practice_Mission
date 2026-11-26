import { isHTTPError } from "ky";

export function getMovieDetailErrorMessage(error: unknown) {
  if (isHTTPError(error) && error.response.status === 404) {
    return "영화를 찾을 수 없어요.";
  }

  return "영화 정보를 불러오지 못했어요.";
}