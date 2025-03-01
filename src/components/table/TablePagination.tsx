
import { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const TablePagination = ({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: TablePaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <div className={cn("py-4 border-t border-[#9C7705]/10", className)}>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => currentPage > 0 && onPageChange(currentPage - 1)}
              className={cn(currentPage === 0 && "pointer-events-none opacity-50", "text-[#3B751E]")}
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
                  className={currentPage === pageIndex ? "bg-[#3B751E] text-white" : "text-[#3B751E]"}
                >
                  {pageIndex + 1}
                </PaginationLink>
              </PaginationItem>
            );
          })}
          <PaginationItem>
            <PaginationNext 
              onClick={() => currentPage < totalPages - 1 && onPageChange(currentPage + 1)}
              className={cn(currentPage === totalPages - 1 && "pointer-events-none opacity-50", "text-[#3B751E]")}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};
