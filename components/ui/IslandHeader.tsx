"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Library,
  Book,
  LogOut,
  Home,
  Info,
  ChevronDown,
  Search,
  User,
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isAdminPage = pathname.startsWith("/admin");

  useEffect(() => {
    setIsExpanded(false);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        headerRef.current &&
        !headerRef.current.contains(event.target as Node)
      ) {
        setIsExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isExpanded && headerRef.current && dropdownRef.current) {
      const islandWidth = headerRef.current.offsetWidth;
      dropdownRef.current.style.width = `${islandWidth}px`;
    }
  }, [isExpanded]);

  const toggleExpanded = () => setIsExpanded(!isExpanded);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Desktop Header */}
      <div className="hidden md:block">
        <motion.div
          initial={false}
          animate={{
            width: isExpanded ? "800px" : "256px",
            height: isExpanded ? "56px" : "48px",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="bg-gray-900 rounded-full shadow-lg border border-gray-600 mx-auto mt-4"
          onMouseEnter={() => setIsExpanded(true)}
          onMouseLeave={() => setIsExpanded(false)}
          aria-expanded={isExpanded}
        >
          <div className="h-full px-6 flex items-center justify-between overflow-hidden">
            <AnimatePresence initial={false}>
              {isExpanded ? (
                <motion.div
                  key="expanded"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="w-full flex items-center justify-between"
                >
                  <Link href="/" className="flex items-center flex-shrink-0">
                    <Library className="h-6 w-6 text-gray-100 mr-2" />
                    <span className="text-base font-bold text-gray-100 whitespace-nowrap">
                      ज्ञान भाण्डार Library
                    </span>
                  </Link>
                  <nav className="flex items-center space-x-4 ml-auto">
                    <NavLink href="/" label="Discover" />
                    <NavLink href="/books" label="Books" />
                    <NavLink href="/about" label="About" />
                    {session ? (
                      <>
                        <Link
                          href="/profile"
                          className="flex items-center space-x-2 text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-full text-sm font-medium transition-colors duration-300"
                        >
                          <img
                            src={session.user.image || "/default-profile.png"}
                            alt="Profile"
                            className="h-6 w-6 rounded-full"
                          />
                          <span className="max-w-[100px] truncate">
                            {session.user?.name}
                          </span>
                        </Link>
                        <button
                          onClick={() => signOut({ callbackUrl: "/" })}
                          className="flex items-center space-x-2 text-red-400 hover:bg-gray-700 px-3 py-2 rounded-full text-sm font-medium transition-colors duration-300"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Sign Out</span>
                        </button>
                      </>
                    ) : (
                      <NavLink href="/login" label="Sign In" />
                    )}
                  </nav>
                </motion.div>
              ) : (
                <motion.div
                  key="collapsed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="w-full flex flex-col items-center justify-center"
                >
                  <div className="flex items-center">
                    <Library className="h-5 w-5 text-gray-100 mr-2" />
                    <span className="text-base font-bold text-gray-100 whitespace-nowrap">
                      ज्ञान भाण्डार
                    </span>
                  </div>
                  <span className="text-xs text-gray-400 mt-1">
                    Hover to access the menu
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden">
        <div className="relative" ref={headerRef}>
          <motion.div
            initial={false}
            animate={{
              width: isExpanded ? "100%" : "90%",
              height: "48px",
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-gray-900 bg-opacity-80 backdrop-blur-lg rounded-full shadow-lg mx-auto mt-4 overflow-hidden"
            onClick={toggleExpanded}
          >
            <div className="h-full px-4 flex items-center justify-between">
              <div className="flex items-center">
                <Library className="h-5 w-5 text-gray-100 mr-2" />
                <span className="text-sm font-bold text-gray-100">
                  ज्ञान भाण्डार
                </span>
              </div>
              <ChevronDown className="h-5 w-5 text-gray-300" />
            </div>
          </motion.div>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                ref={dropdownRef}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-1/2 transform -translate-x-1/2 max-w-md bg-gray-900 bg-opacity-95 backdrop-blur-lg rounded-2xl shadow-lg p-4 space-y-4 mt-2"
              >
                <nav className="space-y-2">
                  <NavLink
                    href="/"
                    label="Discover"
                    icon={<Home className="h-5 w-5" />}
                  />
                  {!isAdminPage && (
                    <NavLink
                      href="/books"
                      label="Books"
                      icon={<Book className="h-5 w-5" />}
                    />
                  )}
                  <NavLink
                    href="/about"
                    label="About"
                    icon={<Info className="h-5 w-5" />}
                  />
                </nav>
                <div className="pt-2 border-t border-gray-700">
                  {session ? (
                    <>
                      <Link
                        href="/profile"
                        className="flex items-center space-x-3 text-gray-300 hover:text-white mb-2"
                      >
                        <img
                          src={session.user?.image || "/default-profile.png"}
                          alt="Profile"
                          className="h-8 w-8 rounded-full border border-gray-600"
                        />
                        <span className="font-medium">
                          {session.user?.name}
                        </span>
                      </Link>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          signOut({ callbackUrl: "/" });
                        }}
                        className="w-full flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                      </button>
                    </>
                  ) : (
                    <NavLink
                      href="/login"
                      label="Sign In"
                      icon={<User className="h-5 w-5" />}
                      className="w-full bg-blue-600 hover:bg-blue-700 justify-center"
                    />
                  )}
                </div>
                <div className="pt-2 border-t border-gray-700">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Find your next read..."
                      className="w-full bg-gray-800 text-white rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

interface NavLinkProps {
  href: string;
  label: string;
  icon?: React.ReactNode;
  className?: string;
}

const NavLink = ({ href, label, icon, className }: NavLinkProps) => (
  <Link
    href={href}
    className={`flex items-center space-x-2 text-gray-300 hover:text-white px-3 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${className}`}
  >
    {icon && icon}
    <span>{label}</span>
  </Link>
);
