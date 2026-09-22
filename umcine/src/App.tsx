interface MovieCardProps {
  title: string;
  releaseDate: string;
  isBookmarked: boolean;
}

function MovieCard({ title, releaseDate, isBookmarked }: MovieCardProps) {
  return (
    <article>
      <h2>{title}</h2>
      <p>{releaseDate}</p>
      <p>{isBookmarked ? "북마크됨" : "북마크 안 됨"}</p>
    </article>
  );
}

export default function App() {
  return (
    <main>
      <MovieCard title="오디세이" releaseDate="2026.08.05" isBookmarked={true} />
      <MovieCard title="토이 스토리 5" releaseDate="2026.06.17" isBookmarked={false} />
      <MovieCard title="인터스텔라" releaseDate="2014.11.06" isBookmarked={true} />
    </main>
  );
}