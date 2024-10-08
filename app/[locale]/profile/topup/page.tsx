"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useSwipeable } from "react-swipeable";
import { fetchWalletBalanceByEmail } from "@/app/[locale]/profile/action";

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return isMobile;
};

export default function Component() {
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-900">
      <div className="w-full max-w-md p-8 rounded-3xl bg-gray-800 shadow-[0_10px_20px_rgba(0,0,0,0.2)]">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-20 h-20 mx-auto"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white">Top Up Wallet</h2>
          <p className="text-gray-400 mt-2">
            Current Balance:{" "}
            <span className="font-semibold text-green-400">
              {isLoading ? (
                "Loading..."
              ) : error ? (
                <span className="text-red-400">{error}</span>
              ) : walletBalance !== undefined ? (
                `🪙 ${walletBalance.toFixed(2)}`
              ) : (
                "N/A"
              )}
            </span>
          </p>
        </div>

        <div className="mb-6">
          <label htmlFor="amount" className="block text-gray-300 mb-2 text-lg">
            Amount to Add
          </label>
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={handleAmountChange}
            className="w-full p-4 rounded-2xl bg-gray-700 text-white text-lg border-2 border-transparent focus:border-green-500 focus:outline-none transition-colors"
            placeholder="Enter amount in Rupee ₹"
            disabled={isAdding}
          />
        </div>

        {isMobile ? (
          <SwipeToAdd amount={Number(amount)} onComplete={handleAddFunds} />
        ) : (
          <button
            onClick={handleAddFunds}
            className="w-full p-4 rounded-2xl bg-green-500 text-white font-bold text-lg transition-all hover:shadow-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            disabled={!amount || Number(amount) <= 0 || isAdding}
          >
            {isAdding ? "Adding..." : "Add Funds"}
          </button>
        )}
      </div>
    </div>
  );
}

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
    <div className="relative w-full h-16 bg-gray-700 rounded-full shadow-inner mt-6 overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className="text-white text-lg font-semibold z-10 transition-opacity duration-300"
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
          className="bg-gray-800 rounded-full p-3 shadow-md z-10 ml-1"
          style={{
            transform: `translateX(${Math.min(progress * 2.8, 280)}px)`,
            transition: "transform 0.1s ease-out",
          }}
        >
          <svg
            className="w-8 h-8 text-green-500"
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
