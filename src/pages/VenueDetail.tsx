import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Users, Calendar, Ticket } from 'lucide-react';
import { VENUES, MATCHES } from '@/constants/data';
import { formatDate } from '@/lib/utils';

export default function VenueDetail() {
  const { id } = useParams<{ id: string }>();
  const venue = VENUES.find(v => v.id === id);
  const venueMatches = MATCHES.filter(m => m.city.toLowerCase().includes(venue?.city.split('/')[0].toLowerCase() || ''));

  if (!venue) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg">Venue not found.</p>
          <Link to="/venues" className="text-blue-600 hover:underline mt-2 block">← Back to Venues</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Split hero like real FIFA hospitality site */}
      <div className="flex flex-col lg:flex-row min-h-[70vh]">
        {/* Left content */}
        <div className="flex-1 flex flex-col justify-center px-8 md:px-16 py-16 max-w-2xl">
          <Link to="/venues" className="flex items-center gap-2 text-blue-600 text-sm font-medium mb-8 hover:underline w-fit">
            <ArrowLeft size={16} /> Back to Venues
          </Link>
          <p className="text-gray-500 text-sm uppercase tracking-widest mb-2">YOUR JOURNEY TO FIFA WORLD CUP 2026™ STARTS HERE</p>
          <h1 className="text-6xl md:text-8xl font-black text-gray-900 leading-none mb-6">{venue.city.split('/')[0].toUpperCase()}</h1>
          <p className="text-gray-600 leading-relaxed mb-8 text-sm max-w-lg">{venue.description}</p>
          <div className="flex flex-wrap gap-3">
            <Link to="/tickets" className="bg-[#0a1f5c] hover:bg-blue-900 text-white font-bold px-7 py-3 rounded-full text-sm transition-colors">
              {venue.city.split('/')[0]} Matches
            </Link>
            <Link to="/hospitality" className="text-gray-700 font-semibold text-sm flex items-center gap-2 hover:text-blue-600 transition-colors">
              Venue Series →
            </Link>
          </div>
        </div>

        {/* Right image */}
        <div className="lg:flex-1 relative min-h-64 lg:min-h-0">
          <img src={venue.image} alt={venue.city} className="w-full h-full object-cover" style={{ borderRadius: '0 0 0 60px' }} />
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-blue-600 rounded-tl-full opacity-80" />
        </div>
      </div>

      {/* Venue details */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { icon: MapPin, label: 'Stadium', value: venue.stadium },
            { icon: Users, label: 'Capacity', value: venue.capacity.toLocaleString() },
            { icon: Calendar, label: 'Matches', value: `${venue.matches} Matches` },
            { icon: Ticket, label: 'Country', value: venue.country },
          ].map(stat => (
            <div key={stat.label} className="bg-gray-50 rounded-xl p-5 text-center border border-gray-100">
              <stat.icon size={20} className="text-blue-600 mx-auto mb-2" />
              <p className="text-xs text-gray-400 uppercase tracking-wide">{stat.label}</p>
              <p className="font-bold text-gray-900 text-sm mt-1">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Highlights */}
        <div className="mb-12">
          <h2 className="text-2xl font-black text-gray-900 mb-5">Venue Highlights</h2>
          <div className="flex flex-wrap gap-3">
            {venue.highlights.map(h => (
              <span key={h} className="bg-blue-100 text-blue-700 font-semibold text-sm px-4 py-2 rounded-full">{h}</span>
            ))}
          </div>
        </div>

        {/* Matches at this venue */}
        {venueMatches.length > 0 && (
          <div>
            <h2 className="text-2xl font-black text-gray-900 mb-5">Matches at {venue.city}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {venueMatches.map(m => (
                <div key={m.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
                  <div className="bg-blue-600 text-white rounded-lg px-3 py-2 text-center flex-shrink-0">
                    <p className="text-[10px] font-bold uppercase">Match</p>
                    <p className="text-lg font-black">#{m.matchNumber}</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">{m.stage}{m.group ? ` · Group ${m.group}` : ''} · {formatDate(m.date)}</p>
                    <p className="font-bold text-gray-900 text-sm">{m.team1} {m.team1Flag} vs {m.team2Flag} {m.team2}</p>
                  </div>
                  <Link to="/tickets" className="text-blue-600 text-xs font-bold hover:underline whitespace-nowrap">Tickets →</Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
