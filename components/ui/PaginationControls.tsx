"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

interface PaginationControlsProps {
  totalPages: number;
  currentPage: number;
  baseUrl: string; // Add baseUrl prop
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  totalPages,
  currentPage,
  baseUrl, // Destructure baseUrl
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;

    const search = searchParams.get("search") || "";
    const sort = searchParams.get("sort") || "title-asc";

    router.push(
      `${baseUrl}?offset=${
        (page - 1) * 8
      }&limit=8&search=${search}&sort=${sort}`
    );
  };

  const generatePagination = (currentPage: number, totalPages: number) => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 3) {
      return [1, 2, 3, "...", totalPages - 1, totalPages];
    }

    if (currentPage >= totalPages - 2) {
      return [1, 2, "...", totalPages - 2, totalPages - 1, totalPages];
    }

    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages,
    ];
  };

  const allPages = generatePagination(currentPage, totalPages);

  return (
    <nav
      className="flex items-center justify-center space-x-2"
      aria-label="Pagination"
    >
      <PaginationArrow
        direction="left"
        onClick={() => handlePageChange(currentPage - 1)}
        isDisabled={currentPage <= 1}
      />
      <div className="flex -space-x-px rounded-md shadow-sm h-10">
        {totalPages > 0 ? (
          allPages.map((page, index) => (
            <PaginationNumber
              key={index}
              page={page}
              onClick={() => handlePageChange(Number(page))}
              isActive={currentPage === page}
            />
          ))
        ) : (
          <div className="flex items-center justify-center px-4 min-w-[200px] text-sm text-gray-400 bg-gray-800 border border-gray-700">
            No pages
          </div>
        )}
      </div>
      <PaginationArrow
        direction="right"
        onClick={() => handlePageChange(currentPage + 1)}
        isDisabled={currentPage >= totalPages}
      />
    </nav>
  );
};

const PaginationNumber: React.FC<{
  page: number | string;
  onClick: () => void;
  isActive: boolean;
}> = ({ page, onClick, isActive }) => {
  const className = clsx(
    "relative inline-flex items-center justify-center w-10 h-10 text-sm font-medium transition-colors duration-150 ease-in-out flex-shrink-0",
    {
      "z-10 bg-indigo-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600":
        isActive,
      "text-gray-300 hover:bg-gray-700 focus:z-20 focus:outline-offset-0":
        !isActive && page !== "...",
      "text-gray-400": page === "...",
    }
  );

  return typeof page === "number" ? (
    <button onClick={onClick} className={className}>
      {page}
    </button>
  ) : (
    <span className={className}>{page}</span>
  );
};

const PaginationArrow: React.FC<{
  direction: "left" | "right";
  onClick: () => void;
  isDisabled: boolean;
}> = ({ direction, onClick, isDisabled }) => {
  const Icon = direction === "left" ? ChevronLeftIcon : ChevronRightIcon;

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={clsx(
        "relative inline-flex items-center justify-center w-10 h-10 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out focus:z-20 focus:outline-offset-0 flex-shrink-0",
        {
          "bg-gray-800 text-gray-300 hover:bg-gray-700": !isDisabled,
          "bg-gray-800 text-gray-500 cursor-not-allowed": isDisabled,
        }
      )}
    >
      <span className="sr-only">
        {direction === "left" ? "Previous" : "Next"}
      </span>
      <Icon className="h-5 w-5" aria-hidden="true" />
    </button>
  );
};

export default PaginationControls;
