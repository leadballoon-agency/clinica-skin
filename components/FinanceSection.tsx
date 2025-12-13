interface FinanceSectionProps {
  onBookingClick?: () => void
}

export default function FinanceSection({ onBookingClick }: FinanceSectionProps) {
  const treatments = [
    { name: 'CO₂ Skin Resurfacing – Face', price: '£900', description: 'Full-face rejuvenation for wrinkles, scarring & texture' },
    { name: 'CO₂ Skin Resurfacing – Face + Neck', price: '£1,300', description: 'Comprehensive treatment for face and neck' },
    { name: 'CO₂ Skin Resurfacing – Face, Neck + Chest', price: '£1,700', description: 'Full advanced rejuvenation package' },
    { name: 'CO₂ Skin Resurfacing – Chest Only', price: '£800', description: 'Targets lines, wrinkles & sun damage on décolletage' },
    { name: 'CO₂ Skin Resurfacing – Hands', price: '£450', description: 'Improves texture, pigmentation & signs of ageing' },
    { name: 'CO₂ Skin Resurfacing – Body (larger area)', price: '£700', description: 'Reduces uneven tone, pigmentation & texture' },
  ]

  return (
    <section id="pricing" className="py-12 sm:py-16 md:py-24 bg-gradient-to-b from-white to-primary-50">
      <div className="max-w-7xl mx-auto section-padding">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <span className="text-primary-600 font-medium tracking-wider uppercase text-xs sm:text-sm">Transparent Pricing</span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mt-2 sm:mt-4">
            CO₂ Laser
            <span className="block gradient-text">Treatment Prices</span>
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-neutral-600 mt-2 sm:mt-4 max-w-2xl mx-auto px-4">
            All treatments include a free consultation and SkinCeuticals digital skin scan
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="max-w-5xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
          {treatments.map((treatment, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-primary-200">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-neutral-800 text-sm sm:text-base leading-tight flex-1 pr-2">
                  {treatment.name}
                </h3>
                <span className="text-xl sm:text-2xl font-bold text-primary-600 whitespace-nowrap">
                  {treatment.price}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-neutral-600">
                {treatment.description}
              </p>
            </div>
          ))}
        </div>

        {/* Free Consultation Banner */}
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-primary-100 to-primary-50 rounded-3xl p-8 sm:p-10 text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h3 className="font-display text-2xl sm:text-3xl font-bold mb-2">Free Consultation Included</h3>
          <p className="text-neutral-600 mb-4 max-w-xl mx-auto">
            Every treatment begins with a complimentary 30-minute consultation including a SkinCeuticals digital skin scan and personalised treatment plan.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-primary-700">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Doctor Assessment
            </span>
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Digital Skin Scan
            </span>
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              No Obligation
            </span>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <button
            onClick={onBookingClick}
            className="inline-flex items-center bg-gradient-to-r from-primary-500 to-primary-600 text-white px-8 py-4 rounded-full font-medium text-base sm:text-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            Book Free Consultation
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}
