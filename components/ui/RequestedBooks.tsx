"use client";
import { useState, useEffect } from "react";
import { Book, CheckCircle, XCircle, RotateCcw, Clock } from "lucide-react";
import { getTransactions } from "@/app/books/action";
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
  }).format(date); // This formats the date in dd/mm/yyyy
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

export default function RequestedBooks({ userId }: { userId: number }) {
  const [filter, setFilter] = useState("all");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ease-in-out ${
        filter === status
          ? "bg-indigo-600 text-white shadow-lg transform scale-105"
          : "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:shadow"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl">
      <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
        <Book className="w-8 h-8 mr-3 text-indigo-400" />
        My Requested Books
      </h2>
      <div className="flex flex-wrap gap-3 mb-8">
        <FilterButton status="all" label="All" />
        <FilterButton status="pending" label="Requested" />
        <FilterButton status="approved" label="Approved" />
        <FilterButton status="rejected" label="Rejected" />
        <FilterButton status="returned" label="Returned" />
      </div>

      <div className="min-h-[300px] bg-gray-800 rounded-xl p-6 shadow-inner">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <Book className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-xl font-medium">Loading...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full text-red-400">
            <Book className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-xl font-medium">{error}</p>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <Book className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-xl font-medium">
              No books found for the selected filter.
            </p>
          </div>
        ) : (
          <ul className="space-y-4">
            {filteredTransactions.map((transaction) => (
              <li
                key={transaction.transactionId}
                className="flex items-center justify-between bg-gray-700 p-5 rounded-lg transition-all duration-300 ease-in-out hover:bg-gray-600 hover:shadow-md"
              >
                <div className="flex flex-col">
                  <span className="text-white text-lg font-medium">
                    {transaction.bookName
                      ? transaction.bookName
                      : `Book ID: ${transaction.bookId}`}
                  </span>
                  <span className="text-gray-400 text-sm">
                    Issued on: {formatDate(transaction.issuedDate)}
                  </span>
                  <span className="text-gray-400 text-sm">
                    Due by: {calculateDueDate(transaction.issuedDate)}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold text-gray-900 ${
                      statusColors[transaction.status]
                    }`}
                  >
                    {transaction.status}
                  </span>
                  {statusIcons[transaction.status]}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
