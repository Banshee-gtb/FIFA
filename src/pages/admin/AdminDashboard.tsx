import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import {
  LayoutDashboard, Gift, CreditCard, ShoppingBag, Calendar,
  Ticket, LogOut, Check, X, Eye, EyeOff, ChevronRight,
  RefreshCw, AlertCircle, Lock, Settings, BarChart3,
  Edit2, Save, Ban, CheckCircle, Clock, DollarSign, Users
} from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────
interface GiftCard {
  code: string; denomination: number; purchasedAt: string;
  used: boolean; usedAt?: string; usedByOrderRef?: string;
  recipientName?: string; senderName?: string;
}

interface PayoneerProof {
  orderRef: string; txId: string; senderEmail: string;
  amount: string; currency: string; name: string;
  notes?: string; submittedAt: string; status: 'pending' | 'verified' | 'rejected';
}

interface Order {
  ref: string; firstName: string; lastName: string; email: string;
  items: Array<{ name: string; quantity: number; price: number; type: string }>;
  total: number; payMethod: string; date: string;
}

interface TicketInventory {
  id: string; name: string; price: number; type: string; soldOut: boolean;
}

interface MatchData {
  id: string; stage: string; group?: string; date: string; time: string;
  team1: string; team1Flag: string; score1?: number;
  team2: string; team2Flag: string; score2?: number;
  venue: string; city: string; status?: 'upcoming' | 'live' | 'ft' | 'soldout';
}

const ADMIN_PASSWORD_KEY = 'fwc26_admin_pw';
const DEFAULT_PASSWORD = 'admin2026';

const NAV_ITEMS = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard },
  { key: 'giftcards', label: 'Gift Cards', icon: Gift },
  { key: 'payoneer', label: 'Payoneer Proofs', icon: CreditCard },
  { key: 'orders', label: 'Orders', icon: ShoppingBag },
  { key: 'matches', label: 'Match Manager', icon: Calendar },
  { key: 'inventory', label: 'Ticket Inventory', icon: Ticket },
  { key: 'settings', label: 'Settings', icon: Settings },
];

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, color }: { label: string; value: string | number; sub?: string; color: string }) {
  return (
    <div className={`${color} rounded-2xl p-5 text-white`}>
      <p className="text-white/70 text-xs font-semibold uppercase tracking-wide mb-1">{label}</p>
      <p className="text-3xl font-black">{value}</p>
      {sub && <p className="text-white/60 text-xs mt-1">{sub}</p>}
    </div>
  );
}

// ── Badge ─────────────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    verified: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
    upcoming: 'bg-blue-100 text-blue-700',
    live: 'bg-red-100 text-red-700',
    ft: 'bg-gray-100 text-gray-600',
    soldout: 'bg-orange-100 text-orange-700',
    used: 'bg-gray-100 text-gray-500',
    active: 'bg-green-100 text-green-700',
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${map[status] || 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');

  // ── Data state ──
  const [giftCards, setGiftCards] = useState<GiftCard[]>([]);
  const [payoneerProofs, setPayoneerProofs] = useState<PayoneerProof[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [matches, setMatches] = useState<MatchData[]>([]);
  const [inventory, setInventory] = useState<TicketInventory[]>([]);

  // ── Settings state ──
  const [newPassword, setNewPassword] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [payoneerEmail, setPayoneerEmail] = useState('payments@fifa2026experience.com');
  const [payoneerName, setPayoneerName] = useState('FIFA 2026 Experience Ltd.');
  const [payoneerAccountId, setPayoneerAccountId] = useState('P-26001234567');

  // ── Match edit state ──
  const [editingMatch, setEditingMatch] = useState<string | null>(null);
  const [matchEdits, setMatchEdits] = useState<Partial<MatchData>>({});

  // ── Auth check ──
  useEffect(() => {
    if (sessionStorage.getItem('fwc26_admin_auth') !== 'true') {
      navigate('/admin/login');
    }
  }, [navigate]);

  // ── Load data ──
  function loadData() {
    setGiftCards(JSON.parse(localStorage.getItem('fwc26_gift_cards') || '[]'));
    setPayoneerProofs(JSON.parse(localStorage.getItem('fwc26_payoneer_proofs') || '[]'));
    setOrders(JSON.parse(localStorage.getItem('fwc26_orders') || '[]').reverse());

    // Load matches from storage or seed defaults
    const savedMatches = localStorage.getItem('fwc26_admin_matches');
    if (savedMatches) {
      setMatches(JSON.parse(savedMatches));
    } else {
      const defaults: MatchData[] = [
        { id: 'm1', stage: 'Group Stage', group: 'A', date: '2026-06-11', time: '18:00', team1: 'Mexico', team1Flag: 'mx', team2: 'USA', team2Flag: 'us', venue: 'Estadio Azteca', city: 'Mexico City', status: 'upcoming' },
        { id: 'm2', stage: 'Group Stage', group: 'A', date: '2026-06-11', time: '21:00', team1: 'Canada', team1Flag: 'ca', team2: 'Argentina', team2Flag: 'ar', venue: 'BMO Field', city: 'Toronto', status: 'upcoming' },
        { id: 'm3', stage: 'Group Stage', group: 'B', date: '2026-06-12', time: '15:00', team1: 'Brazil', team1Flag: 'br', team2: 'Germany', team2Flag: 'de', venue: 'MetLife Stadium', city: 'New York', status: 'upcoming' },
        { id: 'm4', stage: 'Group Stage', group: 'B', date: '2026-06-12', time: '18:00', team1: 'France', team1Flag: 'fr', team2: 'Spain', team2Flag: 'es', venue: 'SoFi Stadium', city: 'Los Angeles', status: 'upcoming' },
        { id: 'm5', stage: 'Group Stage', group: 'C', date: '2026-06-12', time: '21:00', team1: 'England', team1Flag: 'gb', team2: 'Portugal', team2Flag: 'pt', venue: 'AT&T Stadium', city: 'Dallas', status: 'upcoming' },
        { id: 'm6', stage: 'Group Stage', group: 'C', date: '2026-06-13', time: '15:00', team1: 'Netherlands', team1Flag: 'nl', team2: 'Italy', team2Flag: 'it', venue: 'Hard Rock Stadium', city: 'Miami', status: 'upcoming' },
        { id: 'qf1', stage: 'Quarter-Final', date: '2026-07-03', time: '20:00', team1: 'TBD', team1Flag: 'un', team2: 'TBD', team2Flag: 'un', venue: 'MetLife Stadium', city: 'New York', status: 'upcoming' },
        { id: 'sf1', stage: 'Semi-Final', date: '2026-07-10', time: '20:00', team1: 'TBD', team1Flag: 'un', team2: 'TBD', team2Flag: 'un', venue: 'AT&T Stadium', city: 'Dallas', status: 'upcoming' },
        { id: 'final', stage: 'Final', date: '2026-07-19', time: '18:00', team1: 'TBD', team1Flag: 'un', team2: 'TBD', team2Flag: 'un', venue: 'MetLife Stadium', city: 'New York', status: 'upcoming' },
      ];
      setMatches(defaults);
      localStorage.setItem('fwc26_admin_matches', JSON.stringify(defaults));
    }

    // Load ticket inventory
    const savedInv = localStorage.getItem('fwc26_ticket_inventory');
    if (savedInv) {
      setInventory(JSON.parse(savedInv));
    } else {
      const defaults: TicketInventory[] = [
        { id: 'cat1', name: 'Category 1 — Premium Seating', price: 220, type: 'standard', soldOut: false },
        { id: 'cat2', name: 'Category 2 — Midfield Sections', price: 165, type: 'standard', soldOut: false },
        { id: 'cat3', name: 'Category 3 — Affordable Access', price: 110, type: 'standard', soldOut: false },
        { id: 'hospitality-classic', name: 'FIFA Hospitality Classic', price: 890, type: 'hospitality', soldOut: false },
        { id: 'hospitality-premium', name: 'FIFA Hospitality Premium', price: 1850, type: 'hospitality', soldOut: false },
        { id: 'vip-box', name: 'VIP Private Box', price: 4500, type: 'vip', soldOut: false },
        { id: 'vip-pitchside', name: 'VIP Pitch-Side Seats', price: 2800, type: 'vip', soldOut: false },
        { id: 'tour-city', name: 'City Experience Tour', price: 195, type: 'tour', soldOut: false },
        { id: 'tour-stadium', name: 'Stadium Insider Tour', price: 145, type: 'tour', soldOut: false },
        { id: 'tour-full', name: 'Full World Cup Experience', price: 680, type: 'tour', soldOut: false },
      ];
      setInventory(defaults);
      localStorage.setItem('fwc26_ticket_inventory', JSON.stringify(defaults));
    }

    // Load settings
    const savedSettings = localStorage.getItem('fwc26_admin_settings');
    if (savedSettings) {
      const s = JSON.parse(savedSettings);
      if (s.payoneerEmail) setPayoneerEmail(s.payoneerEmail);
      if (s.payoneerName) setPayoneerName(s.payoneerName);
      if (s.payoneerAccountId) setPayoneerAccountId(s.payoneerAccountId);
    }
  }

  useEffect(() => { loadData(); }, []);

  function logout() {
    sessionStorage.removeItem('fwc26_admin_auth');
    navigate('/admin/login');
    toast.success('Logged out successfully.');
  }

  // ── Gift Card actions ──
  function revokeGiftCard(code: string) {
    const updated = giftCards.map(c => c.code === code ? { ...c, used: true, usedAt: new Date().toISOString(), usedByOrderRef: 'REVOKED' } : c);
    setGiftCards(updated);
    localStorage.setItem('fwc26_gift_cards', JSON.stringify(updated));
    toast.success('Gift card revoked.');
  }

  // ── Payoneer Proof actions ──
  function updateProofStatus(idx: number, status: 'verified' | 'rejected') {
    const updated = [...payoneerProofs];
    updated[idx] = { ...updated[idx], status };
    setPayoneerProofs(updated);
    localStorage.setItem('fwc26_payoneer_proofs', JSON.stringify(updated));
    toast.success(`Payment proof ${status}.`);
  }

  // ── Match edit actions ──
  function startEditMatch(match: MatchData) {
    setEditingMatch(match.id);
    setMatchEdits({ ...match });
  }

  function saveMatch(id: string) {
    const updated = matches.map(m => m.id === id ? { ...m, ...matchEdits } : m);
    setMatches(updated);
    localStorage.setItem('fwc26_admin_matches', JSON.stringify(updated));
    setEditingMatch(null);
    toast.success('Match updated.');
  }

  // ── Inventory toggle ──
  function toggleSoldOut(id: string) {
    const updated = inventory.map(t => t.id === id ? { ...t, soldOut: !t.soldOut } : t);
    setInventory(updated);
    localStorage.setItem('fwc26_ticket_inventory', JSON.stringify(updated));
    toast.success('Inventory updated.');
  }

  // ── Settings save ──
  function saveSettings() {
    if (newPassword && newPassword !== confirmPw) {
      toast.error('Passwords do not match.');
      return;
    }
    if (newPassword) {
      localStorage.setItem(ADMIN_PASSWORD_KEY, newPassword);
      setNewPassword(''); setConfirmPw('');
      toast.success('Password updated.');
    }
    const settings = { payoneerEmail, payoneerName, payoneerAccountId };
    localStorage.setItem('fwc26_admin_settings', JSON.stringify(settings));
    toast.success('Settings saved.');
  }

  // ── Stats ──
  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const pendingProofs = payoneerProofs.filter(p => p.status === 'pending').length;
  const activeGiftCards = giftCards.filter(g => !g.used).length;
  const soldOutCount = inventory.filter(t => t.soldOut).length;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* ── Sidebar ── */}
      <aside className="w-64 bg-[#0a1f5c] text-white flex flex-col flex-shrink-0 min-h-screen">
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-400 rounded-full w-10 h-10 flex items-center justify-center">
              <span className="text-black font-black text-sm">26</span>
            </div>
            <div>
              <p className="font-black text-sm">Admin Panel</p>
              <p className="text-white/40 text-[10px]">FIFA WC 2026™</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 py-4">
          {NAV_ITEMS.map(item => (
            <button key={item.key} onClick={() => setActiveSection(item.key)}
              className={`w-full flex items-center gap-3 px-5 py-3 text-sm font-semibold transition-colors text-left ${activeSection === item.key ? 'bg-white/10 text-white border-r-2 border-yellow-400' : 'text-white/60 hover:text-white hover:bg-white/5'}`}>
              <item.icon size={17} />
              {item.label}
              {item.key === 'payoneer' && pendingProofs > 0 && (
                <span className="ml-auto bg-red-500 text-white text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center">{pendingProofs}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2">
          <Link to="/" target="_blank"
            className="flex items-center gap-2 text-white/50 hover:text-white text-xs transition-colors px-1">
            <ChevronRight size={12} /> View Public Site
          </Link>
          <button onClick={logout} className="flex items-center gap-2 text-red-400 hover:text-red-300 text-xs transition-colors px-1">
            <LogOut size={12} /> Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-black text-gray-900 capitalize">
                {NAV_ITEMS.find(n => n.key === activeSection)?.label}
              </h1>
              <p className="text-gray-400 text-sm">FIFA World Cup 2026™ Admin Panel</p>
            </div>
            <button onClick={loadData} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 text-xs font-semibold border border-gray-200 px-3 py-2 rounded-full hover:bg-gray-50 transition-colors">
              <RefreshCw size={12} /> Refresh
            </button>
          </div>

          {/* ── OVERVIEW ── */}
          {activeSection === 'overview' && (
            <div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <StatCard label="Total Revenue" value={`$${totalRevenue.toFixed(0)}`} sub={`${orders.length} orders`} color="bg-blue-600" />
                <StatCard label="Pending Proofs" value={pendingProofs} sub="Payoneer payments" color={pendingProofs > 0 ? 'bg-red-500' : 'bg-green-500'} />
                <StatCard label="Active Gift Cards" value={activeGiftCards} sub={`${giftCards.length} total issued`} color="bg-purple-600" />
                <StatCard label="Sold Out Items" value={soldOutCount} sub={`${inventory.length} total tickets`} color={soldOutCount > 0 ? 'bg-orange-500' : 'bg-gray-600'} />
              </div>

              {/* Quick actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {pendingProofs > 0 && (
                  <div className="bg-white rounded-2xl p-5 shadow-sm border border-red-100">
                    <div className="flex items-center gap-3 mb-3">
                      <AlertCircle size={18} className="text-red-500" />
                      <h3 className="font-black text-gray-900 text-sm">Pending Payoneer Proofs</h3>
                      <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">{pendingProofs}</span>
                    </div>
                    <p className="text-gray-500 text-xs mb-3">Review and approve incoming payment proofs to activate tickets.</p>
                    <button onClick={() => setActiveSection('payoneer')}
                      className="bg-red-500 hover:bg-red-600 text-white font-bold text-xs px-4 py-2 rounded-full transition-colors">
                      Review Now →
                    </button>
                  </div>
                )}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3 mb-3">
                    <BarChart3 size={18} className="text-blue-500" />
                    <h3 className="font-black text-gray-900 text-sm">Recent Orders</h3>
                  </div>
                  <div className="space-y-2">
                    {orders.slice(0, 3).map(o => (
                      <div key={o.ref} className="flex items-center justify-between text-xs">
                        <span className="font-mono text-blue-600 font-bold">FWC26-{o.ref}</span>
                        <span className="text-gray-500">{o.firstName} {o.lastName}</span>
                        <span className="font-bold text-gray-900">${o.total.toFixed(0)}</span>
                      </div>
                    ))}
                    {orders.length === 0 && <p className="text-gray-400 text-xs">No orders yet.</p>}
                  </div>
                </div>
              </div>

              {/* Summary table */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <h3 className="font-black text-gray-900 mb-4">Platform Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  {[
                    { icon: <ShoppingBag size={20} className="text-blue-500" />, label: 'Orders', value: orders.length },
                    { icon: <Gift size={20} className="text-purple-500" />, label: 'Gift Cards Issued', value: giftCards.length },
                    { icon: <CreditCard size={20} className="text-orange-500" />, label: 'Payoneer Proofs', value: payoneerProofs.length },
                    { icon: <DollarSign size={20} className="text-green-500" />, label: 'Revenue', value: `$${totalRevenue.toFixed(0)}` },
                  ].map(s => (
                    <div key={s.label} className="bg-gray-50 rounded-xl p-4">
                      <div className="flex justify-center mb-2">{s.icon}</div>
                      <p className="font-black text-xl text-gray-900">{s.value}</p>
                      <p className="text-xs text-gray-400">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── GIFT CARDS ── */}
          {activeSection === 'giftcards' && (
            <div>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
                  <p className="text-2xl font-black text-purple-600">{giftCards.length}</p>
                  <p className="text-xs text-gray-400 mt-1">Total Issued</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
                  <p className="text-2xl font-black text-green-600">{giftCards.filter(g => !g.used).length}</p>
                  <p className="text-xs text-gray-400 mt-1">Active / Unused</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
                  <p className="text-2xl font-black text-gray-500">{giftCards.filter(g => g.used).length}</p>
                  <p className="text-xs text-gray-400 mt-1">Used / Revoked</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-black text-gray-900 text-sm">All Gift Cards</h3>
                  <span className="text-xs text-gray-400">{giftCards.length} total</span>
                </div>
                {giftCards.length === 0 ? (
                  <div className="p-10 text-center text-gray-400 text-sm">No gift cards issued yet.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-gray-100 text-gray-500 uppercase tracking-wide text-[10px]">
                          <th className="px-4 py-3 text-left font-semibold">Code</th>
                          <th className="px-4 py-3 text-left font-semibold">Amount</th>
                          <th className="px-4 py-3 text-left font-semibold">Recipient</th>
                          <th className="px-4 py-3 text-left font-semibold">Purchased</th>
                          <th className="px-4 py-3 text-left font-semibold">Status</th>
                          <th className="px-4 py-3 text-left font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {giftCards.map((card, i) => (
                          <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 font-mono font-bold text-blue-600">{card.code}</td>
                            <td className="px-4 py-3 font-black text-gray-900">${card.denomination}</td>
                            <td className="px-4 py-3 text-gray-600">{card.recipientName || '—'}</td>
                            <td className="px-4 py-3 text-gray-400">{new Date(card.purchasedAt).toLocaleDateString()}</td>
                            <td className="px-4 py-3">
                              <StatusBadge status={card.used ? 'used' : 'active'} />
                            </td>
                            <td className="px-4 py-3">
                              {!card.used && (
                                <button onClick={() => revokeGiftCard(card.code)}
                                  className="flex items-center gap-1 text-red-500 hover:text-red-700 font-semibold text-[10px] transition-colors">
                                  <Ban size={11} /> Revoke
                                </button>
                              )}
                              {card.used && card.usedByOrderRef === 'REVOKED' && (
                                <span className="text-gray-400 text-[10px]">Revoked</span>
                              )}
                              {card.used && card.usedByOrderRef !== 'REVOKED' && (
                                <span className="text-gray-400 text-[10px] font-mono">Used: {card.usedByOrderRef}</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── PAYONEER PROOFS ── */}
          {activeSection === 'payoneer' && (
            <div>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-xl p-4 border border-yellow-100 shadow-sm text-center">
                  <p className="text-2xl font-black text-yellow-600">{payoneerProofs.filter(p => p.status === 'pending').length}</p>
                  <p className="text-xs text-gray-400 mt-1">Pending Review</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-green-100 shadow-sm text-center">
                  <p className="text-2xl font-black text-green-600">{payoneerProofs.filter(p => p.status === 'verified').length}</p>
                  <p className="text-xs text-gray-400 mt-1">Verified</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-red-100 shadow-sm text-center">
                  <p className="text-2xl font-black text-red-500">{payoneerProofs.filter(p => p.status === 'rejected').length}</p>
                  <p className="text-xs text-gray-400 mt-1">Rejected</p>
                </div>
              </div>

              <div className="space-y-4">
                {payoneerProofs.length === 0 && (
                  <div className="bg-white rounded-2xl p-10 text-center text-gray-400 text-sm">No payment proofs submitted yet.</div>
                )}
                {payoneerProofs.map((proof, i) => (
                  <div key={i} className={`bg-white rounded-2xl p-5 shadow-sm border ${proof.status === 'pending' ? 'border-yellow-200' : proof.status === 'verified' ? 'border-green-100' : 'border-red-100'}`}>
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <StatusBadge status={proof.status} />
                          <span className="font-mono text-blue-600 text-xs font-bold">{proof.orderRef}</span>
                          <span className="text-gray-400 text-xs">{new Date(proof.submittedAt).toLocaleString()}</span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                          <div><p className="text-gray-400 uppercase text-[10px] font-semibold">Name</p><p className="font-semibold text-gray-900">{proof.name}</p></div>
                          <div><p className="text-gray-400 uppercase text-[10px] font-semibold">Email</p><p className="font-semibold text-gray-900 truncate">{proof.senderEmail}</p></div>
                          <div><p className="text-gray-400 uppercase text-[10px] font-semibold">Transaction ID</p><p className="font-mono font-bold text-gray-900">{proof.txId}</p></div>
                          <div><p className="text-gray-400 uppercase text-[10px] font-semibold">Amount</p><p className="font-black text-gray-900">{proof.amount} {proof.currency}</p></div>
                        </div>
                        {proof.notes && <p className="text-gray-400 text-xs mt-2 italic">Note: {proof.notes}</p>}
                      </div>
                      {proof.status === 'pending' && (
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button onClick={() => updateProofStatus(payoneerProofs.indexOf(proof), 'verified')}
                            className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white font-bold text-xs px-4 py-2 rounded-full transition-colors">
                            <Check size={12} /> Verify
                          </button>
                          <button onClick={() => updateProofStatus(payoneerProofs.indexOf(proof), 'rejected')}
                            className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white font-bold text-xs px-4 py-2 rounded-full transition-colors">
                            <X size={12} /> Reject
                          </button>
                        </div>
                      )}
                      {proof.status === 'verified' && (
                        <CheckCircle size={20} className="text-green-500 flex-shrink-0" />
                      )}
                      {proof.status === 'rejected' && (
                        <Ban size={20} className="text-red-400 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── ORDERS ── */}
          {activeSection === 'orders' && (
            <div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-black text-gray-900 text-sm">All Orders</h3>
                  <span className="text-xs text-gray-400">{orders.length} total · ${totalRevenue.toFixed(2)} revenue</span>
                </div>
                {orders.length === 0 ? (
                  <div className="p-10 text-center text-gray-400 text-sm">No orders yet.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-gray-100 text-gray-500 uppercase tracking-wide text-[10px]">
                          <th className="px-4 py-3 text-left font-semibold">Reference</th>
                          <th className="px-4 py-3 text-left font-semibold">Customer</th>
                          <th className="px-4 py-3 text-left font-semibold">Email</th>
                          <th className="px-4 py-3 text-left font-semibold">Items</th>
                          <th className="px-4 py-3 text-left font-semibold">Total</th>
                          <th className="px-4 py-3 text-left font-semibold">Payment</th>
                          <th className="px-4 py-3 text-left font-semibold">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order, i) => (
                          <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 font-mono font-bold text-blue-600">FWC26-{order.ref}</td>
                            <td className="px-4 py-3 font-semibold text-gray-900">{order.firstName} {order.lastName}</td>
                            <td className="px-4 py-3 text-gray-500">{order.email}</td>
                            <td className="px-4 py-3 text-gray-600">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</td>
                            <td className="px-4 py-3 font-black text-gray-900">${order.total.toFixed(2)}</td>
                            <td className="px-4 py-3">
                              <StatusBadge status={order.payMethod} />
                            </td>
                            <td className="px-4 py-3 text-gray-400">{order.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── MATCH MANAGER ── */}
          {activeSection === 'matches' && (
            <div>
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-5 flex items-start gap-2 text-xs text-blue-700">
                <AlertCircle size={14} className="flex-shrink-0 mt-0.5 text-blue-500" />
                Changes are saved to localStorage and will be reflected in the public match schedule immediately.
              </div>
              <div className="space-y-3">
                {matches.map(match => (
                  <div key={match.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                    {editingMatch === match.id ? (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                          <div>
                            <label className="block text-gray-500 font-semibold mb-1">Team 1</label>
                            <input value={matchEdits.team1 || ''} onChange={e => setMatchEdits(p => ({ ...p, team1: e.target.value }))}
                              className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
                          </div>
                          <div>
                            <label className="block text-gray-500 font-semibold mb-1">Score 1</label>
                            <input type="number" value={matchEdits.score1 ?? ''} onChange={e => setMatchEdits(p => ({ ...p, score1: parseInt(e.target.value) || 0 }))}
                              className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
                          </div>
                          <div>
                            <label className="block text-gray-500 font-semibold mb-1">Team 2</label>
                            <input value={matchEdits.team2 || ''} onChange={e => setMatchEdits(p => ({ ...p, team2: e.target.value }))}
                              className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
                          </div>
                          <div>
                            <label className="block text-gray-500 font-semibold mb-1">Score 2</label>
                            <input type="number" value={matchEdits.score2 ?? ''} onChange={e => setMatchEdits(p => ({ ...p, score2: parseInt(e.target.value) || 0 }))}
                              className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
                          </div>
                          <div>
                            <label className="block text-gray-500 font-semibold mb-1">Date</label>
                            <input type="date" value={matchEdits.date || ''} onChange={e => setMatchEdits(p => ({ ...p, date: e.target.value }))}
                              className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
                          </div>
                          <div>
                            <label className="block text-gray-500 font-semibold mb-1">Time</label>
                            <input type="time" value={matchEdits.time || ''} onChange={e => setMatchEdits(p => ({ ...p, time: e.target.value }))}
                              className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
                          </div>
                          <div>
                            <label className="block text-gray-500 font-semibold mb-1">Status</label>
                            <select value={matchEdits.status || 'upcoming'} onChange={e => setMatchEdits(p => ({ ...p, status: e.target.value as MatchData['status'] }))}
                              className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white">
                              <option value="upcoming">Upcoming</option>
                              <option value="live">Live</option>
                              <option value="ft">Full Time</option>
                              <option value="soldout">Sold Out</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-gray-500 font-semibold mb-1">Venue</label>
                            <input value={matchEdits.venue || ''} onChange={e => setMatchEdits(p => ({ ...p, venue: e.target.value }))}
                              className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => saveMatch(match.id)}
                            className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white font-bold text-xs px-4 py-2 rounded-full transition-colors">
                            <Save size={11} /> Save Changes
                          </button>
                          <button onClick={() => setEditingMatch(null)}
                            className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs px-4 py-2 rounded-full transition-colors">
                            <X size={11} /> Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between gap-4 flex-wrap">
                        <div className="flex items-center gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full">{match.stage}</span>
                              {match.status && <StatusBadge status={match.status} />}
                            </div>
                            <div className="flex items-center gap-2 text-sm font-black text-gray-900">
                              <img src={`https://flagcdn.com/w20/${match.team1Flag}.png`} alt="" className="h-3.5 rounded-sm" />
                              <span>{match.team1}</span>
                              {match.score1 !== undefined && match.score2 !== undefined && (
                                <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-700">{match.score1} – {match.score2}</span>
                              )}
                              <span>vs</span>
                              <span>{match.team2}</span>
                              <img src={`https://flagcdn.com/w20/${match.team2Flag}.png`} alt="" className="h-3.5 rounded-sm" />
                            </div>
                            <p className="text-xs text-gray-400 mt-1">{match.date} · {match.time} · {match.venue}, {match.city}</p>
                          </div>
                        </div>
                        <button onClick={() => startEditMatch(match)}
                          className="flex items-center gap-1.5 border border-gray-200 hover:border-blue-400 text-gray-600 hover:text-blue-600 font-bold text-xs px-3 py-2 rounded-full transition-colors flex-shrink-0">
                          <Edit2 size={11} /> Edit
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── TICKET INVENTORY ── */}
          {activeSection === 'inventory' && (
            <div>
              <div className="bg-orange-50 border border-orange-100 rounded-xl p-3 mb-5 flex items-start gap-2 text-xs text-orange-700">
                <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                Mark tickets as sold out to prevent new purchases. Changes take effect immediately on the public site.
              </div>
              <div className="space-y-3">
                {['standard', 'hospitality', 'vip', 'tour'].map(type => (
                  <div key={type} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
                      <h3 className="font-black text-gray-900 text-sm capitalize">{type === 'standard' ? 'Match Tickets' : type === 'hospitality' ? 'Hospitality Packages' : type === 'vip' ? 'VIP Seats' : 'Tour Packages'}</h3>
                    </div>
                    <div className="divide-y divide-gray-50">
                      {inventory.filter(t => t.type === type).map(ticket => (
                        <div key={ticket.id} className="flex items-center justify-between px-5 py-4">
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">{ticket.name}</p>
                            <p className="text-xs text-gray-400">${ticket.price.toFixed(0)} per ticket</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <StatusBadge status={ticket.soldOut ? 'soldout' : 'active'} />
                            <button onClick={() => toggleSoldOut(ticket.id)}
                              className={`w-11 h-6 rounded-full relative transition-colors ${!ticket.soldOut ? 'bg-green-500' : 'bg-gray-300'}`}
                              role="switch" aria-checked={!ticket.soldOut} aria-label="Toggle availability">
                              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${!ticket.soldOut ? 'translate-x-6' : 'translate-x-1'}`} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── SETTINGS ── */}
          {activeSection === 'settings' && (
            <div className="max-w-2xl space-y-6">
              {/* Change password */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-5">
                  <Lock size={18} className="text-gray-500" />
                  <h3 className="font-black text-gray-900">Change Admin Password</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">New Password</label>
                    <div className="relative">
                      <input type={showPw ? 'text' : 'password'} value={newPassword} onChange={e => setNewPassword(e.target.value)}
                        placeholder="New admin password"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      <button type="button" onClick={() => setShowPw(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                        {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Confirm New Password</label>
                    <input type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)}
                      placeholder="Confirm password"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
              </div>

              {/* Payoneer settings */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-5">
                  <CreditCard size={18} className="text-orange-500" />
                  <h3 className="font-black text-gray-900">Payoneer Receiving Account</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Payoneer Email</label>
                    <input value={payoneerEmail} onChange={e => setPayoneerEmail(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Account Name</label>
                    <input value={payoneerName} onChange={e => setPayoneerName(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Account ID</label>
                    <input value={payoneerAccountId} onChange={e => setPayoneerAccountId(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
                  </div>
                  <p className="text-xs text-gray-400">
                    These details will display on the checkout page and /payoneer payment guide for buyers.
                  </p>
                </div>
              </div>

              {/* Site info */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <Users size={18} className="text-blue-500" />
                  <h3 className="font-black text-gray-900">Site Statistics</h3>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-gray-400 font-semibold uppercase tracking-wide">Total Orders</p>
                    <p className="font-black text-gray-900 text-xl mt-1">{orders.length}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-gray-400 font-semibold uppercase tracking-wide">Gift Cards Issued</p>
                    <p className="font-black text-gray-900 text-xl mt-1">{giftCards.length}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-gray-400 font-semibold uppercase tracking-wide">Revenue</p>
                    <p className="font-black text-gray-900 text-xl mt-1">${totalRevenue.toFixed(0)}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-gray-400 font-semibold uppercase tracking-wide">Pending Proofs</p>
                    <p className={`font-black text-xl mt-1 ${pendingProofs > 0 ? 'text-red-500' : 'text-gray-900'}`}>{pendingProofs}</p>
                  </div>
                </div>
              </div>

              <button onClick={saveSettings}
                className="w-full bg-[#0a1f5c] hover:bg-blue-900 text-white font-black py-4 rounded-full text-sm uppercase tracking-wide transition-colors flex items-center justify-center gap-2">
                <Save size={16} /> Save All Settings
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
