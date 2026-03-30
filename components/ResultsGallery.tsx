'use client'

interface ResultsGalleryProps {
  onBookingClick?: () => void
}

export default function ResultsGallery({ onBookingClick }: ResultsGalleryProps) {
  return (
    <section id="results" className="py-12 sm:py-16 md:py-24 bg-gradient-to-b from-primary-50 to-white">
      <div className="max-w-7xl mx-auto section-padding">

        {/* Hero Result Image */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <span className="text-primary-600 font-medium tracking-wider uppercase text-xs sm:text-sm">Real Results</span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mt-2 sm:mt-4">
            Transformations That
            <span className="block gradient-text">Speak For Themselves</span>
          </h2>
        </div>

        <div className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-premium mb-12 sm:mb-16">
          <img
            src="/images/co2laser-skin-rejeuvenation.jpeg"
            alt="CO2 Laser Skin Rejuvenation — Before and After"
            className="w-full h-auto"
          />
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-5 sm:p-8">
            <h3 className="text-white font-bold text-lg sm:text-xl lg:text-2xl">Skin Resurfacing</h3>
            <p className="text-white/90 text-sm sm:text-base">Complete skin rejuvenation, renewal and tightening</p>
          </div>
        </div>

        {/* Skin Analysis Section — 2 Column */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-premium p-6 sm:p-8 lg:p-12 mb-12 sm:mb-16">
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold">
              Free Skin Scan &
              <span className="gradient-text"> Doctor Assessment</span>
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 mt-2 sm:mt-3 max-w-2xl mx-auto italic">
              A no-pressure CO&#8322; laser consultation at our Cambridge clinic — honest expert guidance, never a hard sell.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Left — Content */}
            <div>
              <h3 className="text-primary-600 font-semibold text-base sm:text-lg mb-5">
                During your 30-minute visit you will:
              </h3>

              <div className="space-y-4 sm:space-y-5">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-primary-50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-base">🩺</span>
                  </div>
                  <p className="text-sm sm:text-base text-neutral-700 leading-relaxed">
                    <strong className="text-neutral-900">Meet your doctor</strong> — discuss goals, medical history, and whether CO&#8322; laser is the right fit.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-primary-50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-base">📷</span>
                  </div>
                  <p className="text-sm sm:text-base text-neutral-700 leading-relaxed">
                    <strong className="text-neutral-900">SkinCeuticals digital skin scan</strong> — high-definition imaging reveals hydration levels, sun damage, collagen density and pores.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-primary-50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-base">📋</span>
                  </div>
                  <p className="text-sm sm:text-base text-neutral-700 leading-relaxed">
                    <strong className="text-neutral-900">Personalised treatment plan</strong> — projected results, session timing and transparent pricing.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-primary-50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-base">💬</span>
                  </div>
                  <p className="text-sm sm:text-base text-neutral-700 leading-relaxed">
                    <strong className="text-neutral-900">Ask anything</strong> — side-effects, after-care, suitability — we answer with evidence, not sales pressure.
                  </p>
                </div>
              </div>

              {/* Scan Benefits */}
              <h3 className="text-primary-600 font-semibold text-base sm:text-lg mt-7 mb-3">
                SkinCeuticals Scan Benefits:
              </h3>

              <div className="space-y-2.5">
                <div className="flex items-start gap-2.5">
                  <svg className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm sm:text-base text-neutral-700"><strong>Objective baseline</strong> — track improvements with before/after images.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <svg className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm sm:text-base text-neutral-700"><strong>Targeted dosing</strong> — pinpoint areas that need hydration or firmness.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <svg className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm sm:text-base text-neutral-700"><strong>Safer outcomes</strong> — doctors treat with millimetre precision based on real data.</p>
                </div>
              </div>

              <div className="mt-7">
                <button
                  onClick={onBookingClick}
                  className="inline-flex items-center bg-gradient-to-r from-primary-500 to-primary-600 text-white px-8 py-4 rounded-full font-semibold text-base hover:shadow-xl transition-all duration-300 hover:scale-105 w-full sm:w-auto justify-center"
                >
                  Book a Free Consultation
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Right — Image */}
            <div className="flex items-center justify-center">
              <div>
                <div className="rounded-2xl overflow-hidden shadow-lg">
                  <img
                    src="/images/SkinScope-Selection-1-960x640-copy-2.jpg"
                    alt="SkinCeuticals digital skin scan analysis during every CO₂ laser consultation"
                    className="w-full h-auto max-w-md"
                  />
                </div>
                <p className="text-center text-xs text-neutral-500 mt-3 italic">
                  SkinCeuticals digital skin scan during every CO&#8322; laser consultation.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Clinic Interior */}
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
                className="inline-flex items-center bg-white text-primary-600 px-5 sm:px-6 py-3 rounded-full font-semibold text-sm sm:text-base hover:shadow-lg transition-all duration-300"
              >
                Schedule Consultation
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-10 sm:mt-12 lg:mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {[
            { number: 'Doctor', label: 'Led Care' },
            { number: 'Award', label: 'Winning' },
            { number: '£795', label: 'Starting From' },
            { number: '219', label: '5★ Reviews' }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <p className="text-2xl sm:text-3xl font-bold gradient-text mb-1 sm:mb-2">{stat.number}</p>
              <p className="text-xs sm:text-sm text-neutral-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
