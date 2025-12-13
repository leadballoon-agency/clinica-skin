'use client'

import { useState, useEffect } from 'react'

// Configuration
const CONFIG = {
  webhookUrl: 'https://services.leadconnectorhq.com/hooks/YOUR_WEBHOOK_ID_HERE',
  bookingUrlSuitable: 'https://calendly.com/your-clinic/co2-laser-consultation',
  bookingUrlAlternative: 'https://calendly.com/your-clinic/skin-consultation',
  tagSuitable: 'CO2 Laser - Qualified',
  tagNotSuitable: 'CO2 Laser - Not Suitable',
}

// Fitzpatrick quiz data
const fitzpatrickQuestions = [
  {
    id: 'eye_color',
    question: 'What is your natural eye colour?',
    options: [
      { text: 'Light blue, light grey, or light green', score: 0 },
      { text: 'Blue, grey, or green', score: 1 },
      { text: 'Hazel or light brown', score: 2 },
      { text: 'Dark brown', score: 3 },
      { text: 'Brownish black', score: 4 }
    ]
  },
  {
    id: 'hair_color',
    question: 'What is your natural hair colour?',
    options: [
      { text: 'Red or light blonde', score: 0 },
      { text: 'Blonde', score: 1 },
      { text: 'Dark blonde or light brown', score: 2 },
      { text: 'Dark brown', score: 3 },
      { text: 'Black', score: 4 }
    ]
  },
  {
    id: 'skin_color',
    question: 'What is your natural skin colour (unexposed areas)?',
    options: [
      { text: 'Ivory white', score: 0 },
      { text: 'Fair or pale', score: 1 },
      { text: 'Fair to beige with golden undertone', score: 2 },
      { text: 'Olive or light brown', score: 3 },
      { text: 'Dark brown or black', score: 4 }
    ]
  },
  {
    id: 'freckles',
    question: 'How many freckles do you have on unexposed areas?',
    options: [
      { text: 'Many', score: 0 },
      { text: 'Several', score: 1 },
      { text: 'A few', score: 2 },
      { text: 'Very few', score: 3 },
      { text: 'None', score: 4 }
    ]
  },
  {
    id: 'sun_reaction',
    question: 'How does your skin react to sun exposure?',
    options: [
      { text: 'Always burns, blisters, and peels', score: 0 },
      { text: 'Often burns, blisters, and peels', score: 1 },
      { text: 'Burns moderately', score: 2 },
      { text: 'Burns rarely', score: 3 },
      { text: 'Rarely or never burns', score: 4 }
    ]
  },
  {
    id: 'tanning',
    question: 'Does your skin tan?',
    options: [
      { text: 'Never — I just burn and peel', score: 0 },
      { text: 'Seldom', score: 1 },
      { text: 'Sometimes', score: 2 },
      { text: 'Often', score: 3 },
      { text: 'Always — I never burn', score: 4 }
    ]
  }
]

// Qualifying questions
const qualifyingQuestions = [
  {
    id: 'previous_treatments',
    question: 'What treatments have you previously tried? (Select all that apply)',
    type: 'multi-select',
    options: [
      { value: 'chemical_peels', label: 'Chemical Peels' },
      { value: 'microneedling', label: 'Microneedling' },
      { value: 'laser_treatments', label: 'Laser Treatments' },
      { value: 'fillers_botox', label: 'Fillers/Botox' },
      { value: 'rf_treatments', label: 'RF Treatments' },
      { value: 'none', label: 'None' }
    ]
  },
  {
    id: 'budget',
    question: 'What is your budget range for treatment?',
    type: 'single-select',
    options: [
      { value: '200-500', label: '£200-500' },
      { value: '500-1000', label: '£500-1,000' },
      { value: '1000-2000', label: '£1,000-2,000' },
      { value: '2000+', label: '£2,000+' }
    ]
  },
  {
    id: 'downtime',
    question: 'How much downtime can you accommodate?',
    type: 'single-select',
    options: [
      { value: 'none', label: 'No downtime' },
      { value: '1-3', label: '1-3 days' },
      { value: '3-7', label: '3-7 days' },
      { value: '1-2weeks', label: '1-2 weeks' }
    ]
  },
  {
    id: 'intensity',
    question: 'What treatment intensity do you prefer?',
    type: 'single-select',
    options: [
      { value: 'gentle', label: 'Gentle/gradual results' },
      { value: 'moderate', label: 'Moderate intensity' },
      { value: 'aggressive', label: 'Aggressive/maximum results' }
    ]
  }
]

const fitzTypes: Record<number, any> = {
  1: {
    type: 'Type I', name: 'Very Fair',
    description: 'Always burns, never tans. Extremely sun-sensitive skin.',
    color: '#FFE4D6', textColor: '#8B4513',
    laserSuitability: 'excellent', isSuitable: true,
    laserMessage: 'Excellent candidate for CO2 laser resurfacing. Your skin type typically responds very well to ablative laser treatments with predictable healing.',
    considerations: ['Higher sensitivity may require adjusted treatment parameters', 'Excellent collagen response expected', 'Follow strict sun protection protocol post-treatment']
  },
  2: {
    type: 'Type II', name: 'Fair',
    description: 'Usually burns, tans minimally. Very sun-sensitive skin.',
    color: '#FFE8D0', textColor: '#8B4513',
    laserSuitability: 'excellent', isSuitable: true,
    laserMessage: 'Excellent candidate for CO2 laser resurfacing. Your skin type responds very well to treatment with low risk of complications.',
    considerations: ['Optimal healing potential', 'Low risk of post-inflammatory hyperpigmentation', 'Standard treatment protocols apply']
  },
  3: {
    type: 'Type III', name: 'Medium',
    description: 'Sometimes mild burn, tans uniformly. Moderately sun-sensitive.',
    color: '#E8C8A0', textColor: '#5D4037',
    laserSuitability: 'good', isSuitable: true,
    laserMessage: 'Good candidate for CO2 laser resurfacing. Your skin type generally responds well with proper treatment planning.',
    considerations: ['Pre-treatment skin conditioning may be recommended', 'Careful parameter selection for optimal results', 'Monitor for pigmentation changes during healing']
  },
  4: {
    type: 'Type IV', name: 'Olive',
    description: 'Burns minimally, always tans well. Minimal sun sensitivity.',
    color: '#C9A86C', textColor: '#3E2723',
    laserSuitability: 'moderate', isSuitable: true,
    laserMessage: 'Moderate candidate for CO2 laser resurfacing. Treatment is possible but requires careful assessment and may need modified protocols.',
    considerations: ['Higher risk of post-inflammatory hyperpigmentation', 'Pre-treatment with skin lightening agents often recommended', 'Conservative treatment settings typically used', 'Extended consultation recommended']
  },
  5: {
    type: 'Type V', name: 'Brown',
    description: 'Rarely burns, tans darkly easily. Sun-insensitive skin.',
    color: '#8B6914', textColor: '#FFFFFF',
    laserSuitability: 'limited', isSuitable: false,
    laserMessage: 'CO2 laser resurfacing carries significant risks for your skin type. We recommend exploring alternative treatments that can achieve similar results more safely.',
    considerations: ['Significant risk of hyperpigmentation and scarring with CO2', 'Alternative treatments like chemical peels or microneedling often preferred', 'Specialised protocols available for darker skin types', 'Comprehensive consultation essential to discuss all options']
  },
  6: {
    type: 'Type VI', name: 'Dark Brown/Black',
    description: 'Never burns, deeply pigmented. Sun-insensitive skin.',
    color: '#4A3728', textColor: '#FFFFFF',
    laserSuitability: 'not-recommended', isSuitable: false,
    laserMessage: 'CO2 laser resurfacing is not recommended for your skin type due to high complication risks. However, we have excellent alternative treatments that are safe and effective for your skin.',
    considerations: ['Very high risk of hyperpigmentation, hypopigmentation, and scarring with CO2', 'Safe and effective alternatives available', 'Options include: gentle chemical peels, microneedling, or specialised darker skin protocols', 'Our specialists can recommend the best approach for your goals']
  }
}

// Helper to map skin type to Fitzpatrick scores
const skinTypeToFitzpatrickScores = (skinType: number): Record<string, number> => {
  const totalScoreRanges = [
    { type: 1, maxScore: 6 },
    { type: 2, maxScore: 12 },
    { type: 3, maxScore: 18 },
    { type: 4, maxScore: 24 },
    { type: 5, maxScore: 30 },
    { type: 6, maxScore: 36 }
  ]

  const range = totalScoreRanges.find(r => r.type === skinType)
  const avgScore = range ? Math.floor((range.maxScore - (range.maxScore > 6 ? 6 : 0)) / 6) : 2

  return {
    'eye_color': avgScore,
    'hair_color': avgScore,
    'skin_color': avgScore,
    'freckles': avgScore,
    'sun_reaction': avgScore,
    'tanning': avgScore
  }
}

interface AssessmentModalProps {
  isOpen: boolean
  onClose: () => void
  initialData?: {
    skinType?: number
    concern?: string
    age?: string
  }
}

export default function AssessmentModal({ isOpen, onClose, initialData }: AssessmentModalProps) {
  // Quiz state
  const [quizPhase, setQuizPhase] = useState<'intro' | 'fitzpatrick' | 'qualifying' | 'analyzing' | 'lead' | 'results'>('intro')
  const [fitzpatrickStep, setFitzpatrickStep] = useState(0)
  const [qualifyingStep, setQualifyingStep] = useState(0)
  const [fitzpatrickAnswers, setFitzpatrickAnswers] = useState<Record<string, number>>({})
  const [qualifyingAnswers, setQualifyingAnswers] = useState<Record<string, any>>({})
  const [selectedMultiOptions, setSelectedMultiOptions] = useState<string[]>([])

  // Lead form
  const [leadData, setLeadData] = useState({ firstName: '', lastName: '', email: '', phone: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)

  // Exit confirmation
  const [showExitConfirm, setShowExitConfirm] = useState(false)

  // Pre-fill answers if initialData provided
  useEffect(() => {
    if (isOpen && initialData?.skinType) {
      const preFilled = skinTypeToFitzpatrickScores(initialData.skinType)
      setFitzpatrickAnswers(preFilled)
    }
  }, [isOpen, initialData])

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setQuizPhase('intro')
        setFitzpatrickStep(0)
        setQualifyingStep(0)
        setFitzpatrickAnswers({})
        setQualifyingAnswers({})
        setSelectedMultiOptions([])
        setLeadData({ firstName: '', lastName: '', email: '', phone: '' })
        setErrors({})
        setShowExitConfirm(false)
      }, 300)
    }
  }, [isOpen])

  const calculateFitzpatrickType = () => {
    const total = Object.values(fitzpatrickAnswers).reduce((sum, score) => sum + score, 0)
    if (total <= 6) return 1
    if (total <= 12) return 2
    if (total <= 18) return 3
    if (total <= 24) return 4
    if (total <= 30) return 5
    return 6
  }

  const handleFitzpatrickAnswer = (score: number) => {
    const newAnswers = { ...fitzpatrickAnswers, [fitzpatrickQuestions[fitzpatrickStep].id]: score }
    setFitzpatrickAnswers(newAnswers)

    setTimeout(() => {
      if (fitzpatrickStep < fitzpatrickQuestions.length - 1) {
        setFitzpatrickStep(fitzpatrickStep + 1)
      } else {
        setQuizPhase('qualifying')
        setQualifyingStep(0)
      }
    }, 300)
  }

  const handleQualifyingAnswer = (value: any) => {
    const currentQ = qualifyingQuestions[qualifyingStep]

    if (currentQ.type === 'multi-select') {
      setQualifyingAnswers({ ...qualifyingAnswers, [currentQ.id]: selectedMultiOptions })
      setTimeout(() => {
        if (qualifyingStep < qualifyingQuestions.length - 1) {
          setQualifyingStep(qualifyingStep + 1)
          setSelectedMultiOptions([])
        } else {
          // Show analyzing animation
          setQuizPhase('analyzing')
          setTimeout(() => {
            setQuizPhase('lead')
          }, 2000)
        }
      }, 300)
    } else {
      setQualifyingAnswers({ ...qualifyingAnswers, [currentQ.id]: value })
      setTimeout(() => {
        if (qualifyingStep < qualifyingQuestions.length - 1) {
          setQualifyingStep(qualifyingStep + 1)
        } else {
          // Show analyzing animation
          setQuizPhase('analyzing')
          setTimeout(() => {
            setQuizPhase('lead')
          }, 2000)
        }
      }, 300)
    }
  }

  const toggleMultiOption = (value: string) => {
    if (selectedMultiOptions.includes(value)) {
      setSelectedMultiOptions(selectedMultiOptions.filter(v => v !== value))
    } else {
      setSelectedMultiOptions([...selectedMultiOptions, value])
    }
  }

  const getEnhancedRecommendation = () => {
    const fitzType = calculateFitzpatrickType()
    const result = fitzTypes[fitzType]
    const budget = qualifyingAnswers.budget
    const downtime = qualifyingAnswers.downtime

    if (result.isSuitable) {
      return {
        treatment: 'CO2 Laser Resurfacing',
        price: budget === '2000+' ? '£1,500 - £2,500' : budget === '1000-2000' ? '£700 - £1,500' : '£450 - £700',
        description: 'Based on your skin type, concerns, and preferences, CO2 laser resurfacing is an excellent choice for dramatic results.',
        isSuitable: true,
        fitzType: result
      }
    }

    if (downtime === 'none' && budget === '2000+') {
      return {
        treatment: 'HIFU Skin Tightening',
        price: '£800 - £1,200',
        description: 'No downtime, high-end treatment perfect for your skin type. Non-invasive ultrasound technology for lifting and tightening.',
        isSuitable: false,
        fitzType: result
      }
    } else if (downtime === 'none' || downtime === '1-3') {
      return {
        treatment: 'RF Microneedling',
        price: '£600 - £900',
        description: 'Minimal downtime treatment that combines radiofrequency with microneedling. Safe and effective for darker skin tones.',
        isSuitable: false,
        fitzType: result
      }
    } else if (budget === '200-500' || budget === '500-1000') {
      return {
        treatment: 'Chemical Peel (TCA)',
        price: '£250 - £500',
        description: 'Cost-effective treatment specially formulated for darker skin tones. Addresses pigmentation and texture concerns safely.',
        isSuitable: false,
        fitzType: result
      }
    } else {
      return {
        treatment: 'Microneedling with PRF',
        price: '£400 - £700',
        description: 'Uses your own growth factors for natural healing. Safe and effective for all skin types with moderate downtime.',
        isSuitable: false,
        fitzType: result
      }
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!leadData.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!leadData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(leadData.email)) {
      newErrors.email = 'Valid email is required'
    }
    if (!leadData.phone.trim()) newErrors.phone = 'Phone number is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setSubmitting(true)

    const fitzType = calculateFitzpatrickType()
    const result = fitzTypes[fitzType]
    const recommendation = getEnhancedRecommendation()

    const suitabilityLabels: Record<string, string> = {
      'excellent': 'Excellent Candidate',
      'good': 'Good Candidate',
      'moderate': 'Moderate Candidate',
      'limited': 'Limited Candidate',
      'not-recommended': 'Not Recommended'
    }

    const payload = {
      firstName: leadData.firstName,
      lastName: leadData.lastName,
      email: leadData.email,
      phone: leadData.phone,
      fitzpatrick_type: fitzType,
      fitzpatrick_name: `${result.type} - ${result.name}`,
      co2_laser_suitability: suitabilityLabels[result.laserSuitability],
      co2_laser_suitable: result.isSuitable,
      recommended_treatment: recommendation.treatment,
      recommended_price: recommendation.price,
      previous_treatments: qualifyingAnswers.previous_treatments?.join(', ') || 'None',
      budget_range: qualifyingAnswers.budget || 'Not specified',
      downtime_available: qualifyingAnswers.downtime || 'Not specified',
      treatment_intensity: qualifyingAnswers.intensity || 'Not specified',
      initial_concern: initialData?.concern || 'Not specified',
      initial_age_range: initialData?.age || 'Not specified',
      tags: result.isSuitable ? CONFIG.tagSuitable : CONFIG.tagNotSuitable,
      assessment_source: 'Modal Assessment',
      submitted_at: new Date().toISOString()
    }

    try {
      await fetch(CONFIG.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        mode: 'no-cors',
        body: JSON.stringify(payload)
      })
    } catch (error) {
      console.error('Webhook error:', error)
    }

    setQuizPhase('results')
    setSubmitting(false)
  }

  const handleClose = () => {
    if (quizPhase !== 'intro' && quizPhase !== 'results') {
      setShowExitConfirm(true)
    } else {
      onClose()
    }
  }

  const confirmExit = () => {
    setShowExitConfirm(false)
    onClose()
  }

  if (!isOpen) return null

  const fitzpatrickProgress = ((fitzpatrickStep + 1) / fitzpatrickQuestions.length) * 50
  const qualifyingProgress = 50 + ((qualifyingStep + 1) / qualifyingQuestions.length) * 50
  const currentFitzQ = fitzpatrickQuestions[fitzpatrickStep]
  const currentQualifyingQ = qualifyingQuestions[qualifyingStep]
  const recommendation = getEnhancedRecommendation()

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className={`bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto pointer-events-auto transform transition-all duration-300 ${
            isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Modal Content */}
          <div className="p-8">
            {/* Intro Screen */}
            {quizPhase === 'intro' && (
              <div className="text-center animate-slide-up">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Enhanced Skin Assessment</h2>
                <p className="text-gray-600 mb-6">
                  Complete 10 quick questions for personalized treatment recommendations
                </p>

                {initialData && (
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-6 text-left">
                    <p className="text-sm font-semibold text-blue-900 mb-2">Your Initial Results:</p>
                    <ul className="text-sm text-blue-800 space-y-1">
                      {initialData.skinType && <li>• Skin Type: Type {initialData.skinType}</li>}
                      {initialData.concern && <li>• Concern: {initialData.concern}</li>}
                      {initialData.age && <li>• Age: {initialData.age}</li>}
                    </ul>
                    <p className="text-xs text-blue-700 mt-3">
                      We've pre-filled some answers but you can review and adjust them
                    </p>
                  </div>
                )}

                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">What to expect:</h3>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">1-6:</span>
                      <span>Skin type validation questions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">7-10:</span>
                      <span>Treatment preferences & budget</span>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={() => setQuizPhase('fitzpatrick')}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Start Assessment
                </button>
              </div>
            )}

            {/* Fitzpatrick Questions */}
            {quizPhase === 'fitzpatrick' && currentFitzQ && (
              <div>
                {/* Pre-filled Notice - Only show if we have pre-filled data */}
                {initialData?.skinType && fitzpatrickStep === 0 && (
                  <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="text-xl">👉</div>
                      <div className="flex-1">
                        <p className="text-sm text-blue-900 font-medium mb-1">Quick Tip</p>
                        <p className="text-sm text-blue-800">
                          We've pre-selected answers based on your skin tone. Please review and click each one to confirm or adjust if needed.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mb-8">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Question {fitzpatrickStep + 1} of 10</span>
                    <span>{Math.round(fitzpatrickProgress)}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
                      style={{ width: `${fitzpatrickProgress}%` }}
                    />
                  </div>
                </div>

                <div className="mb-2">
                  <span className="text-sm text-blue-600 font-medium">SKIN TYPE VALIDATION</span>
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  {currentFitzQ.question}
                </h2>

                {initialData && fitzpatrickAnswers[currentFitzQ.id] !== undefined && (
                  <div className="mb-4 text-sm text-blue-600 bg-blue-50 border border-blue-200 rounded-lg p-3">
                    Pre-filled based on your initial assessment. You can change if needed.
                  </div>
                )}

                <div className="space-y-3">
                  {currentFitzQ.options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleFitzpatrickAnswer(option.score)}
                      className={`w-full p-4 text-left border-2 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 group ${
                        fitzpatrickAnswers[currentFitzQ.id] === option.score
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          fitzpatrickAnswers[currentFitzQ.id] === option.score
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-300 group-hover:border-blue-500'
                        }`}>
                          {fitzpatrickAnswers[currentFitzQ.id] === option.score && (
                            <div className="w-2 h-2 rounded-full bg-white" />
                          )}
                        </div>
                        <span className="text-gray-700 group-hover:text-gray-900">{option.text}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Qualifying Questions */}
            {quizPhase === 'qualifying' && currentQualifyingQ && (
              <div>
                <div className="mb-8">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Question {6 + qualifyingStep + 1} of 10</span>
                    <span>{Math.round(qualifyingProgress)}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
                      style={{ width: `${qualifyingProgress}%` }}
                    />
                  </div>
                </div>

                <div className="mb-2">
                  <span className="text-sm text-blue-600 font-medium">TREATMENT PREFERENCES</span>
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  {currentQualifyingQ.question}
                </h2>

                {currentQualifyingQ.type === 'multi-select' ? (
                  <div className="space-y-6">
                    <div className="space-y-3">
                      {currentQualifyingQ.options.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => toggleMultiOption(option.value)}
                          className={`w-full p-4 text-left border-2 rounded-xl transition-all duration-200 ${
                            selectedMultiOptions.includes(option.value)
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                              selectedMultiOptions.includes(option.value)
                                ? 'border-blue-500 bg-blue-500'
                                : 'border-gray-300'
                            }`}>
                              {selectedMultiOptions.includes(option.value) && (
                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                            <span className="text-gray-700">{option.label}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => handleQualifyingAnswer(selectedMultiOptions)}
                      disabled={selectedMultiOptions.length === 0}
                      className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Continue
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {currentQualifyingQ.options.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleQualifyingAnswer(option.value)}
                        className="w-full p-4 text-left border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full border-2 border-gray-300 group-hover:border-blue-500 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <span className="text-gray-700 group-hover:text-gray-900">{option.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Analyzing Animation */}
            {quizPhase === 'analyzing' && (
              <div className="text-center py-16">
                <div className="relative w-20 h-20 mx-auto mb-6">
                  {/* Outer ring */}
                  <div className="absolute inset-0 rounded-full border-4 border-blue-200 animate-ping" style={{ animationDuration: '1.5s' }} />
                  {/* Middle ring */}
                  <div className="absolute inset-2 rounded-full border-4 border-blue-400 animate-spin" />
                  {/* Inner circle */}
                  <div className="absolute inset-4 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 animate-pulse" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 animate-fade-in">
                  Analyzing your skin profile...
                </h3>
                <p className="text-gray-600 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                  Creating personalized recommendations
                </p>
              </div>
            )}

            {/* Lead Form - Rest of the component continues... */}
            {quizPhase === 'lead' && (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Results Are Ready!</h2>
                <p className="text-gray-600 mb-6">Enter your details to see your personalized recommendations</p>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 text-left">First Name *</label>
                      <input
                        type="text"
                        value={leadData.firstName}
                        onChange={(e) => setLeadData({...leadData, firstName: e.target.value})}
                        className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-blue-500 ${errors.firstName ? 'border-red-500' : 'border-gray-200'}`}
                        placeholder="Jane"
                      />
                      {errors.firstName && <p className="text-red-500 text-sm mt-1 text-left">{errors.firstName}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 text-left">Last Name</label>
                      <input
                        type="text"
                        value={leadData.lastName}
                        onChange={(e) => setLeadData({...leadData, lastName: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                        placeholder="Smith"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 text-left">Email *</label>
                    <input
                      type="email"
                      value={leadData.email}
                      onChange={(e) => setLeadData({...leadData, email: e.target.value})}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-200'}`}
                      placeholder="jane@example.com"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1 text-left">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 text-left">Phone *</label>
                    <input
                      type="tel"
                      value={leadData.phone}
                      onChange={(e) => setLeadData({...leadData, phone: e.target.value})}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-blue-500 ${errors.phone ? 'border-red-500' : 'border-gray-200'}`}
                      placeholder="07123 456789"
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1 text-left">{errors.phone}</p>}
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
                  >
                    {submitting ? 'Processing...' : 'See My Results'}
                  </button>

                  <p className="text-xs text-gray-500 text-center mt-4">
                    By submitting, you agree to receive communications about your assessment
                  </p>
                </div>
              </div>
            )}

            {/* Results */}
            {quizPhase === 'results' && recommendation && (
              <div className="text-center">
                <div
                  className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg"
                  style={{
                    background: `linear-gradient(145deg, ${recommendation.fitzType.color}, ${recommendation.fitzType.color}CC)`,
                    color: recommendation.fitzType.textColor
                  }}
                >
                  <span className="text-4xl font-bold">{calculateFitzpatrickType()}</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{recommendation.fitzType.type}</h2>
                <p className="text-xl text-gray-600 mb-2">{recommendation.fitzType.name}</p>
                <p className="text-gray-500 mb-6">{recommendation.fitzType.description}</p>

                <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white mb-6 text-left">
                  <h3 className="text-sm font-semibold mb-3">YOUR PERSONALIZED RECOMMENDATION</h3>
                  <h4 className="text-2xl font-bold mb-2">{recommendation.treatment}</h4>
                  <p className="text-xl font-semibold mb-3">{recommendation.price}</p>
                  <p className="text-blue-50 mb-4">{recommendation.description}</p>

                  <div className="bg-white/10 rounded-lg p-4 mb-4">
                    <p className="text-sm font-medium mb-2">Based on your assessment:</p>
                    <ul className="text-sm space-y-1 text-blue-100">
                      <li>• Budget: {qualifyingAnswers.budget === '200-500' ? '£200-500' : qualifyingAnswers.budget === '500-1000' ? '£500-1,000' : qualifyingAnswers.budget === '1000-2000' ? '£1,000-2,000' : '£2,000+'}</li>
                      <li>• Downtime: {qualifyingAnswers.downtime === 'none' ? 'No downtime' : qualifyingAnswers.downtime === '1-3' ? '1-3 days' : qualifyingAnswers.downtime === '3-7' ? '3-7 days' : '1-2 weeks'}</li>
                      <li>• Intensity: {qualifyingAnswers.intensity === 'gentle' ? 'Gentle/gradual' : qualifyingAnswers.intensity === 'moderate' ? 'Moderate' : 'Aggressive/maximum results'}</li>
                    </ul>
                  </div>

                  {recommendation.isSuitable ? (
                    <a
                      href={CONFIG.bookingUrlSuitable}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full py-3 bg-white text-blue-700 font-semibold rounded-lg hover:bg-gray-100 transition-colors text-center"
                    >
                      Book Your Consultation
                    </a>
                  ) : (
                    <a
                      href={CONFIG.bookingUrlAlternative}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full py-3 bg-white text-blue-700 font-semibold rounded-lg hover:bg-gray-100 transition-colors text-center"
                    >
                      Explore This Treatment
                    </a>
                  )}
                </div>

                <button
                  onClick={onClose}
                  className="w-full py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Exit Confirmation Dialog */}
      {showExitConfirm && (
        <div className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Are you sure?</h3>
            <p className="text-gray-600 mb-6">Your progress will be lost if you exit now.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors"
              >
                Continue Assessment
              </button>
              <button
                onClick={confirmExit}
                className="flex-1 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
              >
                Exit
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
        .animate-slide-up {
          animation: slide-up 0.4s ease-out forwards;
        }
      `}</style>
    </>
  )
}
