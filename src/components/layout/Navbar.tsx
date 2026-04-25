import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, Globe, User, Menu, X, ChevronDown } from 'lucide-react';
import { useCart } from '@/hooks/useCart';

const navLinks = [
  { label: 'SCORES & FIXTURES', href: '/matches' },
  { label: 'TEAMS', href: '/teams' },
  { label: 'HOST COUNTRIES & CITIES', href: '/venues' },
  { label: 'TICKETS', href: '/tickets' },
  { label: 'HOSPITALITY', href: '/hospitality' },
  { label: 'VIP SEATS', href: '/vip' },
  { label: 'TOURS', href: '/tours' },
  { label: 'FIFA STORE', href: '/store' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const { totalItems } = useCart();
  const navigate = useNavigate();

  return (
    <>
      {/* Top utility bar */}
      <div className="bg-black text-white text-xs py-1.5 px-4 flex justify-end gap-6 items-center">
        <Link to="/tickets" className="hover:text-blue-400 transition-colors uppercase tracking-wide font-medium">Tickets &amp; Hospitality</Link>
        <Link to="/store" className="hover:text-blue-400 transition-colors uppercase tracking-wide font-medium">FIFA Store</Link>
        <span className="text-gray-400 uppercase tracking-wide">FIFA+</span>
        <span className="text-gray-400 uppercase tracking-wide">Inside FIFA</span>
      </div>

      {/* Main nav */}
      <header className="bg-black text-white sticky top-0 z-50 shadow-lg border-b border-gray-800">
        <div className="flex items-center h-16 px-4 gap-4">
          {/* Hamburger */}
          <button
            className="p-2 rounded hover:bg-gray-800 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="bg-white rounded-full w-12 h-12 flex items-center justify-center">
              <span className="text-black font-black text-lg leading-none">26</span>
            </div>
            <span className="text-white font-black text-lg tracking-wider hidden sm:block">FIFA</span>
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden xl:flex items-center gap-0 ml-4 overflow-x-auto flex-1">
            {navLinks.map(link => (
              <Link
                key={link.label}
                to={link.href}
                className="text-[11px] font-semibold tracking-wider text-gray-300 hover:text-white whitespace-nowrap px-3 py-5 border-b-2 border-transparent hover:border-blue-400 transition-all"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right icons */}
          <div className="ml-auto flex items-center gap-2">
            <button
              className="p-2 rounded hover:bg-gray-800 transition-colors"
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Search"
            >
              <Search size={18} />
            </button>
            <button className="p-2 rounded hover:bg-gray-800 transition-colors flex items-center gap-1" aria-label="Language">
              <Globe size={18} />
              <ChevronDown size={12} />
            </button>
            <button className="p-2 rounded hover:bg-gray-800 transition-colors" aria-label="Account">
              <User size={18} />
            </button>
            <button
              className="p-2 rounded hover:bg-gray-800 transition-colors relative"
              onClick={() => navigate('/cart')}
              aria-label="Cart"
            >
              <ShoppingCart size={18} />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-blue-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="bg-gray-900 px-4 py-3 border-t border-gray-700">
            <div className="max-w-2xl mx-auto flex gap-2">
              <input
                autoFocus
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search matches, teams, venues..."
                className="flex-1 bg-gray-800 text-white px-4 py-2 rounded text-sm outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              />
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
                onClick={() => setSearchOpen(false)}
              >
                Search
              </button>
            </div>
          </div>
        )}

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="xl:hidden bg-black border-t border-gray-800">
            <nav className="flex flex-col">
              {navLinks.map(link => (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-900 px-6 py-3 border-b border-gray-800 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
