'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  
const isActive = (path: string): boolean => {
    return pathname === path;
};

  return (
    <nav className="bg-black shadow-lg">
      <div className="max-w-1vw px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="w-[650px] flex items-center justify-between">
            <div className="flex-shrink-0">
              <Link href="/" className="text-white font-bold text-xl">Sexy Travels</Link>
            </div>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <Link 
                href="/" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/') ? 'text-white border-b-2 bg-gray-500' : 'text-gray-300 hover:text-white hover:border-b-2 hover:bg-indigo-500'}`}
              >
                Home
              </Link>
              <Link 
                href="/products"
                className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/products') ? 'text-white border-b-2 border-indigo-500' : 'text-gray-300 hover:text-white hover:border-b-2 hover:border-indigo-500'}`}
              >
                Products
              </Link>
              <Link 
                href="/services"
                className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/services') ? 'text-white border-b-2 border-indigo-500' : 'text-gray-300 hover:text-white hover:border-b-2 hover:border-indigo-500'}`}
              >
                Services
              </Link>
              <Link 
                href="/about"
                className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/about') ? 'text-white border-b-2 border-indigo-500' : 'text-gray-300 hover:text-white hover:border-b-2 hover:border-indigo-500'}`}
              >
                About
              </Link>
              <Link 
                href="/contact"
                className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/contact') ? 'text-white border-b-2 border-indigo-500' : 'text-gray-300 hover:text-white hover:border-b-2 hover:border-indigo-500'}`}
              >
                Contact
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <div className="hidden md:flex md:items-center md:ml-6">
              <Link href="/signin" className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Sign In
              </Link>
            </div>
            <div className="flex md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {!isOpen ? (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                ) : (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              href="/" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/') ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/products" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/products') ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
              onClick={() => setIsOpen(false)}
            >
              Products
            </Link>
            <Link 
              href="/services" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/services') ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
              onClick={() => setIsOpen(false)}
            >
              Services
            </Link>
            <Link 
              href="/about" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/about') ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <Link 
              href="/contact" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/contact') ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-700">
            <div className="flex items-center px-5">
              <Link href="/signin" className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700" onClick={() => setIsOpen(false)}>
                Sign In
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}