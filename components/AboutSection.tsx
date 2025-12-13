interface AboutSectionProps {
  onBookingClick?: () => void
}

export default function AboutSection({ onBookingClick }: AboutSectionProps) {
  const practitioners = [
    {
      name: 'Dr. Katarzyna Wasilewska',
      title: 'Founder & Senior Aesthetic Medicine Doctor',
      image: '/images/Dr-Katarzyna-cropped.jpg',
      bio: 'Dr. Kat studied Medicine at the University of Cambridge and trained at Cambridge University Hospitals. She is qualified in Aesthetic and Regenerative Medicine and is a registered member of the Aesthetic Complications Expert Group (ACE). She has spoken internationally on skin longevity, including at Stanford University.',
      qualifications: [
        'Cambridge University Medicine Graduate',
        'GMC-Registered Medical Doctor',
        'Aesthetic & Regenerative Medicine Specialist',
        'ACE Group Member'
      ]
    },
    {
      name: 'Dr. Abigail Coutinho',
      title: 'Senior Aesthetic Medicine Doctor',
      image: '/images/Dr Abigail Coutinho.jpg',
      bio: 'Dr Abigail is a GMC-registered doctor with an MBBS and BSc in Psychology from King\'s College London. She completed a Level 7 Diploma in Aesthetics from Harley Academy – the highest postgraduate qualification in the field. Her focus includes treating skin of colour and pigmentation concerns.',
      qualifications: [
        'GMC-Registered Medical Doctor',
        'King\'s College London Graduate',
        'Level 7 Diploma in Aesthetics',
        'Skin of Colour Specialist'
      ]
    }
  ]

  const supportingTeam = [
    {
      name: 'Jodie Stebbings',
      title: 'Clinic Manager & Senior Technician',
      image: '/images/Miss Jodie-Stebbings.jpg',
      description: 'Advanced laser specialist with 6+ years experience. Expert in pigmentation, acne & rosacea treatments.'
    },
    {
      name: 'Alina Bila',
      title: 'Junior Technician',
      image: '/images/Mrs Alina Bila.jpg',
      description: 'Certified beauty specialist (Levels 2-5) specialising in facial treatments and skincare.'
    },
    {
      name: 'Klaudia Traubert',
      title: 'Massage & Wellness Therapist',
      image: '/images/Klaudia Traubert.jpg',
      description: 'Qualified since 2016 with advanced certifications in facial treatments and lymphatic drainage.'
    },
    {
      name: 'Paulina Lutynska',
      title: 'Eyelash Specialist',
      image: '/images/Paulina Lutynska.jpg',
      description: 'Lash stylist since 2013. UK Hair & Beauty Awards finalist for Lash Stylist of the Year.'
    }
  ]

  return (
    <section id="about" className="py-12 sm:py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto section-padding">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <span className="text-primary-600 font-medium tracking-wider uppercase text-xs sm:text-sm">Meet Your Expert Team</span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mt-2 sm:mt-4">
            Doctor-Led
            <span className="block gradient-text">Excellence</span>
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-neutral-600 mt-2 sm:mt-4 max-w-2xl mx-auto px-4">
            Cambridge-trained medical expertise dedicated to your skin health journey
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {practitioners.map((practitioner, index) => (
            <div key={index} className="bg-gradient-to-br from-white to-primary-50/30 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-premium hover:shadow-premium-lg transition-all duration-300">
              {/* Practitioner Image */}
              <div className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-lg mb-6">
                <div className="aspect-[4/5] relative">
                  <img
                    src={practitioner.image}
                    alt={`${practitioner.name} - ${practitioner.title}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-100/10 to-primary-300/10"></div>
                </div>
              </div>

              {/* Practitioner Info */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold">
                    {practitioner.name}
                  </h3>
                  <p className="text-base sm:text-lg text-primary-600 font-medium mt-1">
                    {practitioner.title}
                  </p>
                </div>

                <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
                  {practitioner.bio}
                </p>

                {/* Qualifications */}
                <div className="space-y-3 pt-2">
                  <h4 className="font-bold text-base sm:text-lg">Qualifications & Expertise</h4>
                  <ul className="space-y-2">
                    {practitioner.qualifications.map((item, qIndex) => (
                      <li key={qIndex} className="flex items-start text-neutral-700">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-primary-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-xs sm:text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Supporting Team Section */}
        <div className="mt-12 sm:mt-16">
          <div className="text-center mb-8">
            <h3 className="font-display text-xl sm:text-2xl font-bold text-neutral-800">
              Our Supporting Team
            </h3>
            <p className="text-sm text-neutral-600 mt-2">
              Expert care at every step of your journey
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {supportingTeam.map((member, index) => (
              <div key={index} className="text-center group">
                <div className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-md mb-3 sm:mb-4 aspect-square">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h4 className="font-bold text-sm sm:text-base text-neutral-800">{member.name}</h4>
                <p className="text-primary-600 text-xs sm:text-sm font-medium">{member.title}</p>
                <p className="text-neutral-500 text-xs mt-1 hidden sm:block leading-relaxed">{member.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Single CTA below team */}
        <div className="text-center mt-10 sm:mt-12">
          <button
            onClick={onBookingClick}
            className="w-full sm:w-auto inline-flex items-center justify-center bg-gradient-to-r from-primary-500 to-primary-600 text-white px-8 sm:px-10 py-3 sm:py-4 rounded-full font-medium text-base sm:text-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            Book Your Consultation
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}
