"use client";

import React, { useState, useEffect } from "react";
import {
  PencilIcon,
  Trash2Icon,
  PlusCircleIcon,
  ChevronDown,
} from "lucide-react";
import { IBook } from "@/repository/models/books.model";
import { useRouter, useSearchParams } from "next/navigation";
import EditBookForm from "@/components/adminComponents/EditBookForm";
import Modal from "@/components/adminComponents/Modal";
import {
  deleteBook,
  getBookInfo,
  updateBookInfo,
  addBook,
} from "@/app/[locale]/admin/books/action";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface BooksTableProps {
  books: IBook[];
}

type SortKey = keyof IBook;
type SortOrder = "asc" | "desc";

const SortArrow = ({ direction }: { direction: SortOrder }) => (
  <svg
    className={`ml-1 h-4 w-4 inline-block transition-transform duration-200 ease-in-out ${
      direction === "asc" ? "transform rotate-180" : ""
    }`}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 9l6 6 6-6" />
  </svg>
);

export default function BooksTable({ books: initialBooks }: BooksTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editBookData, setEditBookData] = useState<IBook | null>(null);
  const [books, setBooks] = useState(initialBooks);

  const defaultSort = searchParams.get("sort") || "title-asc";
  const [field, setField] = useState<SortKey>(
    (defaultSort.split("-")[0] as SortKey) || "title"
  );
  const [direction, setDirection] = useState<SortOrder>(
    (defaultSort.split("-")[1] as SortOrder) || "asc"
  );

  useEffect(() => {
    const sortedBooks = [...initialBooks].sort((a, b) => {
      if (a[field] < b[field]) return direction === "asc" ? -1 : 1;
      if (a[field] > b[field]) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setBooks(sortedBooks);
  }, [initialBooks, field, direction]);

  const handleSort = (key: SortKey) => {
    const newDirection = field === key && direction === "asc" ? "desc" : "asc";
    setField(key);
    setDirection(newDirection);
    router.replace(`?sort=${key}-${newDirection}`);
  };

  const handleAddBookClick = () => {
    setIsEditing(true);
    setEditBookData({
      id: 0,
      title: "",
      author: "",
      publisher: "",
      genre: "",
      isbnNo: "",
      numofPages: 0,
      totalNumberOfCopies: 0,
      availableNumberOfCopies: 0,
    });
  };

  const handleEditClick = async (id: number) => {
    try {
      const bookInfo = await getBookInfo(id);
      if (bookInfo) {
        setEditBookData(bookInfo.bookData);
        setIsEditing(true);
        setSelectedBookId(id);
      } else {
        toast.error("Failed to fetch book details.");
      }
    } catch (error) {
      toast.error("An error occurred while fetching book details.");
    }
  };

  const handleDeleteClick = (id: number) => {
    setSelectedBookId(id);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (selectedBookId !== null) {
      try {
        const result = await deleteBook(selectedBookId);

        if (result.success) {
          toast.success("Book deleted successfully.");
          router.refresh();
        } else {
          throw new Error(result.error || "Failed to delete book.");
        }
      } catch (error) {
        toast.error("Failed to delete book.");
      } finally {
        setIsModalOpen(false);
      }
    }
  };

  const handleSaveChanges = async (updatedBookData: IBook) => {
    try {
      let result;
      if (editBookData?.id === 0) {
        result = await addBook(updatedBookData);
      } else {
        result = await updateBookInfo(updatedBookData);
      }

      if (result.success) {
        toast.success(
          editBookData?.id === 0
            ? "Book added successfully."
            : "Book updated successfully."
        );
        setIsEditing(false);
        setEditBookData(null);
        router.refresh();
      } else {
        throw new Error(result.error || "Failed to save book.");
      }
    } catch (error) {
      toast.error("Failed to save book.");
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditBookData(null);
  };

  const SortableHeader = ({
    children,
    sortKey,
  }: {
    children: React.ReactNode;
    sortKey: SortKey;
  }) => (
    <th
      className="px-2 py-2 sm:px-4 sm:py-3 font-semibold cursor-pointer group"
      onClick={() => handleSort(sortKey)}
    >
      <div className="flex items-center justify-between">
        <span>{children}</span>
        <span
          className={`transition-colors duration-200 ${
            field === sortKey
              ? "text-indigo-400"
              : "text-gray-400 group-hover:text-gray-300"
          }`}
        >
          <SortArrow direction={field === sortKey ? direction : "asc"} />
        </span>
      </div>
    </th>
  );

  return (
    <>
      <div className="mb-4 mt-4 flex justify-center">
        <button
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
          onClick={handleAddBookClick}
        >
          <PlusCircleIcon className="h-5 w-5" />
          <span>Add Book</span>
        </button>
        <div className="flex items-center space-x-4"></div>
      </div>
      <div className="overflow-x-auto bg-gray-900 rounded-lg shadow-xl">
        <table className="min-w-full text-xs sm:text-sm text-left text-gray-300">
          <thead className="bg-gray-800 text-gray-100">
            <tr>
              <SortableHeader sortKey="id">ID</SortableHeader>
              <SortableHeader sortKey="title">Title</SortableHeader>
              <SortableHeader sortKey="author">Author</SortableHeader>
              <SortableHeader sortKey="publisher">Publisher</SortableHeader>
              <SortableHeader sortKey="genre">Genre</SortableHeader>
              <SortableHeader sortKey="isbnNo">ISBN</SortableHeader>
              <SortableHeader sortKey="numofPages">Pages</SortableHeader>
              <SortableHeader sortKey="totalNumberOfCopies">
                Total
              </SortableHeader>
              <SortableHeader sortKey="availableNumberOfCopies">
                Available
              </SortableHeader>
              <th className="px-2 py-2 sm:px-4 sm:py-3 font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {books.map((book) => (
              <tr
                key={book.id}
                className="hover:bg-gray-800 transition-colors duration-200"
              >
                <td className="px-2 py-2 sm:px-4 sm:py-3">{book.id}</td>
                <td className="px-2 py-2 sm:px-4 sm:py-3">{book.title}</td>
                <td className="px-2 py-2 sm:px-4 sm:py-3">{book.author}</td>
                <td className="px-2 py-2 sm:px-4 sm:py-3 hidden sm:table-cell">
                  {book.publisher}
                </td>
                <td className="px-2 py-2 sm:px-4 sm:py-3 hidden md:table-cell">
                  {book.genre}
                </td>
                <td className="px-2 py-2 sm:px-4 sm:py-3 hidden lg:table-cell">
                  {book.isbnNo}
                </td>
                <td className="px-2 py-2 sm:px-4 sm:py-3 hidden xl:table-cell">
                  {book.numofPages}
                </td>
                <td className="px-2 py-2 sm:px-4 sm:py-3">
                  {book.totalNumberOfCopies}
                </td>
                <td className="px-2 py-2 sm:px-4 sm:py-3">
                  {book.availableNumberOfCopies}
                </td>
                <td className="px-2 py-2 sm:px-4 sm:py-3">
                  <div className="flex items-center space-x-3">
                    <button
                      className="text-indigo-400 hover:text-indigo-300 transition-colors duration-200 bg-indigo-900 bg-opacity-30 hover:bg-opacity-50 rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                      onClick={() => handleEditClick(book.id)}
                      aria-label={`Edit ${book.title}`}
                    >
                      <PencilIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                    <button
                      className="text-red-400 hover:text-red-300 transition-colors duration-200 bg-red-900 bg-opacity-30 hover:bg-opacity-50 rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                      onClick={() => handleDeleteClick(book.id)}
                      aria-label={`Delete ${book.title}`}
                    >
                      <Trash2Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isEditing && (
        <EditBookForm
          book={editBookData}
          onSave={handleSaveChanges}
          onCancel={handleCancelEdit}
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
        message="Are you sure you want to delete this book?"
        title="Delete book"
        type="delete"
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
