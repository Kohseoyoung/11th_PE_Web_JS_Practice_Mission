import type { TmdbMovieListItem } from "../../api/movies/models";
import { Link } from "@tanstack/react-router";
import { cn } from "../../utils/cn";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";

interface MovieCardProps {
  movie: TmdbMovieListItem;
  isBookmarked: boolean;
  onToggleBookmark: (movieId: number) => void;
}

export default function MovieCard({
  movie,
  isBookmarked,
  onToggleBookmark,
}: MovieCardProps) {
  const posterUrl = getTmdbPosterUrl(movie.poster_path);

  return (
    <article>
      <div className="relative aspect-7/8 overflow-hidden rounded-lg">
        <Link
          className="block size-full"
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
        >
          {posterUrl ? (
            <img
              className="size-full object-cover"
              src={posterUrl}
              alt={`${movie.title} 포스터`}
            />
          ) : (
            <div className="grid size-full place-items-center bg-gray-200 text-sm text-gray-500">
              이미지 없음
            </div>
          )}
        </Link>
        <button
          type="button"
          className={cn(
            "absolute right-2 top-2 grid size-8 place-items-center rounded-md",
            isBookmarked ? "bg-blue-600" : "bg-gray-900/60",
          )}
          aria-pressed={isBookmarked}
          aria-label={isBookmarked ? "북마크 해제" : "북마크 추가"}
          onClick={() => onToggleBookmark(movie.id)}
        >
          <img
            className="brightness-0 invert"
            src={isBookmarked ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"}
            alt=""
            width={16}
            height={16}
          />
        </button>
      </div>
      <h3 className="mt-2 truncate text-sm font-semibold">
        <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
          {movie.title}
        </Link>
      </h3>
      <p className="mt-0.5 text-xs text-gray-400">
        {movie.release_date.replace(/-/g, ".")}
      </p>
    </article>
  );
}