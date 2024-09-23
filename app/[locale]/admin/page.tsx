import React from "react";
import {
  UserIcon,
  BookOpenIcon,
  ArrowsRightLeftIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { DrizzleManager } from "@/db/drizzleDbConnection";
import { BookRepository } from "@/repository/books.repository";
import { UserRepository } from "@/repository/user.repository";
import { TransactionRepository } from "@/repository/transaction.repository";

const drizzleManager = new DrizzleManager();
const db = drizzleManager.getPoolDrizzle();
const bookRepository = new BookRepository(db);
const userRepository = new UserRepository(db);
const transactionRepository = new TransactionRepository(db);

const AdminStats = async () => {
  const totalBooks = await bookRepository.getTotalBookCount();
  const totalUsers = await userRepository.getTotalUserCount();
  const totalTransaction =
    await transactionRepository.getTotalTransactionCount();
  const pendingRequests = await transactionRepository.getPendingRequestCount();

  const stats = [
    {
      name: "Users",
      value: totalUsers,
      description: "Active users managing resources",
      icon: UserIcon,
      color: "bg-blue-500",
    },
    {
      name: "Books",
      value: totalBooks,
      description: "Total books in the library",
      icon: BookOpenIcon,
      color: "bg-purple-500",
    },
    {
      name: "Transactions",
      value: totalTransaction,
      description: "Completed transactions",
      icon: ArrowsRightLeftIcon,
      color: "bg-pink-500",
    },
    {
      name: "Requests",
      value: pendingRequests,
      description: "Pending requests for books",
      icon: ExclamationCircleIcon,
      color: "bg-red-500",
    },
  ];

  const total = stats.reduce((acc, stat) => acc + stat.value, 0);

  // Dummy data for bar chart (replace with actual data in a real application)
  const barChartData = [
    { name: "Jan", transactions: 400 },
    { name: "Feb", transactions: 300 },
    { name: "Mar", transactions: 500 },
    { name: "Apr", transactions: 280 },
    { name: "May", transactions: 200 },
    { name: "Jun", transactions: 450 },
  ];

  const maxTransactions = Math.max(
    ...barChartData.map((item) => item.transactions)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900 text-white p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-indigo-300 mb-4 sm:mb-6 lg:mb-8">
        Admin Dashboard
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {stats.map((item) => (
          <div
            key={item.name}
            className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl p-4 transition-all duration-300 hover:bg-gray-750 hover:border-indigo-500"
          >
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <h2 className="text-lg sm:text-xl font-semibold text-indigo-400">
                {item.name}
              </h2>
              <item.icon className="w-6 h-6 sm:w-7 sm:h-7 text-indigo-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold mt-1 sm:mt-2">
              {item.value.toLocaleString()}
            </p>
            <p className="text-xs sm:text-sm text-gray-400 mt-1 sm:mt-2">
              {item.description}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl p-4">
          <h2 className="text-xl font-semibold text-indigo-400 mb-4">
            Resource Distribution
          </h2>
          <div className="flex h-40 items-end">
            {stats.map((item) => (
              <div
                key={item.name}
                className="flex-1 mx-1"
                title={`${item.name}: ${item.value}`}
              >
                <div
                  className={`${item.color} rounded-t`}
                  style={{ height: `${(item.value / total) * 100}%` }}
                ></div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs">
            {stats.map((item) => (
              <div key={item.name} className="text-center">
                <div
                  className={`w-3 h-3 ${item.color} rounded-full mx-auto mb-1`}
                ></div>
                {item.name}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl p-4">
          <h2 className="text-xl font-semibold text-indigo-400 mb-4">
            Transaction History
          </h2>
          <div className="flex h-40 items-end">
            {barChartData.map((item) => (
              <div
                key={item.name}
                className="flex-1 mx-1"
                title={`${item.name}: ${item.transactions}`}
              >
                <div
                  className="bg-indigo-500 rounded-t"
                  style={{
                    height: `${(item.transactions / maxTransactions) * 100}%`,
                  }}
                ></div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs">
            {barChartData.map((item) => (
              <div key={item.name} className="text-center">
                {item.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;
