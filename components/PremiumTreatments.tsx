import { trackPRPDealView } from './FacebookPixel'

interface PremiumTreatmentsProps {
  onBookingClick?: () => void
}

export default function PremiumTreatments({ onBookingClick }: PremiumTreatmentsProps) {
  const treatments = [
    {
      icon: '✨',
      title: 'Single Session',
      description: "Individual CO2 laser treatment",
      features: ['Full face treatment', '5-7 days downtime', '60-90 minutes', 'Immediate results'],
      price: '£395',
      gradient: 'from-blue-400 to-cyan-600',
      popular: false
    },
    {
      icon: '💎',
      title: '3 Session Package',
      description: 'Complete transformation package',
      features: ['3 CO2 laser sessions', 'Save £335 total', 'Book within 6 months', 'Best for acne scars'],
      price: '£850',
      gradient: 'from-primary-400 to-primary-600',
      popular: true
    },
    {
      icon: '🔬',
      title: 'Single + PRP',
      description: 'CO2 laser with PRP enhancement',
      features: ['CO2 laser treatment', 'PRP enhancement included', 'Faster healing', 'Enhanced results'],
      price: '£495',
      gradient: 'from-green-400 to-emerald-600',
      popular: false
    }
  ]

  return (
    <section id="treatments" className="py-12 sm:py-16 md:py-24 bg-gradient-to-b from-primary-50 to-white">
      <div className="max-w-7xl mx-auto section-padding">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16 space-y-2 sm:space-y-4">
          <span className="text-primary-600 font-medium tracking-wider uppercase text-xs sm:text-sm">Our Services</span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold">
            Treatments That
            <span className="gradient-text"> Transform</span>
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-neutral-600 max-w-2xl mx-auto px-4">
            Each treatment is tailored to your unique needs
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {treatments.map((treatment, index) => (
            <div
              key={index}
              className={`group relative bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8 transition-all duration-500 flex flex-col h-full ${
                treatment.popular ? 'shadow-premium-lg sm:scale-105 border-2 border-primary-200' : 'shadow-premium hover:shadow-premium-lg'
              } sm:hover:scale-105`}
            >
              {treatment.popular && (
                <div className="absolute -top-2 sm:-top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-3 sm:px-4 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium">
                  Best Value
                </div>
              )}
              
              <div className={`absolute inset-0 bg-gradient-to-br ${treatment.gradient} opacity-5 rounded-2xl sm:rounded-3xl transition-opacity group-hover:opacity-10`}></div>
              
              <div className="relative flex flex-col h-full">
                <div className="mb-3 sm:mb-4 lg:mb-6">
                  <div className={`text-3xl sm:text-4xl lg:text-5xl p-2.5 sm:p-3 lg:p-4 bg-gradient-to-br ${treatment.gradient} rounded-xl sm:rounded-2xl bg-opacity-10 inline-block`}>
                    {treatment.icon}
                  </div>
                </div>

                <div className="mb-3 sm:mb-4 lg:mb-6">
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-1.5 sm:mb-2">{treatment.title}</h3>
                  <p className="text-xs sm:text-sm lg:text-base text-neutral-600">{treatment.description}</p>
                </div>

                <ul className="space-y-1.5 sm:space-y-2 mb-4 sm:mb-6 flex-grow">
                  {treatment.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start sm:items-center text-xs sm:text-sm text-neutral-700">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-primary-500 mr-1.5 sm:mr-2 flex-shrink-0 mt-0.5 sm:mt-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-neutral-100 mt-auto">
                  <div>
                    <p className="text-xs text-neutral-500 sm:hidden">From</p>
                    <p className="text-xl sm:text-2xl font-bold gradient-text">{treatment.price}</p>
                  </div>
                  <button
                    onClick={() => {
                      if (treatment.title === '3 Session Package') {
                        trackPRPDealView()
                      }
                      onBookingClick?.()
                    }}
                    className={`px-4 sm:px-5 lg:px-6 py-2.5 sm:py-3 rounded-full bg-gradient-to-r ${treatment.gradient} text-white font-medium hover:shadow-lg transition-all duration-300 sm:hover:scale-105 text-sm sm:text-base`}
                  >
                    Get Started
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Call-to-Action */}
        <div className="mt-8 text-center sm:hidden">
          <p className="text-xs text-neutral-600 mb-3">Need help choosing?</p>
          <a href="#assessment" className="text-primary-600 font-medium text-sm">
            Take our assessment →
          </a>
        </div>
      </div>
    </section>
  )
}