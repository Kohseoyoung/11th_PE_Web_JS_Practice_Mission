const TMDB_POSTER_BASE_URL = "https://image.tmdb.org/t/p/w500";
const TMDB_BACKDROP_BASE_URL = "https://image.tmdb.org/t/p/w1280";

export function getTmdbPosterUrl(posterPath: string | null) {
  return posterPath ? `${TMDB_POSTER_BASE_URL}${posterPath}` : null;
}

export function getTmdbBackdropUrl(backdropPath: string | null) {
  return backdropPath ? `${TMDB_BACKDROP_BASE_URL}${backdropPath}` : null;
}