import { Link } from 'react-router-dom';

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-black text-white py-14 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-blue-400 text-xs font-semibold uppercase tracking-widest mb-2">Legal</p>
          <h1 className="text-4xl font-black">Refund Policy</h1>
          <p className="text-gray-400 text-sm mt-1">FIFA World Cup 2026™ Official Refund Policy</p>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5 text-sm text-yellow-800">
          <strong>Important Notice:</strong> All ticket and merchandise sales are generally final. Please review this policy carefully before purchasing.
        </div>
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 space-y-6 text-sm text-gray-600 leading-relaxed">
          {[
            { title: 'Ticket Refunds', body: 'Match tickets are non-refundable once purchased. This applies to all ticket categories including Standard, Hospitality, VIP, and Tour packages.' },
            { title: 'Match Cancellation', body: 'If a match is officially cancelled by FIFA with no rescheduled date, purchasers will receive a full refund to the original payment method within 14 business days.' },
            { title: 'Match Postponement', body: 'If a match is postponed, original tickets remain valid for the rescheduled date. If you cannot attend the new date, you may request a refund within 7 days of the postponement announcement.' },
            { title: 'Duplicate Purchases', body: 'If you have been charged twice for the same order due to a system error, contact support within 48 hours with proof and we will issue a full refund for the duplicate charge.' },
            { title: 'Merchandise Returns', body: 'Merchandise may be returned within 14 days of receipt if unused and in original packaging. Items must be returned in original condition with tags attached. Shipping costs are non-refundable.' },
            { title: 'Hospitality Packages', body: 'Hospitality packages are non-refundable. Specific terms may apply depending on the package type and timing of cancellation. Contact our hospitality team for case-by-case considerations.' },
            { title: 'How to Request a Refund', body: 'To request an eligible refund, contact our support team at refunds@fifa2026.com with your order reference number, Fan ID, and reason for the refund request.' },
          ].map(section => (
            <div key={section.title}>
              <h3 className="font-black text-gray-900 text-base mb-2">{section.title}</h3>
              <p>{section.body}</p>
            </div>
          ))}
        </div>
        <div className="text-center">
          <Link to="/contact" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-full text-sm transition-colors">
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
