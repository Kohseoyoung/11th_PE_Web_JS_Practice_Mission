import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface BookmarkStore {
  bookmarkedMovieIds: number[];
  toggleBookmark: (movieId: number) => void;
}

export const useBookmarkStore = create<BookmarkStore>()(
  persist(
    (set) => ({
      bookmarkedMovieIds: [],
      toggleBookmark: (movieId) =>
        set((state) => ({
          bookmarkedMovieIds: state.bookmarkedMovieIds.includes(movieId)
            ? state.bookmarkedMovieIds.filter((id) => id !== movieId)
            : [...state.bookmarkedMovieIds, movieId],
        })),
    }),
    {
      name: "umcine-bookmark-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        bookmarkedMovieIds: state.bookmarkedMovieIds,
      }),
    },
  ),
);