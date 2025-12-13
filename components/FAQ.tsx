'use client'

import { useState } from 'react'

const faqs = [
  {
    question: 'What does CO₂ laser resurfacing recovery look like day by day?',
    answer: 'Expect redness and swelling for the first 1–2 days, followed by peeling between days 3–7. New, pink skin emerges by day 10, and improvements in tone, smoothness, and clarity continue for 6–12 weeks as collagen forms beneath the surface.'
  },
  {
    question: 'What is CO₂ laser resurfacing and how does it work?',
    answer: 'CO₂ laser resurfacing uses fractional laser energy to remove damaged outer skin layers while stimulating collagen production below. It resurfaces texture, softens wrinkles, and brightens tone - revealing smoother, firmer, more youthful skin.'
  },
  {
    question: 'Will I peel or scab after treatment - and for how long?',
    answer: 'Yes. Peeling typically starts around day 3 and lasts up to a week. Light scabbing can appear in targeted areas but will flake away as new skin regenerates. We\'ll guide you through safe aftercare to protect your results.'
  },
  {
    question: 'Is CO₂ laser resurfacing safe for all skin types?',
    answer: 'The treatment is safest and most effective for fair to medium skin tones. Darker skin types may need alternative options to avoid pigmentation risks - our consultation will help determine the best approach for you.'
  },
  {
    question: 'What skin concerns does CO₂ laser resurfacing treat best?',
    answer: 'CO₂ laser resurfacing is ideal for deep wrinkles, sun damage, pigmentation, acne scars, surgical scars, and rough texture. It offers one of the most advanced solutions for visible skin renewal.'
  },
  {
    question: 'How many CO₂ laser treatments will I need?',
    answer: 'Many clients see dramatic improvements after just one session. More severe skin concerns may benefit from a course of two or more treatments spaced several months apart.'
  },
  {
    question: 'How soon will I see results from CO₂ laser resurfacing?',
    answer: 'You\'ll likely see improvements within 2–3 weeks, including smoother skin and a more even tone. Full rejuvenation develops over 6–12 weeks as collagen rebuilds beneath the surface.'
  },
  {
    question: 'Can I wear makeup after CO₂ laser resurfacing?',
    answer: 'You should avoid makeup until your skin has fully healed - typically 7 to 10 days post-treatment. After that, you can safely return to your normal routine with fresh, rejuvenated skin.'
  }
]

interface FAQProps {
  onBookingClick?: () => void
}

export default function FAQ({ onBookingClick }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="faq" className="py-12 sm:py-16 md:py-24 bg-gradient-to-b from-white to-primary-50">
      <div className="max-w-4xl mx-auto section-padding">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <span className="text-primary-600 font-medium tracking-wider uppercase text-xs sm:text-sm">FAQ</span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mt-2 sm:mt-4">
            Your Questions
            <span className="block gradient-text">Answered</span>
          </h2>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-4 sm:px-6 py-4 sm:py-5 text-left flex justify-between items-center hover:bg-primary-50 transition-colors"
              >
                <span className="font-semibold text-sm sm:text-base lg:text-lg pr-3 sm:pr-4">{faq.question}</span>
                <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-primary-400 to-primary-600 flex items-center justify-center flex-shrink-0 transition-transform ${
                  openIndex === index ? 'rotate-180' : ''
                }`}>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              
              <div className={`overflow-hidden transition-all duration-300 ${
                openIndex === index ? 'max-h-96' : 'max-h-0'
              }`}>
                <div className="px-4 sm:px-6 pb-4 sm:pb-5 text-xs sm:text-sm lg:text-base text-neutral-600 leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 sm:mt-12 text-center">
          <p className="text-sm sm:text-base text-neutral-600 mb-4 sm:mb-6">
            Still have questions? We're here to help.
          </p>
          <button 
            onClick={onBookingClick}
            className="inline-flex items-center bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-medium text-sm sm:text-base lg:text-lg hover:shadow-xl transition-all duration-300 hover:scale-105 w-full sm:w-auto justify-center"
          >
            Get in Touch
          </button>
        </div>
      </div>
    </section>
  )
}