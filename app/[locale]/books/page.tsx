import React from "react";
import Link from "next/link";
import PaginationControls from "@/components/ui/PaginationControls";
import Search from "@/components/ui/search";
import { DrizzleManager } from "@/db/drizzleDbConnection";
import { BookRepository } from "@/repository/books.repository";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import BookCard from "@/components/ui/BookCard";
import { ExclamationCircleIcon, FireIcon } from "@heroicons/react/24/outline";
import SortDropdown from "@/components/ui/SortDropdown";

interface BooksPageProps {
  searchParams: {
    offset?: string;
    limit?: string;
    search?: string;
    sort?: string;
  };
}

const drizzleManager = new DrizzleManager();
const db = drizzleManager.getPoolDrizzle();
const bookRepository = new BookRepository(db);

const BooksPage: React.FC<BooksPageProps> = async ({ searchParams }) => {
  const session = await getServerSession(authOptions);
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
    <section className="w-full pt-20 sm:py-24 bg-gray-950 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-4 sm:p-6 rounded-2xl shadow-lg mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-center text-indigo-300">
            Discover Your Next Read
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-6">
            <div className="flex items-center space-x-3 bg-gray-800 bg-opacity-50 p-2 rounded-lg">
              <ExclamationCircleIcon className="h-6 w-6 text-red-400" />
              <span className="text-sm text-gray-300">
                Limited Stock
                <span className="block text-xs text-gray-400">2 or fewer</span>
              </span>
            </div>
            <div className="flex items-center space-x-3 bg-gray-800 bg-opacity-50 p-2 rounded-lg">
              <FireIcon className="h-6 w-6 text-orange-400" />
              <span className="text-sm text-gray-300">
                Popular Choice
                <span className="block text-xs text-gray-400">
                  Frequently Borrowed
                </span>
              </span>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="w-full space-y-4 md:space-y-0 md:flex md:justify-between md:items-center md:space-x-4">
            <div className="w-full ">
              <Search placeholder="Search books, authors, genres..." />
            </div>
            <div className="w-full md:w-auto">
              <SortDropdown defaultSort={sort} />
            </div>
          </div>

          <div className="mt-4 flex w-full justify-center">
            <PaginationControls
              totalPages={totalPages}
              currentPage={currentPage}
              baseUrl={"/books"}
            />
          </div>
        </div>

        {books.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-10 lg:gap-12  justify-center items-center min-h-screen p-4">
            {books.map((book) => (
              <BookCard key={book.id} book={book} session={session} />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center min-h-[400px] bg-gray-800 rounded-2xl shadow-2xl">
            <p className="text-2xl text-gray-400">
              No results found. Try a different search.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default BooksPage;
