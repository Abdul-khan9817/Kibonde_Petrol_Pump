import { Routes, Route } from 'react-router-dom';

import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import MainPage from './pages/MainPage.jsx';
import BuyNow from './pages/BuyNow.jsx';
import ViewOrders from './pages/ViewOrders.jsx';
import Delivery from './pages/Delivery.jsx';
import Contact from './pages/Contact.jsx';
import Help from './pages/Help.jsx';
import About from './pages/About.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import AdminManageOrders from './pages/AdminManageOrders.jsx';
import AdminGenerateCoupon from './pages/AdminGenerateCoupon.jsx';
import AdminProfile from './pages/AdminProfile.jsx';
import Feedback from './pages/Feedback.jsx';
import AdminRoute from './components/AdminRoute.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/mainpage" element={<MainPage />} />
      <Route path="/buynow" element={<BuyNow />} />
      <Route path="/vieworders" element={<ViewOrders />} />
      <Route path="/delivery" element={<Delivery />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/help" element={<Help />} />
      <Route path="/about" element={<About />} />

      {/* Admin-only pages */}
      <Route path="/admin_dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      <Route path="/admin_manage_orders" element={<AdminRoute><AdminManageOrders /></AdminRoute>} />
      <Route path="/admin_generate_coupon" element={<AdminRoute><AdminGenerateCoupon /></AdminRoute>} />
      <Route path="/admin_profile" element={<AdminRoute><AdminProfile /></AdminRoute>} />
      <Route path="/feedback" element={<AdminRoute><Feedback /></AdminRoute>} />
    </Routes>
  );
}
