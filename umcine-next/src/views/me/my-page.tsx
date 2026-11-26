"use client";
import { useState } from "react";
import Link from "next/link";
import { useQueries } from "@tanstack/react-query";
import { getMovieDetail } from "@/api/movies/get-movie-detail";
import Pagination from "@/components/movies/pagination";
import { useFavoritesQuery } from "@/hooks/use-favorite";
import { useMeQuery } from "@/hooks/use-me-query";
import { getTmdbPosterUrl } from "@/utils/movies/tmdb-image";

const PAGE_SIZE = 12;

export function MyPage() {
  // [8주차 변경] MOCK_ME → GET /members/me (헤더·수정 페이지와 같은 캐시)
  const meQuery = useMeQuery();

  // [8주차 변경] MOCK_FAVORITES → GET /favorites
  // 상세 페이지에서 즐겨찾기를 바꾸면 이 key가 무효화돼 다시 조회
  const favoritesQuery = useFavoritesQuery();
  const favorites = favoritesQuery.data ?? [];

  // 서버가 목록을 한 번에 주므로 페이지는 화면에서 나눔
  const [page, setPage] = useState(0);
  const totalPages = Math.max(Math.ceil(favorites.length / PAGE_SIZE), 1);
  // 해제로 목록이 줄어 현재 페이지가 비면 마지막 페이지로
  const currentPage = Math.min(page, totalPages - 1);
  const pageFavorites = favorites.slice(
    currentPage * PAGE_SIZE,
    (currentPage + 1) * PAGE_SIZE,
  );

  // 즐겨찾기에는 영화 ID만 있어서, 제목·포스터는 TMDB 상세로 가져옴
  // 상세 페이지와 같은 query key라 이미 본 영화는 캐시를 그대로 씀
  const movieQueries = useQueries({
    queries: pageFavorites.map((favorite) => ({
      queryKey: ["movies", "detail", favorite.movieId],
      queryFn: () => getMovieDetail(favorite.movieId),
      staleTime: 30 * 1000,
    })),
  });

  return (
    <main className="bg-gray-50">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col px-6 py-8">
        {/* 제목 + 정보 수정 버튼 */}
        <div className="flex items-center justify-between pb-6">
          <h1 className="text-3xl font-bold">내 정보</h1>
          <Link
            href="/me/edit"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
          >
            정보 수정
          </Link>
        </div>

        {/* 기본 정보 */}
        <section className="flex flex-col gap-4 border-y border-gray-200 py-3">
          <h2 className="text-sm font-semibold">기본 정보</h2>
          <div className="flex items-center gap-6">
            <Avatar />
            <div className="grid flex-1 grid-cols-2">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-400">닉네임</span>
                <span className="text-sm font-semibold">
                  {meQuery.data?.nickname ?? "-"}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-400">이메일</span>
                <span className="text-sm font-semibold">
                  {meQuery.data?.email ?? "-"}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 내 즐겨찾기 */}
        <section className="flex flex-col gap-4 py-6">
          <h2 className="text-sm font-semibold">
            내 즐겨찾기
            {favorites.length > 0 && (
              <span className="ml-1 text-gray-400">{favorites.length}</span>
            )}
          </h2>

          {favoritesQuery.isLoading ? (
            <p className="py-10 text-center text-sm text-gray-400">
              불러오는 중이에요.
            </p>
          ) : favoritesQuery.isError ? (
            <div className="flex flex-col items-center gap-2 py-10">
              <p className="text-sm text-red-500">
                즐겨찾기를 불러오지 못했어요.
              </p>
              <button
                type="button"
                onClick={() => favoritesQuery.refetch()}
                className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700"
              >
                다시 시도
              </button>
            </div>
          ) : favorites.length === 0 ? (
            <p className="py-10 text-center text-sm text-gray-400">
              아직 즐겨찾기한 영화가 없어요.
            </p>
          ) : (
            <ul className="grid grid-cols-6 gap-4">
              {pageFavorites.map((favorite, index) => {
                const movie = movieQueries[index]?.data;
                const posterUrl = movie
                  ? getTmdbPosterUrl(movie.poster_path)
                  : null;

                return (
                  <li key={favorite.favoriteId}>
                    <Link
                      href={`/movies/${favorite.movieId}`}
                      className="flex flex-col gap-2"
                    >
                      {posterUrl ? (
                        <img
                          src={posterUrl}
                          alt={`${movie?.title} 포스터`}
                          className="aspect-[2/3] w-full rounded-lg object-cover"
                        />
                      ) : (
                        <div className="aspect-[2/3] w-full animate-pulse rounded-lg bg-gray-200" />
                      )}
                      <p className="truncate text-sm font-semibold">
                        {movie?.title ?? "불러오는 중"}
                      </p>
                      <p className="text-xs text-gray-400">
                        {movie?.release_date.replace(/-/g, ".") ?? ""}
                      </p>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}

          {/* 페이지네이션: 영화 목록과 같은 컴포넌트 사용 (1부터 시작하는 번호로 변환) */}
          {favorites.length > 0 && (
            <Pagination
              page={currentPage + 1}
              totalPages={totalPages}
              onPageChange={(nextPage) => setPage(nextPage - 1)}
            />
          )}
        </section>
      </div>
    </main>
  );
}

function Avatar() {
  return (
    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-200">
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="text-gray-800"
      >
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
      </svg>
    </div>
  );
}
