import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Lock, CreditCard } from 'lucide-react';
import { toast } from 'sonner';
import { useCart } from '@/hooks/useCart';
import { formatPrice } from '@/lib/utils';

type Step = 'details' | 'payment' | 'confirmation';

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('details');
  const [processing, setProcessing] = useState(false);

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', country: '', zip: '',
    cardName: '', cardNumber: '', expiry: '', cvv: '',
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
      if (!form.cardNumber || !form.expiry || !form.cvv || !form.cardName) {
        toast.error('Please complete your payment details.');
        return;
      }
      setProcessing(true);
      setTimeout(() => {
        setProcessing(false);
        setStep('confirmation');
        clearCart();
      }, 2000);
    }
  }

  if (step === 'confirmation') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
        <div className="bg-white rounded-2xl shadow-xl p-10 max-w-lg w-full text-center">
          <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={36} className="text-green-600" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">Booking Confirmed!</h1>
          <p className="text-gray-500 text-sm mb-1">Thank you, <strong>{form.firstName}</strong>!</p>
          <p className="text-gray-500 text-sm mb-6">A confirmation has been sent to <strong>{form.email}</strong>.</p>
          <div className="bg-blue-50 rounded-xl p-4 mb-8 text-left">
            <p className="text-xs text-gray-500 uppercase tracking-wide font-bold mb-1">Order Reference</p>
            <p className="font-black text-blue-600 text-lg">FWC26-{Math.random().toString(36).substring(2, 10).toUpperCase()}</p>
          </div>
          <p className="text-xs text-gray-400 mb-6">Your tickets and package details will be delivered digitally to your email. Please check your Fan ID requirements before travel.</p>
          <button onClick={() => navigate('/')} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-full text-sm transition-colors">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const steps = [
    { key: 'details', label: 'Your Details' },
    { key: 'payment', label: 'Payment' },
    { key: 'confirmation', label: 'Confirmation' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-black text-white py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-black mb-4">Secure Checkout</h1>
          {/* Step progress */}
          <div className="flex items-center gap-3">
            {steps.map((s, i) => (
              <div key={s.key} className="flex items-center gap-3">
                <div className={`flex items-center gap-2 ${step === s.key ? 'text-white' : step === 'confirmation' || (step === 'payment' && s.key === 'details') ? 'text-green-400' : 'text-gray-500'}`}>
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
                  <select name="country" value={form.country} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                    <option value="">Select country</option>
                    <option>United States</option><option>Canada</option><option>Mexico</option>
                    <option>United Kingdom</option><option>Germany</option><option>France</option>
                    <option>Brazil</option><option>Argentina</option><option>Japan</option>
                    <option>Australia</option><option>Other</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 'payment' && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-5">
                <Lock size={16} className="text-green-500" />
                <h2 className="text-lg font-black">Secure Payment</h2>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-5 text-xs text-blue-700 font-medium">
                🔒 Your payment is protected by 256-bit SSL encryption. VISA is the Official Way to Pay for FIFA World Cup 2026™.
              </div>
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
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <CreditCard size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
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
            ) : step === 'details' ? 'Continue to Payment' : 'Confirm & Pay ' + formatPrice(total)}
          </button>
        </div>

        {/* Order summary sidebar */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 h-fit sticky top-20">
          <h3 className="font-black text-gray-900 mb-4">Order Summary</h3>
          <div className="space-y-3 text-xs text-gray-600 mb-4">
            {items.map(item => (
              <div key={`${item.id}-${item.size}`} className="flex justify-between gap-2">
                <span className="flex-1 truncate">{item.name} {item.size ? `(${item.size})` : ''} × {item.quantity}</span>
                <span className="font-medium text-gray-800">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 pt-3 space-y-1 text-xs">
            <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>{formatPrice(totalPrice)}</span></div>
            <div className="flex justify-between text-gray-500"><span>Tax (8%)</span><span>{formatPrice(tax)}</span></div>
            <div className="flex justify-between font-black text-gray-900 text-sm pt-2 border-t border-gray-100 mt-2"><span>Total</span><span className="text-blue-600">{formatPrice(total)}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
