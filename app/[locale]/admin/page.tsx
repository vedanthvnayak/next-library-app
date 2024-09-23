import React from "react";
import {
  UserIcon,
  BookOpenIcon,
  ArrowsRightLeftIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { BookRepository } from "@/repository/books.repository";
import { UserRepository } from "@/repository/user.repository";
import { TransactionRepository } from "@/repository/transaction.repository";

const bookRepository = new BookRepository();
const userRepository = new UserRepository();
const transactionRepository = new TransactionRepository();

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
      <h1 className="text-3xl font-bold text-indigo-300 mb-6">
        Admin Dashboard
      </h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-gray-800 border border-gray-700 rounded-lg p-4 transition duration-300 hover:bg-gray-750 hover:border-indigo-500 shadow-md"
          >
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold text-indigo-400">
                {stat.name}
              </h2>
              <stat.icon className="w-7 h-7 text-indigo-400" />
            </div>
            <p className="text-3xl font-bold">{stat.value.toLocaleString()}</p>
            <p className="text-gray-400 text-sm mt-1">{stat.description}</p>
          </div>
        ))}
      </div>

      {/* Resource Distribution & Transaction History */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Resource Distribution */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-semibold text-indigo-400 mb-4">
            Resource Distribution
          </h2>
          <div className="flex h-40 items-end">
            {stats.map((stat) => (
              <div
                key={stat.name}
                className="flex-1 mx-1"
                title={`${stat.name}: ${stat.value}`}
              >
                <div
                  className={`${stat.color} rounded-t`}
                  style={{ height: `${(stat.value / total) * 100}%` }}
                ></div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs">
            {stats.map((stat) => (
              <div key={stat.name} className="text-center">
                <div
                  className={`w-3 h-3 ${stat.color} rounded-full mx-auto mb-1`}
                />
                {stat.name}
              </div>
            ))}
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-semibold text-indigo-400 mb-4">
            Transaction History
          </h2>
          <div className="flex h-40 items-end">
            {barChartData.map((data) => (
              <div
                key={data.name}
                className="flex-1 mx-1"
                title={`${data.name}: ${data.transactions}`}
              >
                <div
                  className="bg-indigo-500 rounded-t"
                  style={{
                    height: `${(data.transactions / maxTransactions) * 100}%`,
                  }}
                ></div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs">
            {barChartData.map((data) => (
              <div key={data.name} className="text-center">
                {data.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;
