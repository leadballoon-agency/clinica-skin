'use client'

import { useState } from 'react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <img
            src="/images/clinica-logo-two-fonts-2-e1747394036335.webp"
            alt="Clinica Skin Cambridge"
            className="h-10"
          />
          
          <nav className="hidden md:flex space-x-8">
            <a href="#about" className="text-gray-600 hover:text-gray-900">About</a>
            <a href="#treatment" className="text-gray-600 hover:text-gray-900">Treatment</a>
            <a href="#results" className="text-gray-600 hover:text-gray-900">Results</a>
            <a href="#process" className="text-gray-600 hover:text-gray-900">Process</a>
            <a href="#faq" className="text-gray-600 hover:text-gray-900">FAQ</a>
            <a href="#contact" className="text-gray-600 hover:text-gray-900">Contact</a>
          </nav>
          
          <a href="tel:+441223555123" className="hidden md:block bg-primary-600 text-white px-6 py-2 rounded hover:bg-primary-700">
            Book Now
          </a>
          
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
        
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <a href="#about" className="text-gray-600 hover:text-gray-900">About</a>
              <a href="#treatment" className="text-gray-600 hover:text-gray-900">Treatment</a>
              <a href="#results" className="text-gray-600 hover:text-gray-900">Results</a>
              <a href="#process" className="text-gray-600 hover:text-gray-900">Process</a>
              <a href="#faq" className="text-gray-600 hover:text-gray-900">FAQ</a>
              <a href="#contact" className="text-gray-600 hover:text-gray-900">Contact</a>
              <a href="tel:+441223555123" className="bg-primary-600 text-white px-6 py-2 rounded text-center">
                Call: 01223 555 123
              </a>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}