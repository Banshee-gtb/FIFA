import { useState } from 'react';
import { ShoppingCart, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { MERCHANDISE } from '@/constants/data';
import { useCart } from '@/hooks/useCart';
import { formatPrice } from '@/lib/utils';

const categories = ['All', 'Apparel', 'Team Gear', 'Collectibles', 'Accessories'];

export default function Merchandise() {
  const { addItem } = useCart();
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});

  const filtered = activeCategory === 'All' ? MERCHANDISE : MERCHANDISE.filter(m => m.category === activeCategory);

  function handleAddToCart(item: typeof MERCHANDISE[0]) {
    const size = selectedSizes[item.id];
    if (item.sizes && item.sizes.length > 0 && !size) {
      toast.error('Please select a size first.');
      return;
    }
    addItem({ id: `${item.id}-${size || 'one-size'}`, name: item.name, price: item.price, type: 'merch', size });
    toast.success(`${item.name} added to cart!`);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-black text-white py-14 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 to-transparent" />
        <div className="absolute -right-20 top-0 w-72 h-72 rounded-full bg-blue-600/20" />
        <div className="relative max-w-7xl mx-auto">
          <p className="text-blue-400 text-xs font-semibold uppercase tracking-widest mb-2">Official FIFA Store</p>
          <h1 className="text-4xl md:text-5xl font-black mb-2">FIFA World Cup 2026™ Store</h1>
          <p className="text-gray-300 max-w-lg text-sm">Official apparel, team gear, collectibles and more. Show your support for the world's greatest tournament.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Filter tabs */}
        <div className="flex items-center gap-2 mb-8 flex-wrap">
          <Filter size={16} className="text-gray-400" />
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${activeCategory === cat ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-400 hover:text-blue-600'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 mb-10">
          {filtered.map(item => (
            <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 card-hover flex flex-col">
              <div className="relative h-44 overflow-hidden bg-gray-100">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                {item.badge && (
                  <span className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                    {item.badge}
                  </span>
                )}
                {!item.inStock && (
                  <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                    <span className="text-gray-700 font-bold text-sm">Out of Stock</span>
                  </div>
                )}
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">{item.category}</p>
                <h3 className="text-sm font-bold text-gray-900 mb-2 leading-tight flex-1">{item.name}</h3>

                {/* Size selector */}
                {item.sizes && item.sizes.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {item.sizes.map(sz => (
                      <button
                        key={sz}
                        onClick={() => setSelectedSizes(prev => ({ ...prev, [item.id]: sz }))}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border transition-colors ${selectedSizes[item.id] === sz ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300 text-gray-500 hover:border-blue-400'}`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between mt-auto">
                  <span className="text-blue-600 font-black text-lg">{formatPrice(item.price)}</span>
                  <button
                    onClick={() => handleAddToCart(item)}
                    disabled={!item.inStock}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white p-2 rounded-full transition-colors"
                    aria-label="Add to cart"
                  >
                    <ShoppingCart size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Promo banner */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-black mb-2">Free Shipping on Orders Over $75</h3>
          <p className="text-blue-100 text-sm mb-4">Worldwide delivery available. Official FIFA licensed products only.</p>
          <span className="bg-yellow-400 text-black font-black px-6 py-2 rounded-full text-sm">Shop &amp; Save</span>
        </div>
      </div>
    </div>
  );
}
