import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, Globe, User, Menu, X, ChevronDown, Check } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useCurrency, CURRENCIES, type CurrencyCode } from '@/contexts/CurrencyContext';

const navLinks = [
  { label: 'SCORES & FIXTURES', href: '/matches' },
  { label: 'STANDINGS', href: '/standings' },
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
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [query, setQuery] = useState('');
  const { totalItems } = useCart();
  const { currency, setCurrency } = useCurrency();
  const navigate = useNavigate();

  return (
    <>
      {/* Top utility bar */}
      <div className="bg-black text-white text-xs py-1.5 px-4 flex justify-end gap-6 items-center">
        <Link to="/tickets" className="hover:text-blue-400 transition-colors uppercase tracking-wide font-medium">Tickets &amp; Hospitality</Link>
        <Link to="/store" className="hover:text-blue-400 transition-colors uppercase tracking-wide font-medium">FIFA Store</Link>
        <Link to="/fan-id" className="hover:text-blue-400 transition-colors uppercase tracking-wide font-medium">Fan ID</Link>
        <span className="text-gray-400 uppercase tracking-wide">FIFA+</span>
        <Link to="/about" className="hover:text-blue-400 transition-colors uppercase tracking-wide font-medium">Inside FIFA</Link>
      </div>

      {/* Main nav */}
      <header className="bg-black text-white sticky top-0 z-50 shadow-lg border-b border-gray-800">
        <div className="flex items-center h-16 px-4 gap-4">
          {/* Hamburger */}
          <button className="p-2 rounded hover:bg-gray-800 transition-colors" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
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
              <Link key={link.label} to={link.href}
                className="text-[11px] font-semibold tracking-wider text-gray-300 hover:text-white whitespace-nowrap px-3 py-5 border-b-2 border-transparent hover:border-blue-400 transition-all">
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right icons */}
          <div className="ml-auto flex items-center gap-1">
            <button className="p-2 rounded hover:bg-gray-800 transition-colors" onClick={() => setSearchOpen(!searchOpen)} aria-label="Search">
              <Search size={18} />
            </button>

            {/* Currency selector */}
            <div className="relative">
              <button
                className="p-2 rounded hover:bg-gray-800 transition-colors flex items-center gap-1 text-xs font-bold"
                onClick={() => setCurrencyOpen(!currencyOpen)}
                aria-label="Currency"
              >
                <Globe size={16} />
                <span className="hidden sm:block">{currency.code}</span>
                <ChevronDown size={11} />
              </button>
              {currencyOpen && (
                <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 min-w-[180px]">
                  {CURRENCIES.map(c => (
                    <button
                      key={c.code}
                      onClick={() => { setCurrency(c.code as CurrencyCode); setCurrencyOpen(false); }}
                      className="w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors text-gray-700"
                    >
                      <span className="font-medium">{c.symbol} {c.code}</span>
                      <span className="text-xs text-gray-400">{c.name}</span>
                      {currency.code === c.code && <Check size={13} className="text-blue-600 ml-2" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button className="p-2 rounded hover:bg-gray-800 transition-colors" aria-label="Account">
              <User size={18} />
            </button>

            <button className="p-2 rounded hover:bg-gray-800 transition-colors relative" onClick={() => navigate('/cart')} aria-label="Cart">
              <ShoppingCart size={18} />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-blue-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Click-outside close for currency */}
        {currencyOpen && <div className="fixed inset-0 z-40" onClick={() => setCurrencyOpen(false)} />}

        {/* Search bar */}
        {searchOpen && (
          <div className="bg-gray-900 px-4 py-3 border-t border-gray-700">
            <div className="max-w-2xl mx-auto flex gap-2">
              <input autoFocus value={query} onChange={e => setQuery(e.target.value)}
                placeholder="Search matches, teams, venues..."
                className="flex-1 bg-gray-800 text-white px-4 py-2 rounded text-sm outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                onKeyDown={e => { if (e.key === 'Enter') { navigate(`/matches`); setSearchOpen(false); } }}
              />
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
                onClick={() => { navigate('/matches'); setSearchOpen(false); }}>
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
                <Link key={link.label} to={link.href} onClick={() => setMobileOpen(false)}
                  className="text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-900 px-6 py-3 border-b border-gray-800 transition-colors">
                  {link.label}
                </Link>
              ))}
              <Link to="/fan-id" onClick={() => setMobileOpen(false)}
                className="text-sm font-medium text-blue-400 hover:text-blue-300 hover:bg-gray-900 px-6 py-3 border-b border-gray-800 transition-colors">
                FAN ID
              </Link>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
