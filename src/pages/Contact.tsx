import { useState } from 'react';
import { Mail, Phone, MessageSquare, Check } from 'lucide-react';
import { toast } from 'sonner';

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', category: '', message: '' });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all required fields.');
      return;
    }
    setTimeout(() => { setSent(true); }, 800);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-black text-white py-14 px-4">
        <div className="max-w-5xl mx-auto">
          <p className="text-blue-400 text-xs font-semibold uppercase tracking-widest mb-2">Support</p>
          <h1 className="text-4xl md:text-5xl font-black mb-2">Contact Us</h1>
          <p className="text-gray-400 text-sm">FIFA World Cup 2026™ Official Support — We're here to help.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Info sidebar */}
        <div className="space-y-5">
          {[
            { icon: Mail, title: 'Email Support', detail: 'support@fifa2026.com', sub: 'Response within 24 hours' },
            { icon: Phone, title: 'Phone Support', detail: '+1 800 FIFA 2026', sub: 'Mon–Fri, 8am–8pm EST' },
            { icon: MessageSquare, title: 'Live Chat', detail: 'Available on site', sub: 'Response in under 5 minutes' },
          ].map(item => (
            <div key={item.title} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-blue-100 rounded-full w-9 h-9 flex items-center justify-center">
                  <item.icon size={17} className="text-blue-600" />
                </div>
                <h4 className="font-bold text-gray-900 text-sm">{item.title}</h4>
              </div>
              <p className="text-gray-700 text-sm font-semibold">{item.detail}</p>
              <p className="text-gray-400 text-xs mt-0.5">{item.sub}</p>
            </div>
          ))}
        </div>

        {/* Form */}
        {sent ? (
          <div className="lg:col-span-2 bg-white rounded-2xl p-10 shadow-sm border border-gray-100 text-center flex flex-col items-center justify-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Check size={30} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">Message Sent!</h2>
            <p className="text-gray-500 text-sm">Thank you for reaching out. Our support team will respond to <strong>{form.email}</strong> within 24 hours.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="lg:col-span-2 bg-white rounded-2xl p-8 shadow-sm border border-gray-100 space-y-5">
            <h2 className="text-xl font-black text-gray-900">Send us a Message</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Full Name *</label>
                <input name="name" value={form.name} onChange={handleChange} placeholder="John Doe"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email Address *</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="john@example.com"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Category</label>
              <select name="category" value={form.category} onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                <option value="">Select a topic</option>
                <option>Ticket Purchase</option>
                <option>Fan ID</option>
                <option>Hospitality Packages</option>
                <option>VIP Seats</option>
                <option>Merchandise</option>
                <option>Refunds & Cancellations</option>
                <option>Technical Issue</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Subject</label>
              <input name="subject" value={form.subject} onChange={handleChange} placeholder="Brief subject"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Message *</label>
              <textarea name="message" value={form.message} onChange={handleChange} rows={5} placeholder="Describe your question or issue..."
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
            </div>
            <button type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-3.5 rounded-full text-sm uppercase tracking-wide transition-colors">
              Send Message
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
