import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,700&family=IBM+Plex+Mono:wght@400;500&family=Outfit:wght@300;400;500;600&display=swap');

  .nav-root {
    font-family: 'Outfit', sans-serif;
    background: #080910;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    position: sticky; top: 0; z-index: 50;
    backdrop-filter: blur(12px);
  }

  .nav-inner {
    max-width: 1280px; margin: 0 auto;
    padding: 0 40px;
    display: flex; align-items: center;
    height: 60px; gap: 8px;
  }

  .nav-brand {
    display: flex; align-items: center; gap: 10px;
    text-decoration: none; margin-right: 24px; flex-shrink: 0;
  }

  .nav-brand-icon {
    width: 32px; height: 32px;
    background: rgba(212,168,67,0.12);
    border: 1px solid rgba(212,168,67,0.2);
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
  }

  .nav-brand-name {
    font-family: 'Fraunces', serif;
    font-size: 1.05rem; font-weight: 700;
    color: #f0ede8; letter-spacing: -0.02em;
  }

  .nav-links { display: flex; align-items: center; gap: 2px; flex: 1; }

  .nav-link {
    display: flex; align-items: center; gap: 6px;
    padding: 7px 13px; border-radius: 8px;
    text-decoration: none;
    font-size: 0.84rem; font-weight: 500;
    color: #6b6f85;
    transition: all 0.15s;
    white-space: nowrap;
  }

  .nav-link:hover { color: #f0ede8; background: rgba(255,255,255,0.05); }
  .nav-link.active { color: #f0ede8; background: rgba(255,255,255,0.07); }
  .nav-link.active .nav-link-dot { opacity: 1; }

  .nav-link-dot {
    width: 4px; height: 4px; border-radius: 50%;
    background: #d4a843; opacity: 0; transition: opacity 0.15s;
    flex-shrink: 0;
  }

  .nav-right { display: flex; align-items: center; gap: 12px; margin-left: auto; flex-shrink: 0; }

  .nav-user-pill {
    display: flex; align-items: center; gap: 8px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 20px; padding: 5px 12px 5px 6px;
  }

  .nav-avatar {
    width: 26px; height: 26px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.72rem; font-weight: 700;
    font-family: 'Fraunces', serif;
  }

  .nav-avatar.admin   { background: rgba(212,168,67,0.2);  color: #d4a843; }
  .nav-avatar.seller  { background: rgba(96,165,250,0.2);  color: #60a5fa; }
  .nav-avatar.affiliate { background: rgba(45,212,160,0.2); color: #2dd4a0; }

  .nav-user-info { display: flex; flex-direction: column; gap: 1px; }
  .nav-user-name { font-size: 0.78rem; font-weight: 500; color: #f0ede8; line-height: 1; }
  .nav-user-role {
    font-size: 0.58rem; font-family: 'IBM Plex Mono', monospace;
    text-transform: uppercase; letter-spacing: 0.08em; line-height: 1;
  }
  .nav-user-role.admin     { color: #d4a843; }
  .nav-user-role.seller    { color: #60a5fa; }
  .nav-user-role.affiliate { color: #2dd4a0; }

  .nav-divider {
    width: 1px; height: 20px;
    background: rgba(255,255,255,0.07);
  }

  .btn-logout {
    display: flex; align-items: center; gap: 6px;
    background: transparent;
    border: 1px solid rgba(255,255,255,0.07);
    color: #6b6f85; padding: 7px 14px;
    border-radius: 8px; cursor: pointer;
    font-family: 'Outfit', sans-serif;
    font-size: 0.8rem; font-weight: 500;
    transition: all 0.15s;
  }

  .btn-logout:hover {
    border-color: rgba(240,96,96,0.3);
    color: #f06060;
    background: rgba(240,96,96,0.06);
  }

  @media (max-width: 768px) {
    .nav-inner { padding: 0 16px; }
    .nav-user-info { display: none; }
    .nav-brand-name { display: none; }
    .nav-link { padding: 7px 10px; font-size: 0.8rem; }
  }
`;

const NAV_LINKS = {
  admin: [
    { to: "/admin/approvals", label: "Products" },
    { to: "/admin/withdrawals", label: "Withdrawals" },
    { to: "/admin/users", label: "Users" },
  ],
  seller: [
    { to: "/affiliate/products", label: "My Products" },
  ],
  affiliate: [
    { to: "/affiliate/dashboard", label: "Dashboard" },
    { to: "/affiliate/wallet", label: "Wallet" },
    { to: "/affiliate/stats", label: "Stats" },
  ],
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const links = NAV_LINKS[user?.role] || [];

  return (
    <>
      <style>{styles}</style>
      <nav className="nav-root">
        <div className="nav-inner">

          {/* Brand */}
          <Link to="/" className="nav-brand">
            <div className="nav-brand-icon">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="1" y="1" width="6" height="6" rx="1.5" fill="#d4a843" opacity="0.9"/>
                <rect x="9" y="1" width="6" height="6" rx="1.5" fill="#d4a843" opacity="0.4"/>
                <rect x="1" y="9" width="6" height="6" rx="1.5" fill="#d4a843" opacity="0.4"/>
                <rect x="9" y="9" width="6" height="6" rx="1.5" fill="#d4a843" opacity="0.9"/>
              </svg>
            </div>
            <span className="nav-brand-name">AffiliateHub</span>
          </Link>

          {/* Links */}
          <div className="nav-links">
            {links.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`nav-link ${location.pathname === to ? "active" : ""}`}
              >
                <span className="nav-link-dot" />
                {label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          {user && (
            <div className="nav-right">
              <div className="nav-user-pill">
                <div className={`nav-avatar ${user.role}`}>
                  {user.name?.charAt(0)?.toUpperCase()}
                </div>
                <div className="nav-user-info">
                  <span className="nav-user-name">{user.name}</span>
                  <span className={`nav-user-role ${user.role}`}>{user.role}</span>
                </div>
              </div>

              <div className="nav-divider" />

              <button className="btn-logout" onClick={logout}>
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 1H2a1 1 0 00-1 1v9a1 1 0 001 1h3"/>
                  <path d="M9 9.5l3-3-3-3M12 6.5H5"/>
                </svg>
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}