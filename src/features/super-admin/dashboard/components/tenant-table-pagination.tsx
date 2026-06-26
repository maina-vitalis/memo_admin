"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type TenantTablePaginationProps = {
  page: number;
  pageSize: number;
  total: number;
  start: number;
  end: number;
  onPageChange: (page: number) => void;
};

function getPageNumbers(
  current: number,
  totalPages: number,
): Array<number | "ellipsis"> {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (current <= 3) {
    return [1, 2, 3, "ellipsis", totalPages];
  }

  if (current >= totalPages - 2) {
    return [1, "ellipsis", totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, "ellipsis", current, "ellipsis", totalPages];
}

function PageButton({
  children,
  active,
  disabled,
  onClick,
  className,
}: {
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex items-center border border-border bg-card px-3 py-1.5 text-sm font-medium transition-colors",
        active
          ? "bg-primary-container text-white"
          : "text-foreground hover:bg-background",
        disabled && "cursor-not-allowed opacity-50",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function TenantTablePagination({
  page,
  pageSize,
  total,
  start,
  end,
  onPageChange,
}: TenantTablePaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const pages = getPageNumbers(page, totalPages);

  return (
    <div className="flex flex-col gap-3 border-t border-border bg-card px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <p className="text-sm text-muted-foreground">
        Showing <span className="font-medium text-foreground">{start}</span> to{" "}
        <span className="font-medium text-foreground">{end}</span> of{" "}
        <span className="font-medium text-foreground">{total}</span> results
      </p>

      <nav
        aria-label="Pagination"
        className="inline-flex -space-x-px rounded-md shadow-sm"
      >
        <PageButton
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="rounded-l-md px-2"
        >
          <ChevronLeftIcon className="size-5" />
          <span className="sr-only">Previous</span>
        </PageButton>

        {pages.map((item, index) =>
          item === "ellipsis" ? (
            <PageButton key={`ellipsis-${index}`} className="px-3 text-muted-foreground">
              ...
            </PageButton>
          ) : (
            <PageButton
              key={item}
              active={item === page}
              onClick={() => onPageChange(item)}
            >
              {item}
            </PageButton>
          ),
        )}

        <PageButton
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="rounded-r-md px-2"
        >
          <ChevronRightIcon className="size-5" />
          <span className="sr-only">Next</span>
        </PageButton>
      </nav>
    </div>
  );
}
