export default function TreatmentDetails() {
  const treatments = [
    {
      icon: '🔬',
      title: 'Deep Resurfacing',
      description: 'Removes damaged skin layers to reveal fresh, healthy skin underneath',
      features: ['Wrinkle reduction', 'Scar improvement', 'Texture refinement', 'Collagen stimulation'],
      price: 'From £850',
      duration: '60-90 min',
      gradient: 'from-red-400 to-orange-600'
    },
    {
      icon: '✨',
      title: 'Fractional CO2',
      description: 'Targeted treatment for specific areas with minimal downtime',
      features: ['Fine lines', 'Age spots', 'Acne scars', 'Skin tightening'],
      price: 'From £650',
      duration: '45-60 min',
      gradient: 'from-purple-400 to-pink-600'
    },
    {
      icon: '💎',
      title: 'Full Face Rejuvenation',
      description: 'Comprehensive treatment for complete facial transformation',
      features: ['Total resurfacing', 'Dramatic results', 'Long-lasting effects', 'Premium care'],
      price: 'From £1,200',
      duration: '90-120 min',
      gradient: 'from-blue-400 to-cyan-600'
    }
  ]

  return (
    <section id="treatment" className="py-16 sm:py-20 md:py-24 bg-gradient-to-b from-white to-primary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16 space-y-3 sm:space-y-4">
          <span className="text-primary-600 font-medium tracking-wider uppercase text-sm">Our Treatments</span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold">
            CO2 Laser <span className="gradient-text">Solutions</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto">
            Choose the perfect treatment option for your skin concerns and goals
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {treatments.map((treatment, index) => (
            <div key={index} className="group relative bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8 transition-all duration-500 cursor-pointer flex flex-col h-full shadow-lg hover:shadow-xl hover:scale-105">
              <div className={`absolute inset-0 bg-gradient-to-br ${treatment.gradient} opacity-5 rounded-2xl sm:rounded-3xl transition-opacity group-hover:opacity-10`}></div>
              
              <div className="relative flex flex-col h-full">
                <div className="mb-4 sm:mb-6">
                  <div className={`text-4xl sm:text-5xl p-3 sm:p-4 bg-gradient-to-br ${treatment.gradient} rounded-xl sm:rounded-2xl bg-opacity-10 inline-block`}>
                    {treatment.icon}
                  </div>
                </div>

                <div className="mb-4 sm:mb-6">
                  <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">{treatment.title}</h3>
                  <p className="text-sm sm:text-base text-neutral-600">{treatment.description}</p>
                </div>

                <ul className="space-y-2 mb-4 sm:mb-6 flex-grow">
                  {treatment.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-neutral-700">
                      <svg className="w-5 h-5 text-primary-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-neutral-100 mt-auto">
                  <div>
                    <p className="text-xl sm:text-2xl font-bold gradient-text">{treatment.price}</p>
                    <p className="text-xs sm:text-sm text-neutral-500">{treatment.duration}</p>
                  </div>
                  <button className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-full bg-gradient-to-r ${treatment.gradient} text-white font-medium hover:shadow-lg transition-all duration-300 hover:scale-105 text-sm sm:text-base`}>
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 sm:mt-16">
          <div className="text-center bg-gradient-to-br from-primary-50 to-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 shadow-xl">
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center mx-auto">
                <span className="text-3xl sm:text-4xl">🎯</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold">Not Sure Which Treatment Is Right?</h3>
              <p className="text-base sm:text-lg text-neutral-600">
                Book a free consultation to discuss your skin concerns and create a personalized treatment plan
              </p>
              <button className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-full font-medium text-base sm:text-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                Book Free Consultation →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}