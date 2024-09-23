"use client";

import React, { useState } from "react";
import { ITransaction } from "@/repository/models/transactions.model";
import { Trash2 } from "lucide-react";
import { deleteTransaction } from "@/app/[locale]/admin/transactions/action";
import Modal from "@/components/adminComponents/Modal";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);
};

interface TransactionsTableProps {
  transactions: ITransaction[];
}

const TransactionsTable: React.FC<TransactionsTableProps> = ({
  transactions,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState<
    number | null
  >(null);
  const router = useRouter();

  const handleDeleteClick = (id: number) => {
    setSelectedTransactionId(id);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (selectedTransactionId !== null) {
      try {
        const result = await deleteTransaction(selectedTransactionId);
        if (result.success) {
          toast.success("Transaction deleted successfully.");
          router.refresh();
        } else {
          throw new Error(result.error || "Failed to delete transaction.");
        }
      } catch (error) {
        toast.error("Failed to delete transaction.");
      } finally {
        setIsModalOpen(false);
      }
    }
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-800 text-gray-100">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-200">
                Transaction ID
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-200">
                User ID
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-200">
                Book ID
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-200">
                Issued Date (MM/DD/YYYY)
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-200">
                Status
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-200">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr
                key={transaction.transactionId}
                className="border-t border-gray-700 hover:bg-gray-700 transition-colors duration-200"
              >
                <td className="px-4 py-2">{transaction.transactionId}</td>
                <td className="px-4 py-2">{transaction.userId}</td>
                <td className="px-4 py-2">{transaction.bookId}</td>
                <td className="px-4 py-2">
                  {formatDate(new Date(transaction.issuedDate))}
                </td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      transaction.status === "approved"
                        ? "bg-green-500 text-white"
                        : transaction.status === "rejected"
                        ? "bg-red-500 text-white"
                        : transaction.status === "returned"
                        ? "bg-blue-500 text-white"
                        : transaction.status === "pending"
                        ? "bg-yellow-500 text-white"
                        : "bg-gray-500 text-white"
                    }`}
                  >
                    {transaction.status}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleDeleteClick(transaction.transactionId)}
                    className="text-red-500 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 rounded-full p-1 transition-colors duration-200"
                    aria-label={`Delete transaction ${transaction.transactionId}`}
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
        message="Are you sure you want to delete this transaction?"
        title="Delete Transaction"
        type="delete"
      />

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        closeButton
      />
    </>
  );
};

export default TransactionsTable;
