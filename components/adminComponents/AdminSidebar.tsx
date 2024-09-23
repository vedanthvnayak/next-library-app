"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  UserIcon,
  BookOpenIcon,
  ArrowsRightLeftIcon,
  ExclamationCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowUturnLeftIcon,
} from "@heroicons/react/24/outline";
import { BarChartIcon, CalendarIcon } from "lucide-react"; // Importing CalendarIcon

interface MenuItem {
  name: string;
  icon: React.ReactNode;
  route: string;
}

export default function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Extract the current locale from the pathname
  const locale = pathname.split("/")[1] || "en"; // Fallback to "en" if no locale is found

  useEffect(() => {
    const handleResize = () => {
      setIsCollapsed(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuItems: MenuItem[] = [
    {
      name: "Statistics",
      icon: <BarChartIcon className="w-5 h-5" />,
      route: `/${locale}/admin`,
    },
    {
      name: "User Management",
      icon: <UserIcon className="w-5 h-5" />,
      route: `/${locale}/admin/users`,
    },
    {
      name: "Book Management",
      icon: <BookOpenIcon className="w-5 h-5" />,
      route: `/${locale}/admin/books`,
    },
    {
      name: "Requests Management",
      icon: <ExclamationCircleIcon className="w-5 h-5" />,
      route: `/${locale}/admin/requests`,
    },
    {
      name: "Transaction History",
      icon: <ArrowsRightLeftIcon className="w-5 h-5" />,
      route: `/${locale}/admin/transactions`,
    },
    {
      name: "Return Book",
      icon: <ArrowUturnLeftIcon className="w-5 h-5" />,
      route: `/${locale}/admin/returnbook`,
    },
    {
      name: "Due Today",
      icon: <CalendarIcon className="w-5 h-5" />, // Using CalendarIcon
      route: `/${locale}/admin/duetoday`,
    },
  ];

  return (
    <aside
      className={`bg-gray-900 text-gray-100 h-screen transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-16" : "w-64"
      } flex flex-col`}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        {!isCollapsed && (
          <h2 className="text-xl font-bold text-indigo-400 min-w-[150px]">
            Admin Panel
          </h2>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-gray-400 hover:text-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded p-1 transition-colors duration-200"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRightIcon className="w-5 h-5" />
          ) : (
            <ChevronLeftIcon className="w-5 h-5" />
          )}
        </button>
      </div>
      <nav className="flex-grow mt-6 overflow-y-auto">
        <ul className="space-y-2 px-3">
          {menuItems.map((item) => {
            const isActive = pathname === item.route;
            return (
              <li key={item.name}>
                <button
                  onClick={() => router.push(item.route)}
                  className={`flex items-center w-full text-left font-medium p-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-lg"
                      : "text-gray-300 hover:bg-gray-800 hover:text-indigo-400"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                  title={item.name}
                >
                  <span className={`${isCollapsed ? "mx-auto" : "mr-3"}`}>
                    {item.icon}
                  </span>
                  {!isCollapsed && (
                    <span className="text-sm truncate">{item.name}</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
