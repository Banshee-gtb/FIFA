import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const footerLinks = {
  'World Cup 2026': [
    { label: 'About', href: '/about' },
    { label: 'Host Countries', href: '/venues' },
    { label: 'Schedule', href: '/matches' },
    { label: 'Teams', href: '/teams' },
    { label: 'Standings', href: '/matches' },
    { label: 'Fan Guide', href: '/fan-guide' },
  ],
  'Buy Tickets': [
    { label: 'Match Tickets', href: '/tickets' },
    { label: 'Hospitality Packages', href: '/hospitality' },
    { label: 'VIP Seats', href: '/vip' },
    { label: 'Tour Packages', href: '/tours' },
    { label: 'FIFA Store', href: '/store' },
    { label: 'Ticket Queue', href: '/queue' },
  ],
  'Fan Services': [
    { label: 'Fan ID', href: '/fan-id' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'Accessibility', href: '/accessibility' },
    { label: 'Fan Guide', href: '/fan-guide' },
  ],
  Legal: [
    { label: 'Terms & Conditions', href: '/terms' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Cookie Policy', href: '/privacy' },
    { label: 'Refund Policy', href: '/refund-policy' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      {/* Host countries banner */}
      <div className="bg-[#0a1f5c] py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img src="https://flagcdn.com/w40/us.png" alt="USA" className="h-5 rounded shadow" />
            <img src="https://flagcdn.com/w40/ca.png" alt="Canada" className="h-5 rounded shadow" />
            <img src="https://flagcdn.com/w40/mx.png" alt="Mexico" className="h-5 rounded shadow" />
          </div>
          <p className="text-white/80 text-sm text-center">
            FIFA World Cup 2026™ — 11 June to 19 July 2026 · USA, Canada &amp; Mexico
          </p>
          <div className="flex gap-4">
            <a href="https://facebook.com/fifaworldcup" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-white/60 hover:text-white transition-colors"><Facebook size={20} /></a>
            <a href="https://twitter.com/fifaworldcup" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-white/60 hover:text-white transition-colors"><Twitter size={20} /></a>
            <a href="https://instagram.com/fifaworldcup" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-white/60 hover:text-white transition-colors"><Instagram size={20} /></a>
            <a href="https://youtube.com/fifa" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-white/60 hover:text-white transition-colors"><Youtube size={20} /></a>
          </div>
        </div>
      </div>

      {/* Links grid */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        {Object.entries(footerLinks).map(([section, links]) => (
          <div key={section}>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">{section}</h4>
            <ul className="space-y-2">
              {links.map(link => (
                <li key={link.label}>
                  <Link to={link.href} className="text-gray-400 hover:text-white text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800 px-4 py-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© 2026 FIFA. All Rights Reserved. FIFA World Cup 2026™ is a registered trademark of FIFA.</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-gray-300 transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-gray-300 transition-colors">Terms</Link>
            <Link to="/privacy" className="hover:text-gray-300 transition-colors">Cookies</Link>
            <Link to="/refund-policy" className="hover:text-gray-300 transition-colors">Refunds</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
