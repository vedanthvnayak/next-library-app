"use client";

import { useState, useEffect } from "react";
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
  GraduationCap,
  LayoutDashboard,
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isAdminPage =
    /^\/(en|kn)\/admin/.test(pathname) || pathname.startsWith("/admin");

  const [currentLanguage, setCurrentLanguage] = useState(
    pathname.startsWith("/kn") ? "kn" : "en"
  );

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setCurrentLanguage(pathname.startsWith("/kn") ? "kn" : "en");
  }, [pathname]);

  const handleLinkClick = (event: React.MouseEvent) => {
    event.stopPropagation();
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
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-gray-900 bg-opacity-70 font-sans">
        {/* Desktop Header */}
        <div className="hidden md:block">
          <div className="rounded-full shadow-lg border border-gray-600 mx-auto mt-4 hover:shadow-[0_0_15px_5px_rgba(255,255,255,0.3)] transition-shadow duration-300 max-w-5xl">
            <div className="h-14 px-6 py-3 flex items-center justify-between">
              <Link href="/" className="flex items-center flex-shrink-0">
                <div className="flex items-center">
                  <Library className="h-7 w-7 text-gray-100 mr-3" />
                  <span className="text-lg font-bold text-gray-100 whitespace-nowrap">
                    ज्ञान भाण्डार
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

                {session ? (
                  <NavLink
                    href="/professors"
                    label="Professors"
                    onClick={handleLinkClick}
                  />
                ) : null}
                <NavLink
                  href="/about"
                  label="About"
                  onClick={handleLinkClick}
                />
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
                      className="flex items-center space-x-2 text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-full text-sm font-medium transition-colors duration-300"
                      onClick={handleLinkClick}
                    >
                      <img
                        src={session.user.image || "/default-profile.png"}
                        alt="Profile"
                        className="h-7 w-7 rounded-full"
                      />
                      <span className="max-w-[80px] truncate">
                        {session.user?.name}
                      </span>
                    </Link>
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="flex items-center space-x-2 text-red-400 hover:bg-gray-700 px-3 py-2 rounded-full text-sm font-medium transition-colors duration-300"
                    >
                      <LogOut className="h-5 w-5" />
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
            </div>
          </div>
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
            href="/professors"
            label="Professors"
            icon={<GraduationCap className="h-6 w-6" />}
            className="w-16"
            isMobile={true}
          />
          <NavLink
            href="/about"
            label="About"
            icon={<Info className="h-6 w-6" />}
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
              <Link
                href="/profile"
                className="flex flex-row items-center space-x-2 text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-300 w-full"
              >
                <User className="h-6 w-6" />
                <span>Profile</span>
              </Link>
            ) : (
              <NavLink
                href="/login"
                label="Sign In"
                icon={<User className="h-6 w-6" />}
                className="w-full"
                isMobile={true}
              />
            )}
            {session && (
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex items-center space-x-2 text-red-400 hover:bg-gray-700 px-3 py-2 rounded-lg text-base font-medium transition-colors duration-300 w-full"
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
  isMobile?: boolean;
  onClick?: (event: React.MouseEvent) => void;
}

const NavLink: React.FC<NavLinkProps> = ({
  href,
  label,
  icon,
  className = "",
  isMobile = false,
  onClick,
}) => {
  const pathname = usePathname();

  const isActive = pathname === href;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`
        ${
          isMobile
            ? "flex flex-col items-center justify-center space-y-1 px-3 py-2 rounded-full text-sm font-medium transition-all duration-300"
            : "flex items-center justify-center space-x-2 px-3 py-2 rounded-full text-base font-medium transition-all duration-300"
        }
        
        ${
          isActive
            ? "bg-primary text-primary-foreground shadow-md"
            : "text-gray-300 hover:text-white hover:bg-gray-700"
        }
        ${className}
      `}
    >
      {icon && (
        <span
          className={`${isMobile ? "text-center" : "mr-2"} ${
            isActive ? "text-primary-foreground" : ""
          }`}
        >
          {icon}
        </span>
      )}
      <span
        className={`${isMobile ? "text-[10px]" : ""} ${
          isActive ? "text-primary-foreground" : ""
        }`}
      >
        {label}
      </span>
    </Link>
  );
};
