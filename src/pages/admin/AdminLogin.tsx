import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, Shield } from 'lucide-react';
import { toast } from 'sonner';

const ADMIN_PASSWORD_KEY = 'fwc26_admin_pw';
const DEFAULT_PASSWORD = 'admin2026';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const storedPw = localStorage.getItem(ADMIN_PASSWORD_KEY) || DEFAULT_PASSWORD;

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (password === storedPw) {
        sessionStorage.setItem('fwc26_admin_auth', 'true');
        navigate('/admin');
        toast.success('Welcome, Admin!');
      } else {
        toast.error('Incorrect password. Try again.');
        setLoading(false);
      }
    }, 600);
  }

  return (
    <div className="min-h-screen bg-[#0a1f5c] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-yellow-400 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <span className="text-black font-black text-2xl">26</span>
          </div>
          <h1 className="text-3xl font-black text-white mb-1">Admin Panel</h1>
          <p className="text-white/50 text-sm">FIFA World Cup 2026™ Management</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-xl p-3 mb-6">
            <Shield size={16} className="text-blue-500 flex-shrink-0" />
            <p className="text-blue-700 text-xs font-medium">This area is restricted to authorized administrators only.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Admin Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={show ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full border border-gray-200 rounded-lg pl-9 pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
                <button type="button" onClick={() => setShow(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {show ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              <p className="text-[10px] text-gray-400 mt-1">Default password: admin2026 (change after first login)</p>
            </div>

            <button type="submit" disabled={loading || !password}
              className="w-full bg-[#0a1f5c] hover:bg-blue-900 disabled:bg-gray-300 text-white font-black py-3.5 rounded-full text-sm uppercase tracking-wide transition-colors flex items-center justify-center gap-2">
              {loading ? (
                <><svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> Verifying...</>
              ) : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-center text-white/30 text-xs mt-6">
          <a href="/" className="hover:text-white/50 transition-colors">← Return to public site</a>
        </p>
      </div>
    </div>
  );
}
