import Link from 'next/link'

export const metadata = {
  title: 'Privacy Policy | CO2 Laser Cambridge - Clinica Skin',
  description: 'Privacy Policy for CO2 Laser Cambridge by Clinica Skin. Learn how we collect, use, and protect your personal information.',
}

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary-500 to-primary-600 text-white py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center text-white/80 hover:text-white mb-4 transition-colors">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold">Privacy Policy</h1>
          <p className="mt-2 text-white/80">Last updated: December 2024</p>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">Introduction</h2>
            <p className="text-neutral-600 leading-relaxed">
              Clinica Skin Cambridge (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website co2cambridge.com and use our services.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">Information We Collect</h2>

            <h3 className="text-xl font-semibold text-neutral-800 mb-3">Personal Information</h3>
            <p className="text-neutral-600 leading-relaxed mb-4">
              We may collect personal information that you voluntarily provide to us when you:
            </p>
            <ul className="list-disc pl-6 text-neutral-600 space-y-2 mb-6">
              <li>Book a consultation or treatment</li>
              <li>Complete our skin assessment questionnaire</li>
              <li>Contact us via phone, email, or WhatsApp</li>
              <li>Subscribe to our communications</li>
            </ul>
            <p className="text-neutral-600 leading-relaxed mb-4">
              This information may include:
            </p>
            <ul className="list-disc pl-6 text-neutral-600 space-y-2">
              <li>Name and contact details (email, phone number)</li>
              <li>Medical history relevant to treatments</li>
              <li>Photographs (before and after treatment images)</li>
              <li>Payment information</li>
            </ul>

            <h3 className="text-xl font-semibold text-neutral-800 mb-3 mt-6">Automatically Collected Information</h3>
            <p className="text-neutral-600 leading-relaxed">
              When you visit our website, we automatically collect certain information including:
            </p>
            <ul className="list-disc pl-6 text-neutral-600 space-y-2 mt-4">
              <li>Device and browser information</li>
              <li>IP address and location data</li>
              <li>Pages visited and time spent on site</li>
              <li>Referring website information</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">How We Use Your Information</h2>
            <p className="text-neutral-600 leading-relaxed mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 text-neutral-600 space-y-2">
              <li>Provide and manage your treatments and appointments</li>
              <li>Communicate with you about your bookings and care</li>
              <li>Send appointment reminders and follow-up information</li>
              <li>Process payments and maintain records</li>
              <li>Improve our website and services</li>
              <li>Send marketing communications (with your consent)</li>
              <li>Comply with legal and regulatory requirements</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">Cookies and Tracking Technologies</h2>
            <p className="text-neutral-600 leading-relaxed mb-4">
              Our website uses cookies and similar tracking technologies to enhance your experience. These include:
            </p>

            <h3 className="text-xl font-semibold text-neutral-800 mb-3">Essential Cookies</h3>
            <p className="text-neutral-600 leading-relaxed mb-4">
              Required for the website to function properly and cannot be disabled.
            </p>

            <h3 className="text-xl font-semibold text-neutral-800 mb-3">Analytics Cookies</h3>
            <p className="text-neutral-600 leading-relaxed mb-4">
              Help us understand how visitors interact with our website to improve user experience.
            </p>

            <h3 className="text-xl font-semibold text-neutral-800 mb-3">Marketing Cookies</h3>
            <p className="text-neutral-600 leading-relaxed">
              We use Meta (Facebook) Pixel to measure advertising effectiveness and deliver relevant ads. You can opt out of interest-based advertising through your browser settings or the Digital Advertising Alliance opt-out page.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">Third-Party Services</h2>
            <p className="text-neutral-600 leading-relaxed mb-4">
              We use the following third-party services that may collect information:
            </p>
            <ul className="list-disc pl-6 text-neutral-600 space-y-2">
              <li><strong>GoHighLevel:</strong> For appointment booking and customer management</li>
              <li><strong>Meta (Facebook) Pixel:</strong> For advertising and analytics</li>
              <li><strong>WhatsApp:</strong> For customer communication</li>
              <li><strong>Vercel:</strong> For website hosting</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">Data Sharing and Disclosure</h2>
            <p className="text-neutral-600 leading-relaxed mb-4">
              We do not sell your personal information. We may share your information with:
            </p>
            <ul className="list-disc pl-6 text-neutral-600 space-y-2">
              <li>Service providers who assist in our operations</li>
              <li>Professional advisors (lawyers, accountants)</li>
              <li>Regulatory authorities when required by law</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">Your Rights (GDPR)</h2>
            <p className="text-neutral-600 leading-relaxed mb-4">
              Under the UK GDPR, you have the right to:
            </p>
            <ul className="list-disc pl-6 text-neutral-600 space-y-2">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Rectification:</strong> Request correction of inaccurate data</li>
              <li><strong>Erasure:</strong> Request deletion of your data (&quot;right to be forgotten&quot;)</li>
              <li><strong>Restrict Processing:</strong> Request limitation of how we use your data</li>
              <li><strong>Data Portability:</strong> Receive your data in a portable format</li>
              <li><strong>Object:</strong> Object to processing of your data</li>
              <li><strong>Withdraw Consent:</strong> Withdraw consent at any time</li>
            </ul>
            <p className="text-neutral-600 leading-relaxed mt-4">
              To exercise these rights, please contact us using the details below.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">Data Security</h2>
            <p className="text-neutral-600 leading-relaxed">
              We implement appropriate technical and organisational measures to protect your personal information against unauthorised access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">Data Retention</h2>
            <p className="text-neutral-600 leading-relaxed">
              We retain your personal information for as long as necessary to fulfil the purposes outlined in this policy, comply with legal obligations, resolve disputes, and enforce our agreements. Medical records are retained in accordance with NHS guidelines.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">Children&apos;s Privacy</h2>
            <p className="text-neutral-600 leading-relaxed">
              Our services are not directed to individuals under 18 years of age. We do not knowingly collect personal information from children without parental consent.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">Changes to This Policy</h2>
            <p className="text-neutral-600 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the &quot;Last updated&quot; date.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">Contact Us</h2>
            <p className="text-neutral-600 leading-relaxed mb-4">
              If you have questions about this Privacy Policy or wish to exercise your rights, please contact us:
            </p>
            <div className="bg-neutral-50 rounded-xl p-6">
              <p className="text-neutral-700 font-semibold">Clinica Skin Cambridge</p>
              <p className="text-neutral-600">3-4 Sussex Street</p>
              <p className="text-neutral-600">Cambridge CB1 1PA</p>
              <p className="text-neutral-600 mt-2">
                Phone: <a href="tel:+441223555123" className="text-primary-600 hover:underline">01223 555 123</a>
              </p>
              <p className="text-neutral-600">
                Email: <a href="mailto:info@clinicaskin.co.uk" className="text-primary-600 hover:underline">info@clinicaskin.co.uk</a>
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">Supervisory Authority</h2>
            <p className="text-neutral-600 leading-relaxed">
              You have the right to lodge a complaint with the Information Commissioner&apos;s Office (ICO) if you believe your data protection rights have been violated. Visit <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">ico.org.uk</a> for more information.
            </p>
          </section>

        </div>

        {/* Back to home button */}
        <div className="mt-12 pt-8 border-t border-neutral-200">
          <Link
            href="/"
            className="inline-flex items-center bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-3 rounded-full font-medium hover:shadow-lg transition-all duration-300"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="bg-neutral-900 text-white py-8 mt-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-neutral-400">&copy; 2025 Clinica Skin Cambridge. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
