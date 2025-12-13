'use client'

import { useEffect } from 'react'

interface VideoModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function VideoModal({ isOpen, onClose }: VideoModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    // Close on ESC key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => {
      document.body.style.overflow = 'unset'
      window.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/70 to-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Video Container - Portrait orientation */}
      <div className="relative w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-md bg-black sm:rounded-3xl shadow-2xl overflow-hidden animate-modal-slide-up">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 hover:scale-110 group"
          aria-label="Close video"
        >
          <svg className="w-5 h-5 text-white group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Video Placeholder */}
        <div className="relative w-full h-full bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 flex flex-col items-center justify-center p-8 text-center">
          {/* Play icon */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white/20 backdrop-blur rounded-full flex items-center justify-center mb-6">
            <svg className="w-10 h-10 sm:w-12 sm:h-12 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>

          {/* Title */}
          <h3 className="text-white text-2xl sm:text-3xl font-bold mb-3">
            CO2 Laser Treatment
          </h3>

          {/* Description */}
          <p className="text-white/90 text-sm sm:text-base mb-6 max-w-xs leading-relaxed">
            Watch Dr. Katarzyna explain the CO2 laser resurfacing process and what results you can expect.
          </p>

          {/* Coming soon badge */}
          <div className="bg-white/20 backdrop-blur px-4 py-2 rounded-full">
            <p className="text-white text-sm font-medium">
              Video Coming Soon
            </p>
          </div>

          {/* Suggested content */}
          <div className="mt-8 pt-6 border-t border-white/20 w-full max-w-sm">
            <p className="text-white/70 text-xs uppercase tracking-wider mb-3">This video will include:</p>
            <ul className="text-white/80 text-sm space-y-2 text-left">
              <li className="flex items-center">
                <svg className="w-4 h-4 mr-2 text-white/60" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                How CO2 laser resurfacing works
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 mr-2 text-white/60" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Before & after results
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 mr-2 text-white/60" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Recovery timeline explained
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
