import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Check, Lock, CreditCard, Download, Printer, QrCode } from 'lucide-react';
import { toast } from 'sonner';
import { useCart } from '@/hooks/useCart';
import { useCurrency } from '@/contexts/CurrencyContext';
import { formatPrice } from '@/lib/utils';
import payoneerLogo from '@/assets/payoneer-logo.png';

type Step = 'details' | 'payment' | 'confirmation';
type PayMethod = 'card' | 'paypal' | 'payoneer';

interface OrderData {
  ref: string;
  firstName: string;
  lastName: string;
  email: string;
  items: Array<{ name: string; quantity: number; price: number; type: string }>;
  total: number;
  payMethod: PayMethod;
  date: string;
}

// ─── Payment method icons (real SVG logos inline) ───────────────────────────
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

// ─── QR Code placeholder ─────────────────────────────────────────────────────
function QRCodePlaceholder({ value }: { value: string }) {
  // Simple visual QR placeholder using CSS grid
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

// ─── Ticket Card component (for PDF-style download) ──────────────────────────
function TicketCard({ order, itemIndex }: { order: OrderData; itemIndex: number }) {
  const item = order.items[itemIndex];
  const ticketId = `FWC26-${order.ref}-T${(itemIndex + 1).toString().padStart(2, '0')}`;

  return (
    <div id={`ticket-${itemIndex}`} className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden max-w-2xl mx-auto shadow-lg print:shadow-none print:border-gray-400">
      {/* Header strip */}
      <div className="bg-[#0a1f5c] text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-yellow-400 rounded-full w-10 h-10 flex items-center justify-center">
            <span className="text-black font-black text-xs">26</span>
          </div>
          <div>
            <p className="font-black text-sm">FIFA World Cup 2026™</p>
            <p className="text-blue-300 text-xs">Official Ticket · {item.type.toUpperCase()}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-blue-300">Date</p>
          <p className="text-white text-sm font-bold">{order.date}</p>
        </div>
      </div>

      {/* Perforated line */}
      <div className="relative h-px bg-gray-200 mx-6">
        <div className="absolute -left-4 -top-2.5 w-5 h-5 rounded-full bg-gray-100 border-2 border-gray-200" />
        <div className="absolute -right-4 -top-2.5 w-5 h-5 rounded-full bg-gray-100 border-2 border-gray-200" />
      </div>

      {/* Body */}
      <div className="px-6 py-5 grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1">Event</p>
          <h3 className="font-black text-gray-900 text-lg leading-tight mb-4">{item.name}</h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">Holder</p>
              <p className="text-sm font-bold text-gray-900">{order.firstName} {order.lastName}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">Quantity</p>
              <p className="text-sm font-bold text-gray-900">{item.quantity} × Ticket{item.quantity > 1 ? 's' : ''}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">Ticket ID</p>
              <p className="text-sm font-bold text-blue-600 font-mono">{ticketId}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">Price Paid</p>
              <p className="text-sm font-bold text-gray-900">{formatPrice(item.price * item.quantity)}</p>
            </div>
          </div>

          <div className="mt-4 bg-blue-50 rounded-lg px-3 py-2">
            <p className="text-xs text-blue-600 font-semibold">⚠️ Fan ID Required at Entry · Valid Government ID Must Match Ticket Name</p>
          </div>
        </div>

        {/* QR Code side */}
        <div className="flex flex-col items-center justify-center border-l-2 border-dashed border-gray-200 pl-4">
          <QRCodePlaceholder value={ticketId} />
          <p className="text-[9px] text-gray-400 mt-2 text-center font-mono break-all">{ticketId}</p>
        </div>
      </div>

      {/* Footer strip */}
      <div className="bg-gray-50 border-t border-gray-100 px-6 py-3 flex items-center justify-between">
        <p className="text-xs text-gray-400">11 June – 19 July 2026 · USA, Canada, Mexico</p>
        <div className="flex items-center gap-2">
          <img src="https://flagcdn.com/w20/us.png" alt="USA" className="h-3 rounded-sm" />
          <img src="https://flagcdn.com/w20/ca.png" alt="Canada" className="h-3 rounded-sm" />
          <img src="https://flagcdn.com/w20/mx.png" alt="Mexico" className="h-3 rounded-sm" />
        </div>
      </div>
    </div>
  );
}

// ─── Print ticket handler ─────────────────────────────────────────────────────
function printTicket(index: number) {
  const el = document.getElementById(`ticket-${index}`);
  if (!el) return;
  const win = window.open('', '_blank');
  if (!win) return;
  win.document.write(`
    <html>
      <head>
        <title>FIFA World Cup 2026™ Ticket</title>
        <style>
          body { font-family: system-ui, sans-serif; background: white; margin: 0; padding: 20px; }
          * { box-sizing: border-box; }
          @media print { body { padding: 0; } }
        </style>
      </head>
      <body>
        ${el.outerHTML}
        <script>window.onload = function(){ window.print(); window.close(); }<\/script>
      </body>
    </html>
  `);
  win.document.close();
}

// ─── Confirmation screen ──────────────────────────────────────────────────────
function ConfirmationScreen({ order }: { order: OrderData }) {
  const [activeTicket, setActiveTicket] = useState(0);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Success banner */}
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center mb-8">
          <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5">
            <Check size={36} className="text-green-600" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-1">Booking Confirmed!</h1>
          <p className="text-gray-500 text-sm mb-1">Thank you, <strong>{order.firstName}</strong>! A confirmation has been sent to <strong>{order.email}</strong>.</p>

          <div className="bg-blue-50 rounded-xl px-5 py-4 mt-4 inline-block">
            <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">Order Reference</p>
            <p className="font-black text-blue-600 text-xl font-mono">FWC26-{order.ref}</p>
          </div>

          <div className="mt-5 flex items-center justify-center gap-3">
            <span className="text-xs text-gray-400">Paid via</span>
            {order.payMethod === 'card' && (
              <div className="flex items-center gap-1">
                <VisaLogo className="h-5 w-auto" />
                <span className="text-xs text-gray-500">/ Card</span>
              </div>
            )}
            {order.payMethod === 'paypal' && <PayPalLogo className="h-5 w-auto" />}
            {order.payMethod === 'payoneer' && (
              <img src={payoneerLogo} alt="Payoneer" className="h-5 object-contain" />
            )}
          </div>
        </div>

        {/* Tickets section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
              <QrCode size={20} className="text-blue-600" /> Your Tickets
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => printTicket(activeTicket)}
                className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs px-3 py-2 rounded-full transition-colors"
              >
                <Printer size={13} /> Print Ticket
              </button>
              <button
                onClick={() => printTicket(activeTicket)}
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-3 py-2 rounded-full transition-colors"
              >
                <Download size={13} /> Save as PDF
              </button>
            </div>
          </div>

          {/* Ticket tabs if multiple items */}
          {order.items.length > 1 && (
            <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
              {order.items.map((item, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTicket(i)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${activeTicket === i ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-400'}`}
                >
                  Ticket {i + 1}: {item.name.slice(0, 20)}{item.name.length > 20 ? '…' : ''}
                </button>
              ))}
            </div>
          )}

          <TicketCard order={order} itemIndex={activeTicket} />

          <p className="text-center text-xs text-gray-400 mt-3">
            Click "Save as PDF" → your browser's print dialog → "Save as PDF" to download.
          </p>
        </div>

        {/* Payoneer info note */}
        {order.payMethod === 'payoneer' && (
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5 mb-6 flex gap-3">
            <img src={payoneerLogo} alt="Payoneer" className="h-8 object-contain flex-shrink-0" />
            <div>
              <h4 className="font-bold text-orange-800 text-sm mb-1">Payoneer Payment Instructions</h4>
              <p className="text-orange-700 text-xs leading-relaxed">
                Send your payment to our Payoneer account. Use your order reference <strong>FWC26-{order.ref}</strong> as the payment note. Once confirmed, your tickets will be activated within 24 hours. For assistance, contact us at <a href="mailto:tickets@fifa2026experience.com" className="underline font-semibold">tickets@fifa2026experience.com</a>.
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-3 justify-center">
          <Link to="/" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-full text-sm transition-colors">
            Back to Home
          </Link>
          <Link to="/fan-id" className="border-2 border-gray-200 text-gray-700 hover:border-blue-400 font-bold px-6 py-3 rounded-full text-sm transition-colors">
            Register Fan ID
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Main Checkout ────────────────────────────────────────────────────────────
export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const { format } = useCurrency();
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>('details');
  const [payMethod, setPayMethod] = useState<PayMethod>('card');
  const [processing, setProcessing] = useState(false);
  const [order, setOrder] = useState<OrderData | null>(null);

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', country: '', zip: '',
    cardName: '', cardNumber: '', expiry: '', cvv: '',
    paypalEmail: '',
    payoneerEmail: '',
  });

  const tax = totalPrice * 0.08;
  const total = totalPrice + tax;

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleNextStep() {
    if (step === 'details') {
      if (!form.firstName || !form.lastName || !form.email) {
        toast.error('Please fill in all required fields.');
        return;
      }
      setStep('payment');
    } else if (step === 'payment') {
      if (payMethod === 'card') {
        if (!form.cardNumber || !form.expiry || !form.cvv || !form.cardName) {
          toast.error('Please complete your card details.');
          return;
        }
      } else if (payMethod === 'paypal') {
        if (!form.paypalEmail) {
          toast.error('Please enter your PayPal email.');
          return;
        }
      } else if (payMethod === 'payoneer') {
        if (!form.payoneerEmail) {
          toast.error('Please enter your Payoneer email.');
          return;
        }
      }

      setProcessing(true);
      setTimeout(() => {
        setProcessing(false);
        const ref = Math.random().toString(36).substring(2, 9).toUpperCase();
        const newOrder: OrderData = {
          ref,
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          items: items.map(i => ({ name: i.name, quantity: i.quantity, price: i.price, type: i.type })),
          total,
          payMethod,
          date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
        };
        // Save order to localStorage
        const existing = JSON.parse(localStorage.getItem('fwc26_orders') || '[]');
        existing.push(newOrder);
        localStorage.setItem('fwc26_orders', JSON.stringify(existing));
        setOrder(newOrder);
        clearCart();
        setStep('confirmation');
      }, 2200);
    }
  }

  if (step === 'confirmation' && order) {
    return <ConfirmationScreen order={order} />;
  }

  const steps = [
    { key: 'details', label: 'Your Details' },
    { key: 'payment', label: 'Payment' },
    { key: 'confirmation', label: 'Confirmation' },
  ];

  const payMethods: { key: PayMethod; label: string; subtitle: string }[] = [
    { key: 'card', label: 'Credit / Debit Card', subtitle: 'Visa, Mastercard accepted' },
    { key: 'paypal', label: 'PayPal', subtitle: 'Pay securely with PayPal' },
    { key: 'payoneer', label: 'Payoneer', subtitle: 'Pay from 200+ countries worldwide' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-black text-white py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-black mb-4">Secure Checkout</h1>
          <div className="flex items-center gap-3">
            {steps.map((s, i) => (
              <div key={s.key} className="flex items-center gap-3">
                <div className={`flex items-center gap-2 ${step === s.key ? 'text-white' : (step === 'payment' && s.key === 'details') ? 'text-green-400' : 'text-gray-500'}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step === s.key ? 'bg-blue-600' : (step === 'payment' && s.key === 'details') ? 'bg-green-500' : 'bg-gray-700'}`}>
                    {(step === 'payment' && s.key === 'details') ? <Check size={12} /> : i + 1}
                  </div>
                  <span className="text-sm hidden sm:block">{s.label}</span>
                </div>
                {i < steps.length - 1 && <div className="w-8 h-px bg-gray-600" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">

          {/* ── STEP 1: Details ── */}
          {step === 'details' && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-black mb-5">Personal Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { name: 'firstName', label: 'First Name *', type: 'text', placeholder: 'John' },
                  { name: 'lastName', label: 'Last Name *', type: 'text', placeholder: 'Doe' },
                  { name: 'email', label: 'Email Address *', type: 'email', placeholder: 'john@example.com' },
                  { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+1 234 567 8900' },
                  { name: 'address', label: 'Address', type: 'text', placeholder: '123 Main Street' },
                  { name: 'city', label: 'City', type: 'text', placeholder: 'New York' },
                  { name: 'zip', label: 'Postal Code', type: 'text', placeholder: '10001' },
                ].map(f => (
                  <div key={f.name} className={f.name === 'address' ? 'sm:col-span-2' : ''}>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">{f.label}</label>
                    <input
                      name={f.name}
                      type={f.type}
                      placeholder={f.placeholder}
                      value={form[f.name as keyof typeof form]}
                      onChange={handleChange}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Country</label>
                  <select name="country" value={form.country} onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                    <option value="">Select country</option>
                    {['United States','Canada','Mexico','United Kingdom','Germany','France','Brazil','Argentina','Japan','Australia','Spain','Italy','Netherlands','Portugal','South Korea','Saudi Arabia','Nigeria','Ghana','Morocco','South Africa','Other'].map(c => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 2: Payment ── */}
          {step === 'payment' && (
            <div className="space-y-4">
              {/* Payment method selector */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <Lock size={15} className="text-green-500" />
                  <h2 className="text-lg font-black">Secure Payment</h2>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-5 text-xs text-blue-700 font-medium flex items-center gap-2">
                  <Lock size={13} className="text-blue-500" />
                  256-bit SSL encrypted · Your payment data is fully protected.
                </div>

                {/* Method tabs */}
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Choose Payment Method</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
                  {payMethods.map(m => (
                    <button
                      key={m.key}
                      onClick={() => setPayMethod(m.key)}
                      className={`p-3 rounded-xl border-2 text-left transition-all ${payMethod === m.key ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      <div className="mb-2 h-8 flex items-center">
                        {m.key === 'card' && (
                          <div className="flex items-center gap-1.5">
                            <VisaLogo className="h-5 w-auto" />
                            <MastercardLogo className="h-6 w-auto" />
                          </div>
                        )}
                        {m.key === 'paypal' && <PayPalLogo className="h-5 w-20" />}
                        {m.key === 'payoneer' && (
                          <img src={payoneerLogo} alt="Payoneer" className="h-6 object-contain max-w-[80px]" />
                        )}
                      </div>
                      <p className="text-xs font-bold text-gray-800">{m.label}</p>
                      <p className="text-[10px] text-gray-400">{m.subtitle}</p>
                      {payMethod === m.key && (
                        <div className="mt-1.5 w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center">
                          <Check size={9} className="text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                {/* Card form */}
                {payMethod === 'card' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Name on Card *</label>
                      <input name="cardName" placeholder="John Doe" value={form.cardName} onChange={handleChange}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Card Number *</label>
                      <div className="relative">
                        <input name="cardNumber" placeholder="1234 5678 9012 3456" value={form.cardNumber} onChange={handleChange} maxLength={19}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 pr-20 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                          <VisaLogo className="h-4 w-auto opacity-70" />
                          <MastercardLogo className="h-4 w-auto opacity-70" />
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Expiry Date *</label>
                        <input name="expiry" placeholder="MM/YY" value={form.expiry} onChange={handleChange} maxLength={5}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">CVV *</label>
                        <input name="cvv" placeholder="123" value={form.cvv} onChange={handleChange} maxLength={4} type="password"
                          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                    </div>
                  </div>
                )}

                {/* PayPal form */}
                {payMethod === 'paypal' && (
                  <div className="bg-[#003087]/5 border border-[#003087]/20 rounded-xl p-5 space-y-3">
                    <div className="flex items-center gap-3 mb-2">
                      <PayPalLogo className="h-6 w-auto" />
                      <span className="text-sm font-bold text-gray-800">Pay with PayPal</span>
                    </div>
                    <p className="text-xs text-gray-500">Enter your PayPal email. You'll receive a payment link to complete the transaction securely through PayPal.</p>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">PayPal Email *</label>
                      <input name="paypalEmail" type="email" placeholder="you@email.com" value={form.paypalEmail} onChange={handleChange}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                  </div>
                )}

                {/* Payoneer form */}
                {payMethod === 'payoneer' && (
                  <div className="bg-orange-50 border border-orange-200 rounded-xl p-5 space-y-3">
                    <div className="flex items-center gap-3 mb-2">
                      <img src={payoneerLogo} alt="Payoneer" className="h-7 object-contain" />
                      <span className="text-sm font-bold text-gray-800">Pay with Payoneer</span>
                    </div>
                    <p className="text-xs text-gray-500">
                      Payoneer accepts payments from <strong>200+ countries</strong>. Available in USD, EUR, GBP, and more.
                      After placing your order, you'll receive detailed Payoneer payment instructions by email.
                    </p>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Your Payoneer Email *</label>
                      <input name="payoneerEmail" type="email" placeholder="your-payoneer@email.com" value={form.payoneerEmail} onChange={handleChange}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="bg-orange-100 rounded-lg p-3">
                      <p className="text-xs text-orange-700 font-semibold">✓ Accepted currencies: USD, EUR, GBP, CAD, AUD, JPY, MXN, BRL and more</p>
                      <p className="text-xs text-orange-700 mt-1">✓ Payment confirmation within 1–24 hours after transfer</p>
                      <p className="text-xs text-orange-700 mt-1">✓ Tickets activated once payment is received</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <button
            onClick={handleNextStep}
            disabled={processing}
            className="mt-5 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-black py-4 rounded-full text-sm uppercase tracking-wide transition-colors flex items-center justify-center gap-2"
          >
            {processing ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Processing Payment...
              </>
            ) : step === 'details' ? 'Continue to Payment →' : `Confirm & Pay ${format(total)}`}
          </button>

          {step === 'payment' && (
            <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
              <VisaLogo className="h-6 w-auto opacity-80" />
              <MastercardLogo className="h-7 w-auto opacity-80" />
              <PayPalLogo className="h-5 w-auto opacity-80" />
              <img src={payoneerLogo} alt="Payoneer" className="h-5 object-contain opacity-80" />
              <span className="text-xs text-gray-400">· SSL Secured</span>
            </div>
          )}
        </div>

        {/* Order Summary sidebar */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 h-fit sticky top-20">
          <h3 className="font-black text-gray-900 mb-4">Order Summary</h3>
          <div className="space-y-3 text-xs text-gray-600 mb-4">
            {items.map(item => (
              <div key={`${item.id}-${item.size}`} className="flex justify-between gap-2">
                <span className="flex-1 truncate">{item.name} {item.size ? `(${item.size})` : ''} × {item.quantity}</span>
                <span className="font-medium text-gray-800">{format(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 pt-3 space-y-1.5 text-xs">
            <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>{format(totalPrice)}</span></div>
            <div className="flex justify-between text-gray-500"><span>Tax (8%)</span><span>{format(tax)}</span></div>
            <div className="flex justify-between text-gray-500"><span>Shipping</span><span className="text-green-600 font-semibold">FREE</span></div>
            <div className="flex justify-between font-black text-gray-900 text-sm pt-2 border-t border-gray-100 mt-2">
              <span>Total</span>
              <span className="text-blue-600">{format(total)}</span>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400 text-center mb-3 font-medium">Accepted Payments</p>
            <div className="flex items-center justify-center flex-wrap gap-3">
              <VisaLogo className="h-5 w-auto" />
              <MastercardLogo className="h-6 w-auto" />
              <PayPalLogo className="h-4 w-auto" />
              <img src={payoneerLogo} alt="Payoneer" className="h-4 object-contain" />
            </div>
            <p className="text-center text-[10px] text-gray-400 mt-2">🔒 256-bit SSL · Secure & Encrypted</p>
          </div>
        </div>
      </div>
    </div>
  );
}
