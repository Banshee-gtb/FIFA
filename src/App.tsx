import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { CurrencyProvider } from '@/contexts/CurrencyContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import LiveTicker from '@/components/layout/LiveTicker';
import CookieConsent from '@/components/layout/CookieConsent';
import Home from '@/pages/Home';
import Tickets from '@/pages/Tickets';
import Hospitality from '@/pages/Hospitality';
import HospitalityCity from '@/pages/HospitalityCity';
import VIPSeats from '@/pages/VIPSeats';
import TourGuide from '@/pages/TourGuide';
import Merchandise from '@/pages/Merchandise';
import Matches from '@/pages/Matches';
import Teams from '@/pages/Teams';
import Venues from '@/pages/Venues';
import VenueDetail from '@/pages/VenueDetail';
import Cart from '@/pages/Cart';
import Checkout from '@/pages/Checkout';
import FanID from '@/pages/FanID';
import TicketQueue from '@/pages/TicketQueue';
import FAQ from '@/pages/FAQ';
import Contact from '@/pages/Contact';
import About from '@/pages/About';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import TermsConditions from '@/pages/TermsConditions';
import RefundPolicy from '@/pages/RefundPolicy';
import Accessibility from '@/pages/Accessibility';
import FanGuide from '@/pages/FanGuide';
import Orders from '@/pages/Orders';
import Standings from '@/pages/Standings';
import CookieSettings from '@/pages/CookieSettings';
import NotFound from '@/pages/NotFound';

export default function App() {
  return (
    <BrowserRouter>
      <CurrencyProvider>
        <Toaster position="top-right" richColors />
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <LiveTicker />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/tickets" element={<Tickets />} />
              <Route path="/hospitality" element={<Hospitality />} />
              <Route path="/hospitality/:id" element={<HospitalityCity />} />
              <Route path="/vip" element={<VIPSeats />} />
              <Route path="/tours" element={<TourGuide />} />
              <Route path="/store" element={<Merchandise />} />
              <Route path="/matches" element={<Matches />} />
              <Route path="/teams" element={<Teams />} />
              <Route path="/venues" element={<Venues />} />
              <Route path="/venues/:id" element={<VenueDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/fan-id" element={<FanID />} />
              <Route path="/queue" element={<TicketQueue />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/about" element={<About />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsConditions />} />
              <Route path="/refund-policy" element={<RefundPolicy />} />
              <Route path="/accessibility" element={<Accessibility />} />
              <Route path="/fan-guide" element={<FanGuide />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/standings" element={<Standings />} />
              <Route path="/cookie-settings" element={<CookieSettings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
          <CookieConsent />
        </div>
      </CurrencyProvider>
    </BrowserRouter>
  );
}
