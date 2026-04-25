import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Ticket } from 'lucide-react';
import { MATCHES } from '@/constants/data';
import { formatDate } from '@/lib/utils';

const stages = ['All', 'Group Stage', 'Quarter-Final', 'Semi-Final', 'Third Place', 'Final'];

export default function Matches() {
  const [activeStage, setActiveStage] = useState('All');
  const [activeGroup, setActiveGroup] = useState('All');

  const filtered = MATCHES.filter(m => {
    const stageOk = activeStage === 'All' || m.stage === activeStage;
    const groupOk = activeGroup === 'All' || m.group === activeGroup;
    return stageOk && groupOk;
  });

  const groups = ['All', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'];

  const stageColors: Record<string, string> = {
    'Group Stage': 'bg-blue-100 text-blue-700',
    'Quarter-Final': 'bg-purple-100 text-purple-700',
    'Semi-Final': 'bg-orange-100 text-orange-700',
    'Third Place': 'bg-gray-100 text-gray-700',
    'Final': 'bg-yellow-100 text-yellow-700',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-black text-white py-14 px-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-blue-400 text-xs font-semibold uppercase tracking-widest mb-2">FIFA World Cup 2026™</p>
          <h1 className="text-4xl md:text-5xl font-black mb-2">Scores &amp; Fixtures</h1>
          <p className="text-gray-400 text-sm">11 June – 19 July 2026 · 64 Matches · 16 Venues</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stage filter */}
        <div className="flex gap-2 flex-wrap mb-4">
          {stages.map(s => (
            <button
              key={s}
              onClick={() => setActiveStage(s)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${activeStage === s ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-400'}`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Group filter (only for group stage) */}
        {(activeStage === 'All' || activeStage === 'Group Stage') && (
          <div className="flex gap-2 flex-wrap mb-8">
            <span className="text-xs text-gray-500 self-center mr-1 font-medium">Group:</span>
            {groups.map(g => (
              <button
                key={g}
                onClick={() => setActiveGroup(g)}
                className={`w-9 h-9 rounded-full text-sm font-bold transition-colors ${activeGroup === g ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-400'}`}
              >
                {g}
              </button>
            ))}
          </div>
        )}

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
                  <p className="text-xs font-bold text-gray-700">{m.time}</p>
                </div>

                {/* Teams */}
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex items-center gap-2 flex-1 justify-end md:justify-start">
                    <span className="text-2xl">{m.team1Flag}</span>
                    <span className="font-bold text-gray-900 text-sm">{m.team1}</span>
                  </div>
                  <span className="text-gray-400 font-bold text-sm bg-gray-100 px-3 py-1 rounded">VS</span>
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-2xl">{m.team2Flag}</span>
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
                  <Link
                    to="/tickets"
                    className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-full transition-colors"
                  >
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
            <p>No matches found for the selected filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
