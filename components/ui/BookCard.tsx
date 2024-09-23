"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ExclamationCircleIcon,
  FireIcon,
  BookOpenIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import Modal from "@/components/adminComponents/Modal";
import { requestBook } from "@/app/[locale]/books/action";
import { IBook } from "@/repository/models/books.model";

interface NotificationProps {
  message: string;
  onClose: () => void;
  success?: boolean;
}

const Notification: React.FC<NotificationProps> = ({
  message,
  onClose,
  success = false,
}) => {
  return (
    <div
      className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg text-base transition-transform duration-300 ease-out transform ${
        success ? "bg-green-500" : "bg-red-500"
      } text-white`}
      style={{ maxWidth: "400px" }}
    >
      <div className="flex justify-between items-center">
        <p className="mr-4 font-semibold">{message}</p>
        <button
          onClick={onClose}
          className="ml-4 text-white hover:text-gray-200 focus:outline-none"
          aria-label="Close notification"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

interface BookCardProps {
  book: IBook;
  session: any;
}

export default function Component({ book, session }: BookCardProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const totalCopies = book.totalNumberOfCopies;
  const availableCopies = book.availableNumberOfCopies;
  const borrowedCopies = totalCopies - availableCopies;
  const isLowAvailability = availableCopies <= 2;
  const isHot = borrowedCopies >= 3;

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleBorrowClick = async (id: number) => {
    try {
      const transactionInfo = await requestBook(session.user.id, id);
      if (transactionInfo) {
        setMessage("Requested successfully");
        setIsSuccess(true);
      } else {
        setMessage("Something went wrong");
        setIsSuccess(false);
      }
    } catch (error) {
      setMessage("Something went wrong");
      setIsSuccess(false);
    } finally {
      setIsModalOpen(false);
    }
  };

  const handleCloseNotification = () => {
    setMessage(null);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex justify-center items-center ">
      <div
        className={`flex flex-col bg-gray-800 bg-opacity-50 border border-gray-700 rounded-2xl shadow-2xl transition-all duration-500 transform hover:scale-105 hover:shadow-3xl overflow-hidden ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
        style={{ width: "320px", height: "420px" }}
      >
        <div className="relative w-full h-60">
          {book.coverimagelink ? (
            <img
              src={book.coverimagelink}
              alt={`Cover of ${book.title}`}
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-700">
              <BookOpenIcon className="h-24 w-24 text-gray-400" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent flex flex-col justify-end p-4">
            <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
              {book.title}
            </h3>
            <p className="text-lg text-gray-300">{book.author}</p>
          </div>
        </div>
        <div className="flex-grow flex flex-col justify-between p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-center text-indigo-400 text-center">
              <BookOpenIcon className="h-6 w-6 mr-2" />
              <p className="text-sm">{book.genre}</p>
            </div>
            <div className="flex items-center justify-center text-indigo-400 text-center">
              {isLowAvailability && (
                <ExclamationCircleIcon className="h-6 w-6 text-red-500 mr-2" />
              )}
              {isHot && <FireIcon className="h-6 w-6 text-orange-500 mr-2" />}
              <p className="text-sm">{availableCopies} Available</p>
            </div>
          </div>
          <div className="mt-6 flex space-x-3">
            {session && session.user ? (
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex-1 inline-flex items-center justify-center rounded-xl text-base font-medium bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 h-12"
              >
                Borrow Now
              </button>
            ) : null}
            <Link
              href={`/bookinfo?id=${book.id}`}
              className="flex-1 inline-flex items-center justify-center rounded-xl text-base font-medium bg-gray-700 text-white hover:bg-gray-600 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 h-12 text-center"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onConfirm={() => handleBorrowClick(book.id)}
          title="Confirm Borrow"
          message={`Are you sure you want to borrow the book "${book.title}"?`}
          type="confirm"
        />
      )}

      {message && (
        <Notification
          message={message}
          onClose={handleCloseNotification}
          success={isSuccess}
        />
      )}
    </div>
  );
}
