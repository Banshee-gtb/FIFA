import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Cookie, Check } from 'lucide-react';
import { toast } from 'sonner';

export default function CookieSettings() {
  const [prefs, setPrefs] = useState({ analytics: true, marketing: true, personalization: true });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('fwc26_cookie_prefs');
    if (stored) setPrefs(JSON.parse(stored));
  }, []);

  function savePrefs(choice: 'all' | 'essential' | 'none') {
    let newPrefs = prefs;
    if (choice === 'all') {
      newPrefs = { analytics: true, marketing: true, personalization: true };
    } else if (choice === 'none') {
      newPrefs = { analytics: false, marketing: false, personalization: false };
    }
    setPrefs(newPrefs);
    localStorage.setItem('fwc26_cookie_prefs', JSON.stringify(newPrefs));
    localStorage.setItem('fwc26_cookie_choice', choice === 'none' ? 'rejected' : 'essential');
    setSaved(true);
    toast.success('Cookie preferences saved.');
    setTimeout(() => setSaved(false), 3000);
  }

  const categories = [
    {
      key: 'essential' as const,
      label: 'Strictly Necessary Cookies',
      locked: true,
      enabled: true,
      desc: 'These cookies are essential for the website to function properly. They include cookies that allow you to log in, add items to your cart, and complete a purchase. These cannot be disabled.',
      examples: ['Session cookies', 'Security tokens', 'Load balancing', 'CSRF protection'],
    },
    {
      key: 'analytics' as const,
      label: 'Performance & Analytics Cookies',
      locked: false,
      enabled: prefs.analytics,
      desc: 'These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. All information these cookies collect is aggregated and therefore anonymous.',
      examples: ['Google Analytics', 'Session duration', 'Page views', 'Bounce rate'],
    },
    {
      key: 'marketing' as const,
      label: 'Marketing & Targeting Cookies',
      locked: false,
      enabled: prefs.marketing,
      desc: 'These cookies may be set through our site by our advertising partners. They may be used by those companies to build a profile of your interests and show you relevant adverts on other sites.',
      examples: ['Facebook Pixel', 'Google Ads', 'Retargeting', 'Ad measurement'],
    },
    {
      key: 'personalization' as const,
      label: 'Personalization Cookies',
      locked: false,
      enabled: prefs.personalization,
      desc: 'These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third party providers whose services we have added to our pages.',
      examples: ['Language preferences', 'Currency settings', 'Recommended content', 'Recently viewed'],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-black text-white py-14 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-blue-400 text-xs font-semibold uppercase tracking-widest mb-2">Privacy</p>
          <h1 className="text-4xl font-black flex items-center gap-3">
            <Cookie size={32} className="text-blue-400" />
            Cookie Settings
          </h1>
          <p className="text-gray-400 text-sm mt-2">Manage your cookie preferences for FIFA World Cup 2026™</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Quick actions */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-black text-gray-900 mb-1">Quick Settings</h2>
            <p className="text-gray-500 text-sm">Accept all or only essential cookies in one click.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => savePrefs('none')}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-4 py-2.5 rounded-full text-sm transition-colors">
              Reject All Optional
            </button>
            <button onClick={() => savePrefs('all')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-black px-4 py-2.5 rounded-full text-sm transition-colors">
              Accept All
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-4 mb-8">
          {categories.map(cat => (
            <div key={cat.key} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <h3 className="font-black text-gray-900">{cat.label}</h3>
                  {cat.locked && (
                    <span className="text-[10px] bg-blue-100 text-blue-600 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wide">Always Active</span>
                  )}
                </div>
                {cat.locked ? (
                  <div className="w-12 h-6 bg-blue-600 rounded-full relative opacity-60 flex-shrink-0">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow" />
                  </div>
                ) : (
                  <button
                    onClick={() => setPrefs(p => ({ ...p, [cat.key]: !p[cat.key as keyof typeof p] }))}
                    className={`w-12 h-6 rounded-full relative transition-colors flex-shrink-0 ${prefs[cat.key as keyof typeof prefs] ? 'bg-blue-600' : 'bg-gray-300'}`}
                    role="switch"
                    aria-checked={prefs[cat.key as keyof typeof prefs]}
                    aria-label={`Toggle ${cat.label}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${prefs[cat.key as keyof typeof prefs] ? 'translate-x-7' : 'translate-x-1'}`} />
                  </button>
                )}
              </div>
              <p className="text-gray-500 text-sm leading-relaxed mb-3">{cat.desc}</p>
              <div className="flex flex-wrap gap-2">
                {cat.examples.map(ex => (
                  <span key={ex} className="text-[11px] bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-medium">{ex}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Save button */}
        <div className="sticky bottom-6 flex justify-center">
          <button
            onClick={() => savePrefs('essential')}
            className={`flex items-center gap-2 font-black px-8 py-4 rounded-full text-sm shadow-lg transition-all ${saved ? 'bg-green-500 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
          >
            {saved ? <><Check size={16} /> Preferences Saved!</> : 'Save My Preferences'}
          </button>
        </div>

        <div className="mt-8 text-center text-xs text-gray-400 space-x-4">
          <Link to="/privacy" className="hover:text-gray-600 transition-colors">Privacy Policy</Link>
          <span>·</span>
          <Link to="/terms" className="hover:text-gray-600 transition-colors">Terms & Conditions</Link>
          <span>·</span>
          <Link to="/contact" className="hover:text-gray-600 transition-colors">Contact Us</Link>
        </div>
      </div>
    </div>
  );
}
