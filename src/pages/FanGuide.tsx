import { Link } from 'react-router-dom';
import { MapPin, Ticket, User, Shield, Utensils, Bus, Globe, AlertCircle } from 'lucide-react';

const sections = [
  {
    icon: Ticket,
    title: 'Tickets & Fan ID',
    items: [
      'Purchase your match tickets early — demand is extremely high.',
      'Register for your FIFA Fan ID before tickets go on sale.',
      'Tickets are digital — download them to the FIFA App.',
      'Your Fan ID must match the name on your ticket exactly.',
    ],
  },
  {
    icon: User,
    title: 'Stadium Entry',
    items: [
      'Arrive at least 90 minutes before kick-off.',
      'Bring your Fan ID (digital or printed) and a valid photo ID.',
      'Prohibited items: large bags, umbrellas, horns, selfie sticks.',
      'Security screening is mandatory at all entry points.',
    ],
  },
  {
    icon: Bus,
    title: 'Getting There',
    items: [
      'Public transportation is strongly recommended.',
      'Park & Ride services operate from all major venues.',
      'Rideshare drop-off zones are designated near each stadium.',
      'Plan extra time — road closures near venues on match days.',
    ],
  },
  {
    icon: Utensils,
    title: 'Food & Drink',
    items: [
      'Food and beverages are available inside all venues.',
      'Outside food and drink is not permitted in most stadiums.',
      'VIP and Hospitality guests enjoy premium dining included.',
      'Alcoholic beverages are served at designated points only.',
    ],
  },
  {
    icon: Shield,
    title: 'Safety & Security',
    items: [
      'FIFA operates a zero-tolerance policy against discrimination.',
      'Emergency services are present at all venues.',
      'Report any suspicious activity to security immediately.',
      'Keep personal belongings secure at all times.',
    ],
  },
  {
    icon: Globe,
    title: 'Travel & Visas',
    items: [
      'Check visa requirements for USA, Canada, and Mexico before traveling.',
      'Fan ID holders may benefit from simplified immigration procedures.',
      'Travel insurance is strongly recommended.',
      'Keep copies of all travel documents.',
    ],
  },
];

export default function FanGuide() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-black text-white py-14 px-4">
        <div className="max-w-5xl mx-auto">
          <p className="text-blue-400 text-xs font-semibold uppercase tracking-widest mb-2">FIFA World Cup 2026™</p>
          <h1 className="text-4xl md:text-5xl font-black mb-2">Fan Guide</h1>
          <p className="text-gray-400 text-sm">Everything you need to know for an unforgettable World Cup experience.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 flex gap-4 mb-10">
          <AlertCircle size={22} className="text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-blue-900 mb-1">Important Reminder</h3>
            <p className="text-blue-700 text-sm">A valid Fan ID is required for all match attendees. Make sure to register and complete verification before travelling. <Link to="/fan-id" className="font-bold underline">Register your Fan ID →</Link></p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sections.map(section => (
            <div key={section.title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-100 rounded-full w-10 h-10 flex items-center justify-center">
                  <section.icon size={20} className="text-blue-600" />
                </div>
                <h3 className="font-black text-gray-900">{section.title}</h3>
              </div>
              <ul className="space-y-2.5">
                {section.items.map(item => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-gray-600">
                    <MapPin size={13} className="text-blue-400 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 bg-[#0a1f5c] rounded-2xl p-8 text-white text-center">
          <h2 className="text-xl font-black mb-2">Ready to Attend?</h2>
          <p className="text-blue-200 text-sm mb-5">Get your Fan ID and tickets to experience FIFA World Cup 2026™ live.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/fan-id" className="bg-white text-blue-900 font-bold px-6 py-3 rounded-full text-sm hover:bg-blue-50 transition-colors">Get Fan ID</Link>
            <Link to="/tickets" className="border-2 border-white text-white font-bold px-6 py-3 rounded-full text-sm hover:bg-white/10 transition-colors">Buy Tickets</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
