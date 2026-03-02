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
    --red: #f06060; --red-dim: rgba(240,96,96,0.1);
    --amber: #f0a840; --amber-dim: rgba(240,168,64,0.1);
    --blue: #60a5fa; --blue-dim: rgba(96,165,250,0.1); --blue-border: rgba(96,165,250,0.25);
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .afd-root { font-family: 'Outfit', sans-serif; background: var(--bg); min-height: 100vh; color: var(--text-primary); }
  .afd-root::before { content:''; position:fixed; top:-200px; right:-200px; width:600px; height:600px; background:radial-gradient(circle, rgba(212,168,67,0.04) 0%, transparent 70%); pointer-events:none; z-index:0; }

  .afd-inner { position:relative; z-index:1; padding:0 40px 80px; max-width:1280px; margin:0 auto; }

  .afd-header { display:flex; align-items:center; justify-content:space-between; padding:36px 0 32px; border-bottom:1px solid var(--border); margin-bottom:40px; }
  .afd-header-left { display:flex; align-items:center; gap:16px; }
  .afd-icon { width:42px; height:42px; background:var(--gold-dim); border:1px solid rgba(212,168,67,0.2); border-radius:11px; display:flex; align-items:center; justify-content:center; }
  .afd-title h1 { font-family:'Fraunces',serif; font-size:1.7rem; font-weight:700; letter-spacing:-0.03em; }
  .afd-title p { font-size:0.7rem; color:var(--text-secondary); margin-top:4px; font-family:'IBM Plex Mono',monospace; letter-spacing:0.1em; text-transform:uppercase; }

  .afd-stats-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-bottom:40px; }

  .afd-stat-card { background:var(--surface); border:1px solid var(--border); border-radius:16px; padding:22px 24px; transition:all 0.2s; }
  .afd-stat-card:hover { border-color:var(--border-hover); transform:translateY(-2px); }
  .afd-stat-label { font-size:0.65rem; color:var(--text-secondary); text-transform:uppercase; letter-spacing:0.12em; font-family:'IBM Plex Mono',monospace; margin-bottom:10px; }
  .afd-stat-value { font-family:'Fraunces',serif; font-size:2rem; font-weight:700; letter-spacing:-0.04em; line-height:1; margin-bottom:4px; }
  .afd-stat-sub { font-size:0.7rem; color:var(--text-muted); font-family:'IBM Plex Mono',monospace; }

  .afd-stat-card.gold .afd-stat-value { color:var(--gold); }
  .afd-stat-card.green .afd-stat-value { color:var(--green); }
  .afd-stat-card.blue .afd-stat-value { color:var(--blue); }
  .afd-stat-card.amber .afd-stat-value { color:var(--amber); }

  .afd-section-title { font-family:'Fraunces',serif; font-size:1.2rem; font-weight:600; letter-spacing:-0.02em; margin-bottom:20px; display:flex; align-items:center; gap:10px; }
  .afd-section-title span { font-size:0.65rem; font-family:'IBM Plex Mono',monospace; color:var(--text-secondary); letter-spacing:0.1em; text-transform:uppercase; font-weight:400; }

  .afd-tabs { display:flex; gap:6px; background:var(--surface); border:1px solid var(--border); border-radius:10px; padding:4px; width:fit-content; margin-bottom:28px; }
  .afd-tab { padding:7px 18px; border-radius:7px; border:none; background:transparent; color:var(--text-secondary); font-family:'Outfit',sans-serif; font-size:0.82rem; font-weight:500; cursor:pointer; transition:all 0.15s; }
  .afd-tab:hover { color:var(--text-primary); }
  .afd-tab.active { background:var(--surface3); color:var(--text-primary); }

  .afd-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); gap:16px; }

  .afd-card { background:var(--surface); border:1px solid var(--border); border-radius:16px; overflow:hidden; transition:all 0.3s cubic-bezier(0.22,1,0.36,1); animation:cardIn 0.4s ease both; }
  @keyframes cardIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
  .afd-card:hover { border-color:var(--border-hover); transform:translateY(-3px); box-shadow:0 20px 48px rgba(0,0,0,0.4); }

  .afd-card-img { width:100%; height:150px; object-fit:cover; display:block; filter:brightness(0.85); }
  .afd-card-img-placeholder { width:100%; height:150px; background:linear-gradient(135deg,var(--surface2),var(--surface3)); display:flex; align-items:center; justify-content:center; color:var(--text-muted); }

  .afd-card-body { padding:16px 18px 18px; }
  .afd-card-title { font-family:'Fraunces',serif; font-size:0.98rem; font-weight:500; color:var(--text-primary); line-height:1.4; margin-bottom:12px; }

  .afd-card-metrics { display:grid; grid-template-columns:repeat(3,1fr); gap:8px; margin-bottom:14px; }
  .afd-metric { background:var(--surface2); border:1px solid var(--border); border-radius:9px; padding:9px 10px; text-align:center; }
  .afd-metric-val { font-family:'Fraunces',serif; font-size:1.1rem; font-weight:600; line-height:1; margin-bottom:3px; }
  .afd-metric-label { font-size:0.6rem; font-family:'IBM Plex Mono',monospace; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.08em; }
  .afd-metric.clicks .afd-metric-val { color:var(--blue); }
  .afd-metric.sales .afd-metric-val { color:var(--green); }
  .afd-metric.earnings .afd-metric-val { color:var(--gold); }

  .afd-link-box { display:flex; gap:6px; margin-bottom:10px; }
  .afd-link-input { flex:1; background:var(--surface2); border:1px solid var(--border); border-radius:8px; padding:8px 11px; color:var(--text-secondary); font-family:'IBM Plex Mono',monospace; font-size:0.7rem; outline:none; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }

  .btn-copy { display:flex; align-items:center; gap:5px; background:var(--surface3); border:1px solid var(--border); color:var(--text-secondary); padding:8px 12px; border-radius:8px; font-family:'Outfit',sans-serif; font-size:0.75rem; font-weight:500; cursor:pointer; transition:all 0.15s; white-space:nowrap; }
  .btn-copy:hover { border-color:var(--border-hover); color:var(--text-primary); }
  .btn-copy.copied { border-color:var(--green-border); color:var(--green); background:var(--green-dim); }

  .btn-promote { width:100%; display:flex; align-items:center; justify-content:center; gap:7px; background:var(--gold); color:#08090e; border:none; padding:10px; border-radius:9px; font-family:'Outfit',sans-serif; font-size:0.84rem; font-weight:700; cursor:pointer; transition:all 0.2s; }
  .btn-promote:hover { background:#e8bc55; box-shadow:0 0 20px var(--gold-glow); }
  .btn-promote:disabled { opacity:0.4; cursor:not-allowed; }

  .btn-whatsapp { width:100%; display:flex; align-items:center; justify-content:center; gap:7px; background:rgba(37,211,102,0.12); border:1px solid rgba(37,211,102,0.25); color:#25d366; padding:9px; border-radius:9px; font-family:'Outfit',sans-serif; font-size:0.8rem; font-weight:600; cursor:pointer; transition:all 0.18s; margin-top:6px; }
  .btn-whatsapp:hover { background:rgba(37,211,102,0.2); }

  .afd-empty { display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:300px; gap:14px; }
  .afd-empty-icon { width:64px; height:64px; background:var(--surface2); border:1px solid var(--border); border-radius:18px; display:flex; align-items:center; justify-content:center; color:var(--text-muted); margin-bottom:4px; }
  .afd-empty h3 { font-family:'Fraunces',serif; font-size:1.1rem; color:var(--text-muted); font-style:italic; font-weight:400; }
  .afd-empty p { font-size:0.72rem; color:var(--text-muted); font-family:'IBM Plex Mono',monospace; }

  .afd-spinner { width:32px; height:32px; border:2.5px solid var(--surface3); border-top-color:var(--gold); border-radius:50%; animation:spin 0.7s linear infinite; margin:80px auto; }
  @keyframes spin { to{transform:rotate(360deg)} }

  .afd-toast { position:fixed; bottom:28px; left:50%; transform:translateX(-50%); background:var(--surface3); border:1px solid var(--border-hover); color:var(--text-primary); padding:12px 22px; border-radius:12px; font-size:0.84rem; font-family:'Outfit',sans-serif; font-weight:500; z-index:999; pointer-events:none; box-shadow:0 16px 40px rgba(0,0,0,0.5); white-space:nowrap; animation:toastIn 0.25s cubic-bezier(0.22,1,0.36,1); }
  @keyframes toastIn { from{opacity:0;transform:translateX(-50%) translateY(8px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }

  @media (max-width:900px) { .afd-stats-grid { grid-template-columns:repeat(2,1fr); } }
  @media (max-width:640px) {
    .afd-inner { padding:0 16px 60px; }
    .afd-stats-grid { grid-template-columns:repeat(2,1fr); }
    .afd-grid { grid-template-columns:1fr; }
  }
`;

export default function AffiliateDashboard() {
  const [tab, setTab] = useState("promote"); // "promote" | "stats"
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState(null);
  const [links, setLinks] = useState({});   // productId → referral_link
  const [promoting, setPromoting] = useState({});
  const [copied, setCopied] = useState({});
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2500); };

  // Load approved products + stats
  useEffect(() => {
    Promise.all([
      api.get("/affiliate/products").catch(() => ({ data: [] })),
      api.get("/affiliate/stats").catch(() => ({ data: null })),
    ]).then(([prodRes, statsRes]) => {
      setProducts(Array.isArray(prodRes.data) ? prodRes.data : []);

      if (statsRes.data) {
        setStats(statsRes.data);
        // Pre-populate links from stats products
        const linkMap = {};
        (statsRes.data.products || []).forEach((p) => {
          if (p.referral_link) linkMap[p.product_id] = p.referral_link;
        });
        setLinks(linkMap);
      }
    }).finally(() => setLoading(false));
  }, []);

  const promote = async (productId) => {
    setPromoting((p) => ({ ...p, [productId]: true }));
    try {
      const res = await api.post(`/affiliate/products/${productId}/promote`);
      setLinks((prev) => ({ ...prev, [productId]: res.data.referral_link }));
      showToast("✓ Referral link generated!");
    } catch {
      showToast("✗ Failed to generate link");
    } finally {
      setPromoting((p) => ({ ...p, [productId]: false }));
    }
  };

  const copyLink = (productId, link) => {
    navigator.clipboard.writeText(link);
    setCopied((c) => ({ ...c, [productId]: true }));
    setTimeout(() => setCopied((c) => ({ ...c, [productId]: false })), 2000);
    showToast("✓ Link copied!");
  };

  const shareWhatsApp = (link, title) => {
    const text = encodeURIComponent(`Check out "${title}" — ${link}`);
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const summary = stats?.summary || {};
  const statProducts = stats?.products || [];

  return (
    <>
      <style>{styles}</style>
      <div className="afd-root">
        <div className="afd-inner">

          {/* Header */}
          <div className="afd-header">
            <div className="afd-header-left">
              <div className="afd-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 2l2 6h6l-5 3.5 2 6L10 14l-5 3.5 2-6L2 8h6z" fill="#d4a843" opacity="0.9"/>
                </svg>
              </div>
              <div className="afd-title">
                <h1>Affiliate Dashboard</h1>
                <p>Track performance & earn commissions</p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          {loading ? <div className="afd-spinner" /> : (
            <>
              <div className="afd-stats-grid">
                <div className="afd-stat-card gold">
                  <div className="afd-stat-label">Total Earnings</div>
                  <div className="afd-stat-value">₹{(summary.total_earnings || 0).toLocaleString()}</div>
                  <div className="afd-stat-sub">lifetime commissions</div>
                </div>
                <div className="afd-stat-card blue">
                  <div className="afd-stat-label">Total Clicks</div>
                  <div className="afd-stat-value">{summary.total_clicks || 0}</div>
                  <div className="afd-stat-sub">across all links</div>
                </div>
                <div className="afd-stat-card green">
                  <div className="afd-stat-label">Total Sales</div>
                  <div className="afd-stat-value">{summary.total_sales || 0}</div>
                  <div className="afd-stat-sub">paid orders</div>
                </div>
                <div className="afd-stat-card amber">
                  <div className="afd-stat-label">Active Links</div>
                  <div className="afd-stat-value">{summary.total_links || 0}</div>
                  <div className="afd-stat-sub">products promoted</div>
                </div>
              </div>

              {/* Tabs */}
              <div className="afd-tabs">
                <button className={`afd-tab ${tab === "promote" ? "active" : ""}`} onClick={() => setTab("promote")}>
                  Promote Products
                </button>
                <button className={`afd-tab ${tab === "stats" ? "active" : ""}`} onClick={() => setTab("stats")}>
                  Performance Stats
                </button>
              </div>

              {/* Promote Tab */}
              {tab === "promote" && (
                <>
                  <div className="afd-section-title">
                    Available Products <span>{products.length} approved</span>
                  </div>
                  {products.length === 0 ? (
                    <div className="afd-empty">
                      <div className="afd-empty-icon">
                        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                          <rect x="4" y="4" width="20" height="20" rx="4" stroke="currentColor" strokeWidth="1.5"/>
                          <path d="M10 14h8M14 10v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      </div>
                      <h3>No products yet</h3>
                      <p>Approved products will appear here</p>
                    </div>
                  ) : (
                    <div className="afd-grid">
                      {products.map((p, i) => (
                        <div key={p.id} className="afd-card" style={{ animationDelay: `${i * 50}ms` }}>
                          {p.image_base64 ? (
                            <img src={p.image_base64.startsWith("data:") ? p.image_base64 : `data:image/jpeg;base64,${p.image_base64}`} alt={p.title} className="afd-card-img" />
                          ) : (
                            <div className="afd-card-img-placeholder">
                              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                                <rect x="3" y="5" width="26" height="22" rx="4" stroke="currentColor" strokeWidth="1.5"/>
                                <circle cx="11" cy="13" r="3" stroke="currentColor" strokeWidth="1.5"/>
                                <path d="M3 23l8-7 6 6 4-3 8 8" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                              </svg>
                            </div>
                          )}
                          <div className="afd-card-body">
                            <div className="afd-card-title">{p.title}</div>
                            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:14, fontSize:"0.78rem" }}>
                              <span style={{ color:"var(--gold)", fontFamily:"Fraunces, serif", fontSize:"1.05rem", fontWeight:600 }}>₹{p.price?.toLocaleString()}</span>
                              <span style={{ color:"var(--green)", fontFamily:"IBM Plex Mono, monospace", fontSize:"0.72rem", background:"var(--green-dim)", border:"1px solid var(--green-border)", padding:"3px 10px", borderRadius:20 }}>{p.commission_percent}% comm.</span>
                            </div>

                            {links[p.id] ? (
                              <>
                                <div className="afd-link-box">
                                  <input className="afd-link-input" value={links[p.id]} readOnly />
                                  <button
                                    className={`btn-copy ${copied[p.id] ? "copied" : ""}`}
                                    onClick={() => copyLink(p.id, links[p.id])}
                                  >
                                    {copied[p.id] ? "✓ Copied" : "Copy"}
                                  </button>
                                </div>
                                <button className="btn-whatsapp" onClick={() => shareWhatsApp(links[p.id], p.title)}>
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                  </svg>
                                  Share on WhatsApp
                                </button>
                              </>
                            ) : (
                              <button className="btn-promote" onClick={() => promote(p.id)} disabled={promoting[p.id]}>
                                {promoting[p.id] ? "Generating…" : (
                                  <>
                                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                      <path d="M6.5 1v11M1 6.5h11"/>
                                    </svg>
                                    Get Referral Link
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* Stats Tab */}
              {tab === "stats" && (
                <>
                  <div className="afd-section-title">
                    Performance Breakdown <span>{statProducts.length} products</span>
                  </div>
                  {statProducts.length === 0 ? (
                    <div className="afd-empty">
                      <div className="afd-empty-icon">
                        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                          <path d="M4 22V14M10 22V8M16 22v-6M22 22V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      </div>
                      <h3>No data yet</h3>
                      <p>Promote products to see stats here</p>
                    </div>
                  ) : (
                    <div className="afd-grid">
                      {statProducts.map((p, i) => (
                        <div key={p.product_id} className="afd-card" style={{ animationDelay: `${i * 50}ms` }}>
                          {p.image_base64 ? (
                            <img src={p.image_base64.startsWith("data:") ? p.image_base64 : `data:image/jpeg;base64,${p.image_base64}`} alt={p.title} className="afd-card-img" />
                          ) : (
                            <div className="afd-card-img-placeholder">
                              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                                <rect x="3" y="5" width="26" height="22" rx="4" stroke="currentColor" strokeWidth="1.5"/>
                                <circle cx="11" cy="13" r="3" stroke="currentColor" strokeWidth="1.5"/>
                                <path d="M3 23l8-7 6 6 4-3 8 8" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                              </svg>
                            </div>
                          )}
                          <div className="afd-card-body">
                            <div className="afd-card-title">{p.title}</div>
                            <div className="afd-card-metrics">
                              <div className="afd-metric clicks">
                                <div className="afd-metric-val">{p.clicks}</div>
                                <div className="afd-metric-label">Clicks</div>
                              </div>
                              <div className="afd-metric sales">
                                <div className="afd-metric-val">{p.sales}</div>
                                <div className="afd-metric-label">Sales</div>
                              </div>
                              <div className="afd-metric earnings">
                                <div className="afd-metric-val">₹{p.earnings}</div>
                                <div className="afd-metric-label">Earned</div>
                              </div>
                            </div>
                            <div className="afd-link-box">
                              <input className="afd-link-input" value={p.referral_link} readOnly />
                              <button
                                className={`btn-copy ${copied[p.product_id] ? "copied" : ""}`}
                                onClick={() => copyLink(p.product_id, p.referral_link)}
                              >
                                {copied[p.product_id] ? "✓" : "Copy"}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
      {toast && <div className="afd-toast">{toast}</div>}
    </>
  );
}