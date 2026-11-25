import { Link, useRouterState } from "@tanstack/react-router";
import { useMeQuery } from "@/hooks/use-me-query";
import { useAuthStore } from "@/stores/auth-store";

const navLink = "text-sm text-gray-400";
const navLinkActive =
  "text-sm font-bold text-black underline decoration-2 underline-offset-4";

export function Header() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  // [8주차 추가] 토큰이 있을 때만 내 정보 조회 (계정별 캐시)
  const accessToken = useAuthStore((state) => state.accessToken);
  const meQuery = useMeQuery();

  // 목록(/)과 상세(/movies/...)에서는 "영화", 검색(/search)에서는 "검색"
  const isMoviesActive = pathname === "/" || pathname.startsWith("/movies");
  const isSearchActive = pathname.startsWith("/search");
  // [7주차 추가] 내 정보(/me)와 내 정보 수정(/me/edit)에서는 "내 정보"
  const isMyActive = pathname.startsWith("/me");

  return (
    <header className="flex items-center justify-between border-b border-gray-200 bg-white px-[max(80px,calc((100%_-_1280px)/2))] py-6">
      <div className="flex items-center gap-8">
        <Link className="flex items-center gap-2 text-lg font-extrabold" to="/">
          <span className="grid size-9 place-items-center rounded-lg bg-gray-100">
            <img src="/icons/movie.svg" alt="" width={20} height={20} />
          </span>
          <span>UMCine</span>
        </Link>
        <nav className="flex gap-6">
          <Link className={isMoviesActive ? navLinkActive : navLink} to="/">
            영화
          </Link>
          <Link
            className={isSearchActive ? navLinkActive : navLink}
            to="/search"
          >
            검색
          </Link>
          {/* [7주차 변경] a 태그 → Link, /me로 연결 */}
          <Link className={isMyActive ? navLinkActive : navLink} to="/me">
            내 정보
          </Link>
        </nav>
      </div>
      <div className="flex items-center gap-3">
        {/* [7주차 리뷰 반영] button → Link, /search로 연결 */}
        <Link
          to="/search"
          className="grid size-9 place-items-center rounded-lg bg-gray-100"
          aria-label="검색"
        >
          <img src="/icons/search.svg" alt="" width={20} height={20} />
        </Link>
        {/* [8주차 변경] 로그인 전: 로그인 / 첫 조회 중: 로딩 / 로그인 후: 마이페이지 */}
        {!accessToken ? (
          <Link
            to="/login"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
          >
            로그인
          </Link>
        ) : meQuery.isLoading ? (
          <span className="h-10 w-24 animate-pulse rounded-lg bg-gray-200" />
        ) : (
          <Link
            to="/me"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
          >
            마이페이지
          </Link>
        )}
      </div>
    </header>
  );
}