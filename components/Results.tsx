export default function Results() {
  return (
    <section id="results" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Real Results
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            See the dramatic transformations achieved with our CO2 laser treatments
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <img 
              src="/images/beforeafter1.jpg" 
              alt="Before and After Result 1" 
              className="w-full h-64 object-cover"
            />
            <div className="p-6">
              <h3 className="font-semibold text-lg mb-2">Wrinkle Reduction</h3>
              <p className="text-gray-600">Significant improvement in fine lines and deep wrinkles after one treatment</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <img 
              src="/images/beforeafter2.jpg" 
              alt="Before and After Result 2" 
              className="w-full h-64 object-cover"
            />
            <div className="p-6">
              <h3 className="font-semibold text-lg mb-2">Acne Scar Treatment</h3>
              <p className="text-gray-600">Dramatic reduction in acne scarring and improved skin texture</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <img 
              src="/images/beforeafter3.jpg" 
              alt="Before and After Result 3" 
              className="w-full h-64 object-cover"
            />
            <div className="p-6">
              <h3 className="font-semibold text-lg mb-2">Skin Resurfacing</h3>
              <p className="text-gray-600">Complete skin rejuvenation with improved tone and texture</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <img 
              src="/images/beforeafter4.jpg" 
              alt="Before and After Result 4" 
              className="w-full h-64 object-cover"
            />
            <div className="p-6">
              <h3 className="font-semibold text-lg mb-2">Age Spot Removal</h3>
              <p className="text-gray-600">Effective treatment of sun damage and age spots</p>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <img 
            src="/images/home2.jpg" 
            alt="CO2 Laser Treatment Process" 
            className="w-full rounded-lg shadow-lg"
          />
        </div>

        <div className="text-center mt-12">
          <a href="#contact" className="bg-blue-600 text-white px-8 py-3 rounded font-medium hover:bg-blue-700 transition">
            Schedule Your Consultation
          </a>
        </div>
      </div>
    </section>
  )
}