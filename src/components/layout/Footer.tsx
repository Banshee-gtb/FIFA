import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const footerLinks = {
  'World Cup 2026': [
    { label: 'About', href: '#' },
    { label: 'Host Countries', href: '/venues' },
    { label: 'Schedule', href: '/matches' },
    { label: 'Teams', href: '/teams' },
    { label: 'Standings', href: '/matches' },
  ],
  'Buy Tickets': [
    { label: 'Match Tickets', href: '/tickets' },
    { label: 'Hospitality Packages', href: '/hospitality' },
    { label: 'VIP Seats', href: '/vip' },
    { label: 'Tour Packages', href: '/tours' },
    { label: 'FIFA Store', href: '/store' },
  ],
  Support: [
    { label: 'FAQ', href: '#' },
    { label: 'Contact Us', href: '#' },
    { label: 'Accessibility', href: '#' },
    { label: 'Fan Guide', href: '#' },
  ],
  Legal: [
    { label: 'Terms & Conditions', href: '#' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Cookie Policy', href: '#' },
    { label: 'Refund Policy', href: '#' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      {/* Host countries banner */}
      <div className="bg-[#0a1f5c] py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6 text-2xl">
            <span>🇺🇸</span><span>🇨🇦</span><span>🇲🇽</span>
          </div>
          <p className="text-white/80 text-sm text-center">
            FIFA World Cup 2026™ — 11 June to 19 July 2026 · USA, Canada &amp; Mexico
          </p>
          <div className="flex gap-4">
            <a href="#" aria-label="Facebook" className="text-white/60 hover:text-white transition-colors"><Facebook size={20} /></a>
            <a href="#" aria-label="Twitter" className="text-white/60 hover:text-white transition-colors"><Twitter size={20} /></a>
            <a href="#" aria-label="Instagram" className="text-white/60 hover:text-white transition-colors"><Instagram size={20} /></a>
            <a href="#" aria-label="YouTube" className="text-white/60 hover:text-white transition-colors"><Youtube size={20} /></a>
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
            <Link to="#" className="hover:text-gray-300 transition-colors">Privacy</Link>
            <Link to="#" className="hover:text-gray-300 transition-colors">Terms</Link>
            <Link to="#" className="hover:text-gray-300 transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
