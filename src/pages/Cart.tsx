import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingCart, ArrowRight, Lock } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useCurrency } from '@/contexts/CurrencyContext';
import payoneerLogo from '@/assets/payoneer-logo.png';

// Inline SVG logos (same as Checkout)
function VisaLogo({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 780 500" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="780" height="500" rx="40" fill="#1A1F71" />
      <path d="M293.2 348.7L321.4 151.3H366.3L338.1 348.7H293.2Z" fill="white" />
      <path d="M524.3 155.1C514.9 151.5 500 147.6 481.6 147.6C437.2 147.6 405.7 170.6 405.5 203.7C405.2 228.5 428.8 242.3 446.6 250.7C464.8 259.3 470.9 264.7 470.8 272.3C470.7 284 456.3 289.2 442.9 289.2C424.1 289.2 414.1 286.4 398.5 279.6L392.5 276.8L386 316.1C397.2 321.3 417.9 325.8 439.4 326C486.6 326 517.6 303.3 517.9 268.1C518.1 248.6 505.9 233.5 479.3 221.1C462.9 213 452.8 207.7 452.9 199.6C452.9 192.4 461.5 184.7 480.3 184.7C496.2 184.4 507.8 187.9 517 191.9L521.5 194L527.9 156.1L524.3 155.1Z" fill="white" />
      <path d="M633.7 151.3H599.4C588.6 151.3 580.6 154.3 575.9 165.5L509.5 348.7H556.6C556.6 348.7 564.2 327.6 566 322.7C571.1 322.7 617 322.8 623.6 322.8C625 328.8 629.4 348.7 629.4 348.7H671L633.7 151.3ZM578.9 288.1C582.7 278.1 597.4 238.4 597.4 238.4C597.1 238.9 601.2 228.4 603.6 221.9L606.8 236.7C606.8 236.7 616 281.5 618 288.1H578.9Z" fill="white" />
      <path d="M249.1 151.3L205.1 275.3L200.6 252.8C192.8 227 169 199.2 142.4 185.3L183.3 348.5H230.8L305.8 151.3H249.1Z" fill="white" />
      <path d="M168.5 151.3H93.9L93.2 155.1C151.5 169.8 190.9 203.8 207.1 245.5L190.5 166C187.6 154.9 179.8 151.7 168.5 151.3Z" fill="#FAA61A" />
    </svg>
  );
}

function MastercardLogo({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 780 500" xmlns="http://www.w3.org/2000/svg">
      <rect width="780" height="500" rx="40" fill="white" />
      <circle cx="305" cy="250" r="150" fill="#EB001B" />
      <circle cx="475" cy="250" r="150" fill="#F79E1B" />
      <path d="M390 145.7C420.5 170.4 441 207.9 441 250C441 292.1 420.5 329.6 390 354.3C359.5 329.6 339 292.1 339 250C339 207.9 359.5 170.4 390 145.7Z" fill="#FF5F00" />
    </svg>
  );
}

function PayPalLogo({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 124 33" xmlns="http://www.w3.org/2000/svg">
      <path d="M46.2 10.9c-.5-3.5-3.5-5.4-7.4-5.4H28.3c-.7 0-1.4.5-1.5 1.2L22.9 33.6c-.1.5.3 1 .8 1h5.6l1.4-8.9-.04.27c.12-.71.73-1.27 1.46-1.27h3.04c5.96 0 10.63-2.42 11.99-9.42.04-.2.07-.39.1-.58" fill="#009cde" />
      <path d="M46.3 11.47c-.04.19-.07.38-.1.58-1.36 7-6.03 9.42-11.99 9.42H31.17c-.73 0-1.34.56-1.46 1.27L28.01 33H22.42c-.5 0-.86-.48-.78-.97l.01-.07L25.9 7.3c.11-.68.7-1.18 1.39-1.18h9.69c3.94 0 7.3 2.43 7.69 5.84.03.16.04.33.04.51" fill="#012169" />
      <path d="M47.98 5.52H37.86c-.74 0-1.36.54-1.48 1.27L32.62 28.5c-.08.5.3.96.8.96h5.26l1.32-8.36c.12-.73.74-1.27 1.48-1.27H44.3c6.04 0 9.52-2.92 10.44-8.7.52-3.17-.02-5.65-1.81-7.37-1-.96-2.44-1.74-4.95-1.74" fill="#003087" />
    </svg>
  );
}

const typeLabels: Record<string, string> = {
  ticket: '🎫 Match Ticket',
  hospitality: '⭐ Hospitality Package',
  vip: '👑 VIP Package',
  tour: '🗺️ Tour Package',
  merch: '🛍️ Merchandise',
};

export default function Cart() {
  const { items, totalPrice, totalItems, removeItem, updateQty } = useCart();
  const { format } = useCurrency();
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
                  <p className="font-black text-blue-600 text-lg">{format(item.price * item.quantity)}</p>
                  <p className="text-xs text-gray-400">{format(item.price)} each</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-3 bg-gray-100 rounded-full px-3 py-1.5">
                  <button onClick={() => updateQty(item.id, item.quantity - 1, item.size)}
                    className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors" aria-label="Decrease">
                    <Minus size={12} />
                  </button>
                  <span className="font-bold text-sm w-5 text-center">{item.quantity}</span>
                  <button onClick={() => updateQty(item.id, item.quantity + 1, item.size)}
                    className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors" aria-label="Increase">
                    <Plus size={12} />
                  </button>
                </div>
                <button onClick={() => removeItem(item.id, item.size)}
                  className="flex items-center gap-1 text-red-500 hover:text-red-700 text-xs font-medium transition-colors" aria-label="Remove">
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
              <span>{format(totalPrice)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Processing Fee (8%)</span>
              <span>{format(tax)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span className="text-green-600 font-medium">FREE</span>
            </div>
            <div className="border-t border-gray-100 pt-3 flex justify-between font-black text-gray-900 text-lg">
              <span>Total</span>
              <span className="text-blue-600">{format(total)}</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-full text-sm uppercase tracking-wide transition-colors flex items-center justify-center gap-2"
          >
            Proceed to Checkout <ArrowRight size={16} />
          </button>

          {/* Payment logos */}
          <div className="mt-5 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400 text-center mb-3 font-medium">Accepted Payments</p>
            <div className="flex items-center justify-center flex-wrap gap-3">
              <VisaLogo className="h-5 w-auto" />
              <MastercardLogo className="h-6 w-auto" />
              <PayPalLogo className="h-4 w-20" />
              <img src={payoneerLogo} alt="Payoneer" className="h-4 object-contain" />
            </div>
            <div className="flex items-center justify-center gap-1.5 mt-3">
              <Lock size={11} className="text-green-500" />
              <p className="text-center text-[10px] text-gray-400">Secure checkout · 256-bit SSL encrypted</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
