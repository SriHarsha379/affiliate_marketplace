import { useEffect, useState } from "react";
import { api } from "../../api/client";

const MIN_WITHDRAWAL = 500;

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,400&family=IBM+Plex+Mono:wght@400;500&family=Outfit:wght@300;400;500;600&display=swap');

  :root {
    --bg: #080910; --surface: #0d0f18; --surface2: #111420; --surface3: #161928;
    --border: rgba(255,255,255,0.06); --border-hover: rgba(255,255,255,0.12);
    --gold: #d4a843; --gold-dim: rgba(212,168,67,0.1); --gold-glow: rgba(212,168,67,0.25);
    --text-primary: #f0ede8; --text-secondary: #6b6f85; --text-muted: #30334a;
    --green: #2dd4a0; --green-dim: rgba(45,212,160,0.1);
    --red: #f06060; --red-dim: rgba(240,96,96,0.1);
    --amber: #f0a840;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .wl-root {
    font-family: 'Outfit', sans-serif;
    background: var(--bg);
    min-height: 100vh;
    color: var(--text-primary);
    position: relative;
  }

  .wl-root::before {
    content: '';
    position: fixed;
    top: -200px; right: -200px;
    width: 600px; height: 600px;
    background: radial-gradient(circle, rgba(212,168,67,0.04) 0%, transparent 70%);
    pointer-events: none; z-index: 0;
  }

  .wl-inner {
    position: relative; z-index: 1;
    max-width: 1000px; margin: 0 auto;
    padding: 0 32px 60px;
  }

  /* Header */
  .wl-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 36px 0 32px;
    border-bottom: 1px solid var(--border);
    margin-bottom: 36px;
  }

  .wl-header-left h1 {
    font-family: 'Fraunces', serif;
    font-size: 1.65rem; font-weight: 700;
    letter-spacing: -0.03em;
  }

  .wl-header-left p {
    font-size: 0.7rem; color: var(--text-secondary);
    font-family: 'IBM Plex Mono', monospace;
    letter-spacing: 0.08em; text-transform: uppercase; margin-top: 5px;
  }

  /* Stat cards row */
  .wl-stats-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 14px;
    margin-bottom: 32px;
  }

  .wl-stat-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 22px 20px;
    transition: border-color 0.2s;
  }

  .wl-stat-card:hover { border-color: var(--border-hover); }

  .wl-stat-label {
    font-size: 0.65rem; color: var(--text-secondary);
    text-transform: uppercase; letter-spacing: 0.12em;
    font-family: 'IBM Plex Mono', monospace;
    margin-bottom: 10px;
  }

  .wl-stat-value {
    font-family: 'Fraunces', serif;
    font-size: 1.85rem; font-weight: 700;
    letter-spacing: -0.03em;
  }

  .wl-stat-value.gold { color: var(--gold); }
  .wl-stat-value.green { color: var(--green); }
  .wl-stat-value.muted { color: var(--text-secondary); }

  .wl-stat-sub {
    font-size: 0.7rem; color: var(--text-muted);
    font-family: 'IBM Plex Mono', monospace;
    margin-top: 6px;
  }

  /* Progress bar */
  .wl-progress-wrap {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 22px 22px;
    margin-bottom: 32px;
  }

  .wl-progress-header {
    display: flex; justify-content: space-between;
    align-items: center; margin-bottom: 12px;
  }

  .wl-progress-label {
    font-size: 0.68rem; color: var(--text-secondary);
    text-transform: uppercase; letter-spacing: 0.1em;
    font-family: 'IBM Plex Mono', monospace;
  }

  .wl-progress-value {
    font-size: 0.78rem; color: var(--gold);
    font-family: 'IBM Plex Mono', monospace;
    font-weight: 500;
  }

  .wl-progress-track {
    height: 6px; background: var(--surface3);
    border-radius: 99px; overflow: hidden;
  }

  .wl-progress-fill {
    height: 100%; border-radius: 99px;
    background: linear-gradient(90deg, var(--gold), #e8bc55);
    transition: width 0.6s cubic-bezier(0.22,1,0.36,1);
    box-shadow: 0 0 12px var(--gold-glow);
  }

  .wl-progress-hint {
    font-size: 0.68rem; color: var(--text-muted);
    font-family: 'IBM Plex Mono', monospace;
    margin-top: 8px;
  }

  /* Two column layout */
  .wl-columns {
    display: grid;
    grid-template-columns: 1fr 340px;
    gap: 20px;
    align-items: start;
  }

  /* Transaction list */
  .wl-panel {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    overflow: hidden;
  }

  .wl-panel-header {
    padding: 16px 20px;
    border-bottom: 1px solid var(--border);
    display: flex; justify-content: space-between; align-items: center;
  }

  .wl-panel-title {
    font-family: 'Fraunces', serif;
    font-size: 0.95rem; font-weight: 600;
    letter-spacing: -0.01em;
  }

  .wl-txn-count {
    font-size: 0.65rem; color: var(--text-secondary);
    font-family: 'IBM Plex Mono', monospace;
    background: var(--surface3);
    border: 1px solid var(--border);
    padding: 3px 9px; border-radius: 20px;
  }

  .wl-txn-list { list-style: none; }

  .wl-txn-item {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 20px;
    border-bottom: 1px solid var(--border);
    transition: background 0.15s;
    gap: 12px;
  }

  .wl-txn-item:last-child { border-bottom: none; }
  .wl-txn-item:hover { background: rgba(255,255,255,0.02); }

  .wl-txn-icon {
    width: 34px; height: 34px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; flex-shrink: 0;
  }

  .wl-txn-icon.commission { background: var(--green-dim); }
  .wl-txn-icon.withdrawal { background: var(--gold-dim); }
  .wl-txn-icon.refund { background: var(--red-dim); }

  .wl-txn-info { flex: 1; min-width: 0; }

  .wl-txn-desc {
    font-size: 0.82rem; color: var(--text-primary);
    font-weight: 500; white-space: nowrap;
    overflow: hidden; text-overflow: ellipsis;
  }

  .wl-txn-date {
    font-size: 0.66rem; color: var(--text-muted);
    font-family: 'IBM Plex Mono', monospace;
    margin-top: 3px;
  }

  .wl-txn-amount {
    font-family: 'Fraunces', serif;
    font-size: 0.95rem; font-weight: 600;
    white-space: nowrap;
  }

  .wl-txn-amount.credit { color: var(--green); }
  .wl-txn-amount.debit  { color: var(--red); }
  .wl-txn-amount.pending { color: var(--amber); }

  .wl-empty {
    padding: 40px 20px; text-align: center;
    color: var(--text-muted);
    font-size: 0.8rem;
    font-family: 'IBM Plex Mono', monospace;
    letter-spacing: 0.06em;
  }

  /* Withdraw panel */
  .wl-withdraw-panel {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    overflow: hidden;
  }

  .wl-withdraw-header {
    padding: 16px 20px;
    border-bottom: 1px solid var(--border);
  }

  .wl-withdraw-body { padding: 18px 20px; }

  .wl-field { margin-bottom: 14px; }

  .wl-field label {
    display: block;
    font-size: 0.65rem; color: var(--text-secondary);
    text-transform: uppercase; letter-spacing: 0.12em;
    font-family: 'IBM Plex Mono', monospace;
    margin-bottom: 6px;
  }

  .wl-input {
    width: 100%; background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 9px; padding: 9px 12px;
    color: var(--text-primary);
    font-family: 'Outfit', sans-serif; font-size: 0.86rem;
    outline: none; transition: all 0.18s;
  }

  .wl-input:focus {
    border-color: rgba(212,168,67,0.35);
    background: var(--surface3);
    box-shadow: 0 0 0 3px rgba(212,168,67,0.06);
  }

  .wl-input::placeholder { color: var(--text-muted); }

  .wl-divider-label {
    text-align: center;
    font-size: 0.65rem; color: var(--text-muted);
    font-family: 'IBM Plex Mono', monospace;
    letter-spacing: 0.1em;
    margin: 12px 0;
    position: relative;
  }

  .wl-divider-label::before, .wl-divider-label::after {
    content: '';
    position: absolute; top: 50%;
    width: 38%; height: 1px;
    background: var(--border);
  }

  .wl-divider-label::before { left: 0; }
  .wl-divider-label::after  { right: 0; }

  .wl-threshold-note {
    font-size: 0.68rem; color: var(--text-muted);
    font-family: 'IBM Plex Mono', monospace;
    text-align: center; margin-bottom: 14px;
    line-height: 1.6;
  }

  .btn-withdraw {
    width: 100%; background: var(--gold);
    color: #08090e; border: none;
    padding: 12px; border-radius: 10px;
    font-family: 'Outfit', sans-serif;
    font-size: 0.88rem; font-weight: 600;
    cursor: pointer; letter-spacing: 0.01em;
    transition: all 0.2s;
  }

  .btn-withdraw:hover:not(:disabled) {
    background: #e8bc55;
    box-shadow: 0 0 20px var(--gold-glow);
    transform: translateY(-1px);
  }

  .btn-withdraw:disabled { opacity: 0.3; cursor: not-allowed; }

  /* Toast */
  .wl-toast {
    position: fixed; bottom: 28px; left: 50%;
    transform: translateX(-50%);
    background: var(--surface3);
    border: 1px solid var(--border-hover);
    color: var(--text-primary);
    padding: 11px 22px; border-radius: 12px;
    font-size: 0.83rem; font-family: 'Outfit', sans-serif; font-weight: 500;
    z-index: 999; pointer-events: none;
    box-shadow: 0 16px 40px rgba(0,0,0,0.5);
    animation: toastIn 0.25s cubic-bezier(0.22,1,0.36,1);
    white-space: nowrap;
  }

  @keyframes toastIn {
    from { opacity:0; transform: translateX(-50%) translateY(8px); }
    to   { opacity:1; transform: translateX(-50%) translateY(0); }
  }

  @media (max-width: 720px) {
    .wl-columns { grid-template-columns: 1fr; }
    .wl-stats-row { grid-template-columns: 1fr 1fr; }
    .wl-inner { padding: 0 16px 48px; }
  }
`;

const txnIcon = { commission: "💰", withdrawal: "📤", refund: "↩️" };

const fmt = (d) =>
  new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

export default function AffiliateWallet() {
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [withdrawing, setWithdrawing] = useState(false);
  const [form, setForm] = useState({ amount: "", upi_id: "", bank_account: "" });
  const [toast, setToast] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const load = () => {
    Promise.all([
      api.get("/affiliate/wallet/"),
      api.get("/affiliate/wallet/transactions"),
    ]).then(([w, t]) => {
      setWallet(w.data);
      setTransactions(t.data);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleWithdraw = async (e) => {
    e.preventDefault();
    if (!form.upi_id && !form.bank_account) {
      showToast("✗ Enter UPI ID or bank account");
      return;
    }
    setWithdrawing(true);
    try {
      await api.post("/affiliate/wallet/withdraw", {
        amount: Number(form.amount),
        upi_id: form.upi_id || null,
        bank_account: form.bank_account || null,
      });
      showToast("✓ Withdrawal request submitted!");
      setForm({ amount: "", upi_id: "", bank_account: "" });
      load();
    } catch (err) {
      const msg = err?.response?.data?.detail || "Withdrawal failed";
      showToast(`✗ ${msg}`);
    } finally {
      setWithdrawing(false);
    }
  };

  const progress = wallet
    ? Math.min((wallet.balance / MIN_WITHDRAWAL) * 100, 100)
    : 0;

  const canWithdraw = wallet?.balance >= MIN_WITHDRAWAL;

  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <div style={{ minHeight: "100vh", background: "#080910", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 36, height: 36, border: "3px solid #1a1d2e", borderTopColor: "#d4a843", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="wl-root">
        <div className="wl-inner">

          {/* Header */}
          <div className="wl-header">
            <div className="wl-header-left">
              <h1>Wallet</h1>
              <p>Earnings &amp; payouts</p>
            </div>
          </div>

          {/* Stat cards */}
          <div className="wl-stats-row">
            <div className="wl-stat-card">
              <div className="wl-stat-label">Available Balance</div>
              <div className="wl-stat-value gold">₹{wallet?.balance?.toFixed(2) ?? "0.00"}</div>
              <div className="wl-stat-sub">Ready to withdraw</div>
            </div>
            <div className="wl-stat-card">
              <div className="wl-stat-label">Total Earned</div>
              <div className="wl-stat-value green">₹{wallet?.total_earned?.toFixed(2) ?? "0.00"}</div>
              <div className="wl-stat-sub">All time commissions</div>
            </div>
            <div className="wl-stat-card">
              <div className="wl-stat-label">Total Withdrawn</div>
              <div className="wl-stat-value muted">₹{wallet?.total_withdrawn?.toFixed(2) ?? "0.00"}</div>
              <div className="wl-stat-sub">Paid out so far</div>
            </div>
          </div>

          {/* Progress to threshold */}
          {!canWithdraw && (
            <div className="wl-progress-wrap">
              <div className="wl-progress-header">
                <span className="wl-progress-label">Progress to minimum withdrawal</span>
                <span className="wl-progress-value">₹{wallet?.balance?.toFixed(2)} / ₹{MIN_WITHDRAWAL}</span>
              </div>
              <div className="wl-progress-track">
                <div className="wl-progress-fill" style={{ width: `${progress}%` }} />
              </div>
              <div className="wl-progress-hint">
                ₹{(MIN_WITHDRAWAL - (wallet?.balance ?? 0)).toFixed(2)} more to unlock withdrawal
              </div>
            </div>
          )}

          {/* Columns */}
          <div className="wl-columns">

            {/* Transaction history */}
            <div className="wl-panel">
              <div className="wl-panel-header">
                <span className="wl-panel-title">Transaction History</span>
                <span className="wl-txn-count">{transactions.length} entries</span>
              </div>
              {transactions.length === 0 ? (
                <div className="wl-empty">No transactions yet</div>
              ) : (
                <ul className="wl-txn-list">
                  {transactions.map((t) => (
                    <li key={t.id} className="wl-txn-item">
                      <div className={`wl-txn-icon ${t.type}`}>
                        {txnIcon[t.type] ?? "•"}
                      </div>
                      <div className="wl-txn-info">
                        <div className="wl-txn-desc">{t.description || t.type}</div>
                        <div className="wl-txn-date">{fmt(t.created_at)}</div>
                      </div>
                      <div className={`wl-txn-amount ${t.amount < 0 ? "debit" : t.status === "pending" ? "pending" : "credit"}`}>
                        {t.amount > 0 ? "+" : ""}₹{Math.abs(t.amount).toFixed(2)}
                        {t.status === "pending" && (
                          <div style={{ fontSize: "0.6rem", color: "var(--amber)", textAlign: "right", marginTop: 2 }}>pending</div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Withdraw panel */}
            <div className="wl-withdraw-panel">
              <div className="wl-withdraw-header">
                <span className="wl-panel-title">Request Withdrawal</span>
              </div>
              <div className="wl-withdraw-body">
                <form onSubmit={handleWithdraw}>
                  <div className="wl-field">
                    <label>Amount (₹)</label>
                    <input
                      className="wl-input"
                      type="number"
                      placeholder={`Min ₹${MIN_WITHDRAWAL}`}
                      value={form.amount}
                      onChange={(e) => setForm({ ...form, amount: e.target.value })}
                      max={wallet?.balance}
                      min={MIN_WITHDRAWAL}
                      required
                    />
                  </div>

                  <div className="wl-field">
                    <label>UPI ID</label>
                    <input
                      className="wl-input"
                      type="text"
                      placeholder="yourname@upi"
                      value={form.upi_id}
                      onChange={(e) => setForm({ ...form, upi_id: e.target.value })}
                    />
                  </div>

                  <div className="wl-divider-label">or</div>

                  <div className="wl-field">
                    <label>Bank Account</label>
                    <input
                      className="wl-input"
                      type="text"
                      placeholder="Account number"
                      value={form.bank_account}
                      onChange={(e) => setForm({ ...form, bank_account: e.target.value })}
                    />
                  </div>

                  <div className="wl-threshold-note">
                    Minimum withdrawal: ₹{MIN_WITHDRAWAL}<br />
                    Payouts processed within 2–3 business days
                  </div>

                  <button
                    type="submit"
                    className="btn-withdraw"
                    disabled={!canWithdraw || withdrawing}
                  >
                    {withdrawing ? "Submitting…" : canWithdraw ? "Request Withdrawal" : `Need ₹${MIN_WITHDRAWAL} to withdraw`}
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </div>
      {toast && <div className="wl-toast">{toast}</div>}
    </>
  );
}