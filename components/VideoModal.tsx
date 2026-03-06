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

        {/* Video Player */}
        <div className="relative w-full h-full bg-black flex items-center justify-center">
          <video
            autoPlay
            controls
            playsInline
            className="w-full h-full object-contain"
          >
            <source
              src="https://storage.googleapis.com/msgsndr/yE0ZTtTwqOwpiUubrP0k/media/69245121e4747c667cc2e776.mp4?v=3"
              type="video/mp4"
            />
          </video>
        </div>
      </div>
    </div>
  )
}
