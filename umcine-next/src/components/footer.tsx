export default function Footer() {
  return (
    <footer className="flex items-center justify-end gap-2 border-t border-gray-200 bg-white px-[max(80px,calc((100%_-_1280px)/2))] py-4 text-xs text-gray-400">
      <img
        className="h-3 w-auto"
        src="/images/logos/tmdb-logo.svg"
        alt="TMDB"
      />
      <p>
        This product uses the TMDB API but is not endorsed or certified by{" "}
        <a
          className="underline"
          href="https://www.themoviedb.org/"
          target="_blank"
          rel="noreferrer"
        >
          TMDB
        </a>
        .
      </p>
    </footer>
  );
}