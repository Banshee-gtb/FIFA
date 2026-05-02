import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Download, Printer, QrCode, ChevronDown, ChevronUp } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import payoneerLogo from '@/assets/payoneer-logo.png';

interface OrderItem { name: string; quantity: number; price: number; type: string; }
interface StoredOrder {
  ref: string; firstName: string; lastName: string; email: string;
  items: OrderItem[]; total: number; payMethod: 'card' | 'paypal' | 'payoneer'; date: string;
}

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

function QRCodePlaceholder({ value }: { value: string }) {
  const pattern = value.split('').map(c => c.charCodeAt(0));
  const cells = Array.from({ length: 15 * 15 }, (_, i) => (pattern[i % pattern.length] + i) % 3 === 0);
  return (
    <div className="inline-grid gap-px bg-white p-2 border-2 border-black rounded" style={{ gridTemplateColumns: 'repeat(15, 1fr)' }}>
      {cells.map((filled, i) => (
        <div key={i} className={`w-2 h-2 ${filled ? 'bg-black' : 'bg-white'}`} />
      ))}
    </div>
  );
}

function TicketCard({ order, item, itemIndex }: { order: StoredOrder; item: OrderItem; itemIndex: number }) {
  const ticketId = `FWC26-${order.ref}-T${(itemIndex + 1).toString().padStart(2, '0')}`;
  return (
    <div id={`order-ticket-${order.ref}-${itemIndex}`} className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden shadow-lg">
      <div className="bg-[#0a1f5c] text-white px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="bg-yellow-400 rounded-full w-8 h-8 flex items-center justify-center">
            <span className="text-black font-black text-xs">26</span>
          </div>
          <div>
            <p className="font-black text-xs">FIFA World Cup 2026™</p>
            <p className="text-blue-300 text-[10px]">Official Ticket · {item.type.toUpperCase()}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-blue-300">Date</p>
          <p className="text-white text-xs font-bold">{order.date}</p>
        </div>
      </div>
      <div className="relative h-px bg-gray-200 mx-5">
        <div className="absolute -left-3 -top-2 w-4 h-4 rounded-full bg-gray-100 border-2 border-gray-200" />
        <div className="absolute -right-3 -top-2 w-4 h-4 rounded-full bg-gray-100 border-2 border-gray-200" />
      </div>
      <div className="px-5 py-4 grid grid-cols-3 gap-3">
        <div className="col-span-2">
          <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold mb-0.5">Event</p>
          <h3 className="font-black text-gray-900 text-sm leading-tight mb-3">{item.name}</h3>
          <div className="grid grid-cols-2 gap-2">
            <div><p className="text-[10px] text-gray-400 uppercase font-semibold">Holder</p><p className="text-xs font-bold text-gray-900">{order.firstName} {order.lastName}</p></div>
            <div><p className="text-[10px] text-gray-400 uppercase font-semibold">Qty</p><p className="text-xs font-bold text-gray-900">{item.quantity}×</p></div>
            <div><p className="text-[10px] text-gray-400 uppercase font-semibold">Ticket ID</p><p className="text-xs font-bold text-blue-600 font-mono">{ticketId}</p></div>
            <div><p className="text-[10px] text-gray-400 uppercase font-semibold">Paid</p><p className="text-xs font-bold text-gray-900">{formatPrice(item.price * item.quantity)}</p></div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center border-l-2 border-dashed border-gray-200 pl-3">
          <QRCodePlaceholder value={ticketId} />
          <p className="text-[8px] text-gray-400 mt-1 text-center font-mono break-all">{ticketId}</p>
        </div>
      </div>
      <div className="bg-gray-50 border-t border-gray-100 px-5 py-2 flex items-center justify-between">
        <p className="text-[10px] text-gray-400">11 June – 19 July 2026 · USA, Canada, Mexico</p>
        <div className="flex items-center gap-1.5">
          <img src="https://flagcdn.com/w20/us.png" alt="USA" className="h-3 rounded-sm" />
          <img src="https://flagcdn.com/w20/ca.png" alt="Canada" className="h-3 rounded-sm" />
          <img src="https://flagcdn.com/w20/mx.png" alt="Mexico" className="h-3 rounded-sm" />
        </div>
      </div>
    </div>
  );
}

function printOrderTicket(orderId: string, itemIndex: number) {
  const el = document.getElementById(`order-ticket-${orderId}-${itemIndex}`);
  if (!el) return;
  const win = window.open('', '_blank');
  if (!win) return;
  win.document.write(`<html><head><title>FIFA WC 2026 Ticket</title><style>body{font-family:system-ui,sans-serif;background:white;margin:0;padding:20px;}*{box-sizing:border-box;}@media print{body{padding:0;}}</style></head><body>${el.outerHTML}<script>window.onload=function(){window.print();window.close();}<\/script></body></html>`);
  win.document.close();
}

function PayMethodBadge({ method }: { method: StoredOrder['payMethod'] }) {
  if (method === 'card') return <div className="flex items-center gap-1"><VisaLogo className="h-4 w-auto" /><MastercardLogo className="h-5 w-auto" /></div>;
  if (method === 'paypal') return <PayPalLogo className="h-4 w-16" />;
  return <img src={payoneerLogo} alt="Payoneer" className="h-4 object-contain" />;
}

function OrderCard({ order }: { order: StoredOrder }) {
  const [expanded, setExpanded] = useState(false);
  const [activeTicket, setActiveTicket] = useState(0);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Order header */}
      <div className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide">Confirmed</span>
            <span className="text-xs text-gray-400">{order.date}</span>
          </div>
          <p className="text-xs text-gray-500 font-medium">Reference: <span className="font-black text-blue-600 font-mono">FWC26-{order.ref}</span></p>
          <p className="text-xs text-gray-400 mt-0.5">{order.email}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-gray-400">Total Paid</p>
            <p className="font-black text-gray-900 text-lg">{formatPrice(order.total)}</p>
          </div>
          <PayMethodBadge method={order.payMethod} />
        </div>
      </div>

      {/* Items summary */}
      <div className="px-5 pb-4 border-t border-gray-50 pt-4">
        <div className="space-y-2 mb-4">
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-medium capitalize">{item.type}</span>
                <span className="text-gray-700 font-medium truncate max-w-[200px]">{item.name}</span>
                <span className="text-gray-400 text-xs">×{item.quantity}</span>
              </div>
              <span className="font-semibold text-gray-800">{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs px-4 py-2 rounded-full transition-colors"
          >
            <QrCode size={13} />
            {expanded ? 'Hide Tickets' : 'View Tickets'}
            {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
        </div>
      </div>

      {/* Expanded tickets */}
      {expanded && (
        <div className="border-t border-gray-100 bg-gray-50 p-5">
          {order.items.length > 1 && (
            <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
              {order.items.map((item, i) => (
                <button key={i} onClick={() => setActiveTicket(i)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${activeTicket === i ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-400'}`}>
                  Ticket {i + 1}
                </button>
              ))}
            </div>
          )}
          <TicketCard order={order} item={order.items[activeTicket]} itemIndex={activeTicket} />
          <div className="flex gap-3 mt-4">
            <button onClick={() => printOrderTicket(order.ref, activeTicket)}
              className="flex items-center gap-1.5 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 font-semibold text-xs px-4 py-2.5 rounded-full transition-colors">
              <Printer size={13} /> Print
            </button>
            <button onClick={() => printOrderTicket(order.ref, activeTicket)}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2.5 rounded-full transition-colors">
              <Download size={13} /> Save as PDF
            </button>
          </div>
          <p className="text-[10px] text-gray-400 mt-2">Print dialog → "Save as PDF" to download your ticket.</p>
        </div>
      )}
    </div>
  );
}

export default function Orders() {
  const [orders, setOrders] = useState<StoredOrder[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('fwc26_orders');
    if (stored) {
      const parsed = JSON.parse(stored) as StoredOrder[];
      setOrders(parsed.reverse()); // newest first
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-black text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-blue-400 text-xs font-semibold uppercase tracking-widest mb-2">FIFA World Cup 2026™</p>
          <h1 className="text-3xl font-black">My Orders</h1>
          <p className="text-gray-400 text-sm mt-1">{orders.length} order{orders.length !== 1 ? 's' : ''} found</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        {orders.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag size={56} className="mx-auto text-gray-200 mb-5" />
            <h2 className="text-xl font-black text-gray-600 mb-2">No orders yet</h2>
            <p className="text-gray-400 text-sm mb-8">Your confirmed bookings will appear here after checkout.</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link to="/tickets" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-full text-sm transition-colors">Buy Tickets</Link>
              <Link to="/hospitality" className="border-2 border-gray-200 text-gray-700 font-bold px-6 py-3 rounded-full text-sm hover:border-blue-400 transition-colors">Hospitality</Link>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map(order => (
              <OrderCard key={order.ref} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
