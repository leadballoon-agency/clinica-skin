export default function Process() {
  const steps = [
    {
      number: '1',
      title: 'Consultation',
      description: 'Comprehensive skin assessment and personalized treatment planning'
    },
    {
      number: '2',
      title: 'Preparation',
      description: 'Pre-treatment skincare routine to optimize your results'
    },
    {
      number: '3',
      title: 'Treatment',
      description: 'CO2 laser procedure with topical anesthesia for comfort'
    },
    {
      number: '4',
      title: 'Recovery',
      description: '5-7 days healing with our comprehensive aftercare support'
    },
    {
      number: '5',
      title: 'Results',
      description: 'Enjoy your transformed skin with continued improvement over months'
    }
  ]

  return (
    <section id="process" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Treatment Process
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your journey to renewed skin in five simple steps
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-6">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                {step.number}
              </div>
              <h3 className="font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-2xl font-bold mb-6">What to Expect During Recovery</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold mb-3">Timeline</h4>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span className="text-gray-600">Day 1-2: Redness and swelling</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span className="text-gray-600">Day 3-5: Skin begins peeling</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span className="text-gray-600">Day 5-7: New skin emerges</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span className="text-gray-600">Week 2+: Continued improvement</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Aftercare</h4>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span className="text-gray-600">Keep skin moisturized</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span className="text-gray-600">Avoid sun exposure</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span className="text-gray-600">Use prescribed products</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span className="text-gray-600">Follow up appointments</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}