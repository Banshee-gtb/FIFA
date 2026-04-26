import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Check, ShoppingCart, Star, MapPin, Users, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { VENUES, TICKET_CATEGORIES, MATCHES } from '@/constants/data';
import { useCart } from '@/hooks/useCart';
import { useCurrency } from '@/contexts/CurrencyContext';
import { formatDate } from '@/lib/utils';
import { TeamFlag } from '@/components/ui/Flag';

export default function HospitalityCity() {
  const { id } = useParams<{ id: string }>();
  const venue = VENUES.find(v => v.id === id);
  const { addItem } = useCart();
  const { format } = useCurrency();

  const hospPackages = TICKET_CATEGORIES.filter(t => t.type === 'hospitality' || t.type === 'vip');
  const cityMatches = MATCHES.filter(m =>
    m.city.toLowerCase().includes((venue?.city.split('/')[0] ?? '').toLowerCase())
  );

  if (!venue) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg">City not found.</p>
          <Link to="/hospitality" className="text-blue-600 hover:underline mt-2 block">← Back to Hospitality</Link>
        </div>
      </div>
    );
  }

  function handleAdd(pkg: typeof TICKET_CATEGORIES[0]) {
    addItem({ id: pkg.id + '-' + venue!.id, name: `${pkg.name} — ${venue!.city}`, price: pkg.price, type: 'hospitality' });
    toast.success(`${pkg.name} (${venue!.city}) added to cart!`);
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Split hero — exact Dallas page layout */}
      <div className="flex flex-col lg:flex-row min-h-[75vh]">
        {/* Left text panel */}
        <div className="flex-1 flex flex-col justify-center px-8 md:px-14 py-16 max-w-2xl">
          {/* On Location logo area */}
          <div className="flex items-center gap-3 mb-8">
            <Link to="/hospitality" className="flex items-center gap-2 text-gray-500 text-sm hover:text-gray-800 transition-colors">
              <ArrowLeft size={16} /> Back
            </Link>
            <span className="text-gray-300">|</span>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-gray-600 font-black text-xs">OL</span>
              </div>
              <span className="text-gray-600 text-sm font-semibold">ON LOCATION</span>
            </div>
          </div>

          <p className="text-gray-500 text-xs uppercase tracking-[0.2em] font-semibold mb-2">
            YOUR JOURNEY TO FIFA WORLD CUP 2026™ STARTS HERE
          </p>
          <h1 className="text-7xl md:text-9xl font-black text-gray-900 leading-none mb-6 tracking-tight">
            {venue.city.split('/')[0].toUpperCase()}
          </h1>
          <p className="text-gray-600 leading-relaxed text-sm max-w-lg mb-8">{venue.description}</p>

          <div className="flex flex-wrap gap-4">
            <Link
              to={`/venues/${venue.id}`}
              className="bg-[#0a1f5c] hover:bg-blue-900 text-white font-bold px-7 py-3.5 rounded-full text-sm transition-colors"
            >
              {venue.city.split('/')[0]} Matches
            </Link>
            <a href="#packages" className="text-gray-700 font-semibold text-sm flex items-center gap-1.5 hover:text-blue-600 transition-colors">
              Venue Series →
            </a>
          </div>
        </div>

        {/* Right image */}
        <div className="lg:flex-1 relative min-h-80 lg:min-h-0">
          <img
            src={venue.image}
            alt={venue.city}
            className="w-full h-full object-cover"
            style={{ borderRadius: '0 0 0 80px' }}
          />
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-600 rounded-tl-[60px] opacity-90" />
        </div>
      </div>

      {/* Venue stats bar */}
      <div className="bg-gray-50 border-y border-gray-100 py-5 px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-8 text-center justify-center">
          {[
            { icon: MapPin, label: 'Stadium', value: venue.stadium },
            { icon: Users, label: 'Capacity', value: venue.capacity.toLocaleString() },
            { icon: Calendar, label: 'Matches', value: `${venue.matches} Matches` },
          ].map(stat => (
            <div key={stat.label} className="flex items-center gap-3">
              <stat.icon size={18} className="text-blue-600" />
              <div className="text-left">
                <p className="text-[10px] text-gray-400 uppercase tracking-wide">{stat.label}</p>
                <p className="font-bold text-gray-900 text-sm">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-14">
        {/* Match list for this city */}
        {cityMatches.length > 0 && (
          <section className="mb-14">
            <h2 className="text-2xl font-black text-gray-900 mb-6">Matches in {venue.city}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cityMatches.map(m => (
                <div key={m.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
                  <div className="bg-blue-600 text-white rounded-xl px-3 py-2 text-center flex-shrink-0">
                    <p className="text-[9px] font-bold uppercase">Match</p>
                    <p className="text-xl font-black">#{m.matchNumber}</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-400 mb-1">{m.stage}{m.group ? ` · Group ${m.group}` : ''} · {formatDate(m.date)}</p>
                    <div className="flex items-center gap-2">
                      <TeamFlag teamName={m.team1} size={20} />
                      <span className="font-bold text-gray-900 text-sm">{m.team1}</span>
                      <span className="text-gray-300 mx-1">vs</span>
                      <TeamFlag teamName={m.team2} size={20} />
                      <span className="font-bold text-gray-900 text-sm">{m.team2}</span>
                    </div>
                  </div>
                  <Link to={`/queue`} className="text-blue-600 text-xs font-bold hover:underline whitespace-nowrap">Tickets →</Link>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Hospitality packages for this city */}
        <section id="packages">
          <h2 className="text-2xl font-black text-gray-900 mb-2">Hospitality Packages — {venue.city}</h2>
          <p className="text-gray-500 text-sm mb-8">All packages include match ticket + premium hospitality experience at {venue.stadium}.</p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
            {hospPackages.map((pkg, i) => (
              <div key={pkg.id} className={`bg-white rounded-2xl shadow-lg overflow-hidden border-2 ${i === 1 ? 'border-yellow-400' : 'border-gray-100'}`}>
                {i === 1 && (
                  <div className="bg-yellow-400 text-black text-xs font-black text-center py-2 uppercase tracking-widest flex items-center justify-center gap-2">
                    <Star size={12} /> Most Popular
                  </div>
                )}
                <div className="p-7">
                  <div className="flex justify-between items-start mb-5">
                    <div>
                      <h3 className="text-xl font-black text-gray-900">{pkg.name}</h3>
                      <p className="text-gray-500 text-sm mt-1 max-w-xs">{pkg.description}</p>
                    </div>
                    <div className="text-right bg-blue-50 rounded-xl px-4 py-3 flex-shrink-0 ml-4">
                      <div className="text-2xl font-black text-blue-600">{format(pkg.price)}</div>
                      <div className="text-[10px] text-gray-500">per person / match</div>
                    </div>
                  </div>
                  <ul className="space-y-2.5 mb-6">
                    {pkg.includes.map(inc => (
                      <li key={inc} className="flex items-center gap-3 text-sm text-gray-700">
                        <span className="bg-green-100 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                          <Check size={11} className="text-green-600" />
                        </span>
                        {inc}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => handleAdd(pkg)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-full transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <ShoppingCart size={15} />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ teaser */}
        <div className="mt-14 bg-[#0a1f5c] rounded-2xl p-8 text-white text-center">
          <h3 className="text-xl font-black mb-2">Questions about {venue.city} Hospitality?</h3>
          <p className="text-blue-200 text-sm mb-4">Our team is ready to help you plan the perfect FIFA World Cup 2026™ experience.</p>
          <Link to="/contact" className="bg-white text-blue-900 font-bold px-8 py-3 rounded-full text-sm hover:bg-blue-50 transition-colors inline-block">
            Contact Our Team
          </Link>
        </div>
      </div>
    </div>
  );
}
