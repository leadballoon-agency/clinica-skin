export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <img
              src="/images/clinica-logo-two-fonts-2-e1747394036335.webp"
              alt="Clinica Skin Cambridge"
              className="h-10 mb-4 brightness-0 invert"
            />
            <p className="text-gray-400">
              Doctor-led CO₂ laser treatments in Cambridge
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="tel:+441223555123" className="hover:text-white">
                  01223 555 123
                </a>
              </li>
              <li>3-4 Sussex Street</li>
              <li>Cambridge CB1 1PA</li>
              <li>United Kingdom</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#about" className="hover:text-white">About</a></li>
              <li><a href="#treatments" className="hover:text-white">Treatments</a></li>
              <li><a href="#results" className="hover:text-white">Results</a></li>
              <li><a href="#contact" className="hover:text-white">Contact</a></li>
              <li><a href="/privacy" className="hover:text-white">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p className="mb-2">&copy; 2025 Clinica Skin Cambridge. All rights reserved.</p>
          <p className="text-xs text-gray-500">
            CQC Registered. This site may use tracking technologies to improve user experience.
          </p>
        </div>
      </div>
    </footer>
  )
}