"use client";

import React, { useState } from "react";
import { BookOpen, Search, ArrowLeft } from "lucide-react";

interface Book {
  id: number;
  title: string;
  author: string;
  borrowDate: string;
}

const dummyBooks: Book[] = [
  {
    id: 1,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    borrowDate: "2023-05-01",
  },
  {
    id: 2,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    borrowDate: "2023-05-15",
  },
  { id: 3, title: "1984", author: "George Orwell", borrowDate: "2023-06-01" },
];

export default function BorrowedBooksClient() {
  const [userInput, setUserInput] = useState("");
  const [borrowedBooks, setBorrowedBooks] = useState<Book[]>([]);
  const [showBooks, setShowBooks] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBorrowedBooks(dummyBooks);
    setShowBooks(true);
  };

  const handleReturn = (bookId: number) => {
    setBorrowedBooks(borrowedBooks.filter((book) => book.id !== bookId));
  };

  const handleBack = () => {
    setShowBooks(false);
    setUserInput("");
  };

  return (
    <div className="bg-gray-800 shadow-xl rounded-lg overflow-hidden">
      {!showBooks ? (
        <form onSubmit={handleSubmit} className="p-6">
          <div className="flex items-center border-b border-gray-700 py-2">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Enter your User ID or Email to list borrowed book"
              className="appearance-none bg-transparent border-none w-full text-white mr-3 py-1 px-2 leading-tight focus:outline-none"
              required
            />
            <button
              type="submit"
              className="flex-shrink-0 bg-indigo-500 hover:bg-indigo-600 border-indigo-500 hover:border-indigo-600 text-sm border-4 text-white py-1 px-2 rounded"
            >
              <Search className="h-5 w-5" />
            </button>
          </div>
        </form>
      ) : (
        <div className="p-6">
          <button
            onClick={handleBack}
            className="mb-4 flex items-center text-indigo-400 hover:text-indigo-300 transition-colors duration-200"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </button>
          {borrowedBooks.length > 0 ? (
            <ul className="space-y-4">
              {borrowedBooks.map((book) => (
                <li
                  key={book.id}
                  className="bg-gray-700 rounded-lg p-4 flex justify-between items-center"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {book.title}
                    </h3>
                    <p className="text-gray-400">{book.author}</p>
                    <p className="text-sm text-gray-500">
                      Borrowed on: {book.borrowDate}
                    </p>
                  </div>
                  <button
                    onClick={() => handleReturn(book.id)}
                    className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded transition duration-200"
                  >
                    Return
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8">
              <BookOpen className="h-16 w-16 text-indigo-400 mx-auto mb-4" />
              <p className="text-white text-xl">No books currently borrowed</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
