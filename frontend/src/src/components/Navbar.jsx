import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div style={{
      display: "flex",
      gap: 20,
      padding: 16,
      borderBottom: "1px solid #ddd",
      marginBottom: 20
    }}>
      <strong>Affiliate Marketplace</strong>

{/*       <Link to="/">Customer</Link> */}
{/*       <Link to="/admin/approvals">Admin</Link> */}
{/*       <Link to="/affiliate/products">Affiliate</Link> */}
    </div>
  );
}