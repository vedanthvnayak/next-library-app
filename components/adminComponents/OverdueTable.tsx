"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BookUp } from "lucide-react";
import Modal from "@/components/adminComponents/Modal";
import { returnBookByTransactionId } from "@/app/[locale]/admin/duetoday/action";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface OverdueTableProps {
  overdueBooks: Array<{
    transactionId: string;
    bookId: string;
    bookName: string;
    userName: string;
    userEmail: string;
    issuedDate: string; // Date string in YYYY-MM-DD format
  }>;
}

export default function OverdueTable({
  overdueBooks: initialOverdueBooks,
}: OverdueTableProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionIdToReturn, setTransactionIdToReturn] = useState<
    string | null
  >(null);

  const handleReturnClick = (transactionId: string) => {
    setTransactionIdToReturn(transactionId);
    setIsModalOpen(true);
  };

  const handleReturn = async () => {
    if (transactionIdToReturn) {
      try {
        await returnBookByTransactionId(+transactionIdToReturn);
        toast.success("Book returned successfully!"); // Show success toast
        router.refresh(); // Refresh the page
      } catch (error) {
        console.error("Error returning book:", error);
        toast.error("Failed to return the book. Please try again."); // Show error toast
      } finally {
        setTransactionIdToReturn(null);
        setIsModalOpen(false);
      }
    }
  };

  const calculateFine = (issuedDate: string) => {
    const today = new Date();
    const issueDate = new Date(issuedDate);

    // Set the due date to be 15 days after the issue date
    const dueDate = new Date(issueDate);
    dueDate.setDate(dueDate.getDate() + 15); // 15 days to return the book

    const daysOverdue = Math.ceil(
      (today.getTime() - dueDate.getTime()) / (1000 * 3600 * 24)
    );

    // Calculate fine based on overdue days
    return daysOverdue > 0 ? daysOverdue * 10 : 0; // Rs 10 per day
  };

  const calculateReturnDate = (issuedDate: string) => {
    // Split the issued date string to get year, month, and day
    const [year, month, day] = issuedDate.split("-").map(Number);

    // Create a new date object based on the issued date
    const issueDate = new Date(year, month - 1, day); // Month is 0-indexed in Date

    // Calculate return date (15 days after the issued date)
    const returnDate = new Date(issueDate);
    returnDate.setDate(returnDate.getDate() + 15);

    // Format return date as 'YYYY-MM-DD'
    const formattedReturnDate = returnDate.toISOString().split("T")[0];
    return formattedReturnDate; // e.g., '2024-09-19'
  };

  return (
    <>
      <div className="overflow-x-auto bg-gray-900 rounded-lg shadow-xl">
        <table className="min-w-full text-xs sm:text-sm text-left text-gray-300">
          <thead className="bg-gray-800 text-gray-100">
            <tr>
              <th className="px-2 py-2 sm:px-4 sm:py-3 font-semibold">
                Transaction ID
              </th>
              <th className="px-2 py-2 sm:px-4 sm:py-3 font-semibold">
                Book ID
              </th>
              <th className="px-2 py-2 sm:px-4 sm:py-3 font-semibold">
                Book Name
              </th>
              <th className="px-2 py-2 sm:px-4 sm:py-3 font-semibold">
                User Name
              </th>
              <th className="px-2 py-2 sm:px-4 sm:py-3 font-semibold">
                User Email
              </th>
              <th className="px-2 py-2 sm:px-4 sm:py-3 font-semibold">
                Issued Date
              </th>
              <th className="px-2 py-2 sm:px-4 sm:py-3 font-semibold">
                Return Date
              </th>
              <th className="px-2 py-2 sm:px-4 sm:py-3 font-semibold">
                Fine (Rs)
              </th>
              <th className="px-2 py-2 sm:px-4 sm:py-3 font-semibold">
                Return Book
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {initialOverdueBooks.map((book) => (
              <tr
                key={book.transactionId}
                className="hover:bg-gray-800 transition-colors duration-200"
              >
                <td className="px-2 py-2 sm:px-4 sm:py-3">
                  {book.transactionId}
                </td>
                <td className="px-2 py-2 sm:px-4 sm:py-3">{book.bookId}</td>
                <td className="px-2 py-2 sm:px-4 sm:py-3">{book.bookName}</td>
                <td className="px-2 py-2 sm:px-4 sm:py-3">{book.userName}</td>
                <td className="px-2 py-2 sm:px-4 sm:py-3">
                  <Link
                    href={`mailto:${book.userEmail}`}
                    className="text-indigo-400 hover:text-indigo-300 transition-colors duration-200"
                  >
                    {book.userEmail}
                  </Link>
                </td>
                <td className="px-2 py-2 sm:px-4 sm:py-3">{book.issuedDate}</td>
                <td className="px-2 py-2 sm:px-4 sm:py-3">
                  {calculateReturnDate(book.issuedDate)}
                </td>
                <td className="px-2 py-2 sm:px-4 sm:py-3">
                  {calculateFine(book.issuedDate)}
                </td>
                <td className="px-2 py-2 sm:px-4 sm:py-3">
                  <button
                    onClick={() => handleReturnClick(book.transactionId)}
                    className="text-indigo-400 hover:text-indigo-300 transition-colors duration-200 bg-indigo-900 bg-opacity-30 hover:bg-opacity-50 rounded-full p-2"
                    aria-label={`Return Book ${book.bookName}`}
                  >
                    <BookUp className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {initialOverdueBooks.length === 0 && (
        <p className="text-center text-gray-400 mt-4">No overdue books.</p>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleReturn}
        title="Confirm Return"
        message={`Are you sure you want to return the book with Transaction ID: ${transactionIdToReturn}?`}
        type="confirm"
      />

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}
