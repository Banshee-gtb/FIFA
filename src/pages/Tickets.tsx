import { useState } from 'react';
import { Ticket, ShoppingCart, Check, MapPin, Calendar, ChevronDown, ChevronUp, Search, Filter, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { MATCHES } from '@/constants/data';
import { useCart } from '@/hooks/useCart';
import { useCurrency } from '@/contexts/CurrencyContext';
import { formatDate } from '@/lib/utils';
import { Link } from 'react-router-dom';

// ── Coastal/baywatch venues get cheaper prices ──────────────────────────────
const COASTAL_CITIES = ['Miami', 'Seattle', 'San Francisco Bay Area', 'Vancouver'];
const CANADA_CITIES = ['Toronto', 'Vancouver'];
const MEXICO_CITIES = ['Mexico City', 'Guadalajara', 'Monterrey'];

type TierKey = 'fan_zone' | 'cat4b' | 'cat4a' | 'cat3b' | 'cat3a' | 'cat2b' | 'cat2a' | 'cat1c' | 'cat1b';

interface Tier {
  key: TierKey;
  label: string;
  section: string;
  basePrice: number;
  badge?: string;
  color: string;
  popular?: boolean;
}

const BASE_TIERS: Tier[] = [
  { key: 'fan_zone',  label: 'Fan Zone Standing',     section: 'Open terrace fan area, standing', basePrice: 19,  color: 'bg-gray-50  border-gray-200' },
  { key: 'cat4b',    label: 'Category 4 — Upper Far', section: 'Upper tier, far end corners',     basePrice: 35,  color: 'bg-slate-50 border-slate-200' },
  { key: 'cat4a',    label: 'Category 4 — Upper Side',section: 'Upper tier, side view',           basePrice: 49,  color: 'bg-slate-50 border-slate-200' },
  { key: 'cat3b',    label: 'Category 3 — Lower End',  section: 'Lower tier, behind goal area',    basePrice: 65,  color: 'bg-blue-50  border-blue-200' },
  { key: 'cat3a',    label: 'Category 3 — Lower Side', section: 'Lower tier, side sections',       basePrice: 82,  badge: 'Good Value', color: 'bg-blue-50  border-blue-200' },
  { key: 'cat2b',    label: 'Category 2 — Corner',     section: 'Lower tier corner, great angle',  basePrice: 109, color: 'bg-indigo-50 border-indigo-200', popular: true },
  { key: 'cat2a',    label: 'Category 2 — Midfield',   section: 'Midfield lower tier, clear view', basePrice: 135, badge: 'Popular', color: 'bg-indigo-50 border-indigo-200', popular: true },
  { key: 'cat1c',    label: 'Category 1 — Midfield Upper', section: 'Midfield upper tier elevated view', basePrice: 159, color: 'bg-purple-50 border-purple-200' },
  { key: 'cat1b',    label: 'Category 1 — Midfield Lower', section: 'Best pitch-level midfield seats',   basePrice: 189, badge: 'Best Seats', color: 'bg-purple-50 border-purple-200' },
];

// Price adjustments per venue type
function getVenueDiscount(city: string): number {
  if (COASTAL_CITIES.includes(city)) return -18;   // baywatch/coastal cheaper
  if (MEXICO_CITIES.includes(city)) return -10;     // Mexico slightly cheaper
  if (CANADA_CITIES.includes(city)) return -5;      // Canada slight discount
  return 0;                                          // mainland USA = full price
}

function getTiersForMatch(city: string): Array<Tier & { price: number }> {
  const discount = getVenueDiscount(city);
  return BASE_TIERS.map(t => ({
    ...t,
    price: Math.max(15, t.basePrice + discount),
  }));
}

// Stage-based price multiplier for knockout matches
function getStageMultiplier(stage: string): number {
  if (stage === 'Final') return 0; // always show as sold in separate CTA
  if (stage === 'Semi-Final') return 0;
  if (stage === 'Quarter-Final') return 0;
  return 1;
}

const GROUP_LABELS: Record<string, string> = {
  A: 'Group A', B: 'Group B', C: 'Group C', D: 'Group D',
  E: 'Group E', F: 'Group F', G: 'Group G', H: 'Group H',
};

const STAGE_COLORS: Record<string, string> = {
  'Group Stage': 'bg-blue-100 text-blue-700',
  'Quarter-Final': 'bg-orange-100 text-orange-700',
  'Semi-Final': 'bg-red-100 text-red-700',
  'Third Place': 'bg-purple-100 text-purple-700',
  'Final': 'bg-yellow-100 text-yellow-800',
};

function FlagImg({ code, alt }: { code: string; alt: string }) {
  const iso = code.toLowerCase().replace('🇺🇸','us').replace('🇦🇷','ar').replace('🇧🇷','br')
    .replace('🇩🇪','de').replace('🇫🇷','fr').replace('🇪🇸','es').replace('🏴󠁧󠁢󠁥󠁮󠁧󠁿','gb-eng')
    .replace('🇵🇹','pt').replace('🇳🇱','nl').replace('🇮🇹','it').replace('🇯🇵','jp')
    .replace('🇲🇦','ma').replace('🇺🇾','uy').replace('🇰🇷','kr').replace('🇸🇳','sn')
    .replace('🇨🇴','co').replace('🇧🇪','be').replace('🇦🇺','au').replace('🇪🇨','ec')
    .replace('🇭🇷','hr').replace('🇨🇭','ch').replace('🇩🇰','dk').replace('🇬🇭','gh')
    .replace('🇮🇷','ir').replace('🇸🇦','sa').replace('🇵🇱','pl').replace('🇺🇦','ua')
    .replace('🇷🇸','rs').replace('🇹🇷','tr').replace('🇦🇹','at').replace('🇲🇽','mx')
    .replace('🇨🇦','ca').replace('🏳️','un');

  return (
    <img
      src={`https://flagcdn.com/w40/${iso}.png`}
      alt={alt}
      className="w-7 h-5 object-cover rounded-sm shadow-sm flex-shrink-0"
      onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
    />
  );
}

interface MatchCardProps {
  match: typeof MATCHES[0];
  defaultOpen?: boolean;
}

function MatchCard({ match, defaultOpen = false }: MatchCardProps) {
  const [open, setOpen] = useState(defaultOpen);
  const { addItem } = useCart();
  const { format } = useCurrency();
  const isKnockout = match.stage !== 'Group Stage';
  const tiers = getTiersForMatch(match.city);
  const isCoastal = COASTAL_CITIES.includes(match.city);

  function handleAdd(tier: Tier & { price: number }) {
    addItem({
      id: `ticket-${match.id}-${tier.key}`,
      name: `${match.stage === 'Group Stage' ? `${match.team1} vs ${match.team2}` : match.stage} — ${tier.label}`,
      price: tier.price,
      type: 'ticket',
      matchId: match.id,
    });
    toast.success(`${tier.label} added to cart!`);
  }

  return (
    <div className={`bg-white rounded-2xl border-2 overflow-hidden transition-shadow hover:shadow-md ${open ? 'border-blue-400 shadow-md' : 'border-gray-100'}`}>
      {/* Match header — always visible */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full text-left px-5 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors"
        aria-expanded={open}
      >
        {/* Stage badge */}
        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wide flex-shrink-0 ${STAGE_COLORS[match.stage] || 'bg-gray-100 text-gray-600'}`}>
          {match.group ? `Group ${match.group}` : match.stage}
        </span>

        {/* Teams */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {match.team1 !== 'TBD' ? (
            <>
              <FlagImg code={match.team1Flag} alt={match.team1} />
              <span className="font-black text-gray-900 text-sm truncate">{match.team1}</span>
              <span className="text-gray-400 text-xs font-bold mx-1">vs</span>
              <span className="font-black text-gray-900 text-sm truncate">{match.team2}</span>
              <FlagImg code={match.team2Flag} alt={match.team2} />
            </>
          ) : (
            <span className="font-black text-gray-500 text-sm">{match.stage} — To Be Determined</span>
          )}
        </div>

        {/* Meta */}
        <div className="hidden sm:flex items-center gap-4 text-xs text-gray-500 flex-shrink-0">
          <span className="flex items-center gap-1"><Calendar size={11} /> {formatDate(match.date)}</span>
          <span className="flex items-center gap-1"><MapPin size={11} /> {match.city}</span>
          {isCoastal && (
            <span className="bg-cyan-100 text-cyan-700 text-[9px] font-bold px-2 py-0.5 rounded-full">BAYWATCH AREA</span>
          )}
        </div>

        {/* Price from + expand */}
        <div className="flex items-center gap-3 flex-shrink-0 ml-auto">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] text-gray-400 uppercase">From</p>
            <p className="font-black text-blue-600 text-sm">{format(tiers[0].price)}</p>
          </div>
          <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${open ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
            {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </div>
        </div>
      </button>

      {/* Mobile meta row */}
      <div className="sm:hidden px-5 pb-3 flex items-center gap-3 text-xs text-gray-500 -mt-1">
        <span className="flex items-center gap-1"><Calendar size={11} /> {formatDate(match.date)}</span>
        <span className="flex items-center gap-1"><MapPin size={11} /> {match.city}</span>
        {isCoastal && <span className="bg-cyan-100 text-cyan-700 text-[9px] font-bold px-2 py-0.5 rounded-full">BAYWATCH</span>}
      </div>

      {/* Ticket tiers — collapsible */}
      {open && (
        <div className="border-t border-gray-100 px-5 py-4">
          {isKnockout && match.team1 === 'TBD' ? (
            <div className="text-center py-8">
              <div className="bg-yellow-50 rounded-2xl p-6 border border-yellow-100">
                <Ticket size={28} className="text-yellow-500 mx-auto mb-3" />
                <p className="font-black text-gray-800 mb-1">Teams Not Yet Confirmed</p>
                <p className="text-gray-500 text-sm mb-4">Tickets for this {match.stage} go on sale once qualifying teams are confirmed.</p>
                <Link to="/queue" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-black px-6 py-3 rounded-full text-sm transition-colors">
                  <Zap size={14} /> Join Priority Queue
                </Link>
              </div>
            </div>
          ) : (
            <>
              {isCoastal && (
                <div className="bg-cyan-50 border border-cyan-200 rounded-xl px-4 py-2.5 mb-4 flex items-center gap-2 text-xs text-cyan-700 font-semibold">
                  🌊 Baywatch/Coastal venue — discounted pricing vs mainland stadiums
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {tiers.map(tier => (
                  <div
                    key={tier.key}
                    className={`rounded-xl border-2 p-3.5 flex flex-col gap-2 ${tier.popular ? 'border-blue-400 ring-1 ring-blue-200' : 'border-gray-200'} ${tier.color}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                          <p className="font-black text-gray-900 text-xs leading-tight">{tier.label}</p>
                          {tier.badge && (
                            <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full flex-shrink-0 ${tier.popular ? 'bg-blue-600 text-white' : tier.badge === 'Best Seats' ? 'bg-purple-600 text-white' : 'bg-green-100 text-green-700'}`}>
                              {tier.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-gray-400 text-[10px] leading-tight">{tier.section}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-black text-blue-600 text-base leading-tight">{format(tier.price)}</p>
                        <p className="text-gray-400 text-[9px]">per ticket</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
                      <Check size={10} className="text-green-500 flex-shrink-0" />
                      Match ticket + Fan ID included
                    </div>
                    <button
                      onClick={() => handleAdd(tier)}
                      className={`w-full py-2 rounded-full text-xs font-black flex items-center justify-center gap-1.5 transition-colors ${tier.popular ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-900 hover:bg-gray-700 text-white'}`}
                    >
                      <ShoppingCart size={11} /> Add to Cart
                    </button>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-gray-400 mt-3 text-center">All tickets include official FIFA Fan ID · Prices shown per person</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default function Tickets() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStage, setActiveStage] = useState<'all' | 'group' | 'knockout'>('all');
  const [activeGroup, setActiveGroup] = useState('all');
  const [expandAll, setExpandAll] = useState(false);

  const groupMatches = MATCHES.filter(m => m.stage === 'Group Stage');
  const knockoutMatches = MATCHES.filter(m => m.stage !== 'Group Stage');
  const groups = [...new Set(groupMatches.map(m => m.group).filter(Boolean))].sort() as string[];

  const filtered = MATCHES.filter(m => {
    const matchesStage = activeStage === 'all' || (activeStage === 'group' ? m.stage === 'Group Stage' : m.stage !== 'Group Stage');
    const matchesGroup = activeGroup === 'all' || m.group === activeGroup;
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || m.team1.toLowerCase().includes(q) || m.team2.toLowerCase().includes(q)
      || m.city.toLowerCase().includes(q) || m.venue.toLowerCase().includes(q)
      || (m.stage || '').toLowerCase().includes(q);
    return matchesStage && matchesGroup && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-black text-white py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/60 to-transparent" />
        <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-red-500 opacity-30 translate-y-1/2 -translate-x-1/4" />
        <div className="absolute bottom-0 left-6 w-28 h-28 rounded-full bg-yellow-400 opacity-30 translate-y-1/3" />
        <div className="relative max-w-7xl mx-auto">
          <p className="text-blue-400 text-xs font-semibold uppercase tracking-widest mb-2">Official Ticket Sales</p>
          <h1 className="text-4xl md:text-5xl font-black mb-3">FIFA World Cup 2026™ Tickets</h1>
          <p className="text-gray-300 max-w-xl text-sm leading-relaxed">
            All 64 matches · 9 seating categories per match · All under $200 · Baywatch coastal venues from $19
          </p>
          <div className="flex flex-wrap gap-3 mt-5">
            <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 text-xs text-white font-medium">
              <Ticket size={13} /> {MATCHES.length} Matches
            </div>
            <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 text-xs text-white font-medium">
              <Check size={13} /> 9 Tiers Per Match
            </div>
            <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 text-xs text-white font-medium">
              🌊 Coastal Venues from $19
            </div>
            <div className="flex items-center gap-2 bg-green-500 rounded-full px-4 py-2 text-xs text-white font-bold">
              <Zap size={13} className="fill-white" /> Fast Queue — 60 Seconds Max
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">

        {/* Phase Banner */}
        <div className="bg-blue-600 text-white rounded-xl p-5 mb-8 flex flex-col sm:flex-row items-center gap-4">
          <div className="bg-white rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
            <Ticket className="text-blue-600" size={20} />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-lg font-black">Last-Minute Sales Phase — Now Open</h2>
            <p className="text-blue-100 text-xs mt-0.5">Secure your FIFA World Cup 2026™ tickets today · Limited availability · Fast 60-second queue</p>
          </div>
          <Link to="/queue" className="bg-yellow-400 hover:bg-yellow-300 text-black font-black px-6 py-3 rounded-full text-sm transition-colors whitespace-nowrap flex items-center gap-2">
            <Zap size={14} /> Enter Queue
          </Link>
        </div>

        {/* Coastal vs Mainland pricing note */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-4 flex items-start gap-3">
            <span className="text-2xl">🌊</span>
            <div>
              <p className="font-black text-cyan-800 text-sm">Baywatch / Coastal Venues</p>
              <p className="text-cyan-600 text-xs mt-0.5 leading-relaxed">Miami, Seattle, San Francisco Bay Area, Vancouver — discounted pricing · from $19</p>
            </div>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-start gap-3">
            <span className="text-2xl">🏟️</span>
            <div>
              <p className="font-black text-orange-800 text-sm">Mainland / Inland Venues</p>
              <p className="text-orange-600 text-xs mt-0.5 leading-relaxed">Dallas, Houston, Atlanta, Kansas City, Philadelphia, Boston, NY/NJ — standard pricing · from $19</p>
            </div>
          </div>
        </div>

        {/* Search + Filters */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by team, city, or venue…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {/* Stage filter */}
            <div className="flex gap-2 flex-shrink-0">
              {(['all', 'group', 'knockout'] as const).map(s => (
                <button key={s} onClick={() => { setActiveStage(s); setActiveGroup('all'); }}
                  className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-colors capitalize ${activeStage === s ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  {s === 'all' ? 'All Matches' : s === 'group' ? 'Group Stage' : 'Knockout'}
                </button>
              ))}
            </div>
            {/* Expand all */}
            <button onClick={() => setExpandAll(e => !e)}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors flex-shrink-0">
              <Filter size={12} /> {expandAll ? 'Collapse All' : 'Expand All'}
            </button>
          </div>

          {/* Group filter pills (only when group stage is shown) */}
          {(activeStage === 'all' || activeStage === 'group') && (
            <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100">
              <button onClick={() => setActiveGroup('all')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${activeGroup === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                All Groups
              </button>
              {groups.map(g => (
                <button key={g} onClick={() => setActiveGroup(g)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${activeGroup === g ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  Group {g}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-500">
            Showing <strong className="text-gray-900">{filtered.length}</strong> match{filtered.length !== 1 ? 'es' : ''} · 9 ticket tiers each
          </p>
          <p className="text-xs text-gray-400">Click any match to see all seat categories</p>
        </div>

        {/* Match listings */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
              <Ticket size={32} className="text-gray-300 mx-auto mb-3" />
              <p className="font-black text-gray-500">No matches found</p>
              <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filters</p>
            </div>
          ) : (
            filtered.map((match, i) => (
              <MatchCard key={match.id} match={match} defaultOpen={expandAll || i === 0} />
            ))
          )}
        </div>

        {/* Marketplace + Queue CTA */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-10">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-start gap-4">
            <div className="bg-blue-100 rounded-xl w-12 h-12 flex items-center justify-center flex-shrink-0">
              <Ticket className="text-blue-600" size={20} />
            </div>
            <div className="flex-1">
              <h3 className="font-black text-gray-900 mb-1">Marketplace — Resell &amp; Exchange</h3>
              <p className="text-gray-500 text-xs mb-3 leading-relaxed">Residents of most countries may resell tickets. Mexican residents can exchange their tickets for other matches.</p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-full text-xs transition-colors">
                Resell / Exchange Now
              </button>
            </div>
          </div>
          <div className="bg-gradient-to-br from-[#0a1f5c] to-[#1a3a8c] text-white rounded-2xl p-6 flex items-start gap-4">
            <div className="bg-yellow-400 rounded-xl w-12 h-12 flex items-center justify-center flex-shrink-0">
              <Zap size={20} className="text-black fill-black" />
            </div>
            <div className="flex-1">
              <h3 className="font-black mb-1">Fast-Track Queue</h3>
              <p className="text-white/70 text-xs mb-3 leading-relaxed">Skip the wait — our queue clears in under 60 seconds. Enter now for priority access to all remaining tickets.</p>
              <Link to="/queue" className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-black font-black px-5 py-2.5 rounded-full text-xs transition-colors">
                <Zap size={12} className="fill-black" /> Enter 60-Second Queue
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
