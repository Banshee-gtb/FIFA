import { Check, ShoppingCart, MapPin, Clock, Users } from 'lucide-react';
import { toast } from 'sonner';
import { TICKET_CATEGORIES } from '@/constants/data';
import { useCart } from '@/hooks/useCart';
import { formatPrice } from '@/lib/utils';

const tourHighlights = [
  { icon: MapPin, title: 'Expert Local Guides', desc: 'Certified FIFA-approved guides with deep local knowledge and football expertise.' },
  { icon: Clock, title: 'Flexible Schedules', desc: 'Choose from half-day, full-day, and multi-day tour packages around your match schedule.' },
  { icon: Users, title: 'Small Groups', desc: 'Intimate group sizes (max 12 people) for a personal and immersive experience.' },
];

const itinerary = {
  'tour-city': ['Morning: Hotel pickup & city overview', 'Visit iconic landmarks & fan zones', 'Local lunch at authentic restaurant', 'Stadium exterior photo opportunity', 'Pre-match fan zone experience', 'Match attendance (Cat 2 seat)', 'Evening: Hotel return transfer'],
  'tour-stadium': ['VIP entrance to stadium complex', 'Changing room & dressing room access', 'Players\' tunnel walkout experience', 'Pitch-side photography session', 'Press conference room visit', 'Trophy replica photo opportunity', 'Official stadium guide throughout'],
  'tour-full': ['Day 1: Arrival & city orientation tour', 'Day 1: Welcome dinner & fan zone', 'Day 2: Match Day – Cat 1 seats', 'Day 2: Post-match celebration', 'Day 3: Stadium insider tour', 'Day 3: Local experience & departure', 'All transfers, hotel & meals included'],
};

export default function TourGuide() {
  const { addItem } = useCart();
  const tours = TICKET_CATEGORIES.filter(t => t.type === 'tour');

  function handleAdd(tour: typeof TICKET_CATEGORIES[0]) {
    addItem({ id: tour.id, name: tour.name, price: tour.price, type: 'tour' });
    toast.success(`${tour.name} added to cart!`);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-black text-white py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1400&fit=crop)', backgroundSize: 'cover' }} />
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative max-w-7xl mx-auto">
          <p className="text-blue-400 text-xs font-semibold uppercase tracking-widest mb-2">Official FIFA World Cup 2026™</p>
          <h1 className="text-4xl md:text-5xl font-black mb-3">Tour Guide &amp; Experiences</h1>
          <p className="text-gray-300 max-w-xl text-sm">Explore host cities, go behind the scenes of iconic stadiums, and live the full World Cup journey with our expert-guided packages.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Why choose */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          {tourHighlights.map(h => (
            <div key={h.title} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <h.icon size={22} className="text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{h.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{h.desc}</p>
            </div>
          ))}
        </div>

        {/* Tour packages */}
        <h2 className="text-2xl font-black text-gray-900 mb-6">Choose Your Tour Package</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {tours.map((tour, i) => (
            <div key={tour.id} className={`bg-white rounded-2xl shadow-md overflow-hidden card-hover border-2 ${i === 2 ? 'border-blue-500 relative' : 'border-gray-100'}`}>
              {i === 2 && (
                <div className="bg-blue-600 text-white text-xs font-bold text-center py-1.5 uppercase tracking-widest">Best Value</div>
              )}
              <div className="p-6">
                <h3 className="text-lg font-black text-gray-900 mb-1">{tour.name}</h3>
                <p className="text-gray-500 text-sm mb-4 leading-relaxed">{tour.description}</p>
                <div className="text-3xl font-black text-blue-600 mb-4">{formatPrice(tour.price)}<span className="text-sm font-normal text-gray-400"> /person</span></div>

                {/* Itinerary */}
                <div className="bg-gray-50 rounded-xl p-4 mb-5">
                  <p className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">What's Included:</p>
                  <ul className="space-y-1.5">
                    {(itinerary[tour.id as keyof typeof itinerary] || tour.includes).map((item: string) => (
                      <li key={item} className="flex items-start gap-2 text-xs text-gray-600">
                        <Check size={12} className="text-green-500 mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => handleAdd(tour)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-full transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <ShoppingCart size={15} />
                  Book This Tour
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Cities section */}
        <div className="bg-[#0a1f5c] rounded-2xl p-8 text-white">
          <h2 className="text-xl font-black mb-2">Available in All 16 Host Cities</h2>
          <p className="text-blue-200 text-sm mb-6">Our tours operate across all host cities in USA, Canada and Mexico.</p>
          <div className="flex flex-wrap gap-2">
            {['New York/NJ', 'Los Angeles', 'Dallas', 'Miami', 'Seattle', 'San Francisco', 'Boston', 'Kansas City', 'Houston', 'Philadelphia', 'Atlanta', 'Vancouver', 'Toronto', 'Guadalajara', 'Mexico City', 'Monterrey'].map(city => (
              <span key={city} className="bg-white/10 hover:bg-white/20 transition-colors text-white text-xs font-medium px-3 py-1.5 rounded-full cursor-pointer">
                {city}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
