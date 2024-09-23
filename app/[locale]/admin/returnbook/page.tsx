import React from "react";
import BorrowedBooksClient from "@/components/adminComponents/ReturneBook";

export default function BorrowedBooksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-white mb-8">
          Return Books
        </h1>
        <BorrowedBooksClient />
      </div>
    </div>
  );
}
