import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, Cookie, ChevronRight } from 'lucide-react';

export type CookieChoice = 'all' | 'essential' | 'rejected' | null;

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showManage, setShowManage] = useState(false);
  const [prefs, setPrefs] = useState({ analytics: true, marketing: true, personalization: true });

  useEffect(() => {
    const stored = localStorage.getItem('fwc26_cookie_choice');
    if (!stored) {
      const timer = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  function save(choice: CookieChoice, customPrefs?: typeof prefs) {
    localStorage.setItem('fwc26_cookie_choice', choice || 'rejected');
    if (customPrefs) {
      localStorage.setItem('fwc26_cookie_prefs', JSON.stringify(customPrefs));
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <>
      {/* Overlay for manage screen */}
      {showManage && (
        <div className="fixed inset-0 bg-black/50 z-[199]" onClick={() => setShowManage(false)} />
      )}

      {/* Main banner */}
      {!showManage && (
        <div className="fixed bottom-0 left-0 right-0 z-[200] p-4 sm:p-6">
          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
            <div className="p-5 sm:p-6">
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
                  <Cookie size={20} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-black text-gray-900 text-base mb-1">We use cookies</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    FIFA World Cup 2026™ uses cookies to improve your experience, personalize content, and analyze traffic.
                    By clicking "Accept All", you consent to our use of cookies.{' '}
                    <Link to="/cookie-settings" className="text-blue-600 font-semibold hover:underline" onClick={() => setVisible(false)}>
                      Cookie Policy
                    </Link>
                  </p>
                </div>
                <button onClick={() => save('rejected')} className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0" aria-label="Dismiss">
                  <X size={18} />
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-3 mt-5">
                <button
                  onClick={() => save('all')}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-black px-5 py-2.5 rounded-full text-sm transition-colors"
                >
                  Accept All
                </button>
                <button
                  onClick={() => save('rejected')}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-5 py-2.5 rounded-full text-sm transition-colors"
                >
                  Reject All
                </button>
                <button
                  onClick={() => setShowManage(true)}
                  className="flex items-center gap-1.5 text-blue-600 font-semibold text-sm hover:underline"
                >
                  Manage Preferences <ChevronRight size={14} />
                </button>
              </div>

              <p className="text-[10px] text-gray-400 mt-3">
                This site complies with GDPR. You can change your preferences at any time via{' '}
                <Link to="/cookie-settings" className="underline" onClick={() => setVisible(false)}>Cookie Settings</Link>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Manage preferences modal */}
      {showManage && (
        <div className="fixed bottom-0 left-0 right-0 z-[200] p-4 sm:p-6">
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
            <div className="bg-black text-white px-5 py-4 flex items-center justify-between">
              <h3 className="font-black text-sm flex items-center gap-2"><Cookie size={16} /> Cookie Preferences</h3>
              <button onClick={() => setShowManage(false)} className="text-gray-400 hover:text-white transition-colors"><X size={16} /></button>
            </div>

            <div className="p-5 space-y-4">
              {[
                {
                  key: 'essential' as const,
                  label: 'Essential Cookies',
                  desc: 'Required for the website to function. Cannot be disabled.',
                  locked: true,
                },
                {
                  key: 'analytics' as const,
                  label: 'Analytics Cookies',
                  desc: 'Help us understand how visitors interact with our website.',
                  locked: false,
                },
                {
                  key: 'marketing' as const,
                  label: 'Marketing Cookies',
                  desc: 'Used to deliver personalized advertisements and promotions.',
                  locked: false,
                },
                {
                  key: 'personalization' as const,
                  label: 'Personalization Cookies',
                  desc: 'Enable personalized content based on your browsing history.',
                  locked: false,
                },
              ].map(item => (
                <div key={item.key} className="flex items-start justify-between gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-gray-900 text-sm">{item.label}</span>
                      {item.locked && <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-semibold">Always On</span>}
                    </div>
                    <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
                  </div>
                  <div className="flex-shrink-0 mt-0.5">
                    {item.locked ? (
                      <div className="w-11 h-6 bg-blue-600 rounded-full relative cursor-not-allowed opacity-60">
                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow" />
                      </div>
                    ) : (
                      <button
                        onClick={() => setPrefs(p => ({ ...p, [item.key]: !p[item.key as keyof typeof p] }))}
                        className={`w-11 h-6 rounded-full relative transition-colors ${prefs[item.key as keyof typeof prefs] ? 'bg-blue-600' : 'bg-gray-300'}`}
                        aria-label={`Toggle ${item.label}`}
                        role="switch"
                        aria-checked={prefs[item.key as keyof typeof prefs]}
                      >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${prefs[item.key as keyof typeof prefs] ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="px-5 pb-5 flex gap-3">
              <button
                onClick={() => save('essential', prefs)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-black py-3 rounded-full text-sm transition-colors"
              >
                Save My Preferences
              </button>
              <button
                onClick={() => save('all', { analytics: true, marketing: true, personalization: true })}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-full text-sm transition-colors"
              >
                Accept All
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
