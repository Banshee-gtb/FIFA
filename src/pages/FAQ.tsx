import { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const faqs = [
  {
    category: 'Tickets',
    items: [
      { q: 'How do I buy FIFA World Cup 2026™ tickets?', a: 'You can purchase tickets directly through our platform. Choose your match, select your category (Standard, Hospitality, VIP), add to cart and complete the checkout. All tickets are digital and linked to your Fan ID.' },
      { q: 'Do I need a Fan ID to attend matches?', a: 'Yes. All spectators must have a valid FIFA Fan ID to enter match venues. You can register for your Fan ID on our Fan ID page — it\'s free and takes just a few minutes.' },
      { q: 'Can I transfer or resell my tickets?', a: 'Tickets can be transferred or resold through the official FIFA Ticket Marketplace only. Unauthorized resale is prohibited and may result in ticket invalidation.' },
      { q: 'What ticket categories are available?', a: 'We offer Category 1, 2, and 3 standard tickets. Category 1 provides the best midfield views, Category 2 great corner/side views, and Category 3 affordable behind-goal seating. We also offer Hospitality and VIP packages.' },
      { q: 'Are there ticket refunds?', a: 'Tickets are non-refundable except in the case of match cancellation or postponement. In such cases, FIFA will provide full refunds or ticket exchanges.' },
    ],
  },
  {
    category: 'Hospitality',
    items: [
      { q: 'What is included in a Hospitality package?', a: 'Hospitality packages include a Category 1 match ticket, access to exclusive lounges, gourmet catering (pre-match and half-time), premium bar service, official FIFA gifts, and dedicated concierge service.' },
      { q: 'Can I choose which match my Hospitality package covers?', a: 'Yes. When purchasing a Hospitality package, you can select the specific match or matches you wish to attend. Package prices may vary depending on the match stage.' },
      { q: 'Are Hospitality packages available for all venues?', a: 'Yes. Hospitality packages are available for all 16 host city venues. Visit our Hospitality City pages for city-specific packages and availability.' },
    ],
  },
  {
    category: 'Fan ID',
    items: [
      { q: 'What is a FIFA Fan ID?', a: 'The FIFA Fan ID is a mandatory personal entry document for all FIFA World Cup 2026™ spectators. It is linked to your identity documents and purchased tickets, enabling stadium access.' },
      { q: 'Is Fan ID registration free?', a: 'Yes. Fan ID registration is completely free of charge. You only need a valid passport, a recent photo, and an email address.' },
      { q: 'How long does Fan ID processing take?', a: 'Fan ID is typically issued instantly after email verification. You will receive your digital Fan ID card by email within minutes of completing registration.' },
    ],
  },
  {
    category: 'Payments',
    items: [
      { q: 'What payment methods are accepted?', a: 'We accept Visa, Mastercard, American Express, and major debit cards. VISA is the Official Payment Partner of FIFA World Cup 2026™. All transactions are secured with 256-bit SSL encryption.' },
      { q: 'Can I pay in my local currency?', a: 'Yes. Use the currency selector in our navigation bar to switch between USD, EUR, GBP, CAD, MXN, BRL, AUD, and JPY. All prices are converted at current exchange rates.' },
      { q: 'Is my payment information secure?', a: 'Absolutely. All payments are processed through PCI-DSS compliant payment systems. We never store your full card details. All transactions are encrypted end-to-end.' },
    ],
  },
  {
    category: 'Travel & Venues',
    items: [
      { q: 'Do I need a visa to attend matches in the host countries?', a: 'Visa requirements vary by nationality. Citizens of many countries can visit USA, Canada, and Mexico visa-free or with an Electronic Travel Authorization (eTA). Check with the relevant embassy for your specific situation. Fan ID holders may benefit from simplified entry procedures.' },
      { q: 'Can I attend matches in multiple host countries?', a: 'Yes. You can purchase tickets and hospitality packages for matches in any of the 16 venues across USA, Canada, and Mexico.' },
    ],
  },
];

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-black text-white py-14 px-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <HelpCircle size={32} className="text-blue-400" />
          <div>
            <p className="text-blue-400 text-xs font-semibold uppercase tracking-widest mb-1">Support</p>
            <h1 className="text-4xl md:text-5xl font-black">Frequently Asked Questions</h1>
            <p className="text-gray-400 text-sm mt-1">Everything you need to know about FIFA World Cup 2026™</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {faqs.map(section => (
          <div key={section.category} className="mb-10">
            <h2 className="text-lg font-black text-gray-900 mb-4 uppercase tracking-wide border-b border-gray-200 pb-3">{section.category}</h2>
            <div className="space-y-3">
              {section.items.map((item, i) => {
                const key = `${section.category}-${i}`;
                const isOpen = openIdx === key;
                return (
                  <div key={key} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <button
                      onClick={() => setOpenIdx(isOpen ? null : key)}
                      className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-semibold text-gray-900 text-sm pr-4">{item.q}</span>
                      {isOpen ? <ChevronUp size={18} className="text-blue-600 flex-shrink-0" /> : <ChevronDown size={18} className="text-gray-400 flex-shrink-0" />}
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-50">
                        <div className="pt-4">{item.a}</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <div className="bg-[#0a1f5c] rounded-2xl p-8 text-white text-center mt-8">
          <h3 className="text-xl font-black mb-2">Still have questions?</h3>
          <p className="text-blue-200 text-sm mb-5">Our support team is available 24/7 to help with your FIFA World Cup 2026™ experience.</p>
          <Link to="/contact" className="bg-white text-blue-900 font-bold px-8 py-3 rounded-full text-sm hover:bg-blue-50 transition-colors inline-block">
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
