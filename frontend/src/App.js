import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

//import ProductList from "./pages/customer/ProductList";
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

// Redirect logged-in users to their dashboard
function HomeRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (user.role === "admin") return <Navigate to="/admin/approvals" />;
  if (user.role === "seller") return <Navigate to="/affiliate/products" />;
  if (user.role === "affiliate") return <Navigate to="/affiliate/dashboard" />;
  return <Navigate to="/login" />;
}

function App() {
  const { user, loading } = useAuth();
  const location = useLocation();

  const hideNavbar = ["/login", "/signup"].includes(location.pathname);

  // Don't render until auth is checked — prevents flash of wrong page
  if (loading) return null;

  return (
    <>
      {!hideNavbar && user && <Navbar />}
      <Routes>

        {/* Public */}
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/payment/verify" element={<PaymentVerify />} />

        {/* Admin */}
        <Route path="/admin/approvals" element={
          <ProtectedRoute role="admin"><ProductApprovals /></ProtectedRoute>
        } />
        <Route path="/admin/withdrawals" element={
          <ProtectedRoute role="admin"><WithdrawalApprovals /></ProtectedRoute>
        } />
        <Route path="/admin/users" element={
          <ProtectedRoute role="admin"><UserManagement /></ProtectedRoute>
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

        {/* Fallback — must be last */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </>
  );
}

export default App;