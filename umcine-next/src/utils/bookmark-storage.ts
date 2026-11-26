const BOOKMARK_STORAGE_KEY = "umcine-bookmarks";

export function readBookmarkIds(): number[] {
  const storedValue = localStorage.getItem(BOOKMARK_STORAGE_KEY);
  if (!storedValue) return [];

  try {
    const parsedValue: unknown = JSON.parse(storedValue);
    if (!Array.isArray(parsedValue)) return [];

    return parsedValue.filter(
      (movieId): movieId is number =>
        typeof movieId === "number" &&
        Number.isInteger(movieId) &&
        movieId > 0,
    );
  } catch {
    return [];
  }
}

export function saveBookmarkIds(movieIds: number[]) {
  localStorage.setItem(BOOKMARK_STORAGE_KEY, JSON.stringify(movieIds));
}