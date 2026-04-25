import { Link } from 'react-router-dom';
import { MapPin, Users, Calendar } from 'lucide-react';
import { VENUES } from '@/constants/data';

const countries = ['All', 'USA', 'Canada', 'Mexico'];

import { useState } from 'react';

export default function Venues() {
  const [activeCountry, setActiveCountry] = useState('All');
  const filtered = activeCountry === 'All' ? VENUES : VENUES.filter(v => v.country === activeCountry);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-black text-white py-14 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 to-transparent" />
        <div className="relative max-w-7xl mx-auto">
          <p className="text-blue-400 text-xs font-semibold uppercase tracking-widest mb-2">FIFA World Cup 2026™</p>
          <h1 className="text-4xl md:text-5xl font-black mb-2">Host Countries &amp; Cities</h1>
          <p className="text-gray-300 max-w-xl text-sm">Sixteen iconic venues across three nations — the largest FIFA World Cup ever staged.</p>
          <div className="flex gap-8 mt-6 text-sm text-gray-300">
            <div><span className="text-white font-black text-2xl">11</span> 🇺🇸 USA</div>
            <div><span className="text-white font-black text-2xl">2</span> 🇨🇦 Canada</div>
            <div><span className="text-white font-black text-2xl">3</span> 🇲🇽 Mexico</div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Country filter */}
        <div className="flex gap-3 mb-8 flex-wrap">
          {countries.map(c => (
            <button
              key={c}
              onClick={() => setActiveCountry(c)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${activeCountry === c ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-400'}`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map(venue => (
            <Link key={venue.id} to={`/venues/${venue.id}`} className="group bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 card-hover block">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={venue.image}
                  alt={venue.city}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide">
                  {venue.country}
                </div>
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-white font-black text-xl leading-tight">{venue.city.toUpperCase()}</p>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm font-bold text-gray-800 mb-3">{venue.stadium}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><Users size={11} /> {venue.capacity.toLocaleString()}</span>
                  <span className="flex items-center gap-1"><Calendar size={11} /> {venue.matches} matches</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-1">
                  {venue.highlights.slice(0, 2).map(h => (
                    <span key={h} className="bg-blue-50 text-blue-600 text-[10px] font-medium px-2 py-0.5 rounded-full">{h}</span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
