interface TmdbMovie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
}

interface TmdbMovieListItem extends TmdbMovie {
  genre_ids: number[];
}

interface TmdbMovieListResponse {
  page: number;
  results: TmdbMovieListItem[];
  total_pages: number;
  total_results: number;
}

interface TmdbGenre {
  id: number;
  name: string;
}

interface TmdbMovieDetail extends TmdbMovie {
  genres: TmdbGenre[];
  runtime: number | null;
  tagline: string;
}

export type {
  TmdbGenre,
  TmdbMovie,
  TmdbMovieDetail,
  TmdbMovieListItem,
  TmdbMovieListResponse,
};