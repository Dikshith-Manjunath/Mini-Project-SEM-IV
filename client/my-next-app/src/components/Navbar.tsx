'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  
  const isActive = (path: string): boolean => pathname === path;

  return (
    <nav className="fixed top-0 left-0 w-full bg-[#121212] shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo & Journey AI */}
          <div className="flex items-center space-x-2">
            <img src='/logo.jpg' alt="Journey AI Logo" className="h-8" />
            <Link href="/" className="text-white font-bold text-xl">
              Journey AI
            </Link>
          </div>

          {/* Desktop Menu - Centered */}
          <div className="hidden md:flex flex-1 justify-center space-x-8">
            {["/", "/blogs", "/about"].map((path, index) => (
              <Link 
                key={index}
                href={path}
                className={`relative px-3 py-2 text-sm font-medium transition-all duration-300 ${
                  isActive(path) 
                    ? "text-white border-b-2 border-cyan-500" 
                    : "text-gray-300 hover:text-white hover:border-b-2 hover:border-cyan-500"
                }`}
              >
                {path === "/" ? "Home" : path.replace("/", "").replace("-", " ")}
              </Link>
            ))}
          </div>

          {/* Sign In Button - Right */}
          <div className="hidden md:flex">
            <Link 
              href="/signin" 
              className="bg-cyan-500 text-black px-4 py-2 rounded-md text-sm font-medium hover:bg-cyan-600 transition-all duration-300"
            >
              Sign In
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              {!isOpen ? (
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#121212]">
          <div className="px-6 py-3 space-y-2">
            {["/", "/blogs", "/about"].map((path, index) => (
              <Link 
                key={index}
                href={path}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive(path) ? "bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {path === "/" ? "Home" : path.replace("/", "").replace("-", " ")}
              </Link>
            ))}
          </div>
          <div className="px-6 py-3 border-t border-gray-700">
            <Link 
              href="/signin" 
              className="block w-full text-center bg-cyan-500 text-black px-4 py-2 rounded-md text-sm font-medium hover:bg-cyan-600 transition-all duration-300"
              onClick={() => setIsOpen(false)}
            >
              Sign In
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

