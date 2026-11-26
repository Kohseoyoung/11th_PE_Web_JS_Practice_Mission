import type { TmdbMovieListItem } from "../../api/movies/models";
import MovieCard from "./movie-card";

interface MovieGridProps {
  movies: TmdbMovieListItem[];
  bookmarkedMovieIds: number[];
  onToggleBookmark: (movieId: number) => void;
}

export default function MovieGrid({
  movies,
  bookmarkedMovieIds,
  onToggleBookmark,
}: MovieGridProps) {
  return (
    <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {movies.map((movie) => (
        <li key={movie.id}>
          <MovieCard
            movie={movie}
            isBookmarked={bookmarkedMovieIds.includes(movie.id)}
            onToggleBookmark={onToggleBookmark}
          />
        </li>
      ))}
    </ul>
  );
}