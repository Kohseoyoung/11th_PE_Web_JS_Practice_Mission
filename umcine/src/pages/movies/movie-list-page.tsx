import { useEffect, useState } from "react";
import { getMovies } from "../../api/movies/get-movies";
import type { TmdbMovieListItem } from "../../api/movies/models";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";
import { useBookmarkStore } from "../../stores/bookmark-store";

export function MovieListPage() {
  const bookmarkedMovieIds = useBookmarkStore(
    (state) => state.bookmarkedMovieIds,
  );
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  const [movies, setMovies] = useState<TmdbMovieListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    async function loadMovies() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await getMovies({ page: 1 });
        if (!ignore) setMovies(response.results);
      } catch {
        if (!ignore) setErrorMessage("영화 목록을 불러오지 못했어요.");
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    loadMovies();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <main className="flex min-h-[calc(100vh-148px)] flex-col gap-5 bg-[#f5f6f8] px-[max(80px,calc((100%_-_1280px)/2))] py-6">
      <h1 className="text-2xl font-bold">영화 목록</h1>

      {isLoading && <p>영화 목록을 불러오는 중이에요.</p>}
      {!isLoading && errorMessage && <p>{errorMessage}</p>}
      {!isLoading && !errorMessage && movies.length === 0 && (
        <p>조건에 맞는 영화가 없어요.</p>
      )}
      {!isLoading && !errorMessage && movies.length > 0 && (
        <MovieGrid
          movies={movies}
          bookmarkedMovieIds={bookmarkedMovieIds}
          onToggleBookmark={toggleBookmark}
        />
      )}

      <Pagination />
    </main>
  );
}