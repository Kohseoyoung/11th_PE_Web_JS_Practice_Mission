function Header() {
  return (
    <header>
        <h1>영화 목록</h1>
    </header>
  )
}

function MovieCard() {
  return (
    <article>
      <h2>오디세이</h2>
      <p>2026.08.05</p>
    </article>
  )
}

function MovieList() {
  return (
    <section>
      <MovieCard />
      <MovieCard />
    </section>
  );
}

export default function App() {
  return (
    <main>
      <Header />
      <MovieList />
    </main>
  );
}