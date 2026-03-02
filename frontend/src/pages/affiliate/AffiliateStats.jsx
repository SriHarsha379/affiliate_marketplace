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
    --blue: #60a5fa; --blue-dim: rgba(96,165,250,0.1); --blue-border: rgba(96,165,250,0.25);
    --amber: #f0a840; --amber-dim: rgba(240,168,64,0.1); --amber-border: rgba(240,168,64,0.25);
    --red: #f06060; --red-dim: rgba(240,96,96,0.1);
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .as-root { font-family: 'Outfit', sans-serif; background: var(--bg); min-height: 100vh; color: var(--text-primary); }
  .as-root::before { content:''; position:fixed; top:-200px; right:-200px; width:700px; height:700px; background:radial-gradient(circle, rgba(212,168,67,0.04) 0%, transparent 70%); pointer-events:none; z-index:0; }

  .as-inner { position:relative; z-index:1; padding:0 40px 80px; max-width:1100px; margin:0 auto; }

  .as-header { display:flex; align-items:center; justify-content:space-between; padding:36px 0 32px; border-bottom:1px solid var(--border); margin-bottom:40px; }
  .as-header-left { display:flex; align-items:center; gap:16px; }
  .as-icon { width:42px; height:42px; background:var(--gold-dim); border:1px solid rgba(212,168,67,0.2); border-radius:11px; display:flex; align-items:center; justify-content:center; }
  .as-title h1 { font-family:'Fraunces',serif; font-size:1.7rem; font-weight:700; letter-spacing:-0.03em; }
  .as-title p { font-size:0.7rem; color:var(--text-secondary); margin-top:4px; font-family:'IBM Plex Mono',monospace; letter-spacing:0.1em; text-transform:uppercase; }

  .as-stats-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-bottom:48px; }

  .as-stat { background:var(--surface); border:1px solid var(--border); border-radius:16px; padding:24px; position:relative; overflow:hidden; transition:all 0.2s; }
  .as-stat:hover { border-color:var(--border-hover); transform:translateY(-2px); box-shadow:0 16px 40px rgba(0,0,0,0.3); }
  .as-stat::after { content:''; position:absolute; bottom:-20px; right:-20px; width:80px; height:80px; border-radius:50%; opacity:0.06; }
  .as-stat.gold::after { background:var(--gold); }
  .as-stat.blue::after { background:var(--blue); }
  .as-stat.green::after { background:var(--green); }
  .as-stat.amber::after { background:var(--amber); }

  .as-stat-icon { width:36px; height:36px; border-radius:9px; display:flex; align-items:center; justify-content:center; margin-bottom:16px; }
  .as-stat.gold .as-stat-icon { background:var(--gold-dim); color:var(--gold); }
  .as-stat.blue .as-stat-icon { background:var(--blue-dim); color:var(--blue); }
  .as-stat.green .as-stat-icon { background:var(--green-dim); color:var(--green); }
  .as-stat.amber .as-stat-icon { background:var(--amber-dim); color:var(--amber); }

  .as-stat-label { font-size:0.65rem; color:var(--text-secondary); text-transform:uppercase; letter-spacing:0.12em; font-family:'IBM Plex Mono',monospace; margin-bottom:8px; }
  .as-stat-value { font-family:'Fraunces',serif; font-size:2.2rem; font-weight:700; letter-spacing:-0.05em; line-height:1; margin-bottom:6px; }
  .as-stat.gold .as-stat-value { color:var(--gold); }
  .as-stat.blue .as-stat-value { color:var(--blue); }
  .as-stat.green .as-stat-value { color:var(--green); }
  .as-stat.amber .as-stat-value { color:var(--amber); }
  .as-stat-sub { font-size:0.68rem; color:var(--text-muted); font-family:'IBM Plex Mono',monospace; }

  .as-conversion { background:var(--surface); border:1px solid var(--border); border-radius:16px; padding:24px; margin-bottom:32px; }
  .as-conversion-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:20px; }
  .as-conversion-title { font-family:'Fraunces',serif; font-size:1.1rem; font-weight:600; letter-spacing:-0.02em; }
  .as-conversion-rate { font-family:'IBM Plex Mono',monospace; font-size:0.72rem; color:var(--text-secondary); }

  .as-bar-track { background:var(--surface2); border-radius:99px; height:8px; overflow:hidden; margin-bottom:8px; }
  .as-bar-fill { height:100%; border-radius:99px; background:linear-gradient(90deg, var(--gold), #e8bc55); transition:width 1s cubic-bezier(0.22,1,0.36,1); }
  .as-bar-labels { display:flex; justify-content:space-between; font-size:0.66rem; font-family:'IBM Plex Mono',monospace; color:var(--text-muted); }

  .as-section-title { font-family:'Fraunces',serif; font-size:1.15rem; font-weight:600; letter-spacing:-0.02em; margin-bottom:20px; display:flex; align-items:center; gap:10px; }
  .as-section-badge { font-size:0.62rem; font-family:'IBM Plex Mono',monospace; color:var(--text-secondary); letter-spacing:0.1em; text-transform:uppercase; font-weight:400; background:var(--surface2); border:1px solid var(--border); padding:3px 9px; border-radius:20px; }

  .as-product-list { display:flex; flex-direction:column; gap:10px; }

  .as-product-row { background:var(--surface); border:1px solid var(--border); border-radius:13px; padding:16px 20px; display:flex; align-items:center; gap:16px; transition:all 0.2s; animation:rowIn 0.35s ease both; }
  @keyframes rowIn { from{opacity:0;transform:translateX(-8px)} to{opacity:1;transform:translateX(0)} }
  .as-product-row:hover { border-color:var(--border-hover); background:var(--surface2); }

  .as-product-img { width:48px; height:48px; border-radius:9px; object-fit:cover; flex-shrink:0; }
  .as-product-img-placeholder { width:48px; height:48px; border-radius:9px; background:var(--surface3); border:1px solid var(--border); display:flex; align-items:center; justify-content:center; color:var(--text-muted); flex-shrink:0; }

  .as-product-info { flex:1; min-width:0; }
  .as-product-name { font-size:0.9rem; font-weight:500; color:var(--text-primary); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; margin-bottom:3px; }
  .as-product-ref { font-size:0.65rem; font-family:'IBM Plex Mono',monospace; color:var(--text-muted); }

  .as-product-metrics { display:flex; gap:24px; align-items:center; flex-shrink:0; }
  .as-pmetric { text-align:center; }
  .as-pmetric-val { font-family:'Fraunces',serif; font-size:1.1rem; font-weight:600; line-height:1; margin-bottom:2px; }
  .as-pmetric-label { font-size:0.58rem; font-family:'IBM Plex Mono',monospace; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.08em; }
  .as-pmetric.clicks .as-pmetric-val { color:var(--blue); }
  .as-pmetric.sales .as-pmetric-val { color:var(--green); }
  .as-pmetric.earnings .as-pmetric-val { color:var(--gold); }

  .as-empty { display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:280px; gap:14px; }
  .as-empty-icon { width:64px; height:64px; background:var(--surface2); border:1px solid var(--border); border-radius:18px; display:flex; align-items:center; justify-content:center; color:var(--text-muted); margin-bottom:4px; }
  .as-empty h3 { font-family:'Fraunces',serif; font-size:1.1rem; color:var(--text-muted); font-style:italic; font-weight:400; }
  .as-empty p { font-size:0.72rem; color:var(--text-muted); font-family:'IBM Plex Mono',monospace; }

  .as-spinner { width:32px; height:32px; border:2.5px solid var(--surface3); border-top-color:var(--gold); border-radius:50%; animation:spin 0.7s linear infinite; margin:80px auto; }
  @keyframes spin { to{transform:rotate(360deg)} }

  @media (max-width:900px) { .as-stats-grid { grid-template-columns:repeat(2,1fr); } }
  @media (max-width:640px) {
    .as-inner { padding:0 16px 60px; }
    .as-stats-grid { grid-template-columns:repeat(2,1fr); }
    .as-product-metrics { gap:12px; }
  }
`;

export default function AffiliateStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/affiliate/stats")
      .then((res) => setStats(res.data))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  const summary = stats?.summary || {};
  const products = stats?.products || [];

  const conversionRate = summary.total_clicks > 0
    ? ((summary.total_sales / summary.total_clicks) * 100).toFixed(1)
    : 0;

  const barWidth = Math.min(Number(conversionRate), 100);

  return (
    <>
      <style>{styles}</style>
      <div className="as-root">
        <div className="as-inner">

          {/* Header */}
          <div className="as-header">
            <div className="as-header-left">
              <div className="as-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M3 17V9M7 17V5M11 17v-6M15 17V3" stroke="#d4a843" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="as-title">
                <h1>Performance Stats</h1>
                <p>Affiliate analytics overview</p>
              </div>
            </div>
          </div>

          {loading ? <div className="as-spinner" /> : (
            <>
              {/* Stats Cards */}
              <div className="as-stats-grid">
                <div className="as-stat gold">
                  <div className="as-stat-icon">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                      <path d="M2 14V6l6-4 6 4v8"/><rect x="5" y="9" width="2" height="5"/><rect x="9" y="9" width="2" height="5"/>
                    </svg>
                  </div>
                  <div className="as-stat-label">Total Earnings</div>
                  <div className="as-stat-value">₹{(summary.total_earnings || 0).toLocaleString()}</div>
                  <div className="as-stat-sub">lifetime commissions</div>
                </div>

                <div className="as-stat blue">
                  <div className="as-stat-icon">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                      <path d="M1 8s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5z"/><circle cx="8" cy="8" r="2"/>
                    </svg>
                  </div>
                  <div className="as-stat-label">Total Clicks</div>
                  <div className="as-stat-value">{summary.total_clicks || 0}</div>
                  <div className="as-stat-sub">referral link visits</div>
                </div>

                <div className="as-stat green">
                  <div className="as-stat-icon">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                      <path d="M2 9l4 4 8-8"/>
                    </svg>
                  </div>
                  <div className="as-stat-label">Total Sales</div>
                  <div className="as-stat-value">{summary.total_sales || 0}</div>
                  <div className="as-stat-sub">paid conversions</div>
                </div>

                <div className="as-stat amber">
                  <div className="as-stat-icon">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                      <path d="M8 1v14M1 8h14"/>
                    </svg>
                  </div>
                  <div className="as-stat-label">Active Links</div>
                  <div className="as-stat-value">{summary.total_links || 0}</div>
                  <div className="as-stat-sub">products promoted</div>
                </div>
              </div>

              {/* Conversion Rate Bar */}
              <div className="as-conversion">
                <div className="as-conversion-header">
                  <div className="as-conversion-title">Conversion Rate</div>
                  <div className="as-conversion-rate">{conversionRate}% of clicks convert to sales</div>
                </div>
                <div className="as-bar-track">
                  <div className="as-bar-fill" style={{ width: `${barWidth}%` }} />
                </div>
                <div className="as-bar-labels">
                  <span>0%</span>
                  <span>{summary.total_clicks || 0} clicks → {summary.total_sales || 0} sales</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Per Product Breakdown */}
              <div className="as-section-title">
                Product Breakdown
                <span className="as-section-badge">{products.length} promoted</span>
              </div>

              {products.length === 0 ? (
                <div className="as-empty">
                  <div className="as-empty-icon">
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                      <path d="M4 22V14M10 22V8M16 22v-6M22 22V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <h3>No data yet</h3>
                  <p>Generate referral links to start tracking</p>
                </div>
              ) : (
                <div className="as-product-list">
                  {products.map((p, i) => (
                    <div key={p.product_id} className="as-product-row" style={{ animationDelay: `${i * 50}ms` }}>
                      {p.image_base64 ? (
                        <img
                          src={p.image_base64.startsWith("data:") ? p.image_base64 : `data:image/jpeg;base64,${p.image_base64}`}
                          alt={p.title}
                          className="as-product-img"
                        />
                      ) : (
                        <div className="as-product-img-placeholder">
                          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <rect x="1" y="2" width="16" height="14" rx="3" stroke="currentColor" strokeWidth="1.4"/>
                            <circle cx="6" cy="7" r="2" stroke="currentColor" strokeWidth="1.4"/>
                            <path d="M1 13l4-4 3 3 3-2 6 6" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      )}

                      <div className="as-product-info">
                        <div className="as-product-name">{p.title}</div>
                        <div className="as-product-ref">ref: {p.ref_code}</div>
                      </div>

                      <div className="as-product-metrics">
                        <div className="as-pmetric clicks">
                          <div className="as-pmetric-val">{p.clicks}</div>
                          <div className="as-pmetric-label">Clicks</div>
                        </div>
                        <div className="as-pmetric sales">
                          <div className="as-pmetric-val">{p.sales}</div>
                          <div className="as-pmetric-label">Sales</div>
                        </div>
                        <div className="as-pmetric earnings">
                          <div className="as-pmetric-val">₹{p.earnings}</div>
                          <div className="as-pmetric-label">Earned</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}