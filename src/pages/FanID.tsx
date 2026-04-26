import { useState } from 'react';
import { User, Shield, Check, Upload, AlertCircle, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

type FanIDStep = 'intro' | 'register' | 'verify' | 'issued';

interface FanIDData {
  firstName: string;
  lastName: string;
  email: string;
  dob: string;
  nationality: string;
  passportNumber: string;
  phone: string;
  photo: string | null;
  fanId: string;
}

const NATIONALITIES = [
  'United States', 'Canada', 'Mexico', 'United Kingdom', 'Germany', 'France', 'Spain',
  'Brazil', 'Argentina', 'Japan', 'South Korea', 'Morocco', 'Nigeria', 'Australia',
  'Netherlands', 'Italy', 'Portugal', 'Belgium', 'Croatia', 'Colombia', 'Ecuador',
  'Uruguay', 'Chile', 'Saudi Arabia', 'Turkey', 'Poland', 'Ukraine', 'Switzerland',
  'Denmark', 'Ghana', 'Senegal', 'Egypt', 'China PR', 'Iran', 'Indonesia', 'New Zealand',
  'Greece', 'Czech Republic', 'Slovakia', 'Venezuela', 'Paraguay', 'Costa Rica',
  'Panama', 'Honduras', 'Other',
];

function generateFanId() {
  return 'FID' + Math.random().toString(36).substring(2, 8).toUpperCase() + '26';
}

export default function FanID() {
  const [step, setStep] = useState<FanIDStep>('intro');
  const [form, setForm] = useState<FanIDData>({
    firstName: '', lastName: '', email: '', dob: '', nationality: '',
    passportNumber: '', phone: '', photo: null, fanId: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  function handleRegisterSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.email || !form.dob || !form.nationality || !form.passportNumber) {
      toast.error('Please fill in all required fields.');
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setStep('verify');
      toast.success('Verification email sent! Check your inbox.');
    }, 1500);
  }

  function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    if (verificationCode.length < 4) {
      toast.error('Please enter the verification code.');
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      const fanId = generateFanId();
      setForm(prev => ({ ...prev, fanId }));
      setStep('issued');
      toast.success('Fan ID successfully issued!');
    }, 2000);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-black text-white py-14 px-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <div className="bg-blue-600 rounded-full p-3">
            <Shield size={28} className="text-white" />
          </div>
          <div>
            <p className="text-blue-400 text-xs font-semibold uppercase tracking-widest mb-1">Official Registration</p>
            <h1 className="text-4xl md:text-5xl font-black">Fan ID</h1>
            <p className="text-gray-400 text-sm mt-1">Required to attend FIFA World Cup 2026™ matches</p>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="bg-white border-b border-gray-100 px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2">
            {(['intro', 'register', 'verify', 'issued'] as FanIDStep[]).map((s, i) => {
              const labels = ['About Fan ID', 'Registration', 'Verification', 'Fan ID Issued'];
              const stepIdx = ['intro', 'register', 'verify', 'issued'].indexOf(step);
              const isActive = i === stepIdx;
              const isDone = i < stepIdx;
              return (
                <div key={s} className="flex items-center gap-2">
                  <div className={`flex items-center gap-2 text-sm ${isActive ? 'text-blue-600 font-bold' : isDone ? 'text-green-600 font-medium' : 'text-gray-400'}`}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${isActive ? 'bg-blue-600 text-white' : isDone ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                      {isDone ? <Check size={13} /> : i + 1}
                    </div>
                    <span className="hidden sm:block">{labels[i]}</span>
                  </div>
                  {i < 3 && <div className="w-6 md:w-12 h-px bg-gray-200 mx-1" />}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* INTRO STEP */}
        {step === 'intro' && (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 flex gap-4">
              <AlertCircle size={22} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-blue-900 mb-1">Fan ID is mandatory</h3>
                <p className="text-blue-700 text-sm">All spectators attending FIFA World Cup 2026™ matches must have a valid Fan ID. Your Fan ID serves as an entry permit to the stadiums and is linked to your match tickets.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { icon: User, title: 'Personal Identity', desc: 'Linked to your passport for secure stadium entry verification.' },
                { icon: Shield, title: 'Secure Access', desc: 'Your Fan ID is digitally verified at every stadium checkpoint.' },
                { icon: Check, title: 'Ticket Link', desc: 'All purchased tickets must be linked to a valid Fan ID before use.' },
              ].map(item => (
                <div key={item.title} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
                  <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                    <item.icon size={22} className="text-blue-600" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
                  <p className="text-gray-500 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-xl font-black text-gray-900 mb-4">What you'll need</h2>
              <ul className="space-y-3">
                {[
                  'Valid passport (not expired)',
                  'Recent passport-style photo',
                  'Email address for verification',
                  'Phone number for 2FA security',
                ].map(item => (
                  <li key={item} className="flex items-center gap-3 text-sm text-gray-700">
                    <span className="bg-green-100 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                      <Check size={11} className="text-green-600" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => setStep('register')}
                className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-black px-8 py-3.5 rounded-full text-sm uppercase tracking-wide transition-colors flex items-center gap-2"
              >
                Start Fan ID Registration <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* REGISTER STEP */}
        {step === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-6">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-xl font-black text-gray-900 mb-6">Personal Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {[
                  { name: 'firstName', label: 'First Name *', type: 'text', placeholder: 'As in passport' },
                  { name: 'lastName', label: 'Last Name *', type: 'text', placeholder: 'As in passport' },
                  { name: 'email', label: 'Email Address *', type: 'email', placeholder: 'your@email.com' },
                  { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+1 234 567 8900' },
                  { name: 'dob', label: 'Date of Birth *', type: 'date', placeholder: '' },
                  { name: 'passportNumber', label: 'Passport Number *', type: 'text', placeholder: 'AB1234567' },
                ].map(f => (
                  <div key={f.name}>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">{f.label}</label>
                    <input
                      name={f.name}
                      type={f.type}
                      placeholder={f.placeholder}
                      value={form[f.name as keyof FanIDData] as string}
                      onChange={handleChange}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Nationality *</label>
                  <select
                    name="nationality"
                    value={form.nationality}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="">Select nationality</option>
                    {NATIONALITIES.map(n => <option key={n}>{n}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-xl font-black text-gray-900 mb-2">Passport Photo</h2>
              <p className="text-gray-500 text-sm mb-5">Upload a clear, recent passport-style photo (white background, no glasses, face centered).</p>
              <div className="flex items-start gap-6">
                <div className="w-32 h-40 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center text-gray-400 text-xs p-2">
                      <User size={28} className="mx-auto mb-1 opacity-40" />
                      No photo
                    </div>
                  )}
                </div>
                <div>
                  <label className="cursor-pointer">
                    <div className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-5 py-3 rounded-xl text-sm transition-colors w-fit">
                      <Upload size={16} />
                      Upload Photo
                    </div>
                    <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                  </label>
                  <ul className="mt-3 space-y-1.5 text-xs text-gray-500">
                    <li>• JPG, PNG or WebP format</li>
                    <li>• Minimum 400 × 500 pixels</li>
                    <li>• White or light background</li>
                    <li>• Face must be clearly visible</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-xs text-yellow-800">
              <strong>Privacy Notice:</strong> Your personal data is processed securely in compliance with FIFA's Privacy Policy and applicable data protection laws. Your data is used solely for Fan ID issuance and stadium access verification.
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-black py-4 rounded-full text-sm uppercase tracking-wide transition-colors flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Submitting...
                </>
              ) : 'Submit Registration'}
            </button>
          </form>
        )}

        {/* VERIFY STEP */}
        {step === 'verify' && (
          <form onSubmit={handleVerify} className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl p-10 shadow-sm border border-gray-100 text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-5">
                <Shield size={30} className="text-blue-600" />
              </div>
              <h2 className="text-2xl font-black text-gray-900 mb-2">Verify Your Email</h2>
              <p className="text-gray-500 text-sm mb-6">
                We've sent a 6-digit verification code to <strong>{form.email}</strong>. Enter it below to confirm your identity.
              </p>
              <input
                value={verificationCode}
                onChange={e => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="123456"
                maxLength={6}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-4 text-3xl font-black text-center tracking-[0.5em] focus:outline-none focus:border-blue-500 mb-5"
              />
              <p className="text-xs text-gray-400 mb-6">
                Didn't receive it? <button type="button" onClick={() => toast.success('New code sent!')} className="text-blue-600 font-semibold hover:underline">Resend code</button>
              </p>
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-black py-4 rounded-full text-sm uppercase tracking-wide transition-colors flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Verifying...
                  </>
                ) : 'Verify & Issue Fan ID'}
              </button>
            </div>
          </form>
        )}

        {/* ISSUED STEP */}
        {step === 'issued' && (
          <div className="max-w-lg mx-auto text-center">
            <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5">
              <Check size={36} className="text-green-600" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-2">Fan ID Issued!</h2>
            <p className="text-gray-500 text-sm mb-8">Your Fan ID has been successfully created and linked to your account.</p>

            {/* Fan ID Card */}
            <div className="bg-gradient-to-br from-[#0a1f5c] to-blue-700 rounded-2xl p-6 text-white text-left shadow-2xl mb-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-8 translate-x-8" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-6 -translate-x-6" />
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-5">
                  <div>
                    <p className="text-blue-200 text-[10px] uppercase tracking-widest font-bold">FIFA World Cup 2026™</p>
                    <p className="text-white text-lg font-black">Official Fan ID</p>
                  </div>
                  <div className="bg-white rounded-full w-10 h-10 flex items-center justify-center">
                    <span className="text-blue-900 font-black text-sm">26</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 mb-5">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Fan" className="w-16 h-20 object-cover rounded-lg border-2 border-white/30" />
                  ) : (
                    <div className="w-16 h-20 bg-white/20 rounded-lg border-2 border-white/30 flex items-center justify-center">
                      <User size={24} className="text-white/60" />
                    </div>
                  )}
                  <div>
                    <p className="text-xl font-black">{form.firstName} {form.lastName}</p>
                    <p className="text-blue-200 text-xs mt-0.5">{form.nationality}</p>
                    <p className="text-blue-200 text-xs">{form.email}</p>
                  </div>
                </div>
                <div className="bg-white/10 rounded-xl p-3">
                  <p className="text-blue-200 text-[10px] uppercase tracking-widest mb-0.5">Fan ID Number</p>
                  <p className="font-black text-lg tracking-widest">{form.fanId}</p>
                </div>
                <div className="flex justify-between mt-3 text-xs text-blue-200">
                  <span>Valid: 11 Jun – 19 Jul 2026</span>
                  <span>USA · Canada · Mexico</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-full text-sm transition-colors">
                Download Fan ID
              </button>
              <button className="border-2 border-gray-200 text-gray-700 font-bold px-6 py-3 rounded-full text-sm hover:border-blue-400 transition-colors">
                Buy Tickets Now
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
