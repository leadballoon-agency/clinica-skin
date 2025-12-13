'use client'

import { useEffect, useState } from 'react'
import { trackBookingModalOpen, trackPhoneClick } from './FacebookPixel'

type ConsultationType = 'video' | 'in-clinic'

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  assessmentData?: any
}

export default function BookingModal({ isOpen, onClose, assessmentData }: BookingModalProps) {
  const [consultationType, setConsultationType] = useState<ConsultationType>('in-clinic')

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      trackBookingModalOpen()

      // Load GHL calendar script
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.async = true
      script.src = 'https://link.leadballoon.co.uk/js/form_embed.js'
      document.body.appendChild(script)

      return () => {
        try {
          document.body.removeChild(script)
        } catch (e) {
          // Script already removed
        }
      }
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal - Mobile slides up from bottom, desktop centered */}
      <div className="relative w-full max-w-2xl bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-modal-slide-up max-h-[90vh] sm:max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-primary-500 to-primary-600 p-5 sm:p-6 lg:p-8 text-white flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 lg:top-6 lg:right-6 w-8 h-8 sm:w-10 sm:h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-white/20 backdrop-blur rounded-full mb-2 sm:mb-3 lg:mb-4">
              <span className="text-2xl sm:text-3xl">✨</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2">Book Your Treatment</h2>
            <p className="text-white/90 text-xs sm:text-sm lg:text-base">
              Select your preferred date and time
            </p>
          </div>
        </div>

        {/* Calendar Content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-8">
            {/* GHL Calendar */}
            <div className="space-y-4 sm:space-y-6 animate-fade-in">
              {/* Consultation Type Toggle - Compact Pill Style */}
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm text-neutral-600">Consultation type:</p>
                <div className="inline-flex bg-neutral-100 rounded-full p-0.5">
                  <button
                    onClick={() => setConsultationType('video')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                      consultationType === 'video'
                        ? 'bg-white text-primary-600 shadow-sm'
                        : 'text-neutral-500 hover:text-neutral-700'
                    }`}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Video
                  </button>
                  <button
                    onClick={() => setConsultationType('in-clinic')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                      consultationType === 'in-clinic'
                        ? 'bg-white text-primary-600 shadow-sm'
                        : 'text-neutral-500 hover:text-neutral-700'
                    }`}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    In-Clinic
                  </button>
                </div>
              </div>

              {/* Subtle info text */}
              <p className="text-xs text-neutral-400 mb-3">
                {consultationType === 'video'
                  ? 'Perfect for initial assessments from the comfort of home'
                  : '3-4 Sussex Street, Cambridge • Includes SkinCeuticals skin scan'
                }
              </p>

              <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 min-h-[600px]">
                <iframe
                  src="https://link.leadballoon.co.uk/widget/booking/wI8gdiR5RL5ghq6dzkn8"
                  style={{
                    width: '100%',
                    minHeight: '700px',
                    height: '100%',
                    border: 'none',
                    overflow: 'hidden'
                  }}
                  scrolling="no"
                  id="wI8gdiR5RL5ghq6dzkn8_1765616073658"
                  title="Clinica Skin Cambridge Booking Calendar"
                />
              </div>

              {/* Call Now Option */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neutral-200"></div>
                </div>
                <div className="relative flex justify-center text-xs sm:text-sm uppercase">
                  <span className="bg-white px-2 text-neutral-500">Or</span>
                </div>
              </div>

              <a
                href="tel:+441223555123"
                onClick={trackPhoneClick}
                className="block w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-xl sm:rounded-2xl p-4 sm:p-6 transition-all duration-300 hover:shadow-lg group"
              >
                <div className="flex items-center justify-center space-x-3 sm:space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 bg-white/20 backdrop-blur rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="text-sm sm:text-base font-medium mb-0.5 sm:mb-1">Prefer to speak with us?</p>
                    <p className="text-xl sm:text-2xl font-bold">01223 555 123</p>
                    <p className="text-xs sm:text-sm text-white/90 mt-0.5">Tap to call now</p>
                  </div>
                </div>
              </a>

              <div className="bg-white border-2 border-primary-100 rounded-xl p-6">
                <h5 className="font-semibold mb-4 flex items-center">
                  <svg className="w-5 h-5 text-primary-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  What's included in your booking:
                </h5>
                <ul className="space-y-3 text-sm text-neutral-700">
                  <li className="flex items-start">
                    <span className="text-primary-500 mr-2 mt-0.5">✓</span>
                    <span>Instant confirmation via email and SMS</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-500 mr-2 mt-0.5">✓</span>
                    <span>Free consultation with treatment</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-500 mr-2 mt-0.5">✓</span>
                    <span>Flexible rescheduling options</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-500 mr-2 mt-0.5">✓</span>
                    <span>Secure online booking</span>
                  </li>
                </ul>
              </div>

              <div className="text-center">
                <p className="text-xs text-neutral-500">
                  Booking takes less than 2 minutes • Available appointments updated in real-time
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
