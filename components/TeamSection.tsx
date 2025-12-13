interface TeamSectionProps {
  onBookingClick?: () => void
}

export default function TeamSection({ onBookingClick }: TeamSectionProps) {
  const team = [
    {
      name: 'Elanda',
      title: 'Advanced Aesthetics Practitioner / Nurse (Greece)',
      credentials: '',
      image: '/images/team/Elanda.jpg',
      bio: 'With 9 years of experience in the medical industry, I bring expertise from Greece to London\'s aesthetic scene. Having spent the past 5 years refining my skills in one of the best and most highly rated clinics in London, I specialise in advanced CO2 laser treatments for acne scars, wrinkles, and skin rejuvenation.',
      qualifications: [
        '9+ Years Medical Industry Experience',
        'Advanced CO2 Laser Specialist',
        'Acne Scar Treatment Expert',
        'Skin Resurfacing Procedures'
      ]
    },
    {
      name: 'Mavra',
      title: 'Advanced Aesthetician & Pharmacist Practitioner',
      credentials: '',
      image: '/images/team/Mavra.jpg',
      bio: 'Advanced Aesthetician for the last 9 years with a highly qualified medical background. I specialise in Botox and Dermal fillers, anti-ageing treatments, and skin rejuvenation using the latest techniques and technologies.',
      qualifications: [
        '9 Years Aesthetic Medicine Experience',
        'Pharmacist Practitioner',
        'Anti-Aging Treatment Specialist',
        'Advanced Skincare Techniques'
      ]
    }
  ]

  return (
    <section id="team" className="py-12 sm:py-16 md:py-24 bg-gradient-to-b from-white to-primary-50">
      <div className="max-w-7xl mx-auto section-padding">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <span className="text-primary-600 font-medium tracking-wider uppercase text-xs sm:text-sm">CO2 Laser Experts</span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mt-2 sm:mt-4">
            Meet Your
            <span className="block gradient-text">Expert Team</span>
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-neutral-600 mt-2 sm:mt-4 max-w-2xl mx-auto px-4">
            18+ years combined experience in advanced aesthetics & CO2 laser treatments
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          {team.map((member, index) => (
            <div key={index} className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg sm:shadow-premium hover:shadow-premium-lg transition-all duration-300">
              <div className="aspect-[4/3] sm:aspect-[4/3] relative">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 text-white">
                  <h3 className="text-xl sm:text-2xl font-bold">
                    {member.name}{member.credentials && `, ${member.credentials}`}
                  </h3>
                  <p className="text-sm sm:text-base text-white/90">{member.title}</p>
                </div>
              </div>
              
              <div className="p-6 sm:p-8">
                <p className="text-sm sm:text-base text-neutral-600 mb-4 sm:mb-6 leading-relaxed">
                  {member.bio}
                </p>
                
                <div className="space-y-2 sm:space-y-3">
                  <h4 className="font-semibold text-xs sm:text-sm uppercase tracking-wider text-neutral-500">
                    Qualifications
                  </h4>
                  <ul className="grid grid-cols-1 gap-1.5 sm:gap-2">
                    {member.qualifications.map((qual, idx) => (
                      <li key={idx} className="flex items-start sm:items-center text-xs sm:text-sm text-neutral-700">
                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary-500 mr-2 flex-shrink-0 mt-0.5 sm:mt-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>{qual}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 sm:mt-12 text-center">
          <button 
            onClick={onBookingClick}
            className="w-full sm:w-auto inline-flex items-center justify-center bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-medium text-base sm:text-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            Book Your Consultation
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>

        {/* Trust Indicators - Mobile Optimized */}
        <div className="mt-12 sm:mt-16 bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg sm:shadow-premium">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div>
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <span className="text-xl sm:text-2xl">👩‍⚕️</span>
              </div>
              <h4 className="font-semibold text-sm sm:text-base mb-1 sm:mb-2">Medical Expertise</h4>
              <p className="text-xs sm:text-sm text-neutral-600">Nurse-led treatments</p>
            </div>
            <div>
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <span className="text-xl sm:text-2xl">🏆</span>
              </div>
              <h4 className="font-semibold text-sm sm:text-base mb-1 sm:mb-2">Proven Results</h4>
              <p className="text-xs sm:text-sm text-neutral-600">Expert CO2 treatments</p>
            </div>
            <div>
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <span className="text-xl sm:text-2xl">💝</span>
              </div>
              <h4 className="font-semibold text-sm sm:text-base mb-1 sm:mb-2">Personalized Care</h4>
              <p className="text-xs sm:text-sm text-neutral-600">Dedicated support</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}