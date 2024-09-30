"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useSwipeable } from "react-swipeable";
import { fetchWalletBalanceByEmail } from "@/app/[locale]/profile/action";

// Utility hook to check if the screen is mobile
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Adjust the width threshold as needed
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return isMobile;
};

// Simulating a session object

const TopUpWallet: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [amount, setAmount] = useState<string>("");
  const [walletBalance, setWalletBalance] = useState<number | undefined>(
    undefined
  );
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      if (session?.user?.email) {
        try {
          setIsLoading(true);
          setError(null);
          const newAmount = await fetchWalletBalanceByEmail(session.user.email);
          setWalletBalance(newAmount.amount);
        } catch (err) {
          console.error("Error fetching wallet balance:", err);
          setError("Failed to fetch balance");
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchBalance();
  }, [session?.user?.email]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || Number(value) >= 0) {
      setAmount(value);
    }
  };

  const handleAddFunds = () => {
    const numericAmount = Number(amount);
    if (numericAmount > 0 && session?.user?.email) {
      router.push(
        `/pay?amount=${numericAmount}&email=${encodeURIComponent(
          session.user.email
        )}`
      );
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg shadow-lg w-full max-w-md">
        <div className="p-6 sm:p-8">
          <div className="text-center mb-6 sm:mb-8">
            <div className="text-green-400 text-5xl sm:text-6xl mb-4">
              <i className="fas fa-wallet"></i>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold">Top Up Wallet</h2>
            <p className="text-gray-400 mt-2 text-base sm:text-lg">
              Current Balance:{" "}
              <span className="text-green-400 font-semibold">
                {isLoading ? (
                  "Loading..."
                ) : error ? (
                  <span className="text-red-400">{error}</span>
                ) : walletBalance !== undefined ? (
                  `$${walletBalance}`
                ) : (
                  "N/A"
                )}
              </span>
            </p>
          </div>

          <div className="mb-6">
            <label
              htmlFor="amount"
              className="block text-gray-300 mb-2 text-base sm:text-lg"
            >
              Amount to Add
            </label>
            <input
              id="amount"
              type="number"
              value={amount}
              onChange={handleAmountChange}
              className="w-full p-3 sm:p-4 rounded-lg bg-gray-700 text-white text-base sm:text-lg border border-gray-600 focus:border-green-500 focus:outline-none transition-colors"
              placeholder="Enter amount"
              disabled={isAdding}
            />
          </div>

          {isMobile ? (
            <SwipeToAdd amount={Number(amount)} onComplete={handleAddFunds} />
          ) : (
            <button
              onClick={handleAddFunds}
              className="w-full p-3 sm:p-4 rounded-lg bg-green-500 hover:bg-green-600 text-white font-bold text-base sm:text-lg transition-colors"
              disabled={!amount || Number(amount) <= 0 || isAdding}
            >
              {isAdding ? "Adding..." : "Add Funds"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Swipe to Add Component
const SwipeToAdd: React.FC<{ amount: number; onComplete: () => void }> = ({
  amount,
  onComplete,
}) => {
  const [progress, setProgress] = useState<number>(0);
  const [isComplete, setIsComplete] = useState<boolean>(false);

  const handleSwipe = (deltaX: number) => {
    if (deltaX >= 0) {
      const swipeProgress = Math.min((deltaX / 300) * 100, 100);
      setProgress(swipeProgress);
    }
  };

  const handleSwipeEnd = () => {
    if (progress >= 70 && amount > 0) {
      setIsComplete(true);
      onComplete();
    } else {
      setProgress(0);
    }
  };

  const swipeHandlers = useSwipeable({
    onSwiping: (e) => handleSwipe(e.deltaX),
    onSwipedRight: handleSwipeEnd,
    trackMouse: true,
    trackTouch: true,
  });

  return (
    <div className="relative w-full h-14 bg-green-500 rounded-full shadow-inner mt-6 overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className="text-white text-base font-semibold z-10 transition-opacity duration-300"
          style={{ opacity: 1 - progress / 100 }}
        >
          {amount === 0
            ? "Enter an amount"
            : isComplete
            ? "Completed!"
            : "Slide to Pay"}
        </span>
      </div>
      <div
        {...swipeHandlers}
        className="absolute left-0 top-0 h-full w-full flex items-center"
        style={{ touchAction: "none" }}
      >
        <div
          className="bg-white rounded-full p-2 shadow-md z-10 ml-1 sm:p-2.5 md:p-3"
          style={{
            transform: `translateX(${Math.min(progress * 2.8, 280)}px)`,
            transition: "transform 0.1s ease-out",
          }}
        >
          <svg
            className="w-6 h-6 text-green-500 sm:w-7 sm:h-7 md:w-8 md:h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {progress < 50 ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            )}
          </svg>
        </div>
      </div>
    </div>
  );
};

export default TopUpWallet;
