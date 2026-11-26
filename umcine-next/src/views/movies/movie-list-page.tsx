"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMovies } from "../../api/movies/get-movies";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";
import { useFavoriteMovies } from "@/hooks/use-favorite";

export function MovieListPage() {
  // [8주차 변경] 로컬 bookmark-store → 서버 즐겨찾기 API
  const { favoriteMovieIds, toggleFavorite } = useFavoriteMovies();

  const [page, setPage] = useState(1);

  const moviesQuery = useQuery({
    queryKey: ["movies", "list", { page }],
    queryFn: () => getMovies({ page }),
  });

  const movies = moviesQuery.data?.results ?? [];
  const totalPages = moviesQuery.data?.total_pages ?? 0;

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
  };

  return (
    <main className="flex min-h-[calc(100vh-148px)] flex-col gap-5 bg-[#f5f6f8] px-[max(80px,calc((100%_-_1280px)/2))] py-6">
      <h1 className="text-2xl font-bold">영화 목록</h1>

      {moviesQuery.isPending ? (
        <p>영화 목록을 불러오는 중이에요.</p>
      ) : moviesQuery.isError ? (
        <p>영화 목록을 불러오지 못했어요.</p>
      ) : movies.length === 0 ? (
        <p>조건에 맞는 영화가 없어요.</p>
      ) : (
        <MovieGrid
          movies={movies}
          bookmarkedMovieIds={favoriteMovieIds}
          onToggleBookmark={toggleFavorite}
        />
      )}

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </main>
  );
}