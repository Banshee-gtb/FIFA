import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import {
  Gift, Check, ShoppingCart, Shield, ExternalLink,
  CreditCard, ArrowRight, Ticket, Star, AlertCircle
} from 'lucide-react';
import giftCardBg from '@/assets/gift-card-bg.jpg';
import { useCurrency } from '@/contexts/CurrencyContext';

// ── External gift card purchase partners ─────────────────────────────────────
const GIFT_CARD_PARTNERS = [
  {
    name: 'Paysafecard',
    description: 'Buy prepaid scratch cards at thousands of retailers worldwide. Available in 50+ countries.',
    url: 'https://www.paysafecard.com',
    denominations: ['$10', '$25', '$50', '$100'],
    logo: '💳',
    color: 'bg-blue-50 border-blue-200',
    badge: 'Most Popular',
  },
  {
    name: 'Coincards',
    description: 'Purchase digital gift card codes instantly online. Delivered by email within minutes.',
    url: 'https://www.coincards.com',
    denominations: ['$25', '$50', '$100', '$200'],
    logo: '🪙',
    color: 'bg-purple-50 border-purple-200',
    badge: 'Instant Delivery',
  },
  {
    name: 'G2A Pay',
    description: 'Buy game and gift card codes from a global marketplace with 200+ payment methods.',
    url: 'https://www.g2a.com',
    denominations: ['$20', '$50', '$100', '$250'],
    logo: '🌐',
    color: 'bg-green-50 border-green-200',
    badge: '200+ Countries',
  },
];

// ── How it works steps ────────────────────────────────────────────────────────
const HOW_IT_WORKS = [
  {
    num: '01',
    icon: <ExternalLink size={22} className="text-blue-500" />,
    title: 'Visit a Gift Card Store',
    desc: 'Click one of our partner links below to buy a FIFA World Cup 2026™ gift card from a trusted external retailer.',
    color: 'bg-blue-100',
  },
  {
    num: '02',
    icon: <Gift size={22} className="text-yellow-500" />,
    title: 'Scratch & Reveal Your Code',
    desc: 'Once purchased, scratch the physical card or reveal the digital code sent to your email. Your unique code is ready.',
    color: 'bg-yellow-100',
  },
  {
    num: '03',
    icon: <CreditCard size={22} className="text-purple-500" />,
    title: 'Enter Code at Checkout',
    desc: 'At checkout on this site, select "Gift Card" as payment, enter your code, and it will be validated and applied instantly.',
    color: 'bg-purple-100',
  },
  {
    num: '04',
    icon: <Ticket size={22} className="text-green-500" />,
    title: 'Enjoy the World Cup!',
    desc: 'Your tickets, hospitality, VIP seats, tours, or merchandise are confirmed. Show up and make memories.',
    color: 'bg-green-100',
  },
];

// ── Redemption box ────────────────────────────────────────────────────────────
function RedemptionBox() {
  const { format } = useCurrency();
  const [code, setCode] = useState('');
  const [checked, setChecked] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);
  const [used, setUsed] = useState(false);

  function handleCheck() {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) { toast.error('Please enter a gift card code.'); return; }
    const cards: Array<{ code: string; denomination: number; used: boolean }> =
      JSON.parse(localStorage.getItem('fwc26_gift_cards') || '[]');
    const card = cards.find(c => c.code === trimmed);
    if (!card) {
      toast.error('Code not found. Please check your card and try again.');
      return;
    }
    setChecked(true);
    setBalance(card.denomination);
    setUsed(card.used);
    if (card.used) toast.error('This gift card has already been used.');
    else toast.success(`Valid gift card! Balance: ${format(card.denomination)}`);
  }

  function formatCode(val: string) {
    const clean = val.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 16);
    return clean.replace(/(.{4})/g, '$1-').replace(/-$/, '');
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-5">
        <h3 className="text-white font-black text-lg flex items-center gap-2">
          <Gift size={20} /> Check Your Gift Card Balance
        </h3>
        <p className="text-white/70 text-xs mt-1">Enter your scratch-card code to check balance before heading to checkout.</p>
      </div>
      <div className="p-6">
        <div className="flex gap-3 mb-4">
          <input
            type="text"
            placeholder="XXXX-XXXX-XXXX-XXXX"
            value={code}
            onChange={e => { setCode(formatCode(e.target.value)); setChecked(false); setBalance(null); }}
            className="flex-1 border-2 border-gray-200 focus:border-purple-400 rounded-xl px-4 py-3 text-sm font-mono uppercase tracking-widest focus:outline-none transition-colors"
            maxLength={19}
          />
          <button
            onClick={handleCheck}
            className="bg-purple-600 hover:bg-purple-700 text-white font-black px-5 py-3 rounded-xl text-sm transition-colors flex-shrink-0"
          >
            Check
          </button>
        </div>

        {checked && balance !== null && (
          <div className={`rounded-xl p-4 flex items-center gap-4 ${used ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${used ? 'bg-red-100' : 'bg-green-100'}`}>
              {used ? <AlertCircle size={20} className="text-red-500" /> : <Check size={20} className="text-green-600" />}
            </div>
            <div className="flex-1">
              <p className={`font-black text-sm ${used ? 'text-red-700' : 'text-green-800'}`}>
                {used ? 'Gift Card Already Used' : 'Gift Card Valid!'}
              </p>
              <p className={`text-xs mt-0.5 ${used ? 'text-red-500' : 'text-green-600'}`}>
                {used ? 'This code has already been redeemed.' : `Available balance: ${format(balance)}`}
              </p>
            </div>
            {!used && (
              <Link
                to="/checkout"
                className="flex-shrink-0 bg-green-600 hover:bg-green-700 text-white font-bold text-xs px-4 py-2 rounded-full transition-colors flex items-center gap-1.5"
              >
                Use at Checkout <ArrowRight size={12} />
              </Link>
            )}
          </div>
        )}

        <p className="text-xs text-gray-400 mt-4 flex items-start gap-1.5">
          <Shield size={12} className="flex-shrink-0 mt-0.5 text-gray-400" />
          Your code is never stored until you redeem it at checkout. Codes are case-insensitive.
        </p>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function GiftCard() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Hero ── */}
      <div className="relative overflow-hidden">
        <img src={giftCardBg} alt="Gift Card" className="w-full h-80 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-transparent flex items-center">
          <div className="max-w-5xl mx-auto px-6 w-full">
            <div className="flex items-center gap-3 mb-3">
              <Gift size={28} className="text-yellow-400" />
              <span className="text-yellow-400 text-sm font-black uppercase tracking-widest">FIFA World Cup 2026™</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-3 leading-tight">
              Gift Cards
            </h1>
            <p className="text-white/75 text-base max-w-xl leading-relaxed mb-5">
              Buy a gift card from one of our trusted partner stores, scratch to reveal your code, then redeem it here for tickets, hospitality, VIP packages, and merchandise.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="#buy" className="bg-yellow-400 hover:bg-yellow-300 text-black font-black px-6 py-3 rounded-full text-sm transition-colors flex items-center gap-2">
                Buy a Gift Card <ExternalLink size={14} />
              </a>
              <a href="#redeem" className="border-2 border-white/40 hover:border-white text-white font-bold px-6 py-3 rounded-full text-sm transition-colors flex items-center gap-2">
                Check My Code <ArrowRight size={14} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── How It Works ── */}
      <div className="bg-white border-b border-gray-100 py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-black text-gray-900 text-center mb-2">How It Works</h2>
          <p className="text-gray-500 text-sm text-center mb-10">Four simple steps to experience the FIFA World Cup 2026™</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map(step => (
              <div key={step.num} className="relative">
                <div className={`${step.color} rounded-2xl p-5 h-full`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="bg-white rounded-full w-11 h-11 flex items-center justify-center shadow-sm">
                      {step.icon}
                    </div>
                    <span className="text-4xl font-black text-black/5 leading-none">{step.num}</span>
                  </div>
                  <h3 className="font-black text-gray-900 text-sm mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-xs leading-relaxed">{step.desc}</p>
                </div>
                {/* Arrow connector */}
                {step.num !== '04' && (
                  <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 bg-gray-50 rounded-full p-1">
                    <ArrowRight size={14} className="text-gray-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12 space-y-14">

        {/* ── Buy Section ── */}
        <section id="buy">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-black text-sm flex-shrink-0">1</div>
            <h2 className="text-2xl font-black text-gray-900">Buy a Gift Card</h2>
          </div>
          <p className="text-gray-500 text-sm mb-8 pl-11">
            Choose a trusted partner below. You'll be redirected to their site to purchase your gift card. Cards are available as physical scratch-and-reveal or instant digital delivery.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {GIFT_CARD_PARTNERS.map(partner => (
              <div key={partner.name} className={`rounded-2xl border-2 p-6 ${partner.color} relative group hover:shadow-md transition-shadow`}>
                {partner.badge && (
                  <span className="absolute -top-3 left-5 bg-yellow-400 text-black text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wide">
                    {partner.badge}
                  </span>
                )}
                <div className="text-4xl mb-4">{partner.logo}</div>
                <h3 className="font-black text-gray-900 text-lg mb-2">{partner.name}</h3>
                <p className="text-gray-600 text-xs leading-relaxed mb-4">{partner.description}</p>
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {partner.denominations.map(d => (
                    <span key={d} className="bg-white text-gray-700 text-[11px] font-bold px-2 py-0.5 rounded-full border border-gray-200">
                      {d}
                    </span>
                  ))}
                </div>
                <a
                  href={partner.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#0a1f5c] hover:bg-blue-900 text-white font-black py-3 rounded-full text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  Buy at {partner.name}
                  <ExternalLink size={13} />
                </a>
              </div>
            ))}
          </div>

          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3">
            <AlertCircle size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
            <p className="text-blue-700 text-xs leading-relaxed">
              <strong>Note:</strong> These are external third-party retailers. After purchasing, you'll receive a unique scratch-and-reveal code. Return to this page or go directly to checkout to enter your code. FIFA World Cup 2026™ is not responsible for third-party transactions.
            </p>
          </div>
        </section>

        {/* ── Redeem / Check Section ── */}
        <section id="redeem">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-black text-sm flex-shrink-0">2</div>
            <h2 className="text-2xl font-black text-gray-900">Scratch, Reveal & Redeem</h2>
          </div>
          <p className="text-gray-500 text-sm mb-8 pl-11">
            Got your code? Enter it below to check the balance, or go straight to checkout and select "Gift Card" as your payment method.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <RedemptionBox />

            {/* Checkout shortcut */}
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-[#0a1f5c] to-[#1a3a8c] text-white rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-yellow-400 rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
                    <span className="text-black font-black text-sm">26</span>
                  </div>
                  <div>
                    <p className="font-black text-sm">Ready to redeem?</p>
                    <p className="text-white/60 text-xs">Apply your code directly at checkout</p>
                  </div>
                </div>
                <p className="text-white/70 text-xs leading-relaxed mb-5">
                  At checkout, add your items to cart, proceed to payment, and select <strong className="text-white">Gift Card</strong> as your payment method. Enter your code and it'll be validated and applied automatically.
                </p>
                <div className="space-y-2">
                  <Link
                    to="/tickets"
                    className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-black py-3 rounded-full text-sm flex items-center justify-center gap-2 transition-colors"
                  >
                    <Ticket size={15} /> Browse Tickets
                  </Link>
                  <Link
                    to="/store"
                    className="w-full border-2 border-white/30 hover:border-white/60 text-white font-bold py-3 rounded-full text-sm flex items-center justify-center gap-2 transition-colors"
                  >
                    <ShoppingCart size={15} /> Visit FIFA Store
                  </Link>
                </div>
              </div>

              {/* What can you buy */}
              <div className="bg-white rounded-2xl border border-gray-200 p-5">
                <h4 className="font-black text-gray-900 text-sm mb-4">What Can You Buy?</h4>
                <div className="space-y-2.5">
                  {[
                    { icon: '🎟️', label: 'Match Tickets', sub: 'Category 1, 2 & 3 seating' },
                    { icon: '🥂', label: 'Hospitality Packages', sub: 'Premium dining & match access' },
                    { icon: '⭐', label: 'VIP Seats & Private Boxes', sub: 'Pitch-side & luxury suites' },
                    { icon: '🗺️', label: 'Tour Packages', sub: 'City, stadium & full experience' },
                    { icon: '👕', label: 'FIFA Merchandise', sub: 'Jerseys, collectibles & more' },
                  ].map(item => (
                    <div key={item.label} className="flex items-center gap-3">
                      <span className="text-lg">{item.icon}</span>
                      <div>
                        <p className="font-semibold text-gray-900 text-xs">{item.label}</p>
                        <p className="text-gray-400 text-[10px]">{item.sub}</p>
                      </div>
                      <Check size={13} className="text-green-500 ml-auto flex-shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section>
          <h2 className="text-2xl font-black text-gray-900 mb-6">Gift Card FAQ</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                q: 'Where do I buy a gift card?',
                a: 'Click any partner link above (Paysafecard, Coincards, G2A). You'll be redirected to their site to purchase and receive your unique scratch-reveal code.',
              },
              {
                q: 'How do I use the code?',
                a: 'Add your desired tickets or merchandise to cart, go to Checkout, select "Gift Card" as payment method, and enter your code. Balance is deducted instantly.',
              },
              {
                q: 'Can I use one code for multiple orders?',
                a: 'Each code can only be used once. If your cart total is less than the card value, the remaining balance cannot be transferred to a new code.',
              },
              {
                q: 'What if my code is invalid?',
                a: 'First use the balance checker above. If the code shows as invalid, contact the retailer where you purchased the card — they can verify the code was activated.',
              },
              {
                q: 'Is there an expiry on the code?',
                a: 'Expiry depends on the partner retailer. Most codes are valid for 12–18 months from purchase. Check your receipt or the partner's terms for exact details.',
              },
              {
                q: 'Can I use a gift card with other payment methods?',
                a: 'Currently, checkout supports one payment method per order. If your gift card doesn't cover the full amount, consider adding only items that match your balance.',
              },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <h4 className="font-black text-gray-900 text-sm mb-2 flex items-start gap-2">
                  <span className="bg-blue-100 text-blue-600 rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5">Q</span>
                  {item.q}
                </h4>
                <p className="text-gray-500 text-xs leading-relaxed pl-7">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Corporate ── */}
        <section>
          <div className="bg-gradient-to-br from-[#0a1f5c] to-[#1a3a8c] text-white rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Star size={18} className="text-yellow-400" />
                <span className="text-yellow-400 text-xs font-black uppercase tracking-wide">Bulk & Corporate</span>
              </div>
              <h3 className="text-xl font-black mb-1">Buying for a Group or Company?</h3>
              <p className="text-white/70 text-sm">
                Purchase bulk gift card vouchers for your team, fans, or corporate clients. Special pricing available for 10+ cards.
              </p>
            </div>
            <Link
              to="/contact"
              className="flex-shrink-0 bg-yellow-400 hover:bg-yellow-300 text-black font-black px-6 py-3 rounded-full text-sm transition-colors flex items-center gap-2"
            >
              Contact Sales Team <ArrowRight size={14} />
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
