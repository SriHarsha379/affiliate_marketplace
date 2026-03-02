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
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .adm-root { font-family: 'Outfit', sans-serif; background: var(--bg); min-height: 100vh; color: var(--text-primary); }
  .adm-root::before { content:''; position:fixed; top:-200px; left:-200px; width:600px; height:600px; background:radial-gradient(circle, rgba(212,168,67,0.04) 0%, transparent 70%); pointer-events:none; z-index:0; }

  .adm-inner { position:relative; z-index:1; padding:0 40px 60px; max-width:1200px; margin:0 auto; }

  .adm-header { display:flex; align-items:center; justify-content:space-between; padding:36px 0 32px; border-bottom:1px solid var(--border); margin-bottom:36px; }

  .adm-header-left { display:flex; align-items:center; gap:16px; }
  .adm-icon { width:42px; height:42px; background:var(--gold-dim); border:1px solid rgba(212,168,67,0.2); border-radius:11px; display:flex; align-items:center; justify-content:center; }
  .adm-title h1 { font-family:'Fraunces',serif; font-size:1.7rem; font-weight:700; letter-spacing:-0.03em; }
  .adm-title p { font-size:0.7rem; color:var(--text-secondary); margin-top:4px; font-family:'IBM Plex Mono',monospace; letter-spacing:0.1em; text-transform:uppercase; }

  .adm-count-pill { display:flex; align-items:center; gap:6px; background:var(--amber-dim); border:1px solid var(--amber-border); border-radius:20px; padding:7px 14px; font-size:0.74rem; font-family:'IBM Plex Mono',monospace; color:var(--amber); }
  .adm-count-pill strong { font-weight:600; }

  .adm-tabs { display:flex; gap:6px; margin-bottom:32px; background:var(--surface); border:1px solid var(--border); border-radius:12px; padding:5px; width:fit-content; }

  .adm-tab { padding:8px 20px; border-radius:8px; border:none; background:transparent; color:var(--text-secondary); font-family:'Outfit',sans-serif; font-size:0.84rem; font-weight:500; cursor:pointer; transition:all 0.18s; display:flex; align-items:center; gap:6px; }
  .adm-tab:hover { color:var(--text-primary); background:var(--surface2); }
  .adm-tab.active { background:var(--surface3); color:var(--text-primary); box-shadow:0 1px 3px rgba(0,0,0,0.3); }
  .adm-tab.active.pending { color:var(--amber); }
  .adm-tab.active.approved { color:var(--green); }
  .adm-tab.active.rejected { color:var(--red); }

  .adm-tab-dot { width:6px; height:6px; border-radius:50%; }
  .pending .adm-tab-dot { background:var(--amber); }
  .approved .adm-tab-dot { background:var(--green); }
  .rejected .adm-tab-dot { background:var(--red); }

  .adm-empty { display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:320px; gap:12px; }
  .adm-empty-icon { width:64px; height:64px; background:var(--surface2); border:1px solid var(--border); border-radius:18px; display:flex; align-items:center; justify-content:center; color:var(--text-muted); margin-bottom:4px; }
  .adm-empty h3 { font-family:'Fraunces',serif; font-size:1.15rem; color:var(--text-muted); font-style:italic; font-weight:400; }
  .adm-empty p { font-size:0.72rem; color:var(--text-muted); font-family:'IBM Plex Mono',monospace; letter-spacing:0.06em; }

  .adm-grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(340px,1fr)); gap:16px; }

  .adm-card { background:var(--surface); border:1px solid var(--border); border-radius:16px; overflow:hidden; transition:all 0.3s cubic-bezier(0.22,1,0.36,1); animation:cardIn 0.35s ease both; }
  @keyframes cardIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
  .adm-card:hover { border-color:var(--border-hover); transform:translateY(-3px); box-shadow:0 20px 48px rgba(0,0,0,0.4); }

  .adm-card-img { width:100%; height:160px; object-fit:cover; display:block; filter:brightness(0.88); }
  .adm-card-img-placeholder { width:100%; height:160px; background:linear-gradient(135deg,var(--surface2),var(--surface3)); display:flex; align-items:center; justify-content:center; color:var(--text-muted); }

  .adm-card-body { padding:18px 20px 20px; }

  .adm-card-top { display:flex; align-items:flex-start; justify-content:space-between; gap:10px; margin-bottom:10px; }
  .adm-card-title { font-family:'Fraunces',serif; font-size:1rem; font-weight:500; color:var(--text-primary); line-height:1.4; letter-spacing:-0.01em; }
  .adm-type-badge { flex-shrink:0; font-size:0.62rem; font-family:'IBM Plex Mono',monospace; letter-spacing:0.1em; text-transform:uppercase; padding:3px 9px; border-radius:20px; background:var(--surface3); border:1px solid var(--border); color:var(--text-secondary); }

  .adm-card-meta { display:flex; gap:10px; margin-bottom:14px; flex-wrap:wrap; }
  .adm-meta-item { font-size:0.72rem; font-family:'IBM Plex Mono',monospace; color:var(--text-secondary); background:var(--surface2); padding:4px 10px; border-radius:20px; border:1px solid var(--border); }
  .adm-meta-item strong { color:var(--gold); }

  .adm-rejection-note { padding:9px 12px; background:var(--red-dim); border:1px solid var(--red-border); border-radius:8px; font-size:0.74rem; color:#fca5a5; line-height:1.5; margin-bottom:14px; }
  .adm-rejection-note span { display:block; font-family:'IBM Plex Mono',monospace; font-size:0.62rem; text-transform:uppercase; letter-spacing:0.1em; color:var(--red); margin-bottom:3px; }

  .adm-card-actions { display:flex; gap:8px; }

  .btn-approve { flex:1; display:flex; align-items:center; justify-content:center; gap:6px; background:var(--green-dim); border:1px solid var(--green-border); color:var(--green); padding:9px; border-radius:9px; font-family:'Outfit',sans-serif; font-size:0.8rem; font-weight:600; cursor:pointer; transition:all 0.18s; letter-spacing:0.02em; }
  .btn-approve:hover:not(:disabled) { background:rgba(45,212,160,0.18); box-shadow:0 0 16px rgba(45,212,160,0.15); }
  .btn-approve:disabled { opacity:0.3; cursor:not-allowed; }

  .btn-reject { flex:1; display:flex; align-items:center; justify-content:center; gap:6px; background:var(--red-dim); border:1px solid var(--red-border); color:var(--red); padding:9px; border-radius:9px; font-family:'Outfit',sans-serif; font-size:0.8rem; font-weight:600; cursor:pointer; transition:all 0.18s; letter-spacing:0.02em; }
  .btn-reject:hover:not(:disabled) { background:rgba(240,96,96,0.18); box-shadow:0 0 16px rgba(240,96,96,0.15); }
  .btn-reject:disabled { opacity:0.3; cursor:not-allowed; }

  .adm-overlay { position:fixed; inset:0; background:rgba(4,5,10,0.92); backdrop-filter:blur(12px); display:flex; align-items:center; justify-content:center; z-index:100; animation:fadeIn 0.2s ease; }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }

  .adm-modal { background:var(--surface); border:1px solid rgba(255,255,255,0.08); border-radius:20px; width:440px; max-width:95vw; box-shadow:0 48px 96px rgba(0,0,0,0.8); animation:modalIn 0.22s cubic-bezier(0.22,1,0.36,1); }
  @keyframes modalIn { from{opacity:0;transform:translateY(16px) scale(0.98)} to{opacity:1;transform:translateY(0) scale(1)} }

  .adm-modal-header { padding:22px 24px 18px; border-bottom:1px solid var(--border); display:flex; align-items:center; justify-content:space-between; }
  .adm-modal-header h3 { font-family:'Fraunces',serif; font-size:1.1rem; font-weight:700; color:var(--text-primary); letter-spacing:-0.02em; }
  .adm-modal-header p { font-size:0.76rem; color:var(--text-secondary); margin-top:3px; }

  .adm-modal-body { padding:22px 24px 8px; }
  .adm-modal-body label { display:block; font-size:0.65rem; color:var(--text-secondary); text-transform:uppercase; letter-spacing:0.12em; font-family:'IBM Plex Mono',monospace; margin-bottom:8px; }

  .adm-textarea { width:100%; background:var(--surface2); border:1px solid var(--border); border-radius:10px; padding:11px 13px; color:var(--text-primary); font-family:'Outfit',sans-serif; font-size:0.88rem; outline:none; resize:vertical; min-height:100px; transition:all 0.18s; }
  .adm-textarea:focus { border-color:rgba(240,96,96,0.35); box-shadow:0 0 0 3px rgba(240,96,96,0.06); }
  .adm-textarea::placeholder { color:var(--text-muted); }

  .adm-modal-footer { padding:16px 24px 24px; display:flex; gap:10px; }

  .btn-confirm-reject { flex:1; background:var(--red); color:#fff; border:none; padding:12px; border-radius:11px; font-family:'Outfit',sans-serif; font-size:0.9rem; font-weight:600; cursor:pointer; transition:all 0.2s; }
  .btn-confirm-reject:hover:not(:disabled) { background:#e84040; box-shadow:0 0 20px rgba(240,96,96,0.3); }
  .btn-confirm-reject:disabled { opacity:0.35; cursor:not-allowed; }

  .btn-modal-cancel { background:var(--surface2); color:var(--text-secondary); border:1px solid var(--border); padding:12px 20px; border-radius:11px; font-family:'Outfit',sans-serif; font-size:0.88rem; cursor:pointer; transition:all 0.18s; }
  .btn-modal-cancel:hover { background:var(--surface3); color:var(--text-primary); }

  .adm-toast { position:fixed; bottom:28px; left:50%; transform:translateX(-50%); background:var(--surface3); border:1px solid var(--border-hover); color:var(--text-primary); padding:12px 22px; border-radius:12px; font-size:0.84rem; font-family:'Outfit',sans-serif; font-weight:500; z-index:999; pointer-events:none; box-shadow:0 16px 40px rgba(0,0,0,0.5); white-space:nowrap; animation:toastIn 0.25s cubic-bezier(0.22,1,0.36,1); }
  @keyframes toastIn { from{opacity:0;transform:translateX(-50%) translateY(8px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }

  .adm-spinner { width:32px; height:32px; border:2.5px solid var(--surface3); border-top-color:var(--gold); border-radius:50%; animation:spin 0.7s linear infinite; margin:80px auto; }
  @keyframes spin { to{transform:rotate(360deg)} }

  @media (max-width:640px) {
    .adm-inner { padding:0 16px 40px; }
    .adm-grid { grid-template-columns:1fr; }
    .adm-tabs { width:100%; }
    .adm-tab { flex:1; justify-content:center; }
  }
`;

const TAB_COUNTS = { pending: 0, approved: 0, rejected: 0 };

export default function ProductApprovals() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("pending");
  const [counts, setCounts] = useState(TAB_COUNTS);
  const [rejectingProduct, setRejectingProduct] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [processing, setProcessing] = useState(false);
  const [toast, setToast] = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2800); };

  const loadProducts = (tab = status) => {
    setLoading(true);
    api.get(`/admin/products/${tab}`)
      .then((res) => setProducts(Array.isArray(res.data) ? res.data : []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  };

  // Load counts for all tabs
  const loadCounts = () => {
    Promise.all([
      api.get("/admin/products/pending").catch(() => ({ data: [] })),
      api.get("/admin/products/approved").catch(() => ({ data: [] })),
      api.get("/admin/products/rejected").catch(() => ({ data: [] })),
    ]).then(([p, a, r]) => {
      setCounts({
        pending: Array.isArray(p.data) ? p.data.length : 0,
        approved: Array.isArray(a.data) ? a.data.length : 0,
        rejected: Array.isArray(r.data) ? r.data.length : 0,
      });
    });
  };

  useEffect(() => { loadProducts(); loadCounts(); }, [status]);

  const approve = async (id) => {
    setProcessing(true);
    try {
      await api.post(`/admin/products/${id}/approve`);
      setProducts((p) => p.filter((x) => x.id !== id));
      setCounts((c) => ({ ...c, pending: c.pending - 1, approved: c.approved + 1 }));
      showToast("✓ Product approved");
    } catch {
      showToast("✗ Failed to approve");
    } finally {
      setProcessing(false);
    }
  };

  const confirmReject = async () => {
    if (!rejectReason.trim()) { showToast("✗ Rejection reason required"); return; }
    setProcessing(true);
    try {
      await api.post(`/admin/products/${rejectingProduct.id}/reject`, { reason: rejectReason });
      setProducts((p) => p.filter((x) => x.id !== rejectingProduct.id));
      setCounts((c) => ({ ...c, pending: c.pending - 1, rejected: c.rejected + 1 }));
      setRejectingProduct(null);
      setRejectReason("");
      showToast("✓ Product rejected");
    } catch {
      showToast("✗ Failed to reject");
    } finally {
      setProcessing(false);
    }
  };

  const tabConfig = [
    { key: "pending", label: "Pending" },
    { key: "approved", label: "Approved" },
    { key: "rejected", label: "Rejected" },
  ];

  return (
    <>
      <style>{styles}</style>
      <div className="adm-root">
        <div className="adm-inner">

          {/* Header */}
          <div className="adm-header">
            <div className="adm-header-left">
              <div className="adm-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 2L12.4 7.2L18 8.1L14 12L15 17.6L10 15L5 17.6L6 12L2 8.1L7.6 7.2L10 2Z" stroke="#d4a843" strokeWidth="1.5" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="adm-title">
                <h1>Product Moderation</h1>
                <p>Admin dashboard</p>
              </div>
            </div>
            {counts.pending > 0 && (
              <div className="adm-count-pill">
                <strong>{counts.pending}</strong> awaiting review
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="adm-tabs">
            {tabConfig.map(({ key, label }) => (
              <button
                key={key}
                className={`adm-tab ${key} ${status === key ? "active" : ""}`}
                onClick={() => setStatus(key)}
              >
                <span className="adm-tab-dot" />
                {label}
                <span style={{ fontSize: "0.7rem", opacity: 0.7, fontFamily: "IBM Plex Mono" }}>
                  {counts[key]}
                </span>
              </button>
            ))}
          </div>

          {/* Content */}
          {loading ? (
            <div className="adm-spinner" />
          ) : products.length === 0 ? (
            <div className="adm-empty">
              <div className="adm-empty-icon">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <circle cx="14" cy="14" r="11" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M10 14l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>All clear</h3>
              <p>No {status} products to review</p>
            </div>
          ) : (
            <div className="adm-grid">
              {products.map((p, i) => (
                <div key={p.id} className="adm-card" style={{ animationDelay: `${i * 50}ms` }}>
                  {p.image_base64 ? (
                    <img
                      src={p.image_base64.startsWith("data:") ? p.image_base64 : `data:image/jpeg;base64,${p.image_base64}`}
                      alt={p.title}
                      className="adm-card-img"
                    />
                  ) : (
                    <div className="adm-card-img-placeholder">
                      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <rect x="3" y="5" width="26" height="22" rx="4" stroke="currentColor" strokeWidth="1.5"/>
                        <circle cx="11" cy="13" r="3" stroke="currentColor" strokeWidth="1.5"/>
                        <path d="M3 23l8-7 6 6 4-3 8 8" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  )}

                  <div className="adm-card-body">
                    <div className="adm-card-top">
                      <div className="adm-card-title">{p.title}</div>
                      <span className="adm-type-badge">{p.product_type || "course"}</span>
                    </div>

                    <div className="adm-card-meta">
                      <span className="adm-meta-item">₹<strong>{p.price?.toLocaleString()}</strong></span>
                      <span className="adm-meta-item"><strong>{p.commission_percent}%</strong> commission</span>
                    </div>

                    {p.status === "rejected" && p.rejection_reason && (
                      <div className="adm-rejection-note">
                        <span>Rejection reason</span>
                        {p.rejection_reason}
                      </div>
                    )}

                    {status === "pending" && (
                      <div className="adm-card-actions">
                        <button className="btn-approve" onClick={() => approve(p.id)} disabled={processing}>
                          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2 7l3 3 6-6"/>
                          </svg>
                          Approve
                        </button>
                        <button className="btn-reject" onClick={() => { setRejectingProduct(p); setRejectReason(""); }} disabled={processing}>
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <line x1="2" y1="2" x2="10" y2="10"/><line x1="10" y1="2" x2="2" y2="10"/>
                          </svg>
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Reject Modal */}
      {rejectingProduct && (
        <div className="adm-overlay" onClick={(e) => e.target === e.currentTarget && setRejectingProduct(null)}>
          <div className="adm-modal">
            <div className="adm-modal-header">
              <div>
                <h3>Reject Product</h3>
                <p>{rejectingProduct.title}</p>
              </div>
            </div>
            <div className="adm-modal-body">
              <label>Reason for rejection</label>
              <textarea
                className="adm-textarea"
                placeholder="e.g. Content quality too low, misleading description..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                autoFocus
              />
            </div>
            <div className="adm-modal-footer">
              <button className="btn-confirm-reject" onClick={confirmReject} disabled={processing}>
                {processing ? "Rejecting…" : "Confirm Reject"}
              </button>
              <button className="btn-modal-cancel" onClick={() => setRejectingProduct(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="adm-toast">{toast}</div>}
    </>
  );
}