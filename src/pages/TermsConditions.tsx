export default function TermsConditions() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-black text-white py-14 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-blue-400 text-xs font-semibold uppercase tracking-widest mb-2">Legal</p>
          <h1 className="text-4xl font-black">Terms &amp; Conditions</h1>
          <p className="text-gray-400 text-sm mt-1">Last updated: April 2026</p>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 space-y-6 text-sm text-gray-600 leading-relaxed">
          {[
            { title: '1. Agreement to Terms', body: 'By accessing and using this website, you accept and agree to be bound by these Terms and Conditions and our Privacy Policy. If you do not agree, please discontinue use of this site.' },
            { title: '2. Ticket Purchase', body: 'All ticket sales are final. Tickets are non-transferable except through the official FIFA Ticket Marketplace. Each ticket is linked to a Fan ID and valid only for the named holder.' },
            { title: '3. Fan ID Requirement', body: 'All match attendees must possess a valid FIFA Fan ID. Tickets without a linked Fan ID will be invalidated. FIFA reserves the right to cancel tickets where Fan ID requirements are not met.' },
            { title: '4. Pricing', body: 'All prices are listed in USD unless otherwise noted. Currency conversion is approximate. FIFA reserves the right to update prices. Tax may apply depending on jurisdiction.' },
            { title: '5. Cancellation Policy', body: 'Tickets are non-refundable. In the event of match cancellation or postponement, FIFA will issue replacement tickets or vouchers. Cash refunds are not guaranteed.' },
            { title: '6. Prohibited Conduct', body: 'Unauthorized ticket resale, fraudulent Fan ID registration, or use of tickets by non-registered holders are prohibited and may result in permanent bans and legal action.' },
            { title: '7. Stadium Rules', body: 'All attendees must comply with venue rules, FIFA Code of Conduct, and host country laws. FIFA reserves the right to refuse admission or remove any person in violation.' },
            { title: '8. Intellectual Property', body: 'All content on this platform including FIFA World Cup 2026™ branding, logos, and imagery are the intellectual property of FIFA and protected by copyright law.' },
            { title: '9. Limitation of Liability', body: 'FIFA shall not be liable for any indirect, incidental, or consequential damages arising from your use of this platform or attendance at FIFA World Cup 2026™ events.' },
            { title: '10. Governing Law', body: 'These terms are governed by Swiss law. Any disputes shall be subject to the exclusive jurisdiction of the courts of Zurich, Switzerland.' },
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
