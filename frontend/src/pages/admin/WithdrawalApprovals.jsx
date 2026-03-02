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

  .wd-root { font-family: 'Outfit', sans-serif; background: var(--bg); min-height: 100vh; color: var(--text-primary); }
  .wd-root::before { content:''; position:fixed; top:-200px; left:-200px; width:600px; height:600px; background:radial-gradient(circle, rgba(212,168,67,0.04) 0%, transparent 70%); pointer-events:none; z-index:0; }

  .wd-inner { position:relative; z-index:1; padding:0 40px 80px; max-width:1100px; margin:0 auto; }

  .wd-header { display:flex; align-items:center; justify-content:space-between; padding:36px 0 32px; border-bottom:1px solid var(--border); margin-bottom:36px; }
  .wd-header-left { display:flex; align-items:center; gap:16px; }
  .wd-icon { width:42px; height:42px; background:var(--gold-dim); border:1px solid rgba(212,168,67,0.2); border-radius:11px; display:flex; align-items:center; justify-content:center; }
  .wd-title h1 { font-family:'Fraunces',serif; font-size:1.7rem; font-weight:700; letter-spacing:-0.03em; }
  .wd-title p { font-size:0.7rem; color:var(--text-secondary); margin-top:4px; font-family:'IBM Plex Mono',monospace; letter-spacing:0.1em; text-transform:uppercase; }

  .wd-summary { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; margin-bottom:36px; }
  .wd-sum-card { background:var(--surface); border:1px solid var(--border); border-radius:14px; padding:20px 22px; }
  .wd-sum-label { font-size:0.65rem; color:var(--text-secondary); text-transform:uppercase; letter-spacing:0.12em; font-family:'IBM Plex Mono',monospace; margin-bottom:8px; }
  .wd-sum-value { font-family:'Fraunces',serif; font-size:1.8rem; font-weight:700; letter-spacing:-0.04em; }
  .wd-sum-card.amber .wd-sum-value { color:var(--amber); }
  .wd-sum-card.green .wd-sum-value { color:var(--green); }
  .wd-sum-card.red .wd-sum-value { color:var(--red); }

  .wd-tabs { display:flex; gap:6px; background:var(--surface); border:1px solid var(--border); border-radius:10px; padding:4px; width:fit-content; margin-bottom:28px; }
  .wd-tab { padding:7px 18px; border-radius:7px; border:none; background:transparent; color:var(--text-secondary); font-family:'Outfit',sans-serif; font-size:0.82rem; font-weight:500; cursor:pointer; transition:all 0.15s; display:flex; align-items:center; gap:6px; }
  .wd-tab:hover { color:var(--text-primary); }
  .wd-tab.active { background:var(--surface3); color:var(--text-primary); }
  .wd-tab.active.pending { color:var(--amber); }
  .wd-tab.active.approved { color:var(--green); }
  .wd-tab.active.rejected { color:var(--red); }
  .wd-tab-dot { width:6px; height:6px; border-radius:50%; flex-shrink:0; }
  .pending .wd-tab-dot { background:var(--amber); }
  .approved .wd-tab-dot { background:var(--green); }
  .rejected .wd-tab-dot { background:var(--red); }

  .wd-list { display:flex; flex-direction:column; gap:12px; }

  .wd-card { background:var(--surface); border:1px solid var(--border); border-radius:14px; padding:20px 22px; transition:all 0.2s; animation:cardIn 0.35s ease both; }
  @keyframes cardIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
  .wd-card:hover { border-color:var(--border-hover); }

  .wd-card-top { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:14px; }
  .wd-card-amount { font-family:'Fraunces',serif; font-size:1.8rem; font-weight:700; color:var(--gold); letter-spacing:-0.04em; line-height:1; }
  .wd-card-date { font-size:0.68rem; color:var(--text-muted); font-family:'IBM Plex Mono',monospace; margin-top:4px; }

  .wd-status-badge { display:inline-flex; align-items:center; gap:5px; font-size:0.64rem; font-weight:600; letter-spacing:0.1em; text-transform:uppercase; padding:4px 10px; border-radius:20px; font-family:'IBM Plex Mono',monospace; }
  .wd-status-badge.pending { background:var(--amber-dim); color:var(--amber); border:1px solid var(--amber-border); }
  .wd-status-badge.approved { background:var(--green-dim); color:var(--green); border:1px solid var(--green-border); }
  .wd-status-badge.rejected { background:var(--red-dim); color:var(--red); border:1px solid var(--red-border); }

  .wd-card-details { display:grid; grid-template-columns:repeat(2,1fr); gap:10px; margin-bottom:16px; }
  .wd-detail { background:var(--surface2); border:1px solid var(--border); border-radius:9px; padding:10px 12px; }
  .wd-detail-label { font-size:0.62rem; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.1em; font-family:'IBM Plex Mono',monospace; margin-bottom:4px; }
  .wd-detail-value { font-size:0.84rem; color:var(--text-primary); font-family:'IBM Plex Mono',monospace; word-break:break-all; }

  .wd-admin-note { padding:10px 12px; background:var(--red-dim); border:1px solid var(--red-border); border-radius:9px; font-size:0.78rem; color:#fca5a5; margin-bottom:14px; }
  .wd-admin-note span { display:block; font-size:0.62rem; font-family:'IBM Plex Mono',monospace; text-transform:uppercase; letter-spacing:0.1em; color:var(--red); margin-bottom:3px; }

  .wd-card-actions { display:flex; gap:8px; }
  .btn-approve { flex:1; display:flex; align-items:center; justify-content:center; gap:6px; background:var(--green-dim); border:1px solid var(--green-border); color:var(--green); padding:10px; border-radius:9px; font-family:'Outfit',sans-serif; font-size:0.82rem; font-weight:600; cursor:pointer; transition:all 0.18s; }
  .btn-approve:hover:not(:disabled) { background:rgba(45,212,160,0.2); box-shadow:0 0 16px rgba(45,212,160,0.15); }
  .btn-approve:disabled { opacity:0.3; cursor:not-allowed; }

  .btn-reject { flex:1; display:flex; align-items:center; justify-content:center; gap:6px; background:var(--red-dim); border:1px solid var(--red-border); color:var(--red); padding:10px; border-radius:9px; font-family:'Outfit',sans-serif; font-size:0.82rem; font-weight:600; cursor:pointer; transition:all 0.18s; }
  .btn-reject:hover:not(:disabled) { background:rgba(240,96,96,0.2); box-shadow:0 0 16px rgba(240,96,96,0.15); }
  .btn-reject:disabled { opacity:0.3; cursor:not-allowed; }

  .wd-empty { display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:300px; gap:14px; }
  .wd-empty-icon { width:64px; height:64px; background:var(--surface2); border:1px solid var(--border); border-radius:18px; display:flex; align-items:center; justify-content:center; color:var(--text-muted); margin-bottom:4px; }
  .wd-empty h3 { font-family:'Fraunces',serif; font-size:1.1rem; color:var(--text-muted); font-style:italic; font-weight:400; }
  .wd-empty p { font-size:0.72rem; color:var(--text-muted); font-family:'IBM Plex Mono',monospace; }

  .wd-overlay { position:fixed; inset:0; background:rgba(4,5,10,0.92); backdrop-filter:blur(12px); display:flex; align-items:center; justify-content:center; z-index:100; animation:fadeIn 0.2s ease; }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
  .wd-modal { background:var(--surface); border:1px solid rgba(255,255,255,0.08); border-radius:20px; width:440px; max-width:95vw; box-shadow:0 48px 96px rgba(0,0,0,0.8); animation:modalIn 0.22s cubic-bezier(0.22,1,0.36,1); }
  @keyframes modalIn { from{opacity:0;transform:translateY(16px) scale(0.98)} to{opacity:1;transform:translateY(0) scale(1)} }
  .wd-modal-header { padding:22px 24px 18px; border-bottom:1px solid var(--border); }
  .wd-modal-header h3 { font-family:'Fraunces',serif; font-size:1.1rem; font-weight:700; color:var(--text-primary); letter-spacing:-0.02em; }
  .wd-modal-header p { font-size:0.76rem; color:var(--text-secondary); margin-top:3px; }
  .wd-modal-body { padding:22px 24px 8px; }
  .wd-modal-body label { display:block; font-size:0.65rem; color:var(--text-secondary); text-transform:uppercase; letter-spacing:0.12em; font-family:'IBM Plex Mono',monospace; margin-bottom:8px; }
  .wd-textarea { width:100%; background:var(--surface2); border:1px solid var(--border); border-radius:10px; padding:11px 13px; color:var(--text-primary); font-family:'Outfit',sans-serif; font-size:0.88rem; outline:none; resize:vertical; min-height:90px; transition:all 0.18s; }
  .wd-textarea:focus { border-color:rgba(240,96,96,0.35); box-shadow:0 0 0 3px rgba(240,96,96,0.06); }
  .wd-textarea::placeholder { color:var(--text-muted); }
  .wd-modal-footer { padding:16px 24px 24px; display:flex; gap:10px; }
  .btn-confirm-reject { flex:1; background:var(--red); color:#fff; border:none; padding:12px; border-radius:11px; font-family:'Outfit',sans-serif; font-size:0.9rem; font-weight:600; cursor:pointer; transition:all 0.2s; }
  .btn-confirm-reject:hover:not(:disabled) { background:#e84040; box-shadow:0 0 20px rgba(240,96,96,0.3); }
  .btn-confirm-reject:disabled { opacity:0.35; cursor:not-allowed; }
  .btn-modal-cancel { background:var(--surface2); color:var(--text-secondary); border:1px solid var(--border); padding:12px 20px; border-radius:11px; font-family:'Outfit',sans-serif; font-size:0.88rem; cursor:pointer; transition:all 0.18s; }
  .btn-modal-cancel:hover { background:var(--surface3); color:var(--text-primary); }

  .wd-spinner { width:32px; height:32px; border:2.5px solid var(--surface3); border-top-color:var(--gold); border-radius:50%; animation:spin 0.7s linear infinite; margin:80px auto; }
  @keyframes spin { to{transform:rotate(360deg)} }

  .wd-toast { position:fixed; bottom:28px; left:50%; transform:translateX(-50%); background:var(--surface3); border:1px solid var(--border-hover); color:var(--text-primary); padding:12px 22px; border-radius:12px; font-size:0.84rem; font-family:'Outfit',sans-serif; font-weight:500; z-index:999; pointer-events:none; box-shadow:0 16px 40px rgba(0,0,0,0.5); white-space:nowrap; animation:toastIn 0.25s cubic-bezier(0.22,1,0.36,1); }
  @keyframes toastIn { from{opacity:0;transform:translateX(-50%) translateY(8px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }

  @media (max-width:640px) {
    .wd-inner { padding:0 16px 60px; }
    .wd-summary { grid-template-columns:1fr; }
    .wd-card-details { grid-template-columns:1fr; }
  }
`;

const TABS = ["pending", "approved", "rejected"];

export default function WithdrawalApprovals() {
  const [status, setStatus] = useState("pending");
  const [requests, setRequests] = useState([]);
  const [counts, setCounts] = useState({ pending: 0, approved: 0, rejected: 0 });
  const [totalPending, setTotalPending] = useState(0);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectNote, setRejectNote] = useState("");
  const [toast, setToast] = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2800); };

  const loadAll = async () => {
    setLoading(true);
    try {
      const [p, a, r] = await Promise.all([
        api.get("/admin/withdrawals/?status=pending").catch(() => ({ data: [] })),
        api.get("/admin/withdrawals/?status=approved").catch(() => ({ data: [] })),
        api.get("/admin/withdrawals/?status=rejected").catch(() => ({ data: [] })),
      ]);

      const pending = Array.isArray(p.data) ? p.data : [];
      const approved = Array.isArray(a.data) ? a.data : [];
      const rejected = Array.isArray(r.data) ? r.data : [];

      setCounts({ pending: pending.length, approved: approved.length, rejected: rejected.length });
      setTotalPending(pending.reduce((sum, w) => sum + w.amount, 0));

      if (status === "pending") setRequests(pending);
      else if (status === "approved") setRequests(approved);
      else setRequests(rejected);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAll(); }, [status]);

  const approve = async (id) => {
    setProcessing(true);
    try {
      await api.post(`/admin/withdrawals/${id}/approve`);
      setRequests((r) => r.filter((x) => x.id !== id));
      setCounts((c) => ({ ...c, pending: c.pending - 1, approved: c.approved + 1 }));
      showToast("✓ Withdrawal approved");
    } catch {
      showToast("✗ Failed to approve");
    } finally {
      setProcessing(false);
    }
  };

  const confirmReject = async () => {
    if (!rejectNote.trim()) { showToast("✗ Note required"); return; }
    setProcessing(true);
    try {
      await api.post(`/admin/withdrawals/${rejectingId}/reject`, { note: rejectNote });
      setRequests((r) => r.filter((x) => x.id !== rejectingId));
      setCounts((c) => ({ ...c, pending: c.pending - 1, rejected: c.rejected + 1 }));
      setRejectingId(null);
      setRejectNote("");
      showToast("✓ Withdrawal rejected — balance refunded");
    } catch {
      showToast("✗ Failed to reject");
    } finally {
      setProcessing(false);
    }
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—";

  return (
    <>
      <style>{styles}</style>
      <div className="wd-root">
        <div className="wd-inner">

          {/* Header */}
          <div className="wd-header">
            <div className="wd-header-left">
              <div className="wd-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <rect x="2" y="5" width="16" height="12" rx="3" stroke="#d4a843" strokeWidth="1.5"/>
                  <path d="M2 9h16" stroke="#d4a843" strokeWidth="1.5"/>
                  <circle cx="6" cy="13" r="1" fill="#d4a843"/>
                </svg>
              </div>
              <div className="wd-title">
                <h1>Withdrawal Requests</h1>
                <p>Admin payout management</p>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="wd-summary">
            <div className="wd-sum-card amber">
              <div className="wd-sum-label">Pending Amount</div>
              <div className="wd-sum-value">₹{totalPending.toLocaleString()}</div>
            </div>
            <div className="wd-sum-card green">
              <div className="wd-sum-label">Approved</div>
              <div className="wd-sum-value">{counts.approved}</div>
            </div>
            <div className="wd-sum-card red">
              <div className="wd-sum-label">Rejected</div>
              <div className="wd-sum-value">{counts.rejected}</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="wd-tabs">
            {TABS.map((t) => (
              <button
                key={t}
                className={`wd-tab ${t} ${status === t ? "active" : ""}`}
                onClick={() => setStatus(t)}
              >
                <span className="wd-tab-dot" />
                {t.charAt(0).toUpperCase() + t.slice(1)}
                <span style={{ fontSize:"0.68rem", opacity:0.7, fontFamily:"IBM Plex Mono" }}>
                  {counts[t]}
                </span>
              </button>
            ))}
          </div>

          {/* Content */}
          {loading ? <div className="wd-spinner" /> : requests.length === 0 ? (
            <div className="wd-empty">
              <div className="wd-empty-icon">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <circle cx="14" cy="14" r="11" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M10 14l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>All clear</h3>
              <p>No {status} withdrawal requests</p>
            </div>
          ) : (
            <div className="wd-list">
              {requests.map((w, i) => (
                <div key={w.id} className="wd-card" style={{ animationDelay: `${i * 40}ms` }}>
                  <div className="wd-card-top">
                    <div>
                      <div className="wd-card-amount">₹{w.amount?.toLocaleString()}</div>
                      <div className="wd-card-date">{formatDate(w.requested_at)}</div>
                    </div>
                    <span className={`wd-status-badge ${w.status}`}>{w.status}</span>
                  </div>

                  <div className="wd-card-details">
                    <div className="wd-detail">
                      <div className="wd-detail-label">Affiliate ID</div>
                      <div className="wd-detail-value">#{w.affiliate_id}</div>
                    </div>
                    <div className="wd-detail">
                      <div className="wd-detail-label">Payment Method</div>
                      <div className="wd-detail-value">{w.upi_id || w.bank_account || "—"}</div>
                    </div>
                    {w.resolved_at && (
                      <div className="wd-detail">
                        <div className="wd-detail-label">Resolved At</div>
                        <div className="wd-detail-value">{formatDate(w.resolved_at)}</div>
                      </div>
                    )}
                  </div>

                  {w.admin_note && (
                    <div className="wd-admin-note">
                      <span>Admin note</span>
                      {w.admin_note}
                    </div>
                  )}

                  {w.status === "pending" && (
                    <div className="wd-card-actions">
                      <button className="btn-approve" onClick={() => approve(w.id)} disabled={processing}>
                        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2 7l3 3 6-6"/>
                        </svg>
                        Approve
                      </button>
                      <button className="btn-reject" onClick={() => { setRejectingId(w.id); setRejectNote(""); }} disabled={processing}>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <line x1="2" y1="2" x2="10" y2="10"/><line x1="10" y1="2" x2="2" y2="10"/>
                        </svg>
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Reject Modal */}
      {rejectingId && (
        <div className="wd-overlay" onClick={(e) => e.target === e.currentTarget && setRejectingId(null)}>
          <div className="wd-modal">
            <div className="wd-modal-header">
              <h3>Reject Withdrawal</h3>
              <p>The affiliate's balance will be refunded automatically.</p>
            </div>
            <div className="wd-modal-body">
              <label>Reason / Note</label>
              <textarea
                className="wd-textarea"
                placeholder="e.g. Invalid UPI ID, bank details mismatch..."
                value={rejectNote}
                onChange={(e) => setRejectNote(e.target.value)}
                autoFocus
              />
            </div>
            <div className="wd-modal-footer">
              <button className="btn-confirm-reject" onClick={confirmReject} disabled={processing}>
                {processing ? "Rejecting…" : "Confirm Reject"}
              </button>
              <button className="btn-modal-cancel" onClick={() => setRejectingId(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="wd-toast">{toast}</div>}
    </>
  );
}