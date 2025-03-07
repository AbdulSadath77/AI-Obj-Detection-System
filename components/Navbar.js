"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <nav className="bg-gray-900 py-4 px-6 w-full">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <div className="gradient-title font-bold text-2xl tracking-tight">
            AI-TDS
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-8">
          <Link
            href="/"
            className={`${
              pathname === "/" ? "text-blue-400" : "text-gray-300"
            } hover:text-white transition-colors`}
          >
            Home
          </Link>
          <Link
            href="/about"
            className={`${
              pathname === "/about" ? "text-blue-400" : "text-gray-300"
            } hover:text-white transition-colors`}
          >
            About Us
          </Link>
          <Link
            href="/manual"
            className={`${
              pathname === "/manual" ? "text-blue-400" : "text-gray-300"
            } hover:text-white transition-colors`}
          >
            User Manual
          </Link>
          <Link
            href="/contact"
            className={`${
              pathname === "/contact" ? "text-blue-400" : "text-gray-300"
            } hover:text-white transition-colors`}
          >
            Contact
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-300 hover:text-white focus:outline-none"
          >
            {isMenuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 bg-gray-800 rounded-lg p-4">
          <div className="flex flex-col space-y-3">
            <Link
              href="/"
              className={`${
                pathname === "/" ? "text-blue-400" : "text-gray-300"
              } hover:text-white transition-colors block px-3 py-2 rounded-md`}
            >
              Home
            </Link>
            <Link
              href="/about"
              className={`${
                pathname === "/about" ? "text-blue-400" : "text-gray-300"
              } hover:text-white transition-colors block px-3 py-2 rounded-md`}
            >
              About Us
            </Link>
            <Link
              href="/manual"
              className={`${
                pathname === "/manual" ? "text-blue-400" : "text-gray-300"
              } hover:text-white transition-colors block px-3 py-2 rounded-md`}
            >
              User Manual
            </Link>
            <Link
              href="/contact"
              className={`${
                pathname === "/contact" ? "text-blue-400" : "text-gray-300"
              } hover:text-white transition-colors block px-3 py-2 rounded-md`}
            >
              Contact
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
