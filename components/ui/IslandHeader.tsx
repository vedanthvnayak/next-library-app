"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Library,
  LogOut,
  ChevronDown,
  Home,
  Book,
  Info,
  User,
  Globe,
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const collapseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isAdminPage =
    /^\/(en|kn)\/admin/.test(pathname) || pathname.startsWith("/admin");

  const [currentLanguage, setCurrentLanguage] = useState(
    pathname.startsWith("/kn") ? "kn" : "en"
  );

  useEffect(() => {
    setIsExpanded(false);
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

  if (isAdminPage) {
    return null;
  }

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
                    <NavLink
                      href="/"
                      label="Discover"
                      onClick={handleLinkClick}
                    />
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

      {/* Mobile Header */}
      <div className="md:hidden relative" ref={headerRef}>
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
            <MobileDropdown
              session={session}
              isAdminPage={isAdminPage}
              currentLanguage={currentLanguage}
              toggleLanguage={toggleLanguage}
            />
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

interface NavLinkProps {
  href: string;
  label: string;
  icon?: React.ReactNode;
  className?: string;
  onClick?: (event: React.MouseEvent) => void;
}

const NavLink = ({ href, label, icon, className, onClick }: NavLinkProps) => (
  <Link
    href={href}
    className={`flex items-center space-x-2 text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${className}`}
    onClick={onClick}
  >
    {icon && icon}
    <span>{label}</span>
  </Link>
);

interface MobileDropdownProps {
  session: any;
  isAdminPage: boolean;
  currentLanguage: string;
  toggleLanguage: (lang: "en" | "kn") => void;
}

const MobileDropdown = ({
  session,
  isAdminPage,
  currentLanguage,
  toggleLanguage,
}: MobileDropdownProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.2 }}
      className="bg-gray-900 bg-opacity-95 backdrop-blur-lg rounded-2xl shadow-lg space-y-4 absolute top-[60px] left-0 right-0 py-4 px-3"
    >
      <NavLink href="/" label="Discover" icon={<Home className="h-4 w-4" />} />
      <NavLink
        href="/books"
        label="Books"
        icon={<Book className="h-4 w-4" />}
      />
      <NavLink
        href="/about"
        label="About"
        icon={<Info className="h-4 w-4" />}
      />
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
          EN
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
          <NavLink
            href="/profile"
            label="Profile"
            icon={<User className="h-4 w-4" />}
          />
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center space-x-2 text-red-400 hover:bg-gray-700 px-3 py-2 rounded-full text-sm font-medium transition-colors duration-300 w-full text-left"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
          {!isAdminPage && (
            <NavLink
              href="/admin"
              label="Admin"
              icon={<User className="h-4 w-4" />}
            />
          )}
        </>
      ) : (
        <NavLink
          href="/login"
          label="Sign In"
          icon={<User className="h-4 w-4" />}
        />
      )}
    </motion.div>
  );
};
