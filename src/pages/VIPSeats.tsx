import { Check, ShoppingCart, Crown } from 'lucide-react';
import { toast } from 'sonner';
import { TICKET_CATEGORIES } from '@/constants/data';
import { useCart } from '@/hooks/useCart';
import { formatPrice } from '@/lib/utils';
import vipImg from '@/assets/vip-hospitality.jpg';

export default function VIPSeats() {
  const { addItem } = useCart();
  const vipPackages = TICKET_CATEGORIES.filter(t => t.type === 'vip');

  function handleAdd(pkg: typeof TICKET_CATEGORIES[0]) {
    addItem({ id: pkg.id, name: pkg.name, price: pkg.price, type: 'vip' });
    toast.success(`${pkg.name} added to cart!`);
  }

  const features = [
    { title: 'Private Boxes', desc: 'Exclusive luxury suites for up to 10 guests with dedicated butler service and panoramic pitch views.' },
    { title: 'Pitch-Side Access', desc: 'Unprecedented proximity to the action with pitch-level Category A seats and pre-match pitch walks.' },
    { title: 'Player Meet & Greet', desc: 'Exclusive opportunities to meet FIFA World Cup legends and official ambassadors.' },
    { title: 'Champagne Service', desc: 'Premium beverage packages including fine wines, champagne, and bespoke cocktails throughout.' },
    { title: 'VIP Parking', desc: 'Reserved priority parking directly adjacent to the stadium entrance for all VIP guests.' },
    { title: 'Official Memorabilia', desc: 'Exclusive signed mementos and limited-edition FIFA World Cup 2026™ official gifts.' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="relative h-72 md:h-[420px] overflow-hidden">
        <img src={vipImg} alt="VIP Seats" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
        <div className="relative h-full flex items-center px-6 md:px-12 max-w-7xl mx-auto">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Crown size={20} className="text-yellow-400" />
              <p className="text-yellow-400 text-xs font-semibold uppercase tracking-widest">Exclusive VIP Experience</p>
            </div>
            <h1 className="text-white text-4xl md:text-6xl font-black mb-3">VIP &amp; Premium Seats</h1>
            <p className="text-gray-200 max-w-lg text-sm">The ultimate way to witness FIFA World Cup 2026™. Private boxes, pitch-side seating, and luxury that goes beyond the game.</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* VIP Packages */}
        <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-8 text-center">Choose Your VIP Experience</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {vipPackages.map((pkg, i) => (
            <div key={pkg.id} className={`rounded-2xl overflow-hidden shadow-xl card-hover border-2 ${i === 0 ? 'border-yellow-400' : 'border-gray-200'}`}>
              <div className={`p-1 ${i === 0 ? 'bg-yellow-400' : 'bg-gray-800'}`}>
                <div className="text-center text-xs font-black py-1 uppercase tracking-widest text-black">
                  {i === 0 ? '★ Most Exclusive' : 'Premium Selection'}
                </div>
              </div>
              <div className="bg-white p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-black text-gray-900">{pkg.name}</h3>
                    <p className="text-gray-500 text-sm mt-1 max-w-xs">{pkg.description}</p>
                  </div>
                  <div className="text-right bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3">
                    <div className="text-3xl font-black text-yellow-600">{formatPrice(pkg.price)}</div>
                    <div className="text-xs text-gray-500">per person</div>
                  </div>
                </div>
                <ul className="space-y-3 mb-8">
                  {pkg.includes.map(inc => (
                    <li key={inc} className="flex items-center gap-3 text-sm text-gray-700">
                      <span className="bg-yellow-100 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                        <Crown size={10} className="text-yellow-600" />
                      </span>
                      {inc}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleAdd(pkg)}
                  className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-black py-4 rounded-full transition-colors flex items-center justify-center gap-2 text-sm uppercase tracking-wide"
                >
                  <ShoppingCart size={16} />
                  Book VIP Package
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* VIP Features grid */}
        <div className="bg-[#0a1f5c] rounded-2xl p-8 md:p-12 mb-12">
          <h2 className="text-white text-2xl font-black text-center mb-8">What's Included in Every VIP Package</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(f => (
              <div key={f.title} className="bg-white/10 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Check size={16} className="text-yellow-400 flex-shrink-0" />
                  <h4 className="text-white font-bold text-sm">{f.title}</h4>
                </div>
                <p className="text-blue-200 text-xs leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-white rounded-2xl shadow-md border border-gray-100 p-10">
          <Crown size={40} className="text-yellow-400 mx-auto mb-4" />
          <h3 className="text-2xl font-black text-gray-900 mb-2">Reserve Your Seat Among Legends</h3>
          <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">Limited VIP allocations available. Secure your place at the world's greatest football spectacle.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => { addItem({ id: 'vip-box', name: 'VIP Private Box', price: 4500, type: 'vip' }); toast.success('VIP Private Box added to cart!'); }}
              className="bg-yellow-400 hover:bg-yellow-300 text-black font-black px-8 py-4 rounded-full text-sm uppercase tracking-wide transition-colors"
            >
              Book Private Box
            </button>
            <button className="border-2 border-gray-200 hover:border-blue-400 text-gray-700 font-bold px-8 py-4 rounded-full text-sm transition-colors">
              Request Custom Package
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
