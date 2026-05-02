import { useState } from 'react';
import { ChevronUp, ChevronDown, Minus } from 'lucide-react';

interface TeamStanding {
  team: string;
  code: string;
  flag: string;
  mp: number; w: number; d: number; l: number;
  gf: number; ga: number; gd: number; pts: number;
}

type SortKey = 'pts' | 'gd' | 'gf' | 'mp' | 'w';

const GROUPS: Record<string, TeamStanding[]> = {
  A: [
    { team: 'USA', code: 'us', flag: 'us', mp: 3, w: 2, d: 1, l: 0, gf: 5, ga: 2, gd: 3, pts: 7 },
    { team: 'Mexico', code: 'mx', flag: 'mx', mp: 3, w: 1, d: 1, l: 1, gf: 3, ga: 3, gd: 0, pts: 4 },
    { team: 'Poland', code: 'pl', flag: 'pl', mp: 3, w: 1, d: 0, l: 2, gf: 2, ga: 4, gd: -2, pts: 3 },
    { team: 'Saudi Arabia', code: 'sa', flag: 'sa', mp: 3, w: 0, d: 2, l: 1, gf: 1, ga: 2, gd: -1, pts: 2 },
  ],
  B: [
    { team: 'Brazil', code: 'br', flag: 'br', mp: 3, w: 3, d: 0, l: 0, gf: 7, ga: 2, gd: 5, pts: 9 },
    { team: 'Switzerland', code: 'ch', flag: 'ch', mp: 3, w: 1, d: 1, l: 1, gf: 3, ga: 4, gd: -1, pts: 4 },
    { team: 'Serbia', code: 'rs', flag: 'rs', mp: 3, w: 1, d: 0, l: 2, gf: 3, ga: 5, gd: -2, pts: 3 },
    { team: 'Cameroon', code: 'cm', flag: 'cm', mp: 3, w: 0, d: 1, l: 2, gf: 2, ga: 4, gd: -2, pts: 1 },
  ],
  C: [
    { team: 'Argentina', code: 'ar', flag: 'ar', mp: 3, w: 2, d: 1, l: 0, gf: 6, ga: 2, gd: 4, pts: 7 },
    { team: 'Poland', code: 'pl', flag: 'pl', mp: 3, w: 1, d: 1, l: 1, gf: 3, ga: 3, gd: 0, pts: 4 },
    { team: 'Saudi Arabia', code: 'sa', flag: 'sa', mp: 3, w: 1, d: 0, l: 2, gf: 3, ga: 5, gd: -2, pts: 3 },
    { team: 'Mexico', code: 'mx', flag: 'mx', mp: 3, w: 0, d: 2, l: 1, gf: 2, ga: 4, gd: -2, pts: 2 },
  ],
  D: [
    { team: 'France', code: 'fr', flag: 'fr', mp: 3, w: 2, d: 1, l: 0, gf: 5, ga: 1, gd: 4, pts: 7 },
    { team: 'Denmark', code: 'dk', flag: 'dk', mp: 3, w: 1, d: 2, l: 0, gf: 4, ga: 3, gd: 1, pts: 5 },
    { team: 'Tunisia', code: 'tn', flag: 'tn', mp: 3, w: 0, d: 2, l: 1, gf: 1, ga: 2, gd: -1, pts: 2 },
    { team: 'Australia', code: 'au', flag: 'au', mp: 3, w: 0, d: 1, l: 2, gf: 1, ga: 5, gd: -4, pts: 1 },
  ],
  E: [
    { team: 'Spain', code: 'es', flag: 'es', mp: 3, w: 3, d: 0, l: 0, gf: 8, ga: 1, gd: 7, pts: 9 },
    { team: 'Germany', code: 'de', flag: 'de', mp: 3, w: 2, d: 0, l: 1, gf: 6, ga: 3, gd: 3, pts: 6 },
    { team: 'Japan', code: 'jp', flag: 'jp', mp: 3, w: 1, d: 0, l: 2, gf: 3, ga: 5, gd: -2, pts: 3 },
    { team: 'Costa Rica', code: 'cr', flag: 'cr', mp: 3, w: 0, d: 0, l: 3, gf: 1, ga: 9, gd: -8, pts: 0 },
  ],
  F: [
    { team: 'Morocco', code: 'ma', flag: 'ma', mp: 3, w: 2, d: 0, l: 1, gf: 4, ga: 2, gd: 2, pts: 6 },
    { team: 'Croatia', code: 'hr', flag: 'hr', mp: 3, w: 1, d: 2, l: 0, gf: 4, ga: 3, gd: 1, pts: 5 },
    { team: 'Belgium', code: 'be', flag: 'be', mp: 3, w: 1, d: 1, l: 1, gf: 4, ga: 4, gd: 0, pts: 4 },
    { team: 'Canada', code: 'ca', flag: 'ca', mp: 3, w: 0, d: 1, l: 2, gf: 2, ga: 5, gd: -3, pts: 1 },
  ],
  G: [
    { team: 'England', code: 'gb-eng', flag: 'gb', mp: 3, w: 2, d: 1, l: 0, gf: 6, ga: 2, gd: 4, pts: 7 },
    { team: 'Netherlands', code: 'nl', flag: 'nl', mp: 3, w: 2, d: 0, l: 1, gf: 5, ga: 3, gd: 2, pts: 6 },
    { team: 'Senegal', code: 'sn', flag: 'sn', mp: 3, w: 1, d: 0, l: 2, gf: 3, ga: 5, gd: -2, pts: 3 },
    { team: 'Ecuador', code: 'ec', flag: 'ec', mp: 3, w: 0, d: 1, l: 2, gf: 2, ga: 6, gd: -4, pts: 1 },
  ],
  H: [
    { team: 'Portugal', code: 'pt', flag: 'pt', mp: 3, w: 3, d: 0, l: 0, gf: 7, ga: 1, gd: 6, pts: 9 },
    { team: 'Uruguay', code: 'uy', flag: 'uy', mp: 3, w: 1, d: 1, l: 1, gf: 3, ga: 4, gd: -1, pts: 4 },
    { team: 'South Korea', code: 'kr', flag: 'kr', mp: 3, w: 1, d: 0, l: 2, gf: 3, ga: 5, gd: -2, pts: 3 },
    { team: 'Ghana', code: 'gh', flag: 'gh', mp: 3, w: 0, d: 1, l: 2, gf: 2, ga: 5, gd: -3, pts: 1 },
  ],
  I: [
    { team: 'Italy', code: 'it', flag: 'it', mp: 3, w: 2, d: 0, l: 1, gf: 5, ga: 3, gd: 2, pts: 6 },
    { team: 'Colombia', code: 'co', flag: 'co', mp: 3, w: 2, d: 0, l: 1, gf: 4, ga: 3, gd: 1, pts: 6 },
    { team: 'Ivory Coast', code: 'ci', flag: 'ci', mp: 3, w: 1, d: 0, l: 2, gf: 2, ga: 3, gd: -1, pts: 3 },
    { team: 'Qatar', code: 'qa', flag: 'qa', mp: 3, w: 0, d: 0, l: 3, gf: 1, ga: 3, gd: -2, pts: 0 },
  ],
  J: [
    { team: 'Nigeria', code: 'ng', flag: 'ng', mp: 3, w: 2, d: 1, l: 0, gf: 6, ga: 3, gd: 3, pts: 7 },
    { team: 'Egypt', code: 'eg', flag: 'eg', mp: 3, w: 1, d: 2, l: 0, gf: 4, ga: 3, gd: 1, pts: 5 },
    { team: 'New Zealand', code: 'nz', flag: 'nz', mp: 3, w: 1, d: 0, l: 2, gf: 2, ga: 4, gd: -2, pts: 3 },
    { team: 'Honduras', code: 'hn', flag: 'hn', mp: 3, w: 0, d: 1, l: 2, gf: 1, ga: 3, gd: -2, pts: 1 },
  ],
  K: [
    { team: 'Chile', code: 'cl', flag: 'cl', mp: 3, w: 2, d: 0, l: 1, gf: 5, ga: 3, gd: 2, pts: 6 },
    { team: 'Iran', code: 'ir', flag: 'ir', mp: 3, w: 1, d: 1, l: 1, gf: 3, ga: 3, gd: 0, pts: 4 },
    { team: 'DR Congo', code: 'cd', flag: 'cd', mp: 3, w: 1, d: 0, l: 2, gf: 3, ga: 4, gd: -1, pts: 3 },
    { team: 'Panama', code: 'pa', flag: 'pa', mp: 3, w: 0, d: 1, l: 2, gf: 2, ga: 3, gd: -1, pts: 1 },
  ],
  L: [
    { team: 'Turkey', code: 'tr', flag: 'tr', mp: 3, w: 2, d: 1, l: 0, gf: 5, ga: 2, gd: 3, pts: 7 },
    { team: 'Austria', code: 'at', flag: 'at', mp: 3, w: 1, d: 1, l: 1, gf: 4, ga: 4, gd: 0, pts: 4 },
    { team: 'Venezuela', code: 've', flag: 've', mp: 3, w: 1, d: 0, l: 2, gf: 2, ga: 3, gd: -1, pts: 3 },
    { team: 'Indonesia', code: 'id', flag: 'id', mp: 3, w: 0, d: 0, l: 3, gf: 0, ga: 2, gd: -2, pts: 0 },
  ],
};

function GroupTable({ group, teams }: { group: string; teams: TeamStanding[] }) {
  const [sortKey, setSortKey] = useState<SortKey>('pts');
  const [sortDir, setSortDir] = useState<'desc' | 'asc'>('desc');

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  }

  const sorted = [...teams].sort((a, b) => {
    const v = sortDir === 'desc' ? b[sortKey] - a[sortKey] : a[sortKey] - b[sortKey];
    if (v !== 0) return v;
    return b.gd - a.gd;
  });

  function SortBtn({ k, label }: { k: SortKey; label: string }) {
    const active = sortKey === k;
    return (
      <button onClick={() => handleSort(k)}
        className={`flex items-center gap-0.5 hover:text-blue-600 transition-colors ${active ? 'text-blue-600 font-bold' : 'text-gray-500'}`}>
        {label}
        {active ? (sortDir === 'desc' ? <ChevronDown size={11} /> : <ChevronUp size={11} />) : <Minus size={11} className="opacity-30" />}
      </button>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="bg-[#0a1f5c] text-white px-5 py-3 flex items-center gap-3">
        <div className="bg-blue-500 text-white font-black text-sm w-8 h-8 rounded-full flex items-center justify-center">{group}</div>
        <span className="font-black text-sm">Group {group}</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 text-[11px] uppercase tracking-wide">
              <th className="text-left px-4 py-2.5 text-gray-500 font-semibold w-8">#</th>
              <th className="text-left px-4 py-2.5 text-gray-500 font-semibold">Team</th>
              <th className="px-2 py-2.5 text-center"><SortBtn k="mp" label="MP" /></th>
              <th className="px-2 py-2.5 text-center"><SortBtn k="w" label="W" /></th>
              <th className="px-2 py-2.5 text-center text-gray-500 font-semibold">D</th>
              <th className="px-2 py-2.5 text-center text-gray-500 font-semibold">L</th>
              <th className="px-2 py-2.5 text-center text-gray-500 font-semibold">GF</th>
              <th className="px-2 py-2.5 text-center text-gray-500 font-semibold">GA</th>
              <th className="px-2 py-2.5 text-center"><SortBtn k="gd" label="GD" /></th>
              <th className="px-2 py-2.5 text-center"><SortBtn k="pts" label="PTS" /></th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((team, i) => (
              <tr key={team.team}
                className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${i < 2 ? 'border-l-4 border-l-blue-500' : ''}`}>
                <td className="px-4 py-3 text-xs font-bold text-gray-400">{i + 1}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={`https://flagcdn.com/w40/${team.flag}.png`}
                      alt={team.team}
                      className="w-7 h-4.5 object-cover rounded-sm shadow-sm flex-shrink-0"
                      style={{ height: '18px' }}
                    />
                    <span className="font-semibold text-gray-900 text-sm whitespace-nowrap">{team.team}</span>
                  </div>
                </td>
                <td className="px-2 py-3 text-center text-xs text-gray-600">{team.mp}</td>
                <td className="px-2 py-3 text-center text-xs text-gray-600">{team.w}</td>
                <td className="px-2 py-3 text-center text-xs text-gray-600">{team.d}</td>
                <td className="px-2 py-3 text-center text-xs text-gray-600">{team.l}</td>
                <td className="px-2 py-3 text-center text-xs text-gray-600">{team.gf}</td>
                <td className="px-2 py-3 text-center text-xs text-gray-600">{team.ga}</td>
                <td className={`px-2 py-3 text-center text-xs font-semibold ${team.gd > 0 ? 'text-green-600' : team.gd < 0 ? 'text-red-500' : 'text-gray-500'}`}>
                  {team.gd > 0 ? `+${team.gd}` : team.gd}
                </td>
                <td className="px-2 py-3 text-center">
                  <span className="bg-blue-600 text-white font-black text-xs px-2 py-0.5 rounded min-w-[24px] inline-block text-center">
                    {team.pts}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-4 py-2 bg-gray-50 flex items-center gap-3 text-[10px] text-gray-400">
        <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-sm bg-blue-500" /><span>Qualify for Round of 32</span></div>
      </div>
    </div>
  );
}

export default function Standings() {
  const [activeGroup, setActiveGroup] = useState<string | 'ALL'>('ALL');
  const groupKeys = Object.keys(GROUPS);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-black text-white py-14 px-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-blue-400 text-xs font-semibold uppercase tracking-widest mb-2">FIFA World Cup 2026™</p>
          <h1 className="text-4xl md:text-5xl font-black mb-2">Standings</h1>
          <p className="text-gray-400 text-sm">Group Stage · 12 Groups · 48 Teams</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Group filter tabs */}
        <div className="flex gap-2 flex-wrap mb-8">
          <button onClick={() => setActiveGroup('ALL')}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${activeGroup === 'ALL' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-400'}`}>
            All Groups
          </button>
          {groupKeys.map(g => (
            <button key={g} onClick={() => setActiveGroup(g)}
              className={`w-10 h-10 rounded-full text-sm font-bold transition-colors ${activeGroup === g ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-400'}`}>
              {g}
            </button>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 mb-6 text-xs text-gray-500">
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-blue-500" /><span>Advance to Round of 32 (top 2 per group)</span></div>
          <span className="text-gray-300">·</span>
          <span>Click column headers to sort</span>
        </div>

        {activeGroup === 'ALL' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {groupKeys.map(g => (
              <GroupTable key={g} group={g} teams={GROUPS[g]} />
            ))}
          </div>
        ) : (
          <div className="max-w-2xl">
            <GroupTable group={activeGroup} teams={GROUPS[activeGroup]} />
          </div>
        )}
      </div>
    </div>
  );
}
