import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const API_BASE = "http://localhost:8000";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,500;0,9..144,700;1,9..144,400&family=IBM+Plex+Mono:wght@400;500&family=Outfit:wght@300;400;500;600&display=swap');

  :root {
    --bg: #080910; --surface: #0d0f18; --surface2: #111420; --surface3: #161928;
    --border: rgba(255,255,255,0.06); --border-hover: rgba(255,255,255,0.12);
    --gold: #d4a843; --gold-dim: rgba(212,168,67,0.12); --gold-glow: rgba(212,168,67,0.25);
    --text-primary: #f0ede8; --text-secondary: #6b6f85; --text-muted: #30334a;
    --green: #2dd4a0; --red: #f06060; --amber: #f0a840;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .cl-root { font-family: 'Outfit', sans-serif; background: var(--bg); min-height: 100vh; color: var(--text-primary); }
  .cl-root::before { content:''; position:fixed; top:-200px; right:-200px; width:700px; height:700px; background:radial-gradient(circle, rgba(212,168,67,0.04) 0%, transparent 70%); pointer-events:none; z-index:0; }

  .cl-inner { position:relative; z-index:1; padding:0 40px 80px; max-width:1280px; margin:0 auto; }

  .cl-hero { padding: 60px 0 48px; text-align:center; }
  .cl-hero-eyebrow { font-family:'IBM Plex Mono',monospace; font-size:0.7rem; letter-spacing:0.2em; text-transform:uppercase; color:var(--gold); margin-bottom:16px; }
  .cl-hero h1 { font-family:'Fraunces',serif; font-size:clamp(2rem,5vw,3.2rem); font-weight:700; letter-spacing:-0.04em; line-height:1.1; margin-bottom:16px; }
  .cl-hero h1 em { font-style:italic; color:var(--gold); }
  .cl-hero p { font-size:0.95rem; color:var(--text-secondary); max-width:480px; margin:0 auto 32px; line-height:1.6; }

  .cl-search-wrap { max-width:480px; margin:0 auto; position:relative; }
  .cl-search { width:100%; background:var(--surface); border:1px solid var(--border); border-radius:12px; padding:12px 18px 12px 44px; color:var(--text-primary); font-family:'Outfit',sans-serif; font-size:0.9rem; outline:none; transition:all 0.2s; }
  .cl-search:focus { border-color:rgba(212,168,67,0.35); box-shadow:0 0 0 3px rgba(212,168,67,0.06); }
  .cl-search::placeholder { color:var(--text-muted); }
  .cl-search-icon { position:absolute; left:14px; top:50%; transform:translateY(-50%); color:var(--text-muted); pointer-events:none; }

  .cl-filters { display:flex; align-items:center; justify-content:space-between; margin:40px 0 28px; flex-wrap:wrap; gap:12px; }
  .cl-filter-tabs { display:flex; gap:6px; background:var(--surface); border:1px solid var(--border); border-radius:10px; padding:4px; }
  .cl-filter-tab { padding:6px 16px; border-radius:7px; border:none; background:transparent; color:var(--text-secondary); font-family:'Outfit',sans-serif; font-size:0.8rem; font-weight:500; cursor:pointer; transition:all 0.15s; }
  .cl-filter-tab:hover { color:var(--text-primary); }
  .cl-filter-tab.active { background:var(--surface3); color:var(--text-primary); }

  .cl-count { font-size:0.72rem; color:var(--text-secondary); font-family:'IBM Plex Mono',monospace; }
  .cl-count strong { color:var(--gold); }

  .cl-grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(290px,1fr)); gap:20px; }

  .cl-card { background:var(--surface); border:1px solid var(--border); border-radius:18px; overflow:hidden; transition:all 0.3s cubic-bezier(0.22,1,0.36,1); cursor:pointer; animation:cardIn 0.4s ease both; }
  @keyframes cardIn { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  .cl-card:hover { border-color:var(--border-hover); transform:translateY(-5px); box-shadow:0 28px 56px rgba(0,0,0,0.5), 0 0 0 1px var(--border-hover); }

  .cl-card-img-wrap { position:relative; height:180px; overflow:hidden; }
  .cl-card-img { width:100%; height:100%; object-fit:cover; display:block; transition:transform 0.5s ease; filter:brightness(0.88); }
  .cl-card:hover .cl-card-img { transform:scale(1.05); }
  .cl-card-img-placeholder { width:100%; height:100%; background:linear-gradient(135deg,var(--surface2),var(--surface3)); display:flex; align-items:center; justify-content:center; color:var(--text-muted); }

  .cl-type-badge { position:absolute; top:12px; left:12px; font-size:0.62rem; font-family:'IBM Plex Mono',monospace; letter-spacing:0.1em; text-transform:uppercase; padding:4px 10px; border-radius:20px; background:rgba(8,9,16,0.8); border:1px solid var(--border-hover); color:var(--text-secondary); backdrop-filter:blur(8px); }

  .cl-card-body { padding:18px 20px 20px; }
  .cl-card-title { font-family:'Fraunces',serif; font-size:1.05rem; font-weight:500; color:var(--text-primary); line-height:1.4; letter-spacing:-0.01em; margin-bottom:8px; }
  .cl-card-desc { font-size:0.78rem; color:var(--text-secondary); line-height:1.5; margin-bottom:14px; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }

  .cl-card-footer { display:flex; align-items:center; justify-content:space-between; padding-top:14px; border-top:1px solid var(--border); }
  .cl-card-price { font-family:'Fraunces',serif; font-size:1.25rem; font-weight:700; color:var(--gold); letter-spacing:-0.02em; }
  .cl-card-price span { font-size:0.72rem; font-family:'Outfit',sans-serif; color:var(--text-muted); font-weight:400; letter-spacing:0; margin-left:2px; }

  .btn-buy { display:flex; align-items:center; gap:6px; background:var(--gold); color:#08090e; border:none; padding:9px 18px; border-radius:9px; font-family:'Outfit',sans-serif; font-size:0.82rem; font-weight:700; cursor:pointer; transition:all 0.2s; letter-spacing:0.01em; white-space:nowrap; }
  .btn-buy:hover { background:#e8bc55; box-shadow:0 0 20px var(--gold-glow); transform:translateY(-1px); }

  .cl-empty { display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:320px; gap:14px; }
  .cl-empty-icon { width:72px; height:72px; background:var(--surface2); border:1px solid var(--border); border-radius:20px; display:flex; align-items:center; justify-content:center; color:var(--text-muted); margin-bottom:4px; }
  .cl-empty h3 { font-family:'Fraunces',serif; font-size:1.2rem; color:var(--text-muted); font-style:italic; font-weight:400; }
  .cl-empty p { font-size:0.74rem; color:var(--text-muted); font-family:'IBM Plex Mono',monospace; letter-spacing:0.06em; }

  .cl-spinner { width:32px; height:32px; border:2.5px solid var(--surface3); border-top-color:var(--gold); border-radius:50%; animation:spin 0.7s linear infinite; margin:80px auto; }
  @keyframes spin { to{transform:rotate(360deg)} }

  @media (max-width:640px) {
    .cl-inner { padding:0 16px 60px; }
    .cl-hero { padding:36px 0 32px; }
    .cl-grid { grid-template-columns:1fr; }
    .cl-filters { flex-direction:column; align-items:flex-start; }
  }
`;

const TYPES = ["All", "course", "software", "ebook", "service"];

export default function CustomerProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const ref = searchParams.get("ref"); // affiliate referral code

  useEffect(() => {
    // Hit the public endpoint — only returns approved products
    fetch(`${API_BASE}/products/`)
      .then((r) => r.json())
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter((p) => {
    const matchSearch = p.title?.toLowerCase().includes(search.toLowerCase()) ||
                        p.description?.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "All" || p.product_type === typeFilter;
    return matchSearch && matchType;
  });

  const handleBuy = (product) => {
    // Pass referral code along to product detail page
    const url = ref
      ? `/products/${product.id}?ref=${ref}`
      : `/products/${product.id}`;
    navigate(url);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="cl-root">
        <div className="cl-inner">

          {/* Hero */}
          <div className="cl-hero">
            <div className="cl-hero-eyebrow">Digital Marketplace</div>
            <h1>Discover <em>premium</em><br />digital products</h1>
            <p>Courses, software, ebooks and services curated for creators and professionals.</p>
            <div className="cl-search-wrap">
              <svg className="cl-search-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                <circle cx="6.5" cy="6.5" r="5"/><line x1="10.5" y1="10.5" x2="14" y2="14"/>
              </svg>
              <input
                className="cl-search"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Filters */}
          <div className="cl-filters">
            <div className="cl-filter-tabs">
              {TYPES.map((t) => (
                <button
                  key={t}
                  className={`cl-filter-tab ${typeFilter === t ? "active" : ""}`}
                  onClick={() => setTypeFilter(t)}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
            <div className="cl-count">
              <strong>{filtered.length}</strong> product{filtered.length !== 1 ? "s" : ""}
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="cl-spinner" />
          ) : filtered.length === 0 ? (
            <div className="cl-empty">
              <div className="cl-empty-icon">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
                  <line x1="19" y1="19" x2="25" y2="25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <h3>{search ? "No results found" : "No products yet"}</h3>
              <p>{search ? "Try a different search term" : "Check back soon"}</p>
            </div>
          ) : (
            <div className="cl-grid">
              {filtered.map((product, i) => (
                <div
                  key={product.id}
                  className="cl-card"
                  style={{ animationDelay: `${i * 50}ms` }}
                  onClick={() => handleBuy(product)}
                >
                  <div className="cl-card-img-wrap">
                    {product.image_base64 ? (
                      <img
                        src={product.image_base64.startsWith("data:") ? product.image_base64 : `data:image/jpeg;base64,${product.image_base64}`}
                        alt={product.title}
                        className="cl-card-img"
                      />
                    ) : (
                      <div className="cl-card-img-placeholder">
                        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                          <rect x="3" y="5" width="30" height="26" rx="5" stroke="currentColor" strokeWidth="1.5"/>
                          <circle cx="12" cy="15" r="3.5" stroke="currentColor" strokeWidth="1.5"/>
                          <path d="M3 27l9-8 7 7 4-3.5 10 10" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    )}
                    <span className="cl-type-badge">{product.product_type || "product"}</span>
                  </div>

                  <div className="cl-card-body">
                    <div className="cl-card-title">{product.title}</div>
                    {product.description && (
                      <div className="cl-card-desc">{product.description}</div>
                    )}
                    <div className="cl-card-footer">
                      <div className="cl-card-price">
                        ₹{product.price?.toLocaleString()}
                      </div>
                      <button
                        className="btn-buy"
                        onClick={(e) => { e.stopPropagation(); handleBuy(product); }}
                      >
                        Buy Now
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2 6h8M6 2l4 4-4 4"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}