import { Link } from 'react-router-dom';
import { ArrowRight, Ticket, Star, Map, ShoppingBag, Trophy } from 'lucide-react';
import heroBanner from '@/assets/hero-banner.jpg';
import vipImg from '@/assets/vip-hospitality.jpg';
import { MATCHES, VENUES } from '@/constants/data';
import { formatDate } from '@/lib/utils';
import { TeamFlag } from '@/components/ui/Flag';

const featureCards = [
  { icon: Ticket, title: 'Last-Minute Sales', desc: 'Secure your FIFA World Cup 2026™ tickets today, subject to availability.', cta: 'Buy Now', href: '/queue' },
  { icon: Star, title: 'VIP Hospitality', desc: 'Premium packages with exclusive lounge access, fine dining, and the best seats.', cta: 'Explore Packages', href: '/hospitality' },
  { icon: Map, title: 'Tour Guide Experiences', desc: 'City tours, stadium insiders, and full World Cup journey packages.', cta: 'View Tours', href: '/tours' },
  { icon: ShoppingBag, title: 'Official Merchandise', desc: 'Shop official FIFA World Cup 2026™ apparel, collectibles, and team gear.', cta: 'Shop Now', href: '/store' },
];

const upcomingMatches = MATCHES.filter(m => m.stage === 'Group Stage').slice(0, 4);
const featuredVenues = VENUES.slice(0, 4);

export default function Home() {
  return (
    <div className="bg-white">
      {/* HERO */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <img src={heroBanner} alt="FIFA World Cup 2026" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-red-500 opacity-70 translate-y-1/2 -translate-x-1/4" />
        <div className="absolute bottom-0 left-8 w-48 h-48 rounded-full bg-yellow-400 opacity-60 translate-y-1/3" />
        <div className="absolute bottom-0 left-16 w-32 h-32 rounded-full bg-green-500 opacity-60 translate-y-1/4" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 w-full">
          <p className="text-blue-400 uppercase tracking-widest text-sm font-semibold mb-3">Experience FIFA World Cup 2026™</p>
          <h1 className="text-white text-5xl md:text-7xl font-black leading-none mb-4">
            11 JUNE<br />
            <span className="text-blue-400">– 19 JULY</span><br />
            2026™
          </h1>
          <p className="text-gray-300 text-lg max-w-xl mt-4 mb-8">
            The greatest sporting event on Earth returns — bigger than ever across USA, Canada &amp; Mexico. 48 teams. 16 venues. One dream.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/queue" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-full transition-colors text-sm uppercase tracking-wide">
              Buy Tickets
            </Link>
            <Link to="/hospitality" className="border-2 border-white text-white hover:bg-white hover:text-black font-bold px-8 py-4 rounded-full transition-colors text-sm uppercase tracking-wide">
              Hospitality Packages
            </Link>
          </div>
          <div className="flex gap-8 mt-12 text-white/80 text-sm">
            <div><span className="text-3xl font-black text-white">48</span><br />Teams</div>
            <div><span className="text-3xl font-black text-white">64</span><br />Matches</div>
            <div><span className="text-3xl font-black text-white">16</span><br />Venues</div>
            <div><span className="text-3xl font-black text-white">3</span><br />Countries</div>
          </div>
        </div>
      </section>

      {/* EXPERIENCE SECTION */}
      <section className="py-16 px-4 bg-black">
        <div className="max-w-7xl mx-auto text-center mb-10">
          <h2 className="text-white text-3xl md:text-4xl font-black mb-2">Experience FIFA World Cup 2026™</h2>
          <p className="text-gray-400 text-sm">11 June – 19 July 2026</p>
        </div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featureCards.map(card => (
            <div key={card.title} className="bg-white rounded-xl overflow-hidden shadow-xl card-hover flex flex-col">
              <div className="bg-blue-600 p-5 flex items-center gap-3">
                <div className="bg-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
                  <card.icon className="text-blue-600" size={20} />
                </div>
                <h3 className="text-white font-bold text-lg leading-tight">{card.title}</h3>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <p className="text-gray-600 text-sm leading-relaxed flex-1">{card.desc}</p>
                <Link to={card.href} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-5 py-2.5 rounded-full inline-block text-center transition-colors">
                  {card.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* UPCOMING MATCHES */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900">Upcoming Matches</h2>
              <p className="text-gray-500 text-sm mt-1">Group Stage · June 2026</p>
            </div>
            <Link to="/matches" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold text-sm transition-colors">
              View All Matches <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingMatches.map(m => (
              <div key={m.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 card-hover">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded uppercase tracking-wide">{m.stage} {m.group && `· Group ${m.group}`}</span>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">{formatDate(m.date)}</p>
                    <p className="text-xs font-bold text-gray-700">{m.time} Local</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col items-center gap-2 flex-1">
                    <TeamFlag teamName={m.team1} size={36} />
                    <span className="text-sm font-bold text-gray-900">{m.team1}</span>
                  </div>
                  <div className="text-center px-4">
                    <span className="text-gray-400 font-bold text-xl">VS</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 flex-1">
                    <TeamFlag teamName={m.team2} size={36} />
                    <span className="text-sm font-bold text-gray-900">{m.team2}</span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <p className="text-xs text-gray-500">📍 {m.venue}, {m.city}</p>
                  <Link to="/queue" className="text-xs text-blue-600 font-semibold hover:underline">Buy Tickets →</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VIP HOSPITALITY BANNER */}
      <section className="relative h-80 md:h-96 overflow-hidden">
        <img src={vipImg} alt="VIP Hospitality" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-transparent" />
        <div className="absolute inset-0 flex items-center px-6 md:px-16">
          <div className="max-w-lg">
            <p className="text-blue-400 text-xs font-semibold uppercase tracking-widest mb-2">Exclusive Experience</p>
            <h2 className="text-white text-3xl md:text-4xl font-black mb-3">VIP Hospitality &amp; Premium Seating</h2>
            <p className="text-gray-300 text-sm mb-6">Fine dining, private boxes, pitch-side seats, and unforgettable memories at the world's greatest tournament.</p>
            <div className="flex flex-wrap gap-3">
              <Link to="/hospitality" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-full text-sm transition-colors">View Hospitality</Link>
              <Link to="/vip" className="border-2 border-white text-white hover:bg-white hover:text-black font-bold px-6 py-3 rounded-full text-sm transition-colors">VIP Seats</Link>
            </div>
          </div>
        </div>
      </section>

      {/* HOST VENUES */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900">Host Countries &amp; Venues</h2>
              <p className="text-gray-500 text-sm mt-1">16 iconic venues across 3 nations</p>
            </div>
            <Link to="/venues" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold text-sm transition-colors">
              All Venues <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredVenues.map(v => (
              <Link key={v.id} to={`/venues/${v.id}`} className="group rounded-xl overflow-hidden shadow-md card-hover block">
                <div className="relative h-44 overflow-hidden">
                  <img src={v.image} alt={v.city} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <p className="text-white font-black text-lg leading-tight">{v.city.toUpperCase()}</p>
                    <p className="text-gray-300 text-xs">{v.country} · {v.matches} Matches</p>
                  </div>
                </div>
                <div className="bg-white p-3">
                  <p className="text-gray-600 text-xs font-medium truncate">{v.stadium}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* COUNTDOWN */}
      <section className="bg-[#0a1f5c] py-14 px-4 text-white text-center">
        <div className="max-w-4xl mx-auto">
          <Trophy size={40} className="mx-auto mb-4 text-yellow-400" />
          <h2 className="text-3xl md:text-4xl font-black mb-2">The World Awaits</h2>
          <p className="text-blue-200 mb-8 text-sm">Your journey to FIFA World Cup 2026™ starts here</p>
          <div className="flex justify-center gap-6 md:gap-10 text-center">
            {[
              { val: '48', label: 'Nations' },
              { val: '104', label: 'Days' },
              { val: '1M+', label: 'Fans Expected' },
              { val: 'From $110', label: 'Tickets from' },
            ].map(item => (
              <div key={item.label} className="bg-white/10 rounded-xl px-6 py-4 min-w-[80px]">
                <div className="text-3xl md:text-4xl font-black text-yellow-400">{item.val}</div>
                <div className="text-xs text-blue-200 mt-1 uppercase tracking-wide">{item.label}</div>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link to="/queue" className="bg-yellow-400 hover:bg-yellow-300 text-black font-black px-8 py-4 rounded-full text-sm uppercase tracking-wide transition-colors">
              Get Tickets Now
            </Link>
            <Link to="/tours" className="bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-4 rounded-full text-sm uppercase tracking-wide transition-colors border border-white/20">
              Explore Tours
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
