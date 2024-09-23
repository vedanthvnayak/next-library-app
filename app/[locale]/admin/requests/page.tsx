import React from "react";
import { DrizzleManager } from "@/db/drizzleDbConnection";
import { TransactionRepository } from "@/repository/transaction.repository";
import Search from "@/components/adminComponents/Search";
import PaginationControls from "@/components/ui/PaginationControls";
import { useRouter } from "next/router";
import RequestManager from "@/components/adminComponents/requestManager";

interface RequestsPageProps {
  searchParams: {
    offset?: string;
    limit?: string;
    search?: string;
  };
}

const transactionRepository = new TransactionRepository();

export default async function RequestsPage({
  searchParams,
}: RequestsPageProps) {
  const offset = parseInt(searchParams.offset || "0", 10);
  const limit = parseInt(searchParams.limit || "8", 10);
  const search = searchParams.search || "";

  const response = await transactionRepository.listPendingRequest({
    offset,
    limit,
    search,
  });

  if (!response) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <p className="text-2xl text-red-500 bg-gray-800 bg-opacity-50 p-6 rounded-lg shadow-lg">
          Oops, something went wrong.
        </p>
      </div>
    );
  }

  const { items: transactions, pagination } = response;

  const totalPages = Math.ceil(pagination.total / limit);
  const currentPage = Math.floor(offset / limit) + 1;

  return (
    <section className="w-full py-8 sm:py-12 lg:py-16 bg-gray-950 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6">
          Transaction Management
        </h1>

        {/* Search Component */}
        <div className="mb-6 sm:mb-8">
          <Search
            placeholder="Search transactions, users, statuses..."
            baseUrl="/admin/requests"
          />
        </div>

        {/* Pagination Controls */}
        <div className="mb-6 sm:mb-8 flex justify-center">
          <PaginationControls
            totalPages={totalPages}
            currentPage={currentPage}
            baseUrl="/admin/requests"
          />
        </div>

        {/* Transaction Table */}
        <div className="overflow-x-auto bg-gray-900 rounded-lg shadow-xl">
          <RequestManager transactions={transactions} />
        </div>
      </div>
    </section>
  );
}
