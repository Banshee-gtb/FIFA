import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import {
  Copy, Check, Globe, ShieldCheck, Clock, CreditCard,
  AlertCircle, ChevronRight, Send, FileText, Banknote
} from 'lucide-react';
import payoneerLogo from '@/assets/payoneer-logo.png';

// ── Owner Payoneer config (update this with your real Payoneer details) ──────
const PAYONEER_ACCOUNT = {
  email: 'payments@fifa2026experience.com',
  accountName: 'FIFA 2026 Experience Ltd.',
  accountId: 'P-26001234567',
  supportedCurrencies: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'MXN', 'BRL', 'CHF', 'SEK', 'NOK', 'DKK', 'SGD', 'HKD', 'NZD'],
};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <button onClick={copy} className="ml-2 inline-flex items-center gap-1 text-orange-600 hover:text-orange-700 text-xs font-semibold transition-colors" aria-label="Copy">
      {copied ? <Check size={12} /> : <Copy size={12} />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

const steps = [
  {
    num: 1,
    icon: <FileText size={20} />,
    title: 'Place Your Order',
    desc: 'Select your tickets, hospitality, or merchandise and proceed to checkout. Choose "Payoneer" as your payment method and note your order reference number.',
  },
  {
    num: 2,
    icon: <Globe size={20} />,
    title: 'Log In to Payoneer',
    desc: 'Go to payoneer.com and log into your Payoneer account. If you do not have one, registration is free and takes only a few minutes.',
  },
  {
    num: 3,
    icon: <Send size={20} />,
    title: 'Send Payment',
    desc: 'Use "Pay / Send Money" → "Pay a Payoneer Customer" → enter our receiving email address below. Set the amount and your order reference as the payment note.',
  },
  {
    num: 4,
    icon: <FileText size={20} />,
    title: 'Submit Payment Proof',
    desc: 'Fill in the confirmation form below with your Transaction ID and order reference. We will verify your payment within 1–24 hours.',
  },
  {
    num: 5,
    icon: <Check size={20} />,
    title: 'Tickets Activated',
    desc: 'Once payment is confirmed, your tickets are activated and available in My Orders. You will receive a confirmation email immediately.',
  },
];

const currencies = [
  { code: 'USD', flag: 'us', name: 'US Dollar', rate: '1.00' },
  { code: 'EUR', flag: 'eu', name: 'Euro', rate: '0.93' },
  { code: 'GBP', flag: 'gb', name: 'British Pound', rate: '0.79' },
  { code: 'CAD', flag: 'ca', name: 'Canadian Dollar', rate: '1.37' },
  { code: 'AUD', flag: 'au', name: 'Australian Dollar', rate: '1.54' },
  { code: 'BRL', flag: 'br', name: 'Brazilian Real', rate: '5.05' },
  { code: 'MXN', flag: 'mx', name: 'Mexican Peso', rate: '17.20' },
  { code: 'JPY', flag: 'jp', name: 'Japanese Yen', rate: '149.5' },
];

export default function PayoneerPayment() {
  const [form, setForm] = useState({
    orderRef: '',
    txId: '',
    senderEmail: '',
    amount: '',
    currency: 'USD',
    name: '',
    notes: '',
  });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.orderRef || !form.txId || !form.senderEmail || !form.amount) {
      toast.error('Please fill in all required fields.');
      return;
    }
    // Save proof to localStorage for tracking
    const proofs = JSON.parse(localStorage.getItem('fwc26_payoneer_proofs') || '[]');
    proofs.push({ ...form, submittedAt: new Date().toISOString(), status: 'pending' });
    localStorage.setItem('fwc26_payoneer_proofs', JSON.stringify(proofs));
    setSubmitted(true);
    toast.success('Payment proof submitted! We will verify within 1–24 hours.');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-black text-white py-14 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-orange-500 to-yellow-400" />
        <div className="max-w-5xl mx-auto relative">
          <div className="flex items-center gap-3 mb-4">
            <img src={payoneerLogo} alt="Payoneer" className="h-8 object-contain" style={{ filter: 'brightness(0) invert(1)' }} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-3 leading-tight">
            Pay with Payoneer
          </h1>
          <p className="text-gray-300 text-base max-w-2xl leading-relaxed">
            Send money securely from 200+ countries using your Payoneer account. Accepts USD, EUR, GBP, and 12+ more currencies — with no hidden fees.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 text-sm text-white font-medium">
              <Globe size={14} /> 200+ Countries
            </div>
            <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 text-sm text-white font-medium">
              <ShieldCheck size={14} /> Secure & Verified
            </div>
            <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 text-sm text-white font-medium">
              <Clock size={14} /> Confirmed in 1–24hrs
            </div>
            <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 text-sm text-white font-medium">
              <Banknote size={14} /> 15+ Currencies
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">

        {/* Receiving Account Card */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-2xl p-6 mb-10 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-12 translate-x-12" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-8 -translate-x-8" />
          <div className="relative">
            <div className="flex items-center gap-3 mb-5">
              <img src={payoneerLogo} alt="Payoneer" className="h-6 object-contain" style={{ filter: 'brightness(0) invert(1)' }} />
              <span className="text-white/70 text-sm font-medium">Receiving Account Details</span>
            </div>
            <p className="text-white/70 text-xs uppercase tracking-widest font-semibold mb-1">Send Payment To</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <p className="text-white/60 text-[10px] uppercase tracking-wide font-semibold mb-1">Payoneer Email</p>
                <p className="font-black text-white text-sm font-mono break-all">{PAYONEER_ACCOUNT.email}</p>
                <CopyButton text={PAYONEER_ACCOUNT.email} />
              </div>
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <p className="text-white/60 text-[10px] uppercase tracking-wide font-semibold mb-1">Account Name</p>
                <p className="font-black text-white text-sm">{PAYONEER_ACCOUNT.accountName}</p>
                <CopyButton text={PAYONEER_ACCOUNT.accountName} />
              </div>
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <p className="text-white/60 text-[10px] uppercase tracking-wide font-semibold mb-1">Account ID</p>
                <p className="font-black text-white text-sm font-mono">{PAYONEER_ACCOUNT.accountId}</p>
                <CopyButton text={PAYONEER_ACCOUNT.accountId} />
              </div>
            </div>
            <div className="mt-4 bg-white/10 rounded-xl p-3 flex items-start gap-2">
              <AlertCircle size={14} className="text-yellow-300 flex-shrink-0 mt-0.5" />
              <p className="text-white/80 text-xs">
                <strong className="text-white">Important:</strong> Always include your order reference (e.g. FWC26-XXXXXXX) in the payment note so we can match your payment instantly.
              </p>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className="mb-10">
          <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
            <span className="bg-orange-100 text-orange-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-black">?</span>
            How It Works
          </h2>
          <div className="space-y-4">
            {steps.map((step, i) => (
              <div key={step.num} className="flex gap-4 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex-shrink-0">
                  <div className="bg-orange-100 text-orange-600 w-10 h-10 rounded-full flex items-center justify-center font-black text-sm">
                    {step.num}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-orange-500">{step.icon}</span>
                    <h3 className="font-black text-gray-900 text-sm">{step.title}</h3>
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                </div>
                {i < steps.length - 1 && (
                  <ChevronRight size={16} className="text-gray-300 flex-shrink-0 self-center" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Supported Currencies */}
        <div className="mb-10">
          <h2 className="text-2xl font-black text-gray-900 mb-6">Supported Currencies</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {currencies.map(c => (
              <div key={c.code} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
                <img src={`https://flagcdn.com/w40/${c.flag}.png`} alt={c.code}
                  className="w-8 h-5 object-cover rounded-sm shadow-sm flex-shrink-0" />
                <div>
                  <p className="font-black text-gray-900 text-sm">{c.code}</p>
                  <p className="text-gray-400 text-[10px]">{c.name}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-3">* And 7+ more currencies. Payoneer automatically converts at competitive rates.</p>
        </div>

        {/* Payment Proof Submission */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-10">
          <div className="bg-[#0a1f5c] text-white px-6 py-4">
            <h2 className="font-black text-lg flex items-center gap-2">
              <FileText size={18} /> Submit Payment Confirmation
            </h2>
            <p className="text-blue-300 text-xs mt-1">After sending your Payoneer payment, fill this form to confirm your transaction.</p>
          </div>

          {submitted ? (
            <div className="p-10 text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check size={28} className="text-green-600" />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2">Proof Submitted!</h3>
              <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
                We have received your payment confirmation. Our team will verify and activate your tickets within <strong>1–24 hours</strong>.
                You will receive a confirmation email once verified.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link to="/orders" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-full text-sm transition-colors">
                  View My Orders
                </Link>
                <button onClick={() => setSubmitted(false)}
                  className="border-2 border-gray-200 text-gray-700 hover:border-blue-400 font-bold px-6 py-3 rounded-full text-sm transition-colors">
                  Submit Another
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Your Full Name *</label>
                <input name="name" placeholder="John Doe" value={form.name} onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Your Payoneer / Sender Email *</label>
                <input name="senderEmail" type="email" placeholder="your@email.com" value={form.senderEmail} onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Order Reference Number *</label>
                <input name="orderRef" placeholder="FWC26-XXXXXXX" value={form.orderRef} onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 font-mono" />
                <p className="text-[10px] text-gray-400 mt-1">Found in your order confirmation email or My Orders page.</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Payoneer Transaction ID *</label>
                <input name="txId" placeholder="e.g. TXN-2600123456" value={form.txId} onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 font-mono" />
                <p className="text-[10px] text-gray-400 mt-1">Find this in your Payoneer transaction history.</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Amount Sent *</label>
                <input name="amount" type="number" placeholder="150.00" value={form.amount} onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Currency *</label>
                <select name="currency" value={form.currency} onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white">
                  {PAYONEER_ACCOUNT.supportedCurrencies.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-600 mb-1">Additional Notes</label>
                <textarea name="notes" placeholder="Any additional information about your payment..." value={form.notes} onChange={handleChange} rows={3}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none" />
              </div>
              <div className="sm:col-span-2">
                <button type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-4 rounded-full text-sm uppercase tracking-wide transition-colors flex items-center justify-center gap-2">
                  <Send size={16} /> Submit Payment Confirmation
                </button>
                <p className="text-center text-xs text-gray-400 mt-2">
                  Our team will verify your payment and activate your tickets within 1–24 hours.
                </p>
              </div>
            </form>
          )}
        </div>

        {/* FAQ */}
        <div className="mb-10">
          <h2 className="text-2xl font-black text-gray-900 mb-6">Payoneer Payment FAQ</h2>
          <div className="space-y-4">
            {[
              {
                q: 'Do I need a Payoneer account to pay?',
                a: 'Yes, you need a Payoneer account to send a payment. Registration is free at payoneer.com and takes just a few minutes. Payoneer supports bank transfers and cards as funding sources.',
              },
              {
                q: 'How long does payment verification take?',
                a: 'Payoneer payments are typically verified within 1–24 hours after you submit your payment proof. During peak periods (match announcements, finals), it may take up to 48 hours.',
              },
              {
                q: 'What currencies can I use?',
                a: 'We accept USD, EUR, GBP, CAD, AUD, JPY, MXN, BRL, CHF, SEK, NOK, DKK, SGD, HKD, NZD and more. Payoneer handles the conversion at competitive exchange rates.',
              },
              {
                q: 'Is there a transaction fee?',
                a: 'Payoneer charges a small fee for sending to other Payoneer accounts (typically 0–1% depending on your account level). We do not add any additional processing fee on our end.',
              },
              {
                q: 'What if my payment is not confirmed?',
                a: 'If you have submitted your proof and have not received confirmation within 48 hours, please contact us at payments@fifa2026experience.com with your order reference and transaction ID.',
              },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <h4 className="font-black text-gray-900 text-sm mb-2 flex items-start gap-2">
                  <span className="bg-orange-100 text-orange-600 rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5">Q</span>
                  {item.q}
                </h4>
                <p className="text-gray-500 text-sm leading-relaxed pl-7">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="bg-[#0a1f5c] text-white rounded-2xl p-8 text-center">
          <CreditCard size={32} className="mx-auto text-blue-400 mb-3" />
          <h3 className="text-xl font-black mb-2">Need Help with Payment?</h3>
          <p className="text-gray-300 text-sm mb-5">Our payments team is available 24/7 to assist you.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a href="mailto:payments@fifa2026experience.com"
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-full text-sm transition-colors">
              Email Payments Team
            </a>
            <Link to="/contact"
              className="border-2 border-white/20 text-white hover:border-white/50 font-bold px-6 py-3 rounded-full text-sm transition-colors">
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
