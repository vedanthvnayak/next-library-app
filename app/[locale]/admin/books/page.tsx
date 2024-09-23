import React from "react";
import { DrizzleManager } from "@/db/drizzleDbConnection";
import { BookRepository } from "@/repository/books.repository";
import Search from "@/components/adminComponents/Search";
import PaginationControls from "@/components/ui/PaginationControls";
import BooksTable from "@/components/adminComponents/BooksTable";
import SortDropdown from "@/components/ui/SortDropdown";
interface BooksPageProps {
  searchParams: {
    offset?: string;
    limit?: string;
    search?: string;
    sort?: string;
  };
}

const bookRepository = new BookRepository();

export default async function BooksManagement({
  searchParams,
}: BooksPageProps) {
  const offset = parseInt(searchParams.offset || "0", 10);
  const limit = parseInt(searchParams.limit || "8", 10);
  const search = searchParams.search || "";
  const sort = searchParams.sort || "title-asc"; // Default sort
  const response = await bookRepository.list({ offset, limit, search, sort });

  if (!response) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <p className="text-2xl text-red-500 bg-gray-800 bg-opacity-50 p-6 rounded-lg shadow-lg">
          Oops, something went wrong.
        </p>
      </div>
    );
  }

  const { items: books, pagination } = response;

  const totalPages = Math.ceil(pagination.total / limit);
  const currentPage = Math.floor(offset / limit) + 1;

  return (
    <section className="w-full py-8 sm:py-12 lg:py-16 bg-gray-950 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6">
          Book Management
        </h1>
        <div className="mb-8">
          <div className="flex justify-between items-center space-x-4">
            <Search
              placeholder="Search books, authors, genres..."
              baseUrl="/admin/books"
            />
            {/* <SortDropdown defaultSort={sort} /> */}
          </div>

          <div className="mt-4 flex w-full justify-center">
            <PaginationControls
              totalPages={totalPages}
              currentPage={currentPage}
              baseUrl="/admin/books"
            />
          </div>
        </div>
        <div className="overflow-x-auto bg-gray-900 rounded-lg shadow-xl">
          <BooksTable books={books} />
        </div>
        <div className="mt-6 sm:mt-8 flex justify-center"></div>
      </div>
    </section>
  );
}
