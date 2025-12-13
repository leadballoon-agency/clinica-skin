'use client'

import { useState } from 'react'
import { trackAssessmentStart, trackAssessmentComplete } from './FacebookPixel'
import AssessmentModal from './AssessmentModal'

interface AssessmentToolProps {
  onBookingClick?: () => void
  onAssessmentComplete?: (data: any) => void
}

export default function AssessmentTool({ onBookingClick, onAssessmentComplete }: AssessmentToolProps) {
  const [step, setStep] = useState(1)
  const [answers, setAnswers] = useState<any>({})
  const [selectedSkinTone, setSelectedSkinTone] = useState<number | null>(null)
  const [showModal, setShowModal] = useState(false)

  const skinTones = [
    { type: 1, name: 'Very Fair', color: '#FFE4D6', desc: 'Always burns, never tans' },
    { type: 2, name: 'Fair', color: '#FFE8D0', desc: 'Usually burns, tans minimally' },
    { type: 3, name: 'Medium', color: '#E8C8A0', desc: 'Sometimes burns, tans uniformly' },
    { type: 4, name: 'Olive', color: '#C9A86C', desc: 'Rarely burns, tans well' },
    { type: 5, name: 'Brown', color: '#8B6914', desc: 'Very rarely burns, tans easily' },
    { type: 6, name: 'Deep Brown', color: '#4A3728', desc: 'Never burns, deeply pigmented' }
  ]

  const questions = [
    {
      id: 1,
      question: "What is your primary skin concern?",
      options: [
        { value: 'wrinkles', label: 'Fine lines & wrinkles', icon: '🔍' },
        { value: 'scars', label: 'Acne scars', icon: '✨' },
        { value: 'pigmentation', label: 'Pigmentation & sun damage', icon: '☀️' },
        { value: 'stretch-marks', label: 'Stretch marks', icon: '🌟' },
        { value: 'texture', label: 'Skin texture & pores', icon: '💎' },
        { value: 'aging', label: 'General anti-aging', icon: '⏰' }
      ]
    },
    {
      id: 2,
      question: "What is your age range?",
      options: [
        { value: '20-30', label: '20-30', icon: '🌱' },
        { value: '31-40', label: '31-40', icon: '🌿' },
        { value: '41-50', label: '41-50', icon: '🌳' },
        { value: '50+', label: '50+', icon: '🌲' }
      ]
    },
    {
      id: 3,
      question: "What is your natural skin tone?",
      subtext: "Select the shade that best matches your skin in areas not exposed to sun",
      type: 'skin-tone'
    }
  ]

  const totalSteps = questions.length
  const currentQuestion = questions[step - 1]

  const handleAnswer = (value: string | number) => {
    const newAnswers = { ...answers, [step]: value }
    setAnswers(newAnswers)

    // Track first question as assessment start
    if (step === 1) {
      trackAssessmentStart()
    }

    if (step < totalSteps) {
      setStep(step + 1)
    } else {
      // Show results and emit assessment completion
      setStep(step + 1)
      const recommendation = getRecommendation(newAnswers)

      // Track assessment completion
      trackAssessmentComplete(recommendation.treatment)

      onAssessmentComplete?.({
        answers: newAnswers,
        recommendation,
        completedAt: new Date().toISOString()
      })
    }
  }

  const getRecommendation = (assessmentAnswers: any = answers) => {
    const concern = assessmentAnswers[1]
    const ageRange = assessmentAnswers[2]
    const skinType = assessmentAnswers[3]

    // Types V-VI (5-6) - NOT suitable for CO2 laser
    if (skinType >= 5) {
      // Recommend alternative treatments
      if (concern === 'wrinkles' || concern === 'aging') {
        return {
          treatment: 'HIFU Skin Tightening',
          price: '£800',
          description: 'Perfect alternative for darker skin tones. Non-invasive ultrasound treatment for lifting and tightening without laser risks.',
          isSuitable: false,
          skinType: skinType
        }
      } else if (concern === 'scars') {
        return {
          treatment: 'Microneedling with PRF',
          price: '£400',
          description: 'Safe and effective for acne scars on darker skin. Uses your own growth factors for natural healing.',
          isSuitable: false,
          skinType: skinType
        }
      } else if (concern === 'pigmentation') {
        return {
          treatment: 'Chemical Peel (TCA)',
          price: '£250',
          description: 'Specially formulated peels safe for darker skin tones. Reduces pigmentation without laser risks.',
          isSuitable: false,
          skinType: skinType
        }
      } else {
        return {
          treatment: 'RF Microneedling',
          price: '£600',
          description: 'Gold standard for darker skin types. Combines radiofrequency with microneedling for safe, effective results.',
          isSuitable: false,
          skinType: skinType
        }
      }
    }

    // Types I-IV (1-4) - SUITABLE for CO2 laser
    // Recommend based on severity and concerns
    if (concern === 'scars' ||
        (concern === 'wrinkles' && ageRange === '50+') ||
        (concern === 'pigmentation' && ageRange !== '20-30')) {
      return {
        treatment: 'PRP For Free Deal',
        price: '£700',
        description: 'Best value - 2 sessions for £350 each + FREE PRP enhancement. Save £300 total! Perfect for deeper concerns.',
        isSuitable: true,
        skinType: skinType
      }
    } else if (concern === 'stretch-marks') {
      return {
        treatment: 'PRP For Free Deal',
        price: '£700',
        description: 'Recommended for stretch marks - 2 sessions with FREE PRP for optimal results',
        isSuitable: true,
        skinType: skinType
      }
    } else if (concern === 'pigmentation' || concern === 'wrinkles' || concern === 'aging') {
      return {
        treatment: 'Single + PRP',
        price: '£500',
        description: 'Single CO2 laser session with PRP enhancement for faster healing and better results',
        isSuitable: true,
        skinType: skinType
      }
    } else {
      return {
        treatment: 'Single Session',
        price: '£450',
        description: 'Individual CO2 laser treatment for targeted skin improvement',
        isSuitable: true,
        skinType: skinType
      }
    }
  }

  return (
    <section id="assessment" className="py-12 sm:py-16 md:py-24 bg-gradient-to-b from-white to-primary-50">
      <div className="max-w-4xl mx-auto section-padding">
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-primary-100 to-primary-200 rounded-full mb-3">
            <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse mr-2"></span>
            <span className="text-primary-700 font-medium text-xs sm:text-sm">AI-Powered Assessment</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3">
            Find Your Perfect
            <span className="gradient-text"> Treatment</span>
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-neutral-600 max-w-2xl mx-auto px-4">
            Answer 3 quick questions for personalized recommendations
          </p>
        </div>

        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-premium p-6 sm:p-8 md:p-12">
          {step <= totalSteps && currentQuestion ? (
            <>
              {/* Progress Bar */}
              <div className="mb-6 sm:mb-8">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs sm:text-sm text-neutral-600">Step {step} of {totalSteps}</span>
                  <span className="text-xs sm:text-sm text-neutral-600">{Math.round((step / totalSteps) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                  <div
                    className="bg-gradient-to-r from-primary-400 to-primary-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${(step / totalSteps) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Question */}
              <div className="text-center mb-6 sm:mb-8">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2">{currentQuestion.question}</h3>
                {currentQuestion.subtext && (
                  <p className="text-sm text-neutral-500">{currentQuestion.subtext}</p>
                )}
              </div>

              {/* Skin Tone Selector */}
              {currentQuestion.type === 'skin-tone' ? (
                <div className="space-y-3">
                  {skinTones.map((tone) => (
                    <button
                      key={tone.type}
                      onClick={() => {
                        setSelectedSkinTone(tone.type)
                        setTimeout(() => handleAnswer(tone.type), 300)
                      }}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-300 hover:scale-102 ${
                        selectedSkinTone === tone.type
                          ? 'border-primary-500 bg-primary-50 shadow-lg'
                          : 'border-gray-200 hover:border-primary-300 hover:shadow-md'
                      }`}
                    >
                      <div
                        className="w-16 h-16 rounded-full border-4 border-white shadow-md flex-shrink-0"
                        style={{ backgroundColor: tone.color }}
                      ></div>
                      <div className="text-left flex-grow">
                        <div className="font-semibold text-gray-900 mb-1">
                          {tone.name}
                          <span className="text-xs text-gray-500 ml-2">Type {tone.type}</span>
                        </div>
                        <div className="text-sm text-gray-600">{tone.desc}</div>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        selectedSkinTone === tone.type
                          ? 'border-primary-500 bg-primary-500'
                          : 'border-gray-300'
                      }`}>
                        {selectedSkinTone === tone.type && (
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                /* Standard Options */
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {currentQuestion.options?.map((option: any) => (
                    <button
                      key={option.value}
                      onClick={() => handleAnswer(option.value)}
                      className="group relative bg-white border-2 border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:border-primary-500 hover:shadow-lg transition-all duration-300 hover:scale-105 flex sm:flex-col items-center sm:items-center text-left sm:text-center"
                    >
                      <div className="text-3xl sm:text-4xl mr-4 sm:mr-0 sm:mb-3">{option.icon}</div>
                      <p className="font-medium text-sm sm:text-base text-neutral-700 group-hover:text-primary-600">
                        {option.label}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            /* Results */
            <div className="text-center animate-slide-up">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <span className="text-3xl sm:text-4xl">{getRecommendation().isSuitable ? '✨' : '💎'}</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
                {getRecommendation().isSuitable ? 'Your Perfect Treatment' : 'Recommended Alternative'}
              </h3>

              {!getRecommendation().isSuitable && (
                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-6 text-left">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">ℹ️</div>
                    <div>
                      <p className="text-sm text-blue-900 font-medium mb-1">Important Safety Note</p>
                      <p className="text-sm text-blue-800">
                        Based on your skin type, CO2 laser carries higher risks. We've recommended a safer, equally effective alternative treatment designed specifically for your skin tone.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-gradient-to-br from-primary-50 to-white rounded-xl sm:rounded-2xl p-6 sm:p-8 mb-4 sm:mb-6 border-2 border-primary-100">
                <h4 className="text-lg sm:text-xl font-bold text-primary-600 mb-2">
                  {getRecommendation().treatment}
                </h4>
                <p className="text-2xl sm:text-3xl font-bold gradient-text mb-2 sm:mb-3">
                  {getRecommendation().price}
                </p>
                <p className="text-sm sm:text-base text-neutral-600">
                  {getRecommendation().description}
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:gap-4">
                {!getRecommendation().isSuitable && (
                  <button
                    onClick={() => setShowModal(true)}
                    type="button"
                    className="w-full inline-flex items-center justify-center bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-3 sm:py-4 rounded-full font-medium hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    Continue to Full Assessment
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                )}
                <button
                  onClick={onBookingClick}
                  type="button"
                  className={`w-full inline-flex items-center justify-center ${
                    !getRecommendation().isSuitable
                      ? 'border-2 border-primary-500 text-primary-600 bg-white hover:bg-primary-50'
                      : 'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:shadow-xl hover:scale-105'
                  } px-6 py-3 sm:py-4 rounded-full font-medium transition-all duration-300`}
                >
                  Book Consultation
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
                <button
                  onClick={() => {setStep(1); setAnswers({}); setSelectedSkinTone(null)}}
                  className="w-full inline-flex items-center justify-center text-primary-600 text-sm font-medium hover:text-primary-700 transition-all duration-300"
                >
                  ← Start Over
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Assessment Modal */}
      <AssessmentModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        initialData={{
          skinType: answers[3],
          concern: answers[1],
          age: answers[2]
        }}
      />
    </section>
  )
}
