export default function Hero() {
  return (
    <section className="relative bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              CO2 Laser Treatment
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Advanced skin resurfacing for wrinkles, scars, and texture improvement. 
              Experience dramatic results with our state-of-the-art CO2 laser technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="#contact" 
                className="bg-blue-600 text-white px-8 py-3 rounded text-center font-medium hover:bg-blue-700 transition"
              >
                Book Consultation
              </a>
              <a 
                href="#results" 
                className="border border-gray-300 text-gray-700 px-8 py-3 rounded text-center font-medium hover:bg-gray-50 transition"
              >
                View Results
              </a>
            </div>
          </div>
          
          <div className="relative">
            <img 
              src="/images/home1.jpg" 
              alt="CO2 Laser Treatment" 
              className="rounded-lg shadow-lg w-full"
            />
          </div>
        </div>
      </div>
    </section>
  )
}