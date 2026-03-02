import { useEffect, useState } from "react";
import { api } from "../../api/client";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,500;0,9..144,700;1,9..144,400&family=IBM+Plex+Mono:wght@400;500&family=Outfit:wght@300;400;500;600&display=swap');

  :root {
    --bg: #080910; --surface: #0d0f18; --surface2: #111420; --surface3: #161928;
    --border: rgba(255,255,255,0.06); --border-hover: rgba(255,255,255,0.12);
    --gold: #d4a843; --gold-dim: rgba(212,168,67,0.12); --gold-glow: rgba(212,168,67,0.25);
    --text-primary: #f0ede8; --text-secondary: #6b6f85; --text-muted: #30334a;
    --green: #2dd4a0; --green-dim: rgba(45,212,160,0.1); --green-border: rgba(45,212,160,0.25);
    --red: #f06060; --red-dim: rgba(240,96,96,0.1); --red-border: rgba(240,96,96,0.25);
    --amber: #f0a840; --amber-dim: rgba(240,168,64,0.1); --amber-border: rgba(240,168,64,0.25);
    --blue: #60a5fa; --blue-dim: rgba(96,165,250,0.1); --blue-border: rgba(96,165,250,0.25);
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .um-root { font-family: 'Outfit', sans-serif; background: var(--bg); min-height: 100vh; color: var(--text-primary); }
  .um-root::before { content:''; position:fixed; top:-200px; right:-200px; width:600px; height:600px; background:radial-gradient(circle, rgba(212,168,67,0.04) 0%, transparent 70%); pointer-events:none; z-index:0; }

  .um-inner { position:relative; z-index:1; padding:0 40px 80px; max-width:1200px; margin:0 auto; }

  .um-header { display:flex; align-items:center; justify-content:space-between; padding:36px 0 32px; border-bottom:1px solid var(--border); margin-bottom:36px; flex-wrap:wrap; gap:16px; }
  .um-header-left { display:flex; align-items:center; gap:16px; }
  .um-icon { width:42px; height:42px; background:var(--gold-dim); border:1px solid rgba(212,168,67,0.2); border-radius:11px; display:flex; align-items:center; justify-content:center; }
  .um-title h1 { font-family:'Fraunces',serif; font-size:1.7rem; font-weight:700; letter-spacing:-0.03em; }
  .um-title p { font-size:0.7rem; color:var(--text-secondary); margin-top:4px; font-family:'IBM Plex Mono',monospace; letter-spacing:0.1em; text-transform:uppercase; }

  .um-stats { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; margin-bottom:36px; }
  .um-stat { background:var(--surface); border:1px solid var(--border); border-radius:14px; padding:20px 22px; }
  .um-stat-label { font-size:0.65rem; color:var(--text-secondary); text-transform:uppercase; letter-spacing:0.12em; font-family:'IBM Plex Mono',monospace; margin-bottom:8px; }
  .um-stat-value { font-family:'Fraunces',serif; font-size:1.9rem; font-weight:700; letter-spacing:-0.04em; }
  .um-stat.total .um-stat-value { color:var(--gold); }
  .um-stat.sellers .um-stat-value { color:var(--blue); }
  .um-stat.affiliates .um-stat-value { color:var(--green); }

  .um-toolbar { display:flex; align-items:center; justify-content:space-between; margin-bottom:20px; flex-wrap:wrap; gap:12px; }

  .um-tabs { display:flex; gap:6px; background:var(--surface); border:1px solid var(--border); border-radius:10px; padding:4px; }
  .um-tab { padding:7px 16px; border-radius:7px; border:none; background:transparent; color:var(--text-secondary); font-family:'Outfit',sans-serif; font-size:0.8rem; font-weight:500; cursor:pointer; transition:all 0.15s; }
  .um-tab:hover { color:var(--text-primary); }
  .um-tab.active { background:var(--surface3); color:var(--text-primary); }

  .um-search-wrap { position:relative; }
  .um-search { background:var(--surface); border:1px solid var(--border); border-radius:9px; padding:9px 14px 9px 38px; color:var(--text-primary); font-family:'Outfit',sans-serif; font-size:0.84rem; outline:none; transition:all 0.18s; width:240px; }
  .um-search:focus { border-color:rgba(212,168,67,0.35); box-shadow:0 0 0 3px rgba(212,168,67,0.06); }
  .um-search::placeholder { color:var(--text-muted); }
  .um-search-icon { position:absolute; left:12px; top:50%; transform:translateY(-50%); color:var(--text-muted); pointer-events:none; }

  .um-table-wrap { background:var(--surface); border:1px solid var(--border); border-radius:16px; overflow:hidden; }

  .um-table { width:100%; border-collapse:collapse; }
  .um-table thead { background:var(--surface2); border-bottom:1px solid var(--border); }
  .um-table th { padding:12px 18px; text-align:left; font-size:0.63rem; font-family:'IBM Plex Mono',monospace; color:var(--text-secondary); text-transform:uppercase; letter-spacing:0.12em; font-weight:500; white-space:nowrap; }
  .um-table td { padding:14px 18px; border-bottom:1px solid var(--border); vertical-align:middle; }
  .um-table tr:last-child td { border-bottom:none; }
  .um-table tbody tr { transition:background 0.15s; animation:rowIn 0.3s ease both; }
  @keyframes rowIn { from{opacity:0;transform:translateX(-6px)} to{opacity:1;transform:translateX(0)} }
  .um-table tbody tr:hover { background:var(--surface2); }

  .um-user-info { display:flex; align-items:center; gap:12px; }
  .um-avatar { width:36px; height:36px; border-radius:9px; display:flex; align-items:center; justify-content:center; font-family:'Fraunces',serif; font-size:0.9rem; font-weight:600; flex-shrink:0; }
  .um-avatar.seller { background:var(--blue-dim); color:var(--blue); border:1px solid var(--blue-border); }
  .um-avatar.affiliate { background:var(--green-dim); color:var(--green); border:1px solid var(--green-border); }
  .um-user-name { font-size:0.88rem; font-weight:500; color:var(--text-primary); }
  .um-user-email { font-size:0.72rem; color:var(--text-secondary); font-family:'IBM Plex Mono',monospace; margin-top:1px; }

  .um-role-badge { display:inline-flex; align-items:center; gap:5px; font-size:0.63rem; font-family:'IBM Plex Mono',monospace; letter-spacing:0.1em; text-transform:uppercase; padding:4px 10px; border-radius:20px; font-weight:600; }
  .um-role-badge.seller { background:var(--blue-dim); color:var(--blue); border:1px solid var(--blue-border); }
  .um-role-badge.affiliate { background:var(--green-dim); color:var(--green); border:1px solid var(--green-border); }

  .um-status-badge { display:inline-flex; align-items:center; gap:5px; font-size:0.63rem; font-family:'IBM Plex Mono',monospace; letter-spacing:0.1em; text-transform:uppercase; padding:4px 10px; border-radius:20px; font-weight:600; }
  .um-status-dot { width:5px; height:5px; border-radius:50%; }
  .um-status-badge.active { background:var(--green-dim); color:var(--green); border:1px solid var(--green-border); }
  .um-status-badge.active .um-status-dot { background:var(--green); box-shadow:0 0 5px var(--green); }
  .um-status-badge.inactive { background:var(--red-dim); color:var(--red); border:1px solid var(--red-border); }
  .um-status-badge.inactive .um-status-dot { background:var(--red); }

  .um-date { font-size:0.74rem; color:var(--text-secondary); font-family:'IBM Plex Mono',monospace; }

  .btn-deactivate { display:flex; align-items:center; gap:5px; background:var(--red-dim); border:1px solid var(--red-border); color:var(--red); padding:7px 14px; border-radius:8px; font-family:'Outfit',sans-serif; font-size:0.76rem; font-weight:600; cursor:pointer; transition:all 0.15s; white-space:nowrap; }
  .btn-deactivate:hover:not(:disabled) { background:rgba(240,96,96,0.2); }
  .btn-deactivate:disabled { opacity:0.3; cursor:not-allowed; }

  .btn-activate { display:flex; align-items:center; gap:5px; background:var(--green-dim); border:1px solid var(--green-border); color:var(--green); padding:7px 14px; border-radius:8px; font-family:'Outfit',sans-serif; font-size:0.76rem; font-weight:600; cursor:pointer; transition:all 0.15s; white-space:nowrap; }
  .btn-activate:hover:not(:disabled) { background:rgba(45,212,160,0.2); }
  .btn-activate:disabled { opacity:0.3; cursor:not-allowed; }

  .um-empty { display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:260px; gap:14px; }
  .um-empty-icon { width:56px; height:56px; background:var(--surface2); border:1px solid var(--border); border-radius:16px; display:flex; align-items:center; justify-content:center; color:var(--text-muted); }
  .um-empty h3 { font-family:'Fraunces',serif; font-size:1rem; color:var(--text-muted); font-style:italic; font-weight:400; }

  .um-spinner { width:32px; height:32px; border:2.5px solid var(--surface3); border-top-color:var(--gold); border-radius:50%; animation:spin 0.7s linear infinite; margin:80px auto; }
  @keyframes spin { to{transform:rotate(360deg)} }

  .um-toast { position:fixed; bottom:28px; left:50%; transform:translateX(-50%); background:var(--surface3); border:1px solid var(--border-hover); color:var(--text-primary); padding:12px 22px; border-radius:12px; font-size:0.84rem; font-family:'Outfit',sans-serif; font-weight:500; z-index:999; pointer-events:none; box-shadow:0 16px 40px rgba(0,0,0,0.5); white-space:nowrap; animation:toastIn 0.25s cubic-bezier(0.22,1,0.36,1); }
  @keyframes toastIn { from{opacity:0;transform:translateX(-50%) translateY(8px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }

  @media (max-width:900px) {
    .um-inner { padding:0 16px 60px; }
    .um-stats { grid-template-columns:repeat(3,1fr); }
    .um-table-wrap { overflow-x:auto; }
    .um-search { width:180px; }
  }
`;

const TABS = ["All", "seller", "affiliate"];

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("All");
  const [search, setSearch] = useState("");
  const [processing, setProcessing] = useState({});
  const [toast, setToast] = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2800); };

  useEffect(() => {
    api.get("/admin/users")
      .then((res) => setUsers(Array.isArray(res.data) ? res.data : []))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, []);

  const toggleUser = async (user) => {
    setProcessing((p) => ({ ...p, [user.id]: true }));
    const endpoint = user.is_active
      ? `/admin/users/${user.id}/deactivate`
      : `/admin/users/${user.id}/activate`;
    try {
      await api.post(endpoint);
      setUsers((prev) =>
        prev.map((u) => u.id === user.id ? { ...u, is_active: !u.is_active } : u)
      );
      showToast(`✓ ${user.name} ${user.is_active ? "deactivated" : "activated"}`);
    } catch {
      showToast("✗ Action failed");
    } finally {
      setProcessing((p) => ({ ...p, [user.id]: false }));
    }
  };

  const filtered = users.filter((u) => {
    const matchTab = tab === "All" || u.role === tab;
    const matchSearch = u.name?.toLowerCase().includes(search.toLowerCase()) ||
                        u.email?.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const sellers = users.filter((u) => u.role === "seller").length;
  const affiliates = users.filter((u) => u.role === "affiliate").length;

  const formatDate = (d) => d ? new Date(d).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric"
  }) : "—";

  const getInitial = (name) => name?.charAt(0)?.toUpperCase() || "?";

  return (
    <>
      <style>{styles}</style>
      <div className="um-root">
        <div className="um-inner">

          {/* Header */}
          <div className="um-header">
            <div className="um-header-left">
              <div className="um-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="8" cy="6" r="3.5" stroke="#d4a843" strokeWidth="1.5"/>
                  <path d="M2 17c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="#d4a843" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M15 9l2 2 3-3" stroke="#d4a843" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="um-title">
                <h1>User Management</h1>
                <p>Admin dashboard</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="um-stats">
            <div className="um-stat total">
              <div className="um-stat-label">Total Users</div>
              <div className="um-stat-value">{users.length}</div>
            </div>
            <div className="um-stat sellers">
              <div className="um-stat-label">Sellers</div>
              <div className="um-stat-value">{sellers}</div>
            </div>
            <div className="um-stat affiliates">
              <div className="um-stat-label">Affiliates</div>
              <div className="um-stat-value">{affiliates}</div>
            </div>
          </div>

          {/* Toolbar */}
          <div className="um-toolbar">
            <div className="um-tabs">
              {TABS.map((t) => (
                <button
                  key={t}
                  className={`um-tab ${tab === t ? "active" : ""}`}
                  onClick={() => setTab(t)}
                >
                  {t === "All" ? "All Users" : t.charAt(0).toUpperCase() + t.slice(1) + "s"}
                </button>
              ))}
            </div>

            <div className="um-search-wrap">
              <svg className="um-search-icon" width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <circle cx="5.5" cy="5.5" r="4.5"/><line x1="9" y1="9" x2="13" y2="13"/>
              </svg>
              <input
                className="um-search"
                placeholder="Search name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div className="um-spinner" />
          ) : (
            <div className="um-table-wrap">
              {filtered.length === 0 ? (
                <div className="um-empty">
                  <div className="um-empty-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <circle cx="10" cy="7" r="4" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M3 21c0-4 3.134-7 7-7s7 3 7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <h3>No users found</h3>
                </div>
              ) : (
                <table className="um-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Joined</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((u, i) => (
                      <tr key={u.id} style={{ animationDelay: `${i * 40}ms` }}>
                        <td>
                          <div className="um-user-info">
                            <div className={`um-avatar ${u.role}`}>
                              {getInitial(u.name)}
                            </div>
                            <div>
                              <div className="um-user-name">{u.name}</div>
                              <div className="um-user-email">{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={`um-role-badge ${u.role}`}>
                            {u.role}
                          </span>
                        </td>
                        <td>
                          <span className={`um-status-badge ${u.is_active ? "active" : "inactive"}`}>
                            <span className="um-status-dot" />
                            {u.is_active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td>
                          <span className="um-date">{formatDate(u.created_at)}</span>
                        </td>
                        <td>
                          {u.is_active ? (
                            <button
                              className="btn-deactivate"
                              onClick={() => toggleUser(u)}
                              disabled={processing[u.id]}
                            >
                              <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                                <line x1="1.5" y1="1.5" x2="9.5" y2="9.5"/>
                                <line x1="9.5" y1="1.5" x2="1.5" y2="9.5"/>
                              </svg>
                              {processing[u.id] ? "..." : "Deactivate"}
                            </button>
                          ) : (
                            <button
                              className="btn-activate"
                              onClick={() => toggleUser(u)}
                              disabled={processing[u.id]}
                            >
                              <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M1.5 6l3 3 5-5"/>
                              </svg>
                              {processing[u.id] ? "..." : "Activate"}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>
      {toast && <div className="um-toast">{toast}</div>}
    </>
  );
}