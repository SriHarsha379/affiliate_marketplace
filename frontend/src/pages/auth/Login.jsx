import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,600;0,9..144,700;1,9..144,400&family=Outfit:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');

  :root {
    --bg: #080910; --surface: #0d0f18; --surface2: #111420;
    --border: rgba(255,255,255,0.06); --border-hover: rgba(255,255,255,0.12);
    --gold: #d4a843; --gold-glow: rgba(212,168,67,0.25);
    --text-primary: #f0ede8; --text-secondary: #6b6f85; --text-muted: #30334a;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .auth-page {
    min-height: 100vh; background: var(--bg);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Outfit', sans-serif; color: var(--text-primary);
    position: relative; padding: 24px;
  }

  .auth-page::before {
    content: '';
    position: fixed; top: -200px; right: -200px;
    width: 600px; height: 600px;
    background: radial-gradient(circle, rgba(212,168,67,0.05) 0%, transparent 70%);
    pointer-events: none;
  }

  .auth-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 20px; padding: 40px 36px;
    width: 100%; max-width: 420px;
    position: relative; z-index: 1;
    box-shadow: 0 32px 80px rgba(0,0,0,0.5);
    animation: cardIn 0.3s cubic-bezier(0.22,1,0.36,1);
  }

  @keyframes cardIn {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .auth-logo {
    display: flex; align-items: center; gap: 12px; margin-bottom: 32px;
  }

  .auth-logo-icon {
    width: 38px; height: 38px;
    background: rgba(212,168,67,0.1);
    border: 1px solid rgba(212,168,67,0.2);
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
  }

  .auth-logo h2 {
    font-family: 'Fraunces', serif;
    font-size: 1.2rem; font-weight: 700; letter-spacing: -0.02em;
  }

  .auth-heading {
    font-family: 'Fraunces', serif;
    font-size: 1.6rem; font-weight: 700;
    letter-spacing: -0.03em; margin-bottom: 6px;
  }

  .auth-sub {
    font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 28px;
  }

  .auth-field { margin-bottom: 16px; }

  .auth-field label {
    display: block; font-size: 0.65rem; color: var(--text-secondary);
    text-transform: uppercase; letter-spacing: 0.12em;
    font-family: 'IBM Plex Mono', monospace; margin-bottom: 6px;
  }

  .auth-input {
    width: 100%; background: var(--surface2);
    border: 1px solid var(--border); border-radius: 10px;
    padding: 10px 13px; color: var(--text-primary);
    font-family: 'Outfit', sans-serif; font-size: 0.9rem;
    outline: none; transition: all 0.18s;
  }

  .auth-input:focus {
    border-color: rgba(212,168,67,0.35); background: #111420;
    box-shadow: 0 0 0 3px rgba(212,168,67,0.06);
  }

  .auth-input::placeholder { color: var(--text-muted); }

  .auth-error {
    background: rgba(240,96,96,0.1);
    border: 1px solid rgba(240,96,96,0.25);
    border-radius: 9px; padding: 10px 13px;
    font-size: 0.8rem; color: #fca5a5; margin-bottom: 16px;
  }

  .btn-auth {
    width: 100%; background: var(--gold);
    color: #08090e; border: none; padding: 13px;
    border-radius: 11px; font-family: 'Outfit', sans-serif;
    font-size: 0.92rem; font-weight: 600; cursor: pointer;
    margin-top: 8px; transition: all 0.2s; letter-spacing: 0.01em;
  }

  .btn-auth:hover:not(:disabled) {
    background: #e8bc55;
    box-shadow: 0 0 24px var(--gold-glow);
    transform: translateY(-1px);
  }

  .btn-auth:disabled { opacity: 0.35; cursor: not-allowed; }

  .auth-footer {
    text-align: center; margin-top: 22px;
    font-size: 0.8rem; color: var(--text-secondary);
  }

  .auth-footer a { color: var(--gold); text-decoration: none; font-weight: 500; }
  .auth-footer a:hover { text-decoration: underline; }
`;

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      if (user.role === "admin") navigate("/admin/approvals");
      else if (user.role === "seller") navigate("/affiliate/products");
      else navigate("/affiliate/dashboard");
    } catch (err) {
      setError(err?.response?.data?.detail || "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-logo">
            <div className="auth-logo-icon">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <rect x="1" y="1" width="7" height="7" rx="2" fill="#d4a843" opacity="0.9"/>
                <rect x="10" y="1" width="7" height="7" rx="2" fill="#d4a843" opacity="0.4"/>
                <rect x="1" y="10" width="7" height="7" rx="2" fill="#d4a843" opacity="0.4"/>
                <rect x="10" y="10" width="7" height="7" rx="2" fill="#d4a843" opacity="0.9"/>
              </svg>
            </div>
            <h2>AffiliateHub</h2>
          </div>

          <h1 className="auth-heading">Welcome back</h1>
          <p className="auth-sub">Sign in to your account to continue</p>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="auth-field">
              <label>Email</label>
              <input
                className="auth-input" type="email" placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div className="auth-field">
              <label>Password</label>
              <input
                className="auth-input" type="password" placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
            <button className="btn-auth" type="submit" disabled={loading}>
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <div className="auth-footer">
            Don't have an account? <Link to="/signup">Sign up</Link>
          </div>
        </div>
      </div>
    </>
  );
}