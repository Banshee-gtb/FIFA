import { Check, ShoppingCart, Star } from 'lucide-react';
import { toast } from 'sonner';
import { TICKET_CATEGORIES, VENUES } from '@/constants/data';
import { useCart } from '@/hooks/useCart';
import { formatPrice } from '@/lib/utils';
import vipImg from '@/assets/vip-hospitality.jpg';

export default function Hospitality() {
  const { addItem } = useCart();
  const packages = TICKET_CATEGORIES.filter(t => t.type === 'hospitality');

  function handleAdd(pkg: typeof TICKET_CATEGORIES[0]) {
    addItem({ id: pkg.id, name: pkg.name, price: pkg.price, type: 'hospitality' });
    toast.success(`${pkg.name} added to cart!`);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="relative h-80 md:h-96 overflow-hidden">
        <img src={vipImg} alt="Hospitality" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        <div className="relative h-full flex items-center px-6 md:px-12 max-w-7xl mx-auto">
          <div>
            <p className="text-blue-400 text-xs font-semibold uppercase tracking-widest mb-2">Official Hospitality by On Location</p>
            <h1 className="text-white text-4xl md:text-5xl font-black mb-3">FIFA World Cup 2026™ Hospitality</h1>
            <p className="text-gray-200 max-w-lg text-sm">Elevate your World Cup experience with premium hospitality packages — exclusive lounges, gourmet dining, and the finest seats in the house.</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Tagline */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">YOUR JOURNEY TO FIFA WORLD CUP 2026™ STARTS HERE</h2>
          <p className="text-gray-500 text-sm max-w-2xl mx-auto">Experience the world's most prestigious football tournament in unparalleled style with official hospitality packages.</p>
        </div>

        {/* Packages */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-14">
          {packages.map((pkg, i) => (
            <div key={pkg.id} className={`bg-white rounded-2xl shadow-lg overflow-hidden border-2 card-hover ${i === 1 ? 'border-yellow-400' : 'border-gray-100'}`}>
              {i === 1 && (
                <div className="bg-yellow-400 text-black text-xs font-black text-center py-2 uppercase tracking-widest flex items-center justify-center gap-2">
                  <Star size={12} /> Premium Choice
                </div>
              )}
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-black text-gray-900">{pkg.name}</h3>
                    <p className="text-gray-500 text-sm mt-1 max-w-xs">{pkg.description}</p>
                  </div>
                  <div className="text-right bg-blue-50 rounded-xl px-4 py-3">
                    <div className="text-3xl font-black text-blue-600">{formatPrice(pkg.price)}</div>
                    <div className="text-xs text-gray-500">per person / per match</div>
                  </div>
                </div>
                <ul className="space-y-3 mb-8">
                  {pkg.includes.map(inc => (
                    <li key={inc} className="flex items-center gap-3 text-sm text-gray-700">
                      <span className="bg-green-100 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                        <Check size={12} className="text-green-600" />
                      </span>
                      {inc}
                    </li>
                  ))}
                </ul>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleAdd(pkg)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-full transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <ShoppingCart size={16} />
                    Add to Cart
                  </button>
                  <button className="border-2 border-gray-200 hover:border-blue-400 text-gray-700 font-bold py-3 px-5 rounded-full transition-colors text-sm">
                    Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Venue Series */}
        <div className="mb-10">
          <h2 className="text-2xl font-black text-gray-900 mb-2">Venue Series</h2>
          <p className="text-gray-500 text-sm mb-6">Choose your preferred host city for the ultimate hospitality experience.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {VENUES.map(v => (
              <div key={v.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 card-hover">
                <div className="relative h-32 overflow-hidden">
                  <img src={v.image} alt={v.city} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-2 left-3">
                    <p className="text-white font-black text-sm">{v.city.toUpperCase()}</p>
                    <p className="text-gray-300 text-xs">{v.matches} Matches</p>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-xs text-gray-500 font-medium truncate">{v.stadium}</p>
                  <p className="text-xs text-gray-400">{v.country}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ teaser */}
        <div className="bg-[#0a1f5c] rounded-2xl p-8 text-white text-center">
          <h3 className="text-xl font-black mb-2">Need Help Choosing a Package?</h3>
          <p className="text-blue-200 text-sm mb-4">Our hospitality team is here to help you find the perfect FIFA World Cup 2026™ experience.</p>
          <button className="bg-white text-blue-900 font-bold px-8 py-3 rounded-full text-sm hover:bg-blue-50 transition-colors">
            Contact Us
          </button>
        </div>
      </div>
    </div>
  );
}
