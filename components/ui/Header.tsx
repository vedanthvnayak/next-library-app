"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Library,
  Book,
  Menu,
  X,
  User,
  LogOut,
  Home,
  Info,
  ChevronDown,
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const isAdminPage = pathname.startsWith("/admin");

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfileMenu = () => setIsProfileMenuOpen(!isProfileMenuOpen);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest("button")
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-gray-800 bg-opacity-80 backdrop-blur-lg shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link className="flex items-center flex-shrink-0" href="/">
            <Library className="h-8 w-8 text-gray-100" />
            <span className="ml-2 text-xl font-bold text-gray-100 hidden sm:inline">
              ज्ञान भाण्डार Library
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
            <NavLink href="/" label="Discover" />
            <NavLink href="/books" label="Books" />
            <NavLink href="/about" label="About" />
            {session ? (
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={toggleProfileMenu}
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
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-300 ${
                      isProfileMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg py-1 z-10">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors duration-200"
                    >
                      <User className="inline-block w-4 h-4 mr-2" />
                      View Profile
                    </Link>
                    <hr className="my-1 border-gray-700" />
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 transition-colors duration-200"
                    >
                      <LogOut className="inline-block w-4 h-4 mr-2" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <NavLink
                href="/login"
                label="Sign In"
                icon={<User className="h-5 w-5" />}
                className="text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-full text-sm font-medium transition-colors duration-300"
              />
            )}
          </nav>

          <div className="flex md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-100 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div
        className={`md:hidden fixed inset-0 bg-black bg-opacity-75 z-40 transition-opacity duration-300 ${
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleMenu}
      />
      <div
        ref={mobileMenuRef}
        className={`md:hidden fixed right-0 top-0 bottom-0 w-64 bg-gray-900 z-50 transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center p-4 bg-gray-800">
            <span className="text-xl font-bold text-gray-100">Menu</span>
            <button
              onClick={toggleMenu}
              className="text-gray-100 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex-grow px-4 py-6 space-y-4 bg-gray-900">
            <MobileNavLink
              href="/"
              label="Discover"
              icon={<Home className="h-5 w-5" />}
            />
            {!isAdminPage && (
              <MobileNavLink
                href="/books"
                label="Books"
                icon={<Book className="h-5 w-5" />}
              />
            )}
            <MobileNavLink
              href="/about"
              label="About"
              icon={<Info className="h-5 w-5" />}
            />
          </nav>
          <div className="p-4 bg-gray-800">
            {session ? (
              <div className="flex flex-col space-y-4">
                <Link href="/profile" className="flex items-center space-x-3">
                  <img
                    src={session.user?.image || "/default-profile.png"}
                    alt="Profile"
                    className="h-10 w-10 rounded-full border border-gray-100"
                  />
                  <span className="text-gray-100 font-medium">
                    {session.user?.name}
                  </span>
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 flex items-center justify-center"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Sign Out
                </button>
              </div>
            ) : (
              <MobileNavLink
                href="/login"
                label="Sign In"
                icon={<User className="h-5 w-5" />}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 flex items-center justify-center"
              />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
interface NavLinkProps {
  href: string;
  label: string;
  icon?: React.ReactNode;
  badge?: number;
  className?: string;
}

function NavLink({ href, label, icon, badge, className = "" }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`relative flex items-center px-3 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
        isActive
          ? "text-white bg-gray-700"
          : "text-gray-300 hover:text-white hover:bg-gray-700"
      } ${className}`}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {label}
      {badge !== undefined && badge > 0 && (
        <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
          {badge}
        </span>
      )}
    </Link>
  );
}

interface MobileNavLinkProps {
  href: string;
  label: string;
  icon?: React.ReactNode;
  className?: string;
}

function MobileNavLink({
  href,
  label,
  icon,
  className = "",
}: MobileNavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`flex items-center px-4 py-3 rounded-full text-base font-medium transition-colors duration-300 ${
        isActive
          ? "text-white bg-gray-800"
          : "text-gray-300 hover:text-white hover:bg-gray-800"
      } ${className}`}
    >
      {icon && <span className="mr-3">{icon}</span>}
      {label}
    </Link>
  );
}
