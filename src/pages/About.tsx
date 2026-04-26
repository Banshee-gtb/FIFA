import { Link } from 'react-router-dom';
import { Trophy, Globe, Users, Calendar } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-black text-white py-14 px-4">
        <div className="max-w-5xl mx-auto">
          <p className="text-blue-400 text-xs font-semibold uppercase tracking-widest mb-2">FIFA World Cup 2026™</p>
          <h1 className="text-4xl md:text-5xl font-black mb-2">About FIFA World Cup 2026™</h1>
          <p className="text-gray-400 text-sm">11 June – 19 July 2026 · USA, Canada &amp; Mexico</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 mb-14">
          <div>
            <h2 className="text-2xl font-black text-gray-900 mb-4">The Biggest World Cup in History</h2>
            <p className="text-gray-600 leading-relaxed text-sm mb-4">
              FIFA World Cup 2026™ will be the most expansive FIFA World Cup™ ever, featuring 48 teams competing across 16 venues in three nations — the United States of America, Canada, and Mexico. For the first time in the tournament's history, a record 104 matches will be played.
            </p>
            <p className="text-gray-600 leading-relaxed text-sm mb-4">
              From the iconic Estadio Azteca in Mexico City — making history as the first stadium to host matches in three different World Cups — to the MetLife Stadium in New Jersey hosting the Grand Final, every venue promises an unforgettable spectacle.
            </p>
            <p className="text-gray-600 leading-relaxed text-sm">
              The tournament runs from 11 June to 19 July 2026, spanning 39 days of world-class football across North America.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Trophy, value: '48', label: 'Competing Nations', color: 'bg-yellow-50 text-yellow-600' },
              { icon: Calendar, value: '104', label: 'Total Matches', color: 'bg-blue-50 text-blue-600' },
              { icon: Globe, value: '16', label: 'Host Venues', color: 'bg-green-50 text-green-600' },
              { icon: Users, value: '5M+', label: 'Expected Fans', color: 'bg-purple-50 text-purple-600' },
            ].map(item => (
              <div key={item.label} className={`${item.color.split(' ')[0]} rounded-2xl p-6 text-center border border-gray-100`}>
                <item.icon size={24} className={`${item.color.split(' ')[1]} mx-auto mb-2`} />
                <div className="text-3xl font-black text-gray-900">{item.value}</div>
                <div className="text-xs text-gray-500 mt-1">{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 rounded-2xl p-8 mb-12">
          <h2 className="text-xl font-black text-gray-900 mb-4">Three Host Nations</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { flag: 'us', country: 'United States', venues: 11, desc: 'Hosting 11 venues including the Final at MetLife Stadium, New Jersey.' },
              { flag: 'ca', country: 'Canada', venues: 2, desc: 'Hosting 2 venues — Vancouver and Toronto — marking Canada\'s first World Cup.' },
              { flag: 'mx', country: 'Mexico', venues: 3, desc: 'Hosting 3 venues including the iconic Estadio Azteca in Mexico City.' },
            ].map(h => (
              <div key={h.country} className="text-center">
                <img src={`https://flagcdn.com/w80/${h.flag}.png`} alt={h.country} className="w-16 h-10 object-cover rounded mx-auto mb-3 shadow" />
                <h4 className="font-bold text-gray-900 mb-1">{h.country}</h4>
                <p className="text-blue-600 text-xs font-bold mb-2">{h.venues} Venue{h.venues > 1 ? 's' : ''}</p>
                <p className="text-gray-500 text-xs leading-relaxed">{h.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-black text-gray-900 mb-3">Ready to Experience History?</h2>
          <p className="text-gray-500 text-sm mb-6">Secure your place at the greatest sporting event on Earth.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/tickets" className="bg-blue-600 hover:bg-blue-700 text-white font-black px-8 py-3.5 rounded-full text-sm transition-colors uppercase tracking-wide">
              Buy Tickets
            </Link>
            <Link to="/venues" className="border-2 border-gray-200 text-gray-700 hover:border-blue-400 font-bold px-8 py-3.5 rounded-full text-sm transition-colors uppercase tracking-wide">
              View Venues
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
