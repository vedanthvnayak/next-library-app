"use client";

import React, { useRef, useState, useEffect } from "react";
import { FaBook, FaDatabase, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useRouter } from "next/navigation";

interface Book {
  id: number;
  title: string;
  author: string;
  genre: string;
  availableNumberOfCopies: number;
}

interface TopBooksProps {
  topBooks: Book[];
  title: string;
  maxBooksPerRow: number;
}

const TopBooks: React.FC<TopBooksProps> = ({
  topBooks,
  title,
  maxBooksPerRow,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkOverflow = () => {
      if (containerRef.current && topBooks.length > 3) {
        const container = containerRef.current;
        setIsOverflowing(container.scrollWidth > container.clientWidth);
      } else {
        setIsOverflowing(false);
      }
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [topBooks]);

  const handleInfoClick = (id: number) => {
    router.push(`/bookinfo?id=${id}`);
  };

  const scroll = (direction: "left" | "right") => {
    if (containerRef.current) {
      const scrollAmount =
        direction === "left"
          ? -containerRef.current.clientWidth / 2
          : containerRef.current.clientWidth / 2;
      containerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const showScrollButtons = topBooks.length > 3;

  return (
    <section className="w-full py-16 sm:py-24 bg-gradient-to-r from-gray-900 via-gray-950 to-gray-900 overflow-hidden px-4 sm:px-6 md:px-8 lg:px-12">
      <div className="container mx-auto text-center relative">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-12 text-transparent bg-clip-text bg-gradient-to-r from-gray-100 via-gray-300 to-indigo-400">
          {title}
        </h2>

        <div className="relative">
          {showScrollButtons && isOverflowing && (
            <button
              onClick={() => scroll("left")}
              className="absolute -left-4 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 transition duration-300 ease-in-out z-10 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              aria-label="Scroll Left"
            >
              <FaArrowLeft size={20} />
            </button>
          )}
          <div
            ref={containerRef}
            className={`overflow-x-auto flex ${
              showScrollButtons ? "gap-6" : "gap-4"
            } py-4 px-4 sm:px-6 md:px-8 lg:px-12 ${
              showScrollButtons ? "" : "justify-center"
            }`}
            style={{
              scrollBehavior: showScrollButtons ? "smooth" : "auto",
              minWidth: showScrollButtons ? "100%" : "auto",
              display: "flex",
              justifyContent: topBooks.length <= 3 ? "center" : "flex-start",
            }}
          >
            <div
              className={`flex flex-nowrap ${
                showScrollButtons ? "" : "justify-center"
              }`}
              style={{ gap: showScrollButtons ? "1.5rem" : "1rem" }}
            >
              {topBooks.map((book) => (
                <div
                  key={book.id}
                  className="flex flex-col p-4 sm:p-6 bg-gray-850 border border-gray-800 rounded-2xl shadow-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex-shrink-0 w-[280px] sm:w-[300px] min-h-[400px]"
                >
                  <div className="flex flex-col flex-grow h-full">
                    <div className="flex-grow flex flex-col justify-between mb-6">
                      <div className="flex-grow">
                        <h3 className="text-lg sm:text-xl font-semibold text-white text-center mb-3">
                          {book.title}
                        </h3>
                        <p className="text-md text-gray-400 text-center">
                          {book.author}
                        </p>
                      </div>
                      <div className="mt-6 px-4 py-3 bg-gray-900 rounded-xl backdrop-blur-lg">
                        <div className="flex items-center justify-center text-gray-300 text-center">
                          <FaBook className="mr-2" />
                          <p className="text-sm">{book.genre}</p>
                        </div>
                        <div className="flex items-center justify-center text-gray-300 text-center mt-2">
                          <FaDatabase className="mr-2" />
                          <p className="text-sm">
                            {book.availableNumberOfCopies} Copies Available
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-auto flex space-x-3">
                      <button
                        onClick={() => handleInfoClick(book.id)}
                        className="flex-1 inline-flex items-center justify-center rounded-lg text-sm font-medium bg-gray-800 text-white hover:bg-gray-700 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800 h-10"
                      >
                        Info
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {showScrollButtons && isOverflowing && (
            <button
              onClick={() => scroll("right")}
              className="absolute -right-4 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 transition duration-300 ease-in-out z-10 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              aria-label="Scroll Right"
            >
              <FaArrowRight size={20} />
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default TopBooks;
