'use client'

import { useState } from 'react'

interface ResultsGalleryProps {
  onBookingClick?: () => void
}

export default function ResultsGallery({ onBookingClick }: ResultsGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [isModelModalOpen, setIsModelModalOpen] = useState(false)

  const results = [
    {
      image: '/images/co2laser-skin-rejeuvenation.jpeg',
      title: 'Skin Resurfacing',
      description: 'Complete skin rejuvenation, renewal and tightening',
      time: 'Results Vary',
      isAvailable: true,
      featured: true,
      isModelCard: false
    },
    {
      image: '/images/co2-laser-treatment-before-and-after7.jpg',
      title: 'Skin Texture',
      description: 'Smoother, firmer skin with improved clarity',
      time: 'Results Vary',
      isAvailable: true,
      featured: false,
      isModelCard: false
    },
    {
      image: '/images/co2-laser-treatment-before-and-after2.jpg',
      title: 'Fine Lines & Wrinkles',
      description: 'Visible reduction in lines and wrinkles',
      time: 'Results Vary',
      isAvailable: true,
      featured: false,
      isModelCard: false
    },
    {
      image: '/images/co2-laser-treatment-before-and-after5.jpg',
      title: 'Skin Renewal',
      description: 'Deep regeneration for lasting results',
      time: 'Results Vary',
      isAvailable: true,
      featured: false,
      isModelCard: false
    },
    {
      image: '/images/co2-laser-treatment-before-and-after.webp',
      title: 'Overall Rejuvenation',
      description: 'Comprehensive skin transformation',
      time: 'Results Vary',
      isAvailable: true,
      featured: false,
      isModelCard: false
    },
    {
      image: '/images/model-day-tile.svg',
      title: 'Become a Model',
      description: 'Get discounted treatments in exchange for before & after photos',
      time: 'Apply Now',
      isAvailable: true,
      featured: false,
      isModelCard: true
    }
  ]

  const handleCardClick = (index: number) => {
    const result = results[index]
    if (!result.isAvailable) return

    if (result.isModelCard) {
      setIsModelModalOpen(true)
    } else {
      setSelectedImage(index)
    }
  }

  const openWhatsAppWithMessage = () => {
    const phoneNumber = '441223555123'
    const message = encodeURIComponent(
      `Hi Clinica Skin! 👋\n\nI'm interested in becoming a model for your CO2 laser treatments.\n\nI understand I can receive discounted treatments in exchange for allowing my before & after photos to be used.\n\nPlease let me know what the next steps are!\n\n[I will send photos of my skin concern in the next message]`
    )
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank')
  }

  return (
    <section id="results" className="py-12 sm:py-16 md:py-24 bg-gradient-to-b from-primary-50 to-white">
      <div className="max-w-7xl mx-auto section-padding">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <span className="text-primary-600 font-medium tracking-wider uppercase text-xs sm:text-sm">Real Results</span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mt-2 sm:mt-4">
            Transformations That
            <span className="block gradient-text">Speak For Themselves</span>
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-neutral-600 mt-2 sm:mt-4 max-w-2xl mx-auto px-4">
            Browse our gallery of real patient results
          </p>
        </div>

        {/* Premium Results Grid - Mobile Optimized */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {results.map((result, index) => (
            <div
              key={index}
              className={`group relative bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-premium transition-all duration-300 ${
                result.isAvailable ? 'sm:hover:shadow-premium-lg cursor-pointer' : 'opacity-90 cursor-not-allowed'
              } ${result.featured ? 'md:col-span-2' : ''}`}
              onClick={() => handleCardClick(index)}
            >
              {/* Before/After Label - Only show for available results, not for model card */}
              {result.isAvailable && !result.isModelCard && (
                <div className="absolute top-2 sm:top-4 left-2 sm:left-4 z-10 flex gap-1.5 sm:gap-2">
                  <span className="bg-white/90 backdrop-blur px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium">
                    Before
                  </span>
                  <span className="bg-primary-500/90 backdrop-blur text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium">
                    After
                  </span>
                </div>
              )}

              {/* Time Badge or FULL Badge */}
              <div className={`absolute top-2 sm:top-4 right-2 sm:right-4 z-10 backdrop-blur rounded-full px-2 sm:px-3 py-0.5 sm:py-1 ${
                result.isAvailable ? 'bg-white/90' : 'bg-red-500/90'
              }`}>
                <span className={`text-[10px] sm:text-xs font-medium ${
                  result.isAvailable ? 'text-neutral-700' : 'text-white'
                }`}>{result.time}</span>
              </div>

              {/* Image Container */}
              <div className={`relative overflow-hidden ${result.featured ? 'aspect-video' : 'aspect-[4/3]'}`}>
                <img
                  src={result.image}
                  alt={result.title}
                  className="w-full h-full object-cover sm:group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 sm:from-black/50 via-transparent to-transparent sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-6">
                <h3 className="font-bold text-base sm:text-lg lg:text-xl mb-1 sm:mb-2">{result.title}</h3>
                <p className="text-xs sm:text-sm lg:text-base text-neutral-600">{result.description}</p>
                
                <div className="mt-3 sm:mt-4 flex items-center text-primary-600 font-medium text-sm">
                  <span>View Details</span>
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-1.5 sm:ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Clinic Interior Section - Mobile Optimized */}
        <div className="mt-8 sm:mt-12">
          <div className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-premium">
            <img
              src="/images/Clinca-Skin-interior image large.jpg"
              alt="Clinica Skin Cambridge Interior"
              className="w-full h-auto"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 sm:from-black/50 via-black/30 to-transparent flex items-center">
              <div className="p-5 sm:p-8 md:p-12 max-w-full sm:max-w-lg">
                <h3 className="text-white text-2xl sm:text-2xl lg:text-3xl font-bold leading-tight mb-3 sm:mb-4">
                  Welcome to Clinica Skin Cambridge
                </h3>
                <p className="text-white/95 text-sm sm:text-base leading-relaxed mb-5 sm:mb-6">
                  Our beautiful clinic on Sussex Street, designed for your comfort and relaxation during your CO2 laser journey.
                </p>
                <button
                  onClick={onBookingClick}
                  className="inline-flex items-center bg-white text-primary-600 px-5 sm:px-6 py-3 sm:py-3 rounded-full font-semibold text-sm sm:text-base hover:shadow-lg transition-all duration-300"
                >
                  Schedule Consultation
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section - Mobile Optimized */}
        <div className="mt-10 sm:mt-12 lg:mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {[
            { number: 'Doctor', label: 'Led Care' },
            { number: 'CQC', label: 'Registered' },
            { number: '£450', label: 'Starting From' },
            { number: '219', label: '5★ Reviews' }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <p className="text-2xl sm:text-3xl font-bold gradient-text mb-1 sm:mb-2">{stat.number}</p>
              <p className="text-xs sm:text-sm text-neutral-600">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Lightbox Modal - Mobile Optimized */}
        {selectedImage !== null && (
          <div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-3 sm:p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-4xl w-full">
              <img
                src={results[selectedImage].image}
                alt={results[selectedImage].title}
                className="w-full rounded-lg"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-white/90 backdrop-blur rounded-full p-1.5 sm:p-2 hover:bg-white transition"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Model Application Modal */}
        {isModelModalOpen && (
          <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center sm:p-4">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsModelModalOpen(false)}
            />

            {/* Modal */}
            <div className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] sm:max-h-[85vh] flex flex-col">
              {/* Header */}
              <div className="relative bg-gradient-to-br from-primary-500 to-primary-600 p-6 sm:p-8 text-white flex-shrink-0">
                <button
                  onClick={() => setIsModelModalOpen(false)}
                  className="absolute top-4 right-4 sm:top-6 sm:right-6 w-8 h-8 sm:w-10 sm:h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-white/20 backdrop-blur rounded-full mb-3 sm:mb-4">
                    <span className="text-3xl">📸</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold mb-2">Become a Model</h2>
                  <p className="text-white/90 text-sm sm:text-base">
                    Get discounted CO2 laser treatments
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 sm:p-8">
                <div className="space-y-6">
                  <div className="bg-primary-50 rounded-2xl p-5">
                    <h3 className="font-semibold text-lg mb-3">What's the deal?</h3>
                    <ul className="space-y-2 text-sm text-neutral-700">
                      <li className="flex items-start">
                        <span className="text-primary-500 mr-2 mt-0.5">✓</span>
                        <span>Receive <strong>discounted treatments</strong> at Clinica Skin</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary-500 mr-2 mt-0.5">✓</span>
                        <span>In exchange, we use your <strong>before & after photos</strong> for marketing</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary-500 mr-2 mt-0.5">✓</span>
                        <span>Photos can be <strong>anonymous</strong> (face not shown)</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary-500 mr-2 mt-0.5">✓</span>
                        <span>Perfect for acne scars, pigmentation, stretch marks & more</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-neutral-50 rounded-2xl p-5">
                    <h3 className="font-semibold text-lg mb-3">How to apply</h3>
                    <ol className="space-y-3 text-sm text-neutral-700">
                      <li className="flex items-start">
                        <span className="bg-primary-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-3 mt-0.5 flex-shrink-0">1</span>
                        <span>Click the WhatsApp button below</span>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-primary-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-3 mt-0.5 flex-shrink-0">2</span>
                        <span>Send photos of your skin concern</span>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-primary-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-3 mt-0.5 flex-shrink-0">3</span>
                        <span>Our team will review and get back to you</span>
                      </li>
                    </ol>
                  </div>

                  <button
                    onClick={openWhatsAppWithMessage}
                    className="w-full bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-2xl p-4 sm:p-5 transition-all duration-300 hover:shadow-lg group"
                  >
                    <div className="flex items-center justify-center space-x-3">
                      <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      <div className="text-left">
                        <p className="font-bold text-lg">Apply via WhatsApp</p>
                        <p className="text-sm text-white/90">Send us your photos</p>
                      </div>
                    </div>
                  </button>

                  <p className="text-xs text-center text-neutral-500">
                    By applying, you agree to allow Clinica Skin to use your before & after photos for marketing purposes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}