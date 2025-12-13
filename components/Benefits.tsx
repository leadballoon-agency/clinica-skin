const benefits = [
  {
    icon: '✨',
    title: 'Skin Resurfacing',
    description: 'Remove damaged skin layers and reveal fresh, healthy skin underneath for a complete rejuvenation.'
  },
  {
    icon: '🎯',
    title: 'Precision Treatment',
    description: 'Target specific areas with pinpoint accuracy, treating only what needs attention.'
  },
  {
    icon: '⏱️',
    title: 'Long-Lasting Results',
    description: 'Enjoy dramatic improvements that continue to enhance over months.'
  },
  {
    icon: '🛡️',
    title: 'Safe & Proven',
    description: 'FDA-approved technology with decades of successful treatments.'
  },
  {
    icon: '💎',
    title: 'Multiple Benefits',
    description: 'Address wrinkles, scars, sun damage, and texture issues in one session.'
  },
  {
    icon: '👩‍⚕️',
    title: 'Expert Care',
    description: 'Performed by qualified professionals with extensive training.'
  }
]

export default function Benefits() {
  return (
    <section id="benefits" className="py-16 sm:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-12 text-primary">
          Transform Your Skin with CO2 Laser
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-white p-6 sm:p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow hover:-translate-y-1 transform duration-300"
            >
              <div className="text-4xl sm:text-5xl mb-4">{benefit.icon}</div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-3 text-primary">
                {benefit.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}