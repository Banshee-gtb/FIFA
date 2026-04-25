import { useState } from 'react';
import { Search } from 'lucide-react';
import { TEAMS } from '@/constants/data';

const confederations = ['All', 'UEFA', 'CONMEBOL', 'CONCACAF', 'CAF', 'AFC', 'OFC'];

export default function Teams() {
  const [search, setSearch] = useState('');
  const [activeConf, setActiveConf] = useState('All');

  const filtered = TEAMS.filter((t, idx, arr) =>
    arr.findIndex(x => x.name === t.name) === idx // deduplicate
  ).filter(t => {
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase());
    const matchConf = activeConf === 'All' || t.confederation === activeConf;
    return matchSearch && matchConf;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-black text-white py-14 px-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-blue-400 text-xs font-semibold uppercase tracking-widest mb-2">FIFA World Cup 2026™</p>
          <h1 className="text-4xl md:text-5xl font-black mb-2">Teams</h1>
          <p className="text-gray-400 text-sm">48 nations competing for the ultimate prize in football.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search teams..."
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {confederations.map(c => (
              <button
                key={c}
                onClick={() => setActiveConf(c)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide transition-colors ${activeConf === c ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-400'}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <p className="text-gray-500 text-sm mb-4">{filtered.length} teams</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filtered.map(team => (
            <div key={team.name} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 card-hover text-center cursor-pointer">
              <div className="text-4xl mb-2">{team.flag}</div>
              <p className="font-bold text-gray-900 text-sm leading-tight">{team.name}</p>
              <p className="text-xs text-gray-400 mt-1">{team.confederation}</p>
              {team.group && (
                <span className="inline-block mt-2 bg-blue-100 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                  Group {team.group}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
