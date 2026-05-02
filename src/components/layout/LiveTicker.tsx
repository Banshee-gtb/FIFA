import { useEffect, useRef, useState } from 'react';

interface LiveMatch {
  id: number;
  team1: string; flag1: string; score1: number;
  team2: string; flag2: string; score2: number;
  minute: number;
  status: 'LIVE' | 'HT' | 'FT';
}

const LIVE_MATCHES: LiveMatch[] = [
  { id: 1, team1: 'Brazil', flag1: 'br', score1: 2, team2: 'Serbia', flag2: 'rs', score2: 0, minute: 67, status: 'LIVE' },
  { id: 2, team1: 'France', flag1: 'fr', score1: 1, team2: 'Denmark', flag2: 'dk', score2: 1, minute: 45, status: 'HT' },
  { id: 3, team1: 'Argentina', flag1: 'ar', score1: 3, team2: 'Mexico', flag2: 'mx', score2: 2, minute: 90, status: 'FT' },
  { id: 4, team1: 'Spain', flag1: 'es', score1: 2, team2: 'Germany', flag2: 'de', score2: 1, minute: 54, status: 'LIVE' },
  { id: 5, team1: 'England', flag1: 'gb', score1: 0, team2: 'Netherlands', flag2: 'nl', score2: 0, minute: 23, status: 'LIVE' },
  { id: 6, team1: 'Portugal', flag1: 'pt', score1: 4, team2: 'Uruguay', flag2: 'uy', score2: 0, minute: 90, status: 'FT' },
  { id: 7, team1: 'Morocco', flag1: 'ma', score1: 1, team2: 'Croatia', flag2: 'hr', score2: 1, minute: 78, status: 'LIVE' },
  { id: 8, team1: 'Nigeria', flag1: 'ng', score1: 2, team2: 'Egypt', flag2: 'eg', score2: 1, minute: 45, status: 'HT' },
];

function MatchChip({ match }: { match: LiveMatch }) {
  const [minute, setMinute] = useState(match.minute);

  useEffect(() => {
    if (match.status !== 'LIVE') return;
    const interval = setInterval(() => {
      setMinute(m => Math.min(m + 1, 90));
    }, 30000);
    return () => clearInterval(interval);
  }, [match.status]);

  return (
    <div className="flex items-center gap-2.5 px-4 py-1.5 border-r border-white/10 flex-shrink-0 min-w-fit">
      {/* Status badge */}
      <div className="flex items-center gap-1">
        {match.status === 'LIVE' && (
          <span className="flex items-center gap-1 text-[10px] font-black text-red-400 uppercase tracking-wide">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
            </span>
            LIVE
          </span>
        )}
        {match.status === 'HT' && (
          <span className="text-[10px] font-black text-yellow-400 uppercase tracking-wide">HT</span>
        )}
        {match.status === 'FT' && (
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-wide">FT</span>
        )}
      </div>

      {/* Match */}
      <div className="flex items-center gap-1.5">
        <img src={`https://flagcdn.com/w20/${match.flag1}.png`} alt={match.team1}
          className="h-3.5 rounded-sm flex-shrink-0" style={{ width: '22px', objectFit: 'cover' }} />
        <span className="text-white text-xs font-semibold">{match.team1}</span>
        <span className="text-white font-black text-xs bg-white/10 px-2 py-0.5 rounded mx-0.5">
          {match.score1} – {match.score2}
        </span>
        <span className="text-white text-xs font-semibold">{match.team2}</span>
        <img src={`https://flagcdn.com/w20/${match.flag2}.png`} alt={match.team2}
          className="h-3.5 rounded-sm flex-shrink-0" style={{ width: '22px', objectFit: 'cover' }} />
      </div>

      {/* Minute */}
      {match.status === 'LIVE' && (
        <span className="text-gray-400 text-[10px] font-mono">{minute}&apos;</span>
      )}
    </div>
  );
}

export default function LiveTicker() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let pos = 0;
    let rafId: number;

    function animate() {
      if (!paused && track) {
        pos -= 0.5;
        const totalWidth = track.scrollWidth / 2;
        if (Math.abs(pos) >= totalWidth) pos = 0;
        track.style.transform = `translateX(${pos}px)`;
      }
      rafId = requestAnimationFrame(animate);
    }
    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [paused]);

  return (
    <div
      className="bg-[#0a0a0a] border-b border-white/5 overflow-hidden h-9 flex items-center relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Left label */}
      <div className="flex-shrink-0 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest px-3 h-full flex items-center z-10 select-none border-r border-blue-700">
        ⚽ LIVE
      </div>

      {/* Scrolling content */}
      <div className="overflow-hidden flex-1 relative">
        <div ref={trackRef} className="flex whitespace-nowrap" style={{ willChange: 'transform' }}>
          {/* Duplicate for seamless loop */}
          {[...LIVE_MATCHES, ...LIVE_MATCHES].map((m, i) => (
            <MatchChip key={`${m.id}-${i}`} match={m} />
          ))}
        </div>
      </div>

      {/* Fade edges */}
      <div className="absolute left-[72px] top-0 bottom-0 w-8 bg-gradient-to-r from-[#0a0a0a] to-transparent pointer-events-none z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#0a0a0a] to-transparent pointer-events-none z-10" />
    </div>
  );
}
