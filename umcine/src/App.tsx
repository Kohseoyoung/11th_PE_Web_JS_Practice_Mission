export default function App() {
  const movieTitle = "오디세이";
  const genre = "모험";

  return (
    <article className="movie-card">
      <h1>{movieTitle}</h1>
      <p>장르: {genre}</p>
    </article>
  );
}