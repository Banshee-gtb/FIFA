import { Link } from 'react-router-dom';

export default function Accessibility() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-black text-white py-14 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-blue-400 text-xs font-semibold uppercase tracking-widest mb-2">Support</p>
          <h1 className="text-4xl font-black">Accessibility</h1>
          <p className="text-gray-400 text-sm mt-1">FIFA World Cup 2026™ Accessibility Statement</p>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 space-y-6 text-sm text-gray-600 leading-relaxed">
          <p>FIFA is committed to ensuring digital accessibility for people with disabilities. We continually improve the user experience for everyone, and apply the relevant accessibility standards.</p>
          {[
            { title: 'Conformance Status', body: 'This platform aims to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA. These guidelines explain how to make web content more accessible to people with disabilities.' },
            { title: 'Wheelchair & Mobility Access', body: 'All 16 host venues have dedicated wheelchair seating areas, accessible entrances, restrooms, and concessions. When purchasing tickets, accessible seating options are clearly marked.' },
            { title: 'Visual Impairment', body: 'Commentary services and audio description options are available at all venues. Our website supports screen readers and high-contrast display modes.' },
            { title: 'Hearing Impairment', body: 'All 16 venues provide hearing loop systems. Sign language interpretation services are available on request for official FIFA events.' },
            { title: 'Requesting Accessibility Services', body: 'When purchasing tickets, you can indicate your accessibility requirements. Our team will follow up to ensure appropriate arrangements are made for your match day experience.' },
            { title: 'Contact Us', body: 'If you experience any accessibility barriers on this website or at our venues, please contact accessibility@fifa2026.com and we will do our best to resolve the issue.' },
          ].map(s => (
            <div key={s.title}>
              <h3 className="font-black text-gray-900 text-base mb-2">{s.title}</h3>
              <p>{s.body}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link to="/contact" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-full text-sm transition-colors">
            Contact Accessibility Team
          </Link>
        </div>
      </div>
    </div>
  );
}
