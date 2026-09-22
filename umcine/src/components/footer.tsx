export default function Footer() {
  return (
    <footer className="footer">
      <img src="/images/logos/tmdb.svg" alt="TMDB" height={12} />
      <p>
        This product uses the TMDB API but is not endorsed or certified by{" "}
        <a href="https://www.themoviedb.org/" target="_blank" rel="noreferrer">TMDB</a>.
      </p>
    </footer>
  );
}