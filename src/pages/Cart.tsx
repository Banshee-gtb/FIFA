import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingCart, ArrowRight } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { formatPrice } from '@/lib/utils';

const typeLabels: Record<string, string> = {
  ticket: '🎫 Match Ticket',
  hospitality: '⭐ Hospitality Package',
  vip: '👑 VIP Package',
  tour: '🗺️ Tour Package',
  merch: '🛍️ Merchandise',
};

export default function Cart() {
  const { items, totalPrice, totalItems, removeItem, updateQty } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-24 px-4">
        <ShoppingCart size={64} className="text-gray-300 mb-6" />
        <h2 className="text-2xl font-black text-gray-700 mb-2">Your cart is empty</h2>
        <p className="text-gray-400 text-sm mb-8">Start by selecting tickets, packages, or merchandise.</p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link to="/tickets" className="bg-blue-600 text-white font-bold px-6 py-3 rounded-full text-sm hover:bg-blue-700 transition-colors">Buy Tickets</Link>
          <Link to="/store" className="border-2 border-gray-200 text-gray-700 font-bold px-6 py-3 rounded-full text-sm hover:border-blue-400 transition-colors">Shop Merchandise</Link>
        </div>
      </div>
    );
  }

  const tax = totalPrice * 0.08;
  const total = totalPrice + tax;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-black text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-black">Your Cart</h1>
          <p className="text-gray-400 text-sm mt-1">{totalItems} item{totalItems !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(item => (
            <div key={`${item.id}-${item.size}`} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <span className="text-xs text-gray-500 font-medium">{typeLabels[item.type] || item.type}</span>
                  <h3 className="font-bold text-gray-900 text-sm mt-0.5">{item.name}</h3>
                  {item.size && <p className="text-xs text-gray-400 mt-0.5">Size: {item.size}</p>}
                </div>
                <div className="text-right">
                  <p className="font-black text-blue-600 text-lg">{formatPrice(item.price * item.quantity)}</p>
                  <p className="text-xs text-gray-400">{formatPrice(item.price)} each</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-3 bg-gray-100 rounded-full px-3 py-1.5">
                  <button
                    onClick={() => updateQty(item.id, item.quantity - 1, item.size)}
                    className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors"
                    aria-label="Decrease"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="font-bold text-sm w-5 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQty(item.id, item.quantity + 1, item.size)}
                    className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors"
                    aria-label="Increase"
                  >
                    <Plus size={12} />
                  </button>
                </div>
                <button
                  onClick={() => removeItem(item.id, item.size)}
                  className="flex items-center gap-1 text-red-500 hover:text-red-700 text-xs font-medium transition-colors"
                  aria-label="Remove"
                >
                  <Trash2 size={13} /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-fit sticky top-20">
          <h2 className="text-lg font-black text-gray-900 mb-5">Order Summary</h2>
          <div className="space-y-3 text-sm mb-5">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal ({totalItems} items)</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Processing Fee (8%)</span>
              <span>{formatPrice(tax)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span className="text-green-600 font-medium">FREE</span>
            </div>
            <div className="border-t border-gray-100 pt-3 flex justify-between font-black text-gray-900 text-lg">
              <span>Total</span>
              <span className="text-blue-600">{formatPrice(total)}</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-full text-sm uppercase tracking-wide transition-colors flex items-center justify-center gap-2"
          >
            Proceed to Checkout <ArrowRight size={16} />
          </button>

          <div className="mt-4 flex items-center justify-center gap-3">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/200px-Visa_Inc._logo.svg.png" alt="Visa" className="h-5 object-contain" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/200px-Mastercard-logo.svg.png" alt="Mastercard" className="h-5 object-contain" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/200px-PayPal.svg.png" alt="PayPal" className="h-5 object-contain" />
          </div>
          <p className="text-center text-xs text-gray-400 mt-2">Secure checkout · SSL encrypted</p>
        </div>
      </div>
    </div>
  );
}
