"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { IBook } from "@/repository/models/books.model";
import {
  BookOpen,
  User,
  Globe,
  Tag,
  Hash,
  FileText,
  Archive,
  ArrowLeft,
  Star,
  Calendar,
  DollarSign,
  Bookmark,
} from "lucide-react";

interface BookInfoClientProps {
  book: IBook | null;
}

export default function BookInfoClient({ book }: BookInfoClientProps) {
  const router = useRouter();
  const [isBookmarked, setIsBookmarked] = useState(false);

  if (!book) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900 flex items-center justify-center p-4">
        <div className="text-center animate-fade-in-up">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 shadow-2xl max-w-md w-full">
            <BookOpen className="w-16 h-16 text-indigo-400 mx-auto mb-6 animate-pulse" />
            <h2 className="text-3xl font-bold text-gray-100 mb-3">
              Book Not Found
            </h2>
            <p className="text-gray-300 mb-8 text-lg">
              We couldn&apos;t find the book you&apos;re looking for.
            </p>
            <button
              onClick={() => router.back()}
              className="inline-flex items-center justify-center rounded-md bg-indigo-600 text-white py-2 px-4 text-lg font-semibold hover:bg-indigo-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900 transform hover:scale-105"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Go Back
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900 py-12 px-4">
      <div className="container max-w-6xl mx-auto animate-fade-in-up">
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 shadow-2xl">
          <div className="flex justify-between items-center mb-8">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center rounded-md bg-gray-700 text-white py-2 px-4 hover:bg-gray-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900 transform hover:scale-105"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Go Back
            </button>
            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`p-2 rounded-full transition-all duration-300 ${
                isBookmarked ? "bg-indigo-600" : "bg-gray-700"
              }`}
              aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
            >
              <Bookmark
                className={`w-6 h-6 ${
                  isBookmarked ? "text-white" : "text-indigo-400"
                }`}
              />
            </button>
          </div>
          <div className="flex flex-col md:flex-row gap-8 mb-8">
            <div className="w-full md:w-1/3">
              <div className="bg-gray-700 rounded-lg p-4 h-full flex items-center justify-center">
                <BookOpen className="w-32 h-32 text-indigo-400" />
              </div>
            </div>
            <div className="w-full md:w-2/3">
              <h1 className="text-4xl font-bold text-indigo-300 mb-4">
                {book.title}
              </h1>
              <p className="text-xl text-gray-300 mb-4">by {book.author}</p>
              <div className="flex items-center space-x-4 mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-500 text-white">
                  {book.genre}
                </span>
                <span className="inline-flex items-center text-yellow-400">
                  <Star className="w-5 h-5 mr-1 fill-current" />
                  4.5
                </span>
              </div>
              <p className="text-gray-400 mb-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <BookInfoItem
              icon={<Globe className="w-5 h-5" />}
              label="Publisher"
              value={book.publisher}
            />
            <BookInfoItem
              icon={<FileText className="w-5 h-5" />}
              label="ISBN"
              value={book.isbnNo}
            />
            <BookInfoItem
              icon={<BookOpen className="w-5 h-5" />}
              label="Pages"
              value={book.numofPages.toString()}
            />
            <BookInfoItem
              icon={<Archive className="w-5 h-5" />}
              label="Available Copies"
              value={book.availableNumberOfCopies.toString()}
            />
            <BookInfoItem
              icon={<Calendar className="w-5 h-5" />}
              label="Publication Date"
              value="January 1, 2023"
            />
            <BookInfoItem
              icon={<DollarSign className="w-5 h-5" />}
              label="Price"
              value="$19.99"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

interface BookInfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function BookInfoItem({ icon, label, value }: BookInfoItemProps) {
  return (
    <div className="flex items-start space-x-4 p-4 rounded-lg bg-gray-700 bg-opacity-20 transition-all duration-300 ease-in-out hover:bg-opacity-30 hover:scale-105">
      <div className="flex-shrink-0">
        <div className="p-2 bg-indigo-500 bg-opacity-20 rounded-full text-indigo-400">
          {icon}
        </div>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-400 mb-1">{label}</p>
        <p className="text-lg font-semibold text-white">{value}</p>
      </div>
    </div>
  );
}
