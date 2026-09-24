import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layout
import Navbar from './components/Navbar';

// Pages
import Home from './pages/Home';
import All from './pages/All';
import Flavors from './pages/Flavors';
import BestSellers from './pages/BestSellers';
import About from './pages/About';
import Contact from './pages/Contact';
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminProducts from './pages/admin/AdminProducts';
import AdminAppearance from './pages/admin/AdminAppearance';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import AdminOrders from './pages/admin/AdminOrders';
import TrackOrder from './pages/TrackOrder';
import ProductDetail from './pages/ProductDetail';
import Profile from './pages/Profile';

const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.5, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

function AppContent() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  React.useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen bg-dark">
      {!isAdminPage && <Navbar />}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
            <Route path="/all" element={<PageWrapper><All /></PageWrapper>} />
            <Route path="/flavors" element={<PageWrapper><Flavors /></PageWrapper>} />
            <Route path="/best-sellers" element={<PageWrapper><BestSellers /></PageWrapper>} />
            <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
            <Route path="/contact" element={<PageWrapper><Contact /></PageWrapper>} />
            <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
            <Route path="/register" element={<PageWrapper><Register /></PageWrapper>} />
            <Route path="/cart" element={<PageWrapper><Cart /></PageWrapper>} />
            <Route path="/orders" element={<PageWrapper><Orders /></PageWrapper>} />
            <Route path="/track-order/:id" element={<PageWrapper><TrackOrder /></PageWrapper>} />
            <Route path="/product/:id" element={<PageWrapper><ProductDetail /></PageWrapper>} />
            <Route path="/profile" element={<PageWrapper><Profile /></PageWrapper>} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/appearance" element={<AdminAppearance />} />
          </Routes>
        </AnimatePresence>
      </main>
      <ToastContainer theme="dark" position="bottom-right" />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
