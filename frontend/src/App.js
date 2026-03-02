import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import ProductList from "./pages/customer/ProductList";
import ProductDetail from "./pages/customer/ProductDetail";
import ProductApprovals from "./pages/admin/ProductApprovals";
import AffiliateProducts from "./pages/affiliate/ProductList";
import AffiliateStats from "./pages/affiliate/AffiliateStats";
import AffiliateWallet from "./pages/affiliate/AffiliateWallet";
import AffiliateDashboard from "./pages/affiliate/AffiliateDashboard";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import WithdrawalApprovals from "./pages/admin/WithdrawalApprovals";
import UserManagement from "./pages/admin/UserManagement";
import PaymentVerify from "./pages/PaymentVerify";

function App() {
  const { user } = useAuth();
  const location = useLocation();

  const hideNavbar = ["/login", "/signup"].includes(location.pathname);

  return (
    <>
      {!hideNavbar && user && <Navbar />}
      <Routes>

        {/* Public */}
        <Route path="/" element={<ProductList />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Admin */}
        <Route path="/admin/approvals" element={
          <ProtectedRoute role="admin"><ProductApprovals /></ProtectedRoute>
        } />
        <Route path="/admin/withdrawals" element={
          <ProtectedRoute role="admin"><WithdrawalApprovals /></ProtectedRoute>
        } />

        {/* Seller */}
        <Route path="/affiliate/products" element={
          <ProtectedRoute role="seller"><AffiliateProducts /></ProtectedRoute>
        } />

        {/* Affiliate */}
        <Route path="/affiliate/dashboard" element={
          <ProtectedRoute role="affiliate"><AffiliateDashboard /></ProtectedRoute>
        } />
        <Route path="/affiliate/stats" element={
          <ProtectedRoute role="affiliate"><AffiliateStats /></ProtectedRoute>
        } />
        <Route path="/affiliate/wallet" element={
          <ProtectedRoute role="affiliate"><AffiliateWallet /></ProtectedRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />

        <Route path="/admin/users" element={<ProtectedRoute role="admin"><UserManagement /></ProtectedRoute>} />
        <Route path="/payment/verify" element={<PaymentVerify />} />
      </Routes>
    </>
  );
}

export default App;