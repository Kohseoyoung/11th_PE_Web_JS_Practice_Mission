import { useState } from "react";

interface Movie {
  id: number;
  title: string;
  releaseDate: string;
  isBookmarked: boolean;
}

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (movieId: number) => void;
}

const initialMovies: Movie[] = [
  { id: 1, title: "오디세이", releaseDate: "2026.08.05", isBookmarked: true },
  { id: 2, title: "토이 스토리 5", releaseDate: "2026.06.17", isBookmarked: false },
];

function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
  return (
    <li>
      <span>
        {movie.title} ({movie.releaseDate})
      </span>
      <button
        type="button"
        aria-pressed={movie.isBookmarked}
        onClick={() => onToggleBookmark(movie.id)}
      >
        {movie.isBookmarked ? "북마크 해제" : "북마크 추가"}
      </button>
    </li>
  );
}

export default function App() {
  const [movies, setMovies] = useState(initialMovies);

  function handleToggleBookmark(movieId: number) {
    setMovies((currentMovies) =>
      currentMovies.map((movie) =>
        movie.id === movieId
          ? { ...movie, isBookmarked: !movie.isBookmarked }
          : movie,
      ),
    );
  }

  return (
    <main>
      <h1>영화 목록</h1>
      <ul>
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onToggleBookmark={handleToggleBookmark}
          />
        ))}
      </ul>
    </main>
  );
}