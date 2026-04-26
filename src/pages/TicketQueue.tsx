import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Users, Ticket, RefreshCw } from 'lucide-react';

function generateCaptcha() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export default function TicketQueue() {
  const [position, setPosition] = useState(() => Math.floor(Math.random() * 40000) + 15000);
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [input, setInput] = useState('');
  const [joined, setJoined] = useState(false);
  const [waitMinutes, setWaitMinutes] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState('');
  const [entered, setEntered] = useState(false);
  const navigate = useNavigate();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (joined && !entered) {
      intervalRef.current = setInterval(() => {
        setPosition(p => {
          const drop = Math.floor(Math.random() * 120) + 40;
          const newPos = p - drop;
          if (newPos <= 0) {
            clearInterval(intervalRef.current!);
            setEntered(true);
            return 0;
          }
          return newPos;
        });
        setElapsed(e => e + 1);
      }, 1000);
      return () => clearInterval(intervalRef.current!);
    }
  }, [joined, entered]);

  useEffect(() => {
    setWaitMinutes(Math.ceil(position / 800));
  }, [position]);

  function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    if (input.toUpperCase() !== captcha) {
      setError('Incorrect code. Please try again.');
      setCaptcha(generateCaptcha());
      setInput('');
      return;
    }
    setError('');
    setJoined(true);
  }

  function refreshCaptcha() {
    setCaptcha(generateCaptcha());
    setInput('');
    setError('');
  }

  const progressPct = joined ? Math.min(100, Math.round((1 - position / (position + elapsed * 80)) * 100)) : 0;

  if (entered) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full text-center">
          <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5">
            <Ticket size={36} className="text-green-600" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">You're In!</h1>
          <p className="text-gray-500 text-sm mb-6">
            Your queue wait is complete. You now have <strong>15 minutes</strong> to complete your ticket purchase before your session expires.
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-6 text-xs text-yellow-800 font-medium">
            ⏱ Session expires in 15:00 — Complete your purchase now
          </div>
          <button
            onClick={() => navigate('/tickets')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-full text-sm uppercase tracking-wide transition-colors"
          >
            Buy Tickets Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-3">
            <span className="text-black font-black text-3xl">26</span>
          </div>
          <p className="text-white/60 text-xs uppercase tracking-widest">FIFA World Cup 2026™</p>
        </div>

        {!joined ? (
          /* CAPTCHA / JOIN form */
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-blue-50 border-b border-blue-100 px-6 py-4 text-center">
              <a href="#" className="text-blue-600 text-sm font-bold underline uppercase tracking-wide">
                CLICK HERE TO EXPLORE TICKET-INCLUSIVE HOSPITALITY PACKAGES
              </a>
            </div>
            <div className="p-8 text-center">
              <h1 className="text-2xl font-black text-gray-900 mb-2">Almost there...</h1>
              <p className="text-gray-600 text-sm mb-1">
                Thank you for waiting to access the FIFA World Cup 2026™ Last-Minute Sales Phase.
              </p>
              <p className="text-gray-700 text-sm font-semibold mt-4 mb-5">
                To join the queue, enter the characters you see in the image below and click <strong>'SUBMIT'</strong>.
              </p>

              {/* Captcha display */}
              <div className="flex items-center justify-center gap-4 mb-5">
                <div className="bg-gray-900 rounded-lg px-5 py-3 relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className="absolute bg-white/30 rounded-full" style={{
                        width: Math.random() * 30 + 10, height: Math.random() * 30 + 10,
                        left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
                      }} />
                    ))}
                  </div>
                  <span className="text-white text-2xl font-black tracking-[0.2em] relative z-10 select-none" style={{ fontFamily: 'monospace', textShadow: '1px 1px 2px rgba(0,0,0,0.5)', transform: 'skewX(-5deg)', display: 'inline-block' }}>
                    {captcha}
                  </span>
                </div>
                <button type="button" onClick={refreshCaptcha} className="text-blue-600 text-xs flex items-center gap-1 hover:underline font-medium">
                  <RefreshCw size={12} />
                  New captcha
                </button>
              </div>

              <form onSubmit={handleJoin}>
                <div className="flex items-center gap-3 mb-3">
                  <label className="text-sm font-semibold text-gray-600 whitespace-nowrap">Characters:</label>
                  <input
                    value={input}
                    onChange={e => setInput(e.target.value.toUpperCase())}
                    maxLength={5}
                    className="flex-1 border-2 border-gray-300 rounded px-3 py-2 text-sm font-mono uppercase focus:outline-none focus:border-blue-500"
                    placeholder=""
                  />
                </div>
                {error && <p className="text-red-500 text-xs mb-3">{error}</p>}
                <button
                  type="submit"
                  className="w-full bg-[#9b1b30] hover:bg-[#7a1525] text-white font-black py-3 rounded text-sm uppercase tracking-wider transition-colors"
                >
                  ▶ SUBMIT
                </button>
              </form>
            </div>
            <div className="bg-gray-50 border-t border-gray-100 px-6 py-3 flex justify-center">
              <button className="text-gray-500 text-sm flex items-center gap-2">
                <span>🌐</span> English
              </button>
            </div>
          </div>
        ) : (
          /* QUEUE STATUS */
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Clock size={18} className="text-blue-600 animate-pulse" />
                <span className="text-blue-600 text-sm font-bold uppercase tracking-wide">In Queue</span>
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-6">FIFA World Cup 2026™ — Last-Minute Sales</h2>

            {/* Position display */}
            <div className="bg-gray-50 rounded-2xl p-6 mb-5">
              <p className="text-gray-500 text-xs uppercase tracking-widest mb-2">Your position in queue</p>
              <div className="text-5xl font-black text-blue-600 mb-1">
                #{position.toLocaleString()}
              </div>
              <p className="text-gray-500 text-sm">Estimated wait: <span className="font-bold text-gray-800">{waitMinutes} min</span></p>
            </div>

            {/* Progress bar */}
            <div className="mb-5">
              <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span>Queue Progress</span>
                <span>{progressPct}%</span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-1000"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-5 text-center">
              <div className="bg-blue-50 rounded-xl p-3">
                <Users size={16} className="text-blue-600 mx-auto mb-1" />
                <p className="text-[11px] text-gray-500">People Ahead</p>
                <p className="font-black text-sm text-gray-900">{position.toLocaleString()}</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-3">
                <Clock size={16} className="text-blue-600 mx-auto mb-1" />
                <p className="text-[11px] text-gray-500">Est. Wait</p>
                <p className="font-black text-sm text-gray-900">{waitMinutes}m</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-3">
                <Ticket size={16} className="text-blue-600 mx-auto mb-1" />
                <p className="text-[11px] text-gray-500">Session</p>
                <p className="font-black text-sm text-gray-900">{elapsed}s</p>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-xs text-yellow-800 font-medium mb-5">
              ⚠️ Do not close this tab. Your position will be lost if you leave.
            </div>

            <a href="/hospitality" className="text-blue-600 text-sm font-bold underline">
              Explore Ticket-Inclusive Hospitality Packages →
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
