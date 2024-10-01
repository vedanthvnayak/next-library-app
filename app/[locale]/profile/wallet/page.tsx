"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { fetchWalletBalanceByEmail } from "@/app/[locale]/profile/action";

export default function RealisticWallet() {
  const { data: session } = useSession();
  const router = useRouter();
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

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

  const handleTopUp = () => {
    router.push("/profile/topup");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-md">
        <motion.div
          className="relative"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <svg
            viewBox="0 0 300 180"
            className="w-full h-auto"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient
                id="walletGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#2c3e50" />
                <stop offset="100%" stopColor="#34495e" />
              </linearGradient>
              <filter id="walletShadow">
                <feDropShadow
                  dx="0"
                  dy="4"
                  stdDeviation="4"
                  floodOpacity="0.3"
                />
              </filter>
              <pattern
                id="companyPattern"
                x="0"
                y="0"
                width="300"
                height="180"
                patternUnits="userSpaceOnUse"
              >
                <text
                  x="150"
                  y="100"
                  fontSize="14"
                  fill="#ffffff10"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  ज्ञान भाण्डार
                </text>
              </pattern>
            </defs>
            <motion.path
              d="M10,10 L290,10 Q300,10 300,20 L300,160 Q300,170 290,170 L10,170 Q0,170 0,160 L0,20 Q0,10 10,10 Z"
              fill="url(#walletGradient)"
              filter="url(#walletShadow)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, ease: "easeInOut" }}
            />
            <rect
              x="0"
              y="0"
              width="300"
              height="180"
              fill="url(#companyPattern)"
            />
            <motion.path
              d="M240,10 L290,10 Q300,10 300,20 L300,160 Q300,170 290,170 L240,170 L240,10 Z"
              fill="#2c3e50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            />
            <motion.rect
              x="250"
              y="70"
              width="40"
              height="40"
              rx="5"
              ry="5"
              fill="#95a5a6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                delay: 0.8,
                type: "spring",
                stiffness: 200,
                damping: 10,
              }}
            />
            <motion.circle
              cx="270"
              cy="90"
              r="8"
              fill="#7f8c8d"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1, duration: 0.3 }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col justify-between p-6">
            <motion.div
              className="space-y-1"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold text-gray-300">
                ज्ञान भाण्डार
              </h2>
              <p className="text-sm text-gray-400">
                {session?.user?.name || "User"}
              </p>
              <p className="text-xs text-gray-500">
                {session?.user?.email || "user@example.com"}
              </p>
            </motion.div>
            <motion.div
              className="text-center"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loading"
                    className="text-xl text-gray-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    Loading...
                  </motion.div>
                ) : error ? (
                  <motion.div
                    key="error"
                    className="text-xl text-red-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {error}
                  </motion.div>
                ) : (
                  <motion.div
                    key="balance"
                    className="text-4xl font-bold text-green-400"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    ${walletBalance?.toFixed(2)}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <motion.button
                onClick={handleTopUp}
                className="w-full py-2 bg-gradient-to-r from-green-500 to-blue-600 text-white font-bold text-lg rounded-xl transition-all hover:shadow-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Top Up Wallet
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            {isOpen ? "Hide" : "Show"} Transaction History
          </button>
        </motion.div>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 bg-gray-800 rounded-lg overflow-hidden"
            >
              <ul className="p-4 space-y-2">
                <li className="text-gray-300">Last top-up: $50.00</li>
                <li className="text-gray-300">Recent purchase: $12.99</li>
                <li className="text-gray-300">Withdrawal: $20.00</li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
