import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Ticket, Calendar, X } from 'lucide-react';
import { MATCHES, VENUES } from '@/constants/data';
import { formatDate } from '@/lib/utils';
import { TeamFlag } from '@/components/ui/Flag';

const stages = ['All', 'Group Stage', 'Quarter-Final', 'Semi-Final', 'Third Place', 'Final'];
const groups = ['All', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'];
const countries = ['All', 'USA', 'Canada', 'Mexico'];

const stageColors: Record<string, string> = {
  'Group Stage': 'bg-blue-100 text-blue-700',
  'Quarter-Final': 'bg-purple-100 text-purple-700',
  'Semi-Final': 'bg-orange-100 text-orange-700',
  'Third Place': 'bg-gray-100 text-gray-700',
  'Final': 'bg-yellow-100 text-yellow-700',
};

const cities = ['All', ...Array.from(new Set(VENUES.map(v => v.city.split('/')[0])))];

export default function Matches() {
  const [activeStage, setActiveStage] = useState('All');
  const [activeGroup, setActiveGroup] = useState('All');
  const [activeCountry, setActiveCountry] = useState('All');
  const [activeCity, setActiveCity] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const filtered = MATCHES.filter(m => {
    const stageOk = activeStage === 'All' || m.stage === activeStage;
    const groupOk = activeGroup === 'All' || m.group === activeGroup;
    const countryOk = activeCountry === 'All' || m.country === activeCountry;
    const cityOk = activeCity === 'All' || m.city.toLowerCase().includes(activeCity.toLowerCase());
    const dateFromOk = !dateFrom || m.date >= dateFrom;
    const dateToOk = !dateTo || m.date <= dateTo;
    const searchOk = !searchQuery || [m.team1, m.team2, m.city, m.venue, m.stage]
      .some(v => v.toLowerCase().includes(searchQuery.toLowerCase()));
    return stageOk && groupOk && countryOk && cityOk && dateFromOk && dateToOk && searchOk;
  });

  function clearFilters() {
    setActiveStage('All');
    setActiveGroup('All');
    setActiveCountry('All');
    setActiveCity('All');
    setSearchQuery('');
    setDateFrom('');
    setDateTo('');
  }

  const hasFilters = activeStage !== 'All' || activeGroup !== 'All' || activeCountry !== 'All' ||
    activeCity !== 'All' || searchQuery || dateFrom || dateTo;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-black text-white py-14 px-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-blue-400 text-xs font-semibold uppercase tracking-widest mb-2">FIFA World Cup 2026™</p>
          <h1 className="text-4xl md:text-5xl font-black mb-2">Scores &amp; Fixtures</h1>
          <p className="text-gray-400 text-sm">11 June – 19 July 2026 · 64 Matches · 16 Venues</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search bar */}
        <div className="flex gap-3 mb-5">
          <div className="relative flex-1 max-w-lg">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by team, city, venue, or stage..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X size={15} />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-500 font-medium whitespace-nowrap">From:</label>
            <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-500 font-medium whitespace-nowrap">To:</label>
            <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
          </div>
        </div>

        {/* Stage filter */}
        <div className="flex gap-2 flex-wrap mb-3">
          {stages.map(s => (
            <button key={s} onClick={() => setActiveStage(s)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${activeStage === s ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-400'}`}>
              {s}
            </button>
          ))}
        </div>

        {/* Group filter (only for group stage) */}
        {(activeStage === 'All' || activeStage === 'Group Stage') && (
          <div className="flex gap-2 flex-wrap mb-3">
            <span className="text-xs text-gray-500 self-center mr-1 font-medium">Group:</span>
            {groups.map(g => (
              <button key={g} onClick={() => setActiveGroup(g)}
                className={`w-9 h-9 rounded-full text-sm font-bold transition-colors ${activeGroup === g ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-400'}`}>
                {g}
              </button>
            ))}
          </div>
        )}

        {/* Country + City filter */}
        <div className="flex gap-4 flex-wrap mb-6">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-medium">Country:</span>
            <div className="flex gap-1.5 flex-wrap">
              {countries.map(c => (
                <button key={c} onClick={() => { setActiveCountry(c); setActiveCity('All'); }}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${activeCountry === c ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-400'}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-medium">City:</span>
            <select value={activeCity} onChange={e => setActiveCity(e.target.value)}
              className="border border-gray-200 rounded-full px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
              {cities.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Results info + clear */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-gray-500 text-sm">
            <span className="font-bold text-gray-900">{filtered.length}</span> match{filtered.length !== 1 ? 'es' : ''} found
          </p>
          {hasFilters && (
            <button onClick={clearFilters} className="flex items-center gap-1.5 text-blue-600 text-sm font-semibold hover:underline">
              <X size={14} /> Clear all filters
            </button>
          )}
        </div>

        {/* Matches list */}
        <div className="space-y-3">
          {filtered.map(m => (
            <div key={m.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                {/* Stage badge + date */}
                <div className="flex-shrink-0 w-36">
                  <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${stageColors[m.stage] || 'bg-gray-100 text-gray-700'}`}>
                    {m.stage}{m.group ? ` G${m.group}` : ''}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">{formatDate(m.date)}</p>
                  <p className="text-xs font-bold text-gray-700">{m.time} Local</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">Match #{m.matchNumber}</p>
                </div>

                {/* Teams with real flags */}
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex items-center gap-2.5 flex-1 justify-end md:justify-start">
                    <TeamFlag teamName={m.team1} size={28} />
                    <span className="font-bold text-gray-900 text-sm">{m.team1}</span>
                  </div>
                  <span className="text-gray-400 font-bold text-sm bg-gray-100 px-3 py-1 rounded flex-shrink-0">VS</span>
                  <div className="flex items-center gap-2.5 flex-1">
                    <TeamFlag teamName={m.team2} size={28} />
                    <span className="font-bold text-gray-900 text-sm">{m.team2}</span>
                  </div>
                </div>

                {/* Venue + CTA */}
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <MapPin size={11} />
                    <span>{m.city}</span>
                  </div>
                  <p className="text-[11px] text-gray-400 truncate max-w-[160px] text-right">{m.venue}</p>
                  <Link to="/queue"
                    className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-full transition-colors">
                    <Ticket size={12} />
                    Tickets
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <Calendar size={40} className="mx-auto mb-3 opacity-40" />
            <p className="font-semibold text-gray-500">No matches found.</p>
            <p className="text-sm mt-1">Try adjusting your search or filters.</p>
            <button onClick={clearFilters} className="mt-4 text-blue-600 text-sm font-bold hover:underline">
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
