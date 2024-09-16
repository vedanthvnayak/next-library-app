"use client";

import React from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { ITransaction } from "@/repository/models/transactions.model";
import { updateStatus } from "@/app/admin/requests/action";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface RequestManagerProps {
  transactions: ITransaction[];
}

const RequestManager: React.FC<RequestManagerProps> = ({ transactions }) => {
  const router = useRouter();

  const handleApprove = async (transactionId: number) => {
    try {
      await updateStatus(transactionId, "approved");
      router.refresh();
      toast.success("Transaction approved successfully.");
    } catch (error) {
      toast.error("Failed to approve transaction.");
    }
  };

  const handleReject = async (transactionId: number) => {
    try {
      await updateStatus(transactionId, "rejected");
      router.refresh();
      toast.success("Transaction rejected successfully.");
    } catch (error) {
      toast.error("Failed to reject transaction.");
    }
  };

  return (
    <div className="overflow-x-auto bg-gray-900 rounded-lg shadow-xl p-4">
      {transactions.length === 0 ? (
        <p className="text-center text-gray-400">No transactions found.</p>
      ) : (
        <table className="min-w-full text-sm text-left text-gray-300">
          <thead className="bg-gray-700 text-gray-100">
            <tr>
              <th className="px-4 py-3 font-semibold">Transaction ID</th>
              <th className="px-4 py-3 font-semibold">User ID</th>
              <th className="px-4 py-3 font-semibold">Book ID</th>
              <th className="px-4 py-3 font-semibold">Request Date</th>
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-600">
            {transactions.map((transaction) => (
              <tr
                key={transaction.transactionId}
                className="hover:bg-gray-700 transition-colors duration-200"
              >
                <td className="px-4 py-3">{transaction.transactionId}</td>
                <td className="px-4 py-3">{transaction.userId}</td>
                <td className="px-4 py-3">{transaction.bookId}</td>
                <td className="px-4 py-3">
                  {new Date(transaction.issuedDate).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleApprove(transaction.transactionId)}
                      className="text-green-400 hover:text-green-300 transition-colors duration-200 bg-green-900 p-2 rounded-md"
                      aria-label="Approve transaction"
                    >
                      <CheckCircle size={18} />
                    </button>
                    <button
                      onClick={() => handleReject(transaction.transactionId)}
                      className="text-red-400 hover:text-red-300 transition-colors duration-200 bg-red-900 p-2 rounded-md"
                      aria-label="Reject transaction"
                    >
                      <XCircle size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

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
    </div>
  );
};

export default RequestManager;
