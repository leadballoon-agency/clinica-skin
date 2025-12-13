export default function CTA() {
  return (
    <section id="contact" className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700"></div>
      
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary-300/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto section-padding text-center text-white">
        <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur rounded-full mb-6">
          <span className="w-2 h-2 bg-white rounded-full animate-pulse mr-2"></span>
          <span className="font-medium text-sm">Limited Availability</span>
        </div>

        <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
          Ready to Transform
          <span className="block mt-2">Your Skin?</span>
        </h2>

        <p className="text-xl mb-12 max-w-2xl mx-auto text-white/90">
          Join hundreds of satisfied patients who have experienced the remarkable results of CO2 laser treatment
        </p>

        <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-3xl mx-auto">
          <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
            <div className="text-3xl mb-3">📞</div>
            <h3 className="font-semibold text-lg mb-2">Call Us</h3>
            <a href="tel:+447846888649" className="text-white/90 hover:text-white">
              +44 7846 888649
            </a>
          </div>
          
          <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
            <div className="text-3xl mb-3">📧</div>
            <h3 className="font-semibold text-lg mb-2">Email</h3>
            <p className="text-white/90 text-sm">
              Consultations Available
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
            <div className="text-3xl mb-3">📍</div>
            <h3 className="font-semibold text-lg mb-2">Visit</h3>
            <p className="text-white/90 text-sm">
              115 Lower Richmond Rd.<br />Putney, London SW15 1EX<br />United Kingdom
            </p>
          </div>
        </div>

        <div id="consultation" className="bg-white rounded-3xl p-8 md:p-12 max-w-2xl mx-auto text-neutral-800">
          <h3 className="font-display text-2xl font-bold mb-6">Book Your Free Consultation</h3>
          
          <form className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full px-4 py-3 rounded-lg border border-neutral-200 focus:border-primary-500 focus:outline-none"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                className="w-full px-4 py-3 rounded-lg border border-neutral-200 focus:border-primary-500 focus:outline-none"
              />
            </div>
            
            <input
              type="email"
              placeholder="Email Address"
              className="w-full px-4 py-3 rounded-lg border border-neutral-200 focus:border-primary-500 focus:outline-none"
            />
            
            <select className="w-full px-4 py-3 rounded-lg border border-neutral-200 focus:border-primary-500 focus:outline-none text-neutral-600">
              <option>Select Treatment Interest</option>
              <option>Deep Resurfacing</option>
              <option>Fractional CO2</option>
              <option>Full Face Rejuvenation</option>
              <option>Not Sure - Need Consultation</option>
            </select>
            
            <textarea
              placeholder="Tell us about your skin concerns..."
              rows={4}
              className="w-full px-4 py-3 rounded-lg border border-neutral-200 focus:border-primary-500 focus:outline-none"
            ></textarea>
            
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-4 rounded-lg font-semibold text-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
            >
              Request Consultation
            </button>
          </form>
          
          <p className="text-sm text-neutral-500 mt-6 text-center">
            By submitting, you agree to our privacy policy and consent to receive communications
          </p>
        </div>

        <div className="mt-12 flex items-center justify-center space-x-8">
          <div className="text-center">
            <div className="flex justify-center mb-2">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-yellow-400 text-xl">★</span>
              ))}
            </div>
            <p className="text-sm text-white/80">5.0 on Google</p>
          </div>
          
          <div className="w-px h-12 bg-white/30"></div>
          
          <div className="text-center">
            <p className="text-2xl font-bold mb-1">500+</p>
            <p className="text-sm text-white/80">Happy Patients</p>
          </div>
          
          <div className="w-px h-12 bg-white/30"></div>
          
          <div className="text-center">
            <p className="text-2xl font-bold mb-1">10+</p>
            <p className="text-sm text-white/80">Years Experience</p>
          </div>
        </div>
      </div>
    </section>
  )
}