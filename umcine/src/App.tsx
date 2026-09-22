interface Movie {
  id: number;
  title: string;
  releaseDate: string;
}

const movies: Movie[] = [
  { id: 1, title: "오디세이", releaseDate: "2026.08.05" },
  { id: 2, title: "토이 스토리 5", releaseDate: "2026.06.17" },
  { id: 3, title: "인터스텔라", releaseDate: "2014.11.06" },
];

export default function App() {
  return (
    <main>
      <h1>영화 목록</h1>
      {movies.length === 0 ? (
        <p>표시할 영화가 없어요.</p>
      ) : (
        <ul>
          {movies.map((movie) => (
            <li key={movie.id}>
              {movie.title} - {movie.releaseDate}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}