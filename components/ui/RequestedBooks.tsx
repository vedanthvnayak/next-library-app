"use client";

import { useState, useEffect, useRef } from "react";
import { Book, CheckCircle, XCircle, RotateCcw, Clock, X } from "lucide-react";
import { getTransactions } from "@/app/[locale]/books/action";
import { ITransaction } from "@/repository/models/transactions.model";

const statusIcons = {
  pending: <Clock className="w-5 h-5 text-yellow-400" />,
  approved: <CheckCircle className="w-5 h-5 text-green-400" />,
  rejected: <XCircle className="w-5 h-5 text-red-400" />,
  returned: <RotateCcw className="w-5 h-5 text-blue-400" />,
};

const statusColors = {
  pending: "bg-yellow-400",
  approved: "bg-green-400",
  rejected: "bg-red-400",
  returned: "bg-blue-400",
};

const formatDate = (dateInput: string | Date) => {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  return new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
};

const calculateDueDate = (issueDateInput: string | Date) => {
  const issueDate =
    typeof issueDateInput === "string"
      ? new Date(issueDateInput)
      : issueDateInput;
  const dueDate = new Date(issueDate);
  dueDate.setDate(issueDate.getDate() + 14);
  return formatDate(dueDate);
};

const cancelRequest = (transactionId: number) => {
  console.log(`Cancelling request for transaction ID: ${transactionId}`);
};

export default function Component({ userId }: { userId: number }) {
  const [filter, setFilter] = useState("all");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await getTransactions(userId);
        setTransactions(data.data);
      } catch (err) {
        console.error("Error fetching transactions:", err);
        setError("Failed to fetch transactions.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [userId]);

  const filteredTransactions = transactions.filter((transaction) =>
    filter === "all" ? true : transaction.status === filter
  );

  const FilterButton = ({
    status,
    label,
  }: {
    status: string;
    label: string;
  }) => (
    <button
      onClick={() => setFilter(status)}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ease-in-out whitespace-nowrap ${
        filter === status
          ? "bg-indigo-600 text-white shadow-lg"
          : "bg-gray-700 text-gray-300 hover:bg-gray-600"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="bg-gray-800 p-4 sm:p-8 rounded-2xl shadow-2xl">
      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 flex items-center">
        <Book className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 text-indigo-400" />
        My Requested Books
      </h2>
      <div
        ref={filterRef}
        className="flex overflow-x-auto pb-3 mb-6 sm:mb-8 scrollbar-hide"
      >
        <div className="flex space-x-3">
          <FilterButton status="all" label="All" />
          <FilterButton status="pending" label="Requested" />
          <FilterButton status="approved" label="Approved" />
          <FilterButton status="rejected" label="Rejected" />
          <FilterButton status="returned" label="Returned" />
        </div>
      </div>

      <div className="min-h-[300px] bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-inner">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <Book className="w-12 h-12 sm:w-16 sm:h-16 mb-4 opacity-50 animate-pulse" />
            <p className="text-lg sm:text-xl font-medium">Loading...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full text-red-400">
            <Book className="w-12 h-12 sm:w-16 sm:h-16 mb-4 opacity-50" />
            <p className="text-lg sm:text-xl font-medium">{error}</p>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <Book className="w-12 h-12 sm:w-16 sm:h-16 mb-4 opacity-50" />
            <p className="text-lg sm:text-xl font-medium text-center">
              No books found for the selected filter.
            </p>
          </div>
        ) : (
          <ul className="space-y-4">
            {filteredTransactions.map((transaction) => (
              <li
                key={transaction.transactionId}
                className="bg-gray-700 p-4 sm:p-5 rounded-xl transition-all duration-300 ease-in-out hover:bg-gray-600 hover:shadow-md"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-col mb-3 sm:mb-0">
                    <span className="text-white text-base sm:text-lg font-medium">
                      {transaction.bookName
                        ? transaction.bookName
                        : `Book ID: ${transaction.bookId}`}
                    </span>
                    <span className="text-gray-400 text-xs sm:text-sm">
                      Issued: {formatDate(transaction.issuedDate)}
                    </span>
                    <span className="text-gray-400 text-xs sm:text-sm">
                      Due: {calculateDueDate(transaction.issuedDate)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end sm:space-x-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold text-gray-900 ${
                        statusColors[transaction.status]
                      }`}
                    >
                      {transaction.status}
                    </span>
                    {statusIcons[transaction.status]}
                    {transaction.status === "pending" && (
                      <button
                        onClick={() => cancelRequest(transaction.transactionId)}
                        className="ml-3 p-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors duration-200"
                        aria-label="Cancel request"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
