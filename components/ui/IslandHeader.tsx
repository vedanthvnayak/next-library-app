"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Library,
  LogOut,
  ChevronDown,
  ChevronUp,
  Home,
  Book,
  Info,
  User,
  Globe,
  GraduationCap,
  LayoutDashboard,
  Menu,
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const collapseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isAdminPage =
    /^\/(en|kn)\/admin/.test(pathname) || pathname.startsWith("/admin");

  const [currentLanguage, setCurrentLanguage] = useState(
    pathname.startsWith("/kn") ? "kn" : "en"
  );

  useEffect(() => {
    setIsExpanded(false);
    setIsMobileMenuOpen(false);
    setCurrentLanguage(pathname.startsWith("/kn") ? "kn" : "en");
  }, [pathname]);

  const handleMouseEnter = () => {
    if (collapseTimeoutRef.current) {
      clearTimeout(collapseTimeoutRef.current);
    }
    setIsExpanded(true);
  };

  const handleMouseLeave = () => {
    collapseTimeoutRef.current = setTimeout(() => {
      setIsExpanded(false);
    }, 500);
  };

  const handleLinkClick = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  const toggleExpanded = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const toggleLanguage = (lang: "en" | "kn") => {
    if (lang !== currentLanguage) {
      setCurrentLanguage(lang);
      const newPathname = pathname.replace(/^\/?(en|kn)?/, `/${lang}`);
      router.push(newPathname);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  if (isAdminPage) {
    return null;
  }

  const isAdmin = session?.user?.role === "admin";

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50">
        {/* Desktop Header */}
        <div className="hidden md:block">
          <motion.div
            initial={false}
            animate={{
              width: isExpanded ? "1000px" : "256px",
              height: isExpanded ? "56px" : "48px",
            }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 30,
              duration: 0.5,
            }}
            className={`bg-gray-900 rounded-full shadow-lg border border-gray-600 mx-auto mt-4 
              ${
                isExpanded
                  ? "hover:shadow-[0_0_15px_5px_rgba(255,255,255,0.3)]"
                  : ""
              }`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            aria-expanded={isExpanded}
            ref={headerRef}
          >
            <div className="h-full px-6 flex items-center justify-between overflow-hidden">
              <AnimatePresence initial={false}>
                {isExpanded ? (
                  <motion.div
                    key="expanded"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full flex items-center justify-between"
                    onClick={handleLinkClick}
                  >
                    <Link href="/" className="flex items-center flex-shrink-0">
                      <div className="flex items-center min-w-[150px]">
                        <Library className="h-6 w-6 text-gray-100 mr-2" />
                        <span className="text-base font-bold text-gray-100 whitespace-nowrap">
                          ज्ञान भाण्डार Library
                        </span>
                      </div>
                    </Link>

                    <nav className="flex items-center space-x-4 ml-auto">
                      {isAdmin ? (
                        <NavLink
                          href="/admin"
                          label="Dashboard"
                          onClick={handleLinkClick}
                        />
                      ) : (
                        <NavLink
                          href="/"
                          label="Discover"
                          onClick={handleLinkClick}
                        />
                      )}
                      <NavLink
                        href="/books"
                        label="Books"
                        onClick={handleLinkClick}
                      />
                      <NavLink
                        href="/about"
                        label="About"
                        onClick={handleLinkClick}
                      />
                      {session ? (
                        <NavLink
                          href="/professors"
                          label="Professors"
                          onClick={handleLinkClick}
                        />
                      ) : null}

                      <div className="flex items-center bg-gray-800 rounded-full p-1 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] border border-gray-700">
                        <button
                          onClick={() => toggleLanguage("en")}
                          className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 ${
                            currentLanguage === "en"
                              ? "bg-gray-700 text-white shadow-[0_2px_4px_rgba(0,0,0,0.1)]"
                              : "text-gray-400 hover:text-white"
                          }`}
                          aria-label="Switch to English"
                        >
                          ENG
                        </button>
                        <button
                          onClick={() => toggleLanguage("kn")}
                          className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 ${
                            currentLanguage === "kn"
                              ? "bg-gray-700 text-white shadow-[0_2px_4px_rgba(0,0,0,0.1)]"
                              : "text-gray-400 hover:text-white"
                          }`}
                          aria-label="Switch to Kannada"
                        >
                          ಕನ್ನಡ
                        </button>
                      </div>

                      {session ? (
                        <>
                          <Link
                            href="/profile"
                            className="flex items-center space-x-2 text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-full text-base font-medium transition-colors duration-300"
                            onClick={handleLinkClick}
                          >
                            <img
                              src={session.user.image || "/default-profile.png"}
                              alt="Profile"
                              className="h-6 w-6 rounded-full"
                            />
                            <span className="max-w-[150px] truncate">
                              {session.user?.name}
                            </span>
                          </Link>
                          <button
                            onClick={() => signOut({ callbackUrl: "/" })}
                            className="flex items-center space-x-2 text-red-400 hover:bg-gray-700 px-3 py-2 rounded-full text-base font-medium transition-colors duration-300"
                          >
                            <LogOut className="h-4 w-4" />
                            <span>Sign Out</span>
                          </button>
                        </>
                      ) : (
                        <NavLink
                          href="/login"
                          label="Sign In"
                          onClick={handleLinkClick}
                        />
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
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 z-50 rounded-t-xl shadow-lg">
        <div className="flex justify-between items-center h-16 px-4">
          <NavLink
            href={isAdmin ? "/admin" : "/"}
            label={isAdmin ? "Dashboard" : "Home"}
            icon={
              isAdmin ? (
                <LayoutDashboard className="h-6 w-6" />
              ) : (
                <Home className="h-6 w-6" />
              )
            }
            className="w-16"
            isMobile={true}
          />
          <NavLink
            href="/books"
            label="Books"
            icon={<Book className="h-6 w-6" />}
            className="w-16"
            isMobile={true}
          />
          <button
            onClick={toggleMobileMenu}
            className="flex flex-col items-center justify-center text-gray-300 hover:text-white w-16 h-full"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <ChevronDown className="h-6 w-6" />
            ) : (
              <ChevronUp className="h-6 w-6" />
            )}
            <span className="text-[10px] mt-1">More</span>
          </button>
          <NavLink
            href="/about"
            label="About"
            icon={<Info className="h-6 w-6" />}
            className="w-16"
            isMobile={true}
          />
          <NavLink
            href="/professors"
            label="Professors"
            icon={<GraduationCap className="h-6 w-6" />}
            className="w-16"
            isMobile={true}
          />
        </div>
      </nav>

      {/* Mobile Expanded Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="md:hidden fixed bottom-16 left-0 right-0 bg-gray-900 border-t border-gray-800 z-40 rounded-t-xl shadow-lg p-4 space-y-4"
          >
            {session ? (
              <NavLink
                href="/profile"
                label="Profile"
                icon={<User className="h-6 w-6" />}
                className="flex items-center space-x-2 w-full"
                isMobile={true}
              />
            ) : (
              <NavLink
                href="/login"
                label="Sign In"
                icon={<User className="h-6 w-6" />}
                className="flex items-center space-x-2 w-full"
                isMobile={true}
              />
            )}

            {session && (
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex items-center space-x-2 text-red-400 hover:bg-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-300 w-full"
              >
                <LogOut className="h-6 w-6" />
                <span>Sign Out</span>
              </button>
            )}
            <div className="flex items-center justify-center bg-gray-800 rounded-full p-1 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] border border-gray-700">
              <button
                onClick={() => toggleLanguage("en")}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 ${
                  currentLanguage === "en"
                    ? "bg-gray-700 text-white shadow-[0_2px_4px_rgba(0,0,0,0.1)]"
                    : "text-gray-400 hover:text-white"
                }`}
                aria-label="Switch to English"
              >
                ENG
              </button>
              <button
                onClick={() => toggleLanguage("kn")}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 ${
                  currentLanguage === "kn"
                    ? "bg-gray-700 text-white shadow-[0_2px_4px_rgba(0,0,0,0.1)]"
                    : "text-gray-400 hover:text-white"
                }`}
                aria-label="Switch to Kannada"
              >
                ಕನ್ನಡ
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

interface NavLinkProps {
  href: string;
  label: string;
  icon?: React.ReactNode;
  className?: string;
  onClick?: (event: React.MouseEvent) => void;
  isMobile?: boolean;
}

const NavLink = ({
  href,
  label,
  icon,
  className,
  onClick,
  isMobile = false,
}: NavLinkProps) => (
  <Link
    href={href}
    className={`${
      isMobile
        ? "flex flex-col items-center justify-center space-y-1 text-gray-300 hover:text-white hover:bg-gray-700 px-2 py-1 rounded-lg text-[10px] font-medium transition-colors duration-300"
        : "flex flex-col items-center justify-center space-y-1 text-gray-300 hover:text-white hover:bg-gray-700 px-2 py-1 rounded-lg text-base font-medium transition-colors duration-300"
    } ${className}`}
    onClick={onClick}
  >
    {icon && (
      <div
        className={`flex items-center justify-center ${
          isMobile ? "h-6 w-6" : "h-6"
        }`}
      >
        {icon}
      </div>
    )}
    <span className={isMobile ? "text-[10px]" : "text-center"}>{label}</span>
  </Link>
);
