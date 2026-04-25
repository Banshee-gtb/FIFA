import { useState } from 'react';
import { Ticket, Check, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import { TICKET_CATEGORIES, MATCHES } from '@/constants/data';
import { useCart } from '@/hooks/useCart';
import { formatPrice, formatDate } from '@/lib/utils';

export default function Tickets() {
  const { addItem } = useCart();
  const [selectedMatch, setSelectedMatch] = useState('');
  const groupMatches = MATCHES.filter(m => m.stage === 'Group Stage');
  const knockoutMatches = MATCHES.filter(m => m.stage !== 'Group Stage');
  const standardTickets = TICKET_CATEGORIES.filter(t => t.type === 'standard');

  function handleAdd(ticket: typeof TICKET_CATEGORIES[0]) {
    addItem({
      id: `${ticket.id}-${selectedMatch || 'general'}`,
      name: `${ticket.name}${selectedMatch ? ` – Match #${selectedMatch}` : ''}`,
      price: ticket.price,
      type: 'ticket',
      matchId: selectedMatch,
    });
    toast.success(`${ticket.name} added to cart!`);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-black text-white py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/50 to-transparent" />
        <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-red-500 opacity-40 translate-y-1/2 -translate-x-1/4" />
        <div className="absolute bottom-0 left-6 w-28 h-28 rounded-full bg-yellow-400 opacity-40 translate-y-1/3" />
        <div className="relative max-w-7xl mx-auto">
          <p className="text-blue-400 text-xs font-semibold uppercase tracking-widest mb-2">Official Ticket Sales</p>
          <h1 className="text-4xl md:text-5xl font-black mb-2">FIFA World Cup 2026™ Tickets</h1>
          <p className="text-gray-300 max-w-xl">Secure your spot at the world's greatest sporting event. Choose your match, select your category, and experience history.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Phase Banner */}
        <div className="bg-blue-600 text-white rounded-xl p-6 mb-10 flex flex-col md:flex-row items-center gap-6">
          <div className="bg-white rounded-full w-14 h-14 flex items-center justify-center flex-shrink-0">
            <Ticket className="text-blue-600" size={24} />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-xl font-bold mb-1">Last-Minute Sales Phase — Now Open</h2>
            <p className="text-blue-100 text-sm">Secure your FIFA World Cup 2026™ tickets today, subject to availability. Limited seats remaining.</p>
          </div>
          <div className="bg-yellow-400 text-black font-black px-6 py-3 rounded-full text-sm uppercase tracking-wide whitespace-nowrap">
            Buy Now
          </div>
        </div>

        {/* Match Selector */}
        <div className="mb-10">
          <h2 className="text-xl font-black text-gray-900 mb-4">1. Select a Match (Optional)</h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <select
              value={selectedMatch}
              onChange={e => setSelectedMatch(e.target.value)}
              className="w-full text-sm border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">— General Admission (any match) —</option>
              <optgroup label="Group Stage">
                {groupMatches.map(m => (
                  <option key={m.id} value={m.id}>
                    Match #{m.matchNumber} · {m.team1} vs {m.team2} · {m.city} · {formatDate(m.date)}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Knockout Stage">
                {knockoutMatches.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.stage} · {m.city} · {formatDate(m.date)}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
        </div>

        {/* Ticket Categories */}
        <h2 className="text-xl font-black text-gray-900 mb-6">2. Select Your Ticket Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {standardTickets.map((ticket, i) => (
            <div key={ticket.id} className={`bg-white rounded-2xl shadow-md border-2 overflow-hidden card-hover ${i === 1 ? 'border-blue-500 relative' : 'border-gray-100'}`}>
              {i === 1 && (
                <div className="bg-blue-600 text-white text-xs font-bold text-center py-1.5 uppercase tracking-widest">Most Popular</div>
              )}
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-black text-gray-900">{ticket.name}</h3>
                    <p className="text-gray-500 text-sm mt-1">{ticket.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-blue-600">{formatPrice(ticket.price)}</div>
                    <div className="text-xs text-gray-400">per ticket</div>
                  </div>
                </div>
                <ul className="space-y-2 mb-6">
                  {ticket.includes.map(inc => (
                    <li key={inc} className="flex items-center gap-2 text-sm text-gray-700">
                      <Check size={14} className="text-green-500 flex-shrink-0" />
                      {inc}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleAdd(ticket)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-full transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <ShoppingCart size={16} />
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Marketplace Banner */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 flex flex-col md:flex-row items-center gap-6">
          <div className="bg-blue-100 rounded-full w-14 h-14 flex items-center justify-center flex-shrink-0">
            <Ticket className="text-blue-600" size={24} />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-lg font-bold text-gray-900">Marketplace — Resell &amp; Exchange</h3>
            <p className="text-gray-500 text-sm mt-1">Residents of most countries may resell tickets; Mexican residents can exchange.</p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-full text-sm transition-colors whitespace-nowrap">
            Resell / Exchange Now
          </button>
        </div>
      </div>
    </div>
  );
}
