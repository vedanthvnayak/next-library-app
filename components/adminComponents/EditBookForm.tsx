"use client";

import React from "react";
import { IBook } from "@/repository/models/books.model";

interface EditBookFormProps {
  book: IBook;
  onSave: (bookData: IBook) => void;
  onCancel: () => void;
}

export default function EditBookForm({
  book,
  onSave,
  onCancel,
}: EditBookFormProps) {
  const [bookData, setBookData] = React.useState<IBook>(book);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBookData({
      ...bookData,
      [name]:
        name === "availableNumberOfCopies" ||
        name === "totalNumberOfCopies" ||
        name === "numofPages"
          ? Number(value)
          : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(bookData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-lg shadow-xl w-full max-w-md max-h-[80vh] overflow-auto">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4 text-indigo-300">Edit Book</h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            {[
              { label: "Title", name: "title", type: "text" },
              { label: "Author", name: "author", type: "text" },
              { label: "Publisher", name: "publisher", type: "text" },
              { label: "Genre", name: "genre", type: "text" },
              { label: "ISBN No", name: "isbnNo", type: "text" },
              { label: "Pages", name: "numofPages", type: "number" },
              {
                label: "Total Copies",
                name: "totalNumberOfCopies",
                type: "number",
              },
              {
                label: "Available Copies",
                name: "availableNumberOfCopies",
                type: "number",
              },
            ].map(({ label, name, type }) => (
              <div key={name} className="space-y-1">
                <label
                  htmlFor={name}
                  className="block text-sm font-medium text-indigo-200"
                >
                  {label}
                </label>
                <input
                  type={type}
                  id={name}
                  name={name}
                  value={bookData[name as keyof IBook] || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-100"
                />
              </div>
            ))}
            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border border-gray-600 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
