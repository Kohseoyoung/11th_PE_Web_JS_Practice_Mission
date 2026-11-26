import { cn } from "../../utils/cn";

const pageButton =
  "grid size-8 place-items-center rounded-lg text-sm disabled:cursor-default disabled:opacity-30";

const VISIBLE_COUNT = 5;
const MAX_PAGE = 500; // TMDB는 500페이지까지만 조회할 수 있어요.

type PaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (nextPage: number) => void;
};

export default function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const lastPage = Math.min(totalPages, MAX_PAGE);

  if (lastPage === 0) return null;

  const start = Math.max(
    1,
    Math.min(page - Math.floor(VISIBLE_COUNT / 2), lastPage - VISIBLE_COUNT + 1),
  );
  const end = Math.min(lastPage, start + VISIBLE_COUNT - 1);
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  return (
    <nav className="flex items-center justify-center gap-2" aria-label="페이지 이동">
      <button
        type="button"
        className={pageButton}
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        aria-label="이전 페이지"
      >
        <img src="/icons/chevron-left.svg" alt="" width={16} height={16} />
      </button>

      {pages.map((pageNumber) => (
        <button
          key={pageNumber}
          type="button"
          className={cn(pageButton, pageNumber === page && "bg-blue-600 text-white")}
          aria-current={pageNumber === page ? "page" : undefined}
          onClick={() => onPageChange(pageNumber)}
        >
          {pageNumber}
        </button>
      ))}

      <button
        type="button"
        className={pageButton}
        disabled={page >= lastPage}
        onClick={() => onPageChange(page + 1)}
        aria-label="다음 페이지"
      >
        <img src="/icons/chevron-right.svg" alt="" width={16} height={16} />
      </button>
    </nav>
  );
}