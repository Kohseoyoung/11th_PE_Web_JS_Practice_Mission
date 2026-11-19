import { Link, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import { FavoriteButton } from "@/components/movies/favorite-button";
import { MyRatingPanel } from "@/components/movies/my-rating-panel";
import { cn } from "../../utils/cn";
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";
import {
  getTmdbBackdropUrl,
  getTmdbPosterUrl,
} from "../../utils/movies/tmdb-image";

const pageX = "px-[max(80px,calc((100%_-_1280px)/2))]";

function formatRuntime(runtime: number | null) {
  if (!runtime) return "상영 시간 정보가 없어요.";

  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;

  return hours > 0 ? `${hours}시간 ${minutes}분` : `${minutes}분`;
}

export function MovieDetailPage() {
  const { movieId: movieIdParam } = useParams({ from: "/movies/$movieId" });
  const movieId = Number(movieIdParam);
  const isValidMovieId = Number.isInteger(movieId) && movieId > 0;

  const movieDetailQuery = useQuery({
    queryKey: ["movies", "detail", movieId],
    queryFn: () => getMovieDetail(movieId),
    enabled: isValidMovieId,
    staleTime: 30 * 1000, // 전역 기본값(1분) 대신 이 쿼리만 30초
  });

  // 잘못된 번호에서도 isPending이 참이므로 가장 먼저 확인
  if (!isValidMovieId) {
    return (
      <main className={cn("py-6", pageX)}>올바르지 않은 영화 번호예요.</main>
    );
  }

  if (movieDetailQuery.isPending) {
    return (
      <main className={cn("py-6", pageX)}>영화 정보를 불러오는 중이에요.</main>
    );
  }

  if (movieDetailQuery.isError) {
    return (
      <main className={cn("py-6", pageX)}>
        {getMovieDetailErrorMessage(movieDetailQuery.error)}
      </main>
    );
  }

  const movie = movieDetailQuery.data;
  const backdropUrl = getTmdbBackdropUrl(movie.backdrop_path);
  const posterUrl = getTmdbPosterUrl(movie.poster_path);

  return (
    <main className="min-h-[calc(100vh-148px)] bg-[#f5f6f8]">
      {/* 히어로: 높이 360, 위아래 패딩 24 */}
      <section className="relative h-90 overflow-hidden">
        {backdropUrl ? (
          <img
            className="absolute inset-0 size-full object-cover"
            src={backdropUrl}
            alt=""
            aria-hidden="true"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center bg-gray-600 text-sm text-gray-300">
            이미지 없음
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-black/10" />
        <div
          className={cn(
            "relative flex h-full flex-col justify-between py-6 text-white",
            pageX,
          )}
        >
          <Link
            to="/"
            className="inline-flex h-6 w-fit items-center gap-1 text-sm text-white/90 hover:text-white"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M10 3L5 8l5 5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            영화 목록
          </Link>

          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-bold">{movie.title}</h1>
            <p className="text-sm text-white/80">{movie.original_title}</p>
            <p className="flex gap-3 text-xs text-white/70">
              <span>{movie.release_date.replace(/-/g, ".")}</span>
              <span>{movie.genres.map((genre) => genre.name).join(" · ")}</span>
              <span>{formatRuntime(movie.runtime)}</span>
            </p>
          </div>
        </div>
      </section>

      {/* 본문: 포스터 200 / 줄거리 fill / 평점 패널 360, 간격 32, 패딩 80·24 */}
      <div className={cn("flex items-start gap-8 py-6", pageX)}>
        {posterUrl ? (
          <img
            className="h-[286px] w-[200px] shrink-0 rounded-lg object-cover shadow-md"
            src={posterUrl}
            alt={`${movie.title} 포스터`}
          />
        ) : (
          <div className="grid h-[286px] w-[200px] shrink-0 place-items-center rounded-lg bg-gray-200 text-sm text-gray-500 shadow-md">
            이미지 없음
          </div>
        )}

        <section className="flex min-w-0 flex-1 flex-col items-start gap-3">
          {movie.tagline && <h2 className="text-base font-bold">{movie.tagline}</h2>}
          <p className="text-[13px] leading-relaxed text-gray-500">
            {movie.overview}
          </p>
          {/* [8주차 변경] 로컬 북마크 → 서버 즐겨찾기 API */}
          <FavoriteButton movieId={movie.id} />
        </section>

        {/* [8주차 변경] 평점 패널: 내 평점 조회·등록·수정·삭제 */}
        <MyRatingPanel movieId={movie.id} />
      </div>
    </main>
  );
}