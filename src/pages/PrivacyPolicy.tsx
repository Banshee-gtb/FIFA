export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-black text-white py-14 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-blue-400 text-xs font-semibold uppercase tracking-widest mb-2">Legal</p>
          <h1 className="text-4xl font-black">Privacy Policy</h1>
          <p className="text-gray-400 text-sm mt-1">Last updated: April 2026</p>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-12 prose prose-gray max-w-none">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 space-y-6 text-sm text-gray-600 leading-relaxed">
          {[
            { title: '1. Data Controller', body: 'FIFA (Fédération Internationale de Football Association), FIFA-Strasse 20, 8044 Zurich, Switzerland, is the controller of your personal data collected through this platform.' },
            { title: '2. Data We Collect', body: 'We collect personal information including name, email address, date of birth, passport details, phone number, and payment information. We also collect technical data such as IP address, browser type, and usage analytics.' },
            { title: '3. How We Use Your Data', body: 'Your data is used to process ticket purchases, issue Fan IDs, verify stadium access, send booking confirmations, provide customer support, and comply with legal obligations.' },
            { title: '4. Data Sharing', body: 'We share data with authorized service providers, host country authorities for stadium access, and payment processors. We do not sell your personal data to third parties.' },
            { title: '5. Data Retention', body: 'We retain personal data for as long as necessary to fulfill the purposes described in this policy, typically no longer than 5 years after the tournament ends.' },
            { title: '6. Your Rights', body: 'You have the right to access, correct, delete, or restrict processing of your personal data. You may also object to processing or request data portability. Contact our Data Protection Officer at privacy@fifa.com.' },
            { title: '7. Cookies', body: 'We use essential, analytics, and preference cookies. You can manage cookie preferences through your browser settings or our cookie consent tool.' },
            { title: '8. Security', body: 'We implement industry-standard security measures including TLS encryption, secure servers, and regular security audits to protect your personal data.' },
            { title: '9. Contact', body: 'For privacy-related inquiries, contact our Data Protection Officer at privacy@fifa.com or write to FIFA, FIFA-Strasse 20, 8044 Zurich, Switzerland.' },
          ].map(section => (
            <div key={section.title}>
              <h3 className="font-black text-gray-900 text-base mb-2">{section.title}</h3>
              <p>{section.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
