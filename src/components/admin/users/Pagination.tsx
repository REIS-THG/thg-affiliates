
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface UserPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const UserPagination = ({
  currentPage,
  totalPages,
  onPageChange
}: UserPaginationProps) => {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious 
            onClick={() => currentPage > 0 && onPageChange(currentPage - 1)}
            className={currentPage === 0 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
        {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
          const pageIndex = i + Math.max(0, currentPage - 2 + (currentPage < 2 ? 2 - currentPage : 0));
          if (pageIndex >= totalPages) return null;
          
          return (
            <PaginationItem key={pageIndex}>
              <PaginationLink
                onClick={() => onPageChange(pageIndex)}
                isActive={currentPage === pageIndex}
              >
                {pageIndex + 1}
              </PaginationLink>
            </PaginationItem>
          );
        })}
        <PaginationItem>
          <PaginationNext 
            onClick={() => currentPage < totalPages - 1 && onPageChange(currentPage + 1)}
            className={currentPage === totalPages - 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
