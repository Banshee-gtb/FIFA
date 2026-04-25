import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Home from '@/pages/Home';
import Tickets from '@/pages/Tickets';
import Hospitality from '@/pages/Hospitality';
import VIPSeats from '@/pages/VIPSeats';
import TourGuide from '@/pages/TourGuide';
import Merchandise from '@/pages/Merchandise';
import Matches from '@/pages/Matches';
import Teams from '@/pages/Teams';
import Venues from '@/pages/Venues';
import VenueDetail from '@/pages/VenueDetail';
import Cart from '@/pages/Cart';
import Checkout from '@/pages/Checkout';
import NotFound from '@/pages/NotFound';

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors />
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tickets" element={<Tickets />} />
            <Route path="/hospitality" element={<Hospitality />} />
            <Route path="/vip" element={<VIPSeats />} />
            <Route path="/tours" element={<TourGuide />} />
            <Route path="/store" element={<Merchandise />} />
            <Route path="/matches" element={<Matches />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/venues" element={<Venues />} />
            <Route path="/venues/:id" element={<VenueDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
