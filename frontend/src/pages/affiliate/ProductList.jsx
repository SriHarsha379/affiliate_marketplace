import { useEffect, useState } from "react";

const API_BASE = "";


const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,500;0,9..144,700&family=IBM+Plex+Mono:wght@400;500&family=Outfit:wght@300;400;500;600&display=swap');

  :root {
    --bg: #080910; --surface: #0d0f18; --surface2: #111420; --surface3: #161928;
    --border: rgba(255,255,255,0.06); --border-hover: rgba(255,255,255,0.12);
    --gold: #d4a843; --gold-dim: rgba(212,168,67,0.12); --gold-glow: rgba(212,168,67,0.25);
    --text-primary: #f0ede8; --text-secondary: #6b6f85; --text-muted: #30334a;
    --green: #2dd4a0; --green-dim: rgba(45,212,160,0.1);
    --red: #f06060; --red-dim: rgba(240,96,96,0.1); --amber: #f0a840;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .ap-root { font-family: 'Outfit', sans-serif; background: var(--bg); min-height: 100vh; color: var(--text-primary); position: relative; overflow-x: hidden; }
  .ap-root::before { content: ''; position: fixed; top: -200px; right: -200px; width: 600px; height: 600px; background: radial-gradient(circle, rgba(212,168,67,0.04) 0%, transparent 70%); pointer-events: none; z-index: 0; }
  .ap-inner { position: relative; z-index: 1; padding: 0 40px 60px; max-width: 1280px; margin: 0 auto; }
  .ap-header { display: flex; align-items: center; justify-content: space-between; padding: 36px 0 32px; border-bottom: 1px solid var(--border); margin-bottom: 40px; }
  .ap-brand { display: flex; align-items: center; gap: 16px; }
  .ap-brand-icon { width: 40px; height: 40px; background: var(--gold-dim); border: 1px solid rgba(212,168,67,0.2); border-radius: 10px; display: flex; align-items: center; justify-content: center; }
  .ap-title-block h1 { font-family: 'Fraunces', serif; font-size: 1.65rem; font-weight: 700; letter-spacing: -0.03em; line-height: 1; }
  .ap-title-block p { font-size: 0.72rem; color: var(--text-secondary); margin-top: 5px; font-family: 'IBM Plex Mono', monospace; letter-spacing: 0.08em; text-transform: uppercase; }
  .ap-header-right { display: flex; align-items: center; gap: 12px; }
  .ap-stats-pill { display: flex; align-items: center; gap: 6px; background: var(--surface2); border: 1px solid var(--border); border-radius: 20px; padding: 7px 14px; font-size: 0.74rem; color: var(--text-secondary); font-family: 'IBM Plex Mono', monospace; }
  .ap-stats-pill strong { color: var(--gold); font-weight: 500; }
  .btn-add { display: flex; align-items: center; gap: 8px; background: var(--gold); color: #08090e; border: none; padding: 10px 20px; border-radius: 10px; font-family: 'Outfit', sans-serif; font-size: 0.84rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
  .btn-add:hover { background: #e8bc55; box-shadow: 0 0 24px var(--gold-glow); transform: translateY(-1px); }
  .empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 380px; gap: 14px; }
  .empty-icon { width: 72px; height: 72px; background: var(--surface2); border: 1px solid var(--border); border-radius: 20px; display: flex; align-items: center; justify-content: center; margin-bottom: 4px; }
  .empty-state h3 { font-family: 'Fraunces', serif; font-size: 1.2rem; color: var(--text-muted); font-weight: 500; font-style: italic; }
  .empty-state p { font-size: 0.78rem; color: var(--text-muted); font-family: 'IBM Plex Mono', monospace; letter-spacing: 0.06em; }
  .ap-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
  .ap-card { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; overflow: hidden; transition: all 0.3s cubic-bezier(0.22,1,0.36,1); position: relative; animation: cardIn 0.4s ease both; }
  @keyframes cardIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
  .ap-card:hover { border-color: var(--border-hover); transform: translateY(-4px); box-shadow: 0 24px 48px rgba(0,0,0,0.5); }
  .ap-card-img-wrap { position: relative; height: 160px; overflow: hidden; }
  .ap-card-img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.5s ease; filter: brightness(0.92); }
  .ap-card:hover .ap-card-img { transform: scale(1.04); }
  .ap-card-img-placeholder { width: 100%; height: 100%; background: linear-gradient(135deg, var(--surface2), var(--surface3)); display: flex; align-items: center; justify-content: center; color: var(--text-muted); }
  .ap-status-badge { position: absolute; top: 10px; right: 10px; display: inline-flex; align-items: center; gap: 5px; font-size: 0.64rem; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; padding: 4px 10px; border-radius: 20px; backdrop-filter: blur(12px); font-family: 'IBM Plex Mono', monospace; }
  .ap-status-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }
  .status-pending { background: rgba(240,168,64,0.18); color: var(--amber); border: 1px solid rgba(240,168,64,0.3); }
  .status-pending .ap-status-dot { background: var(--amber); box-shadow: 0 0 6px var(--amber); }
  .status-approved { background: rgba(45,212,160,0.14); color: var(--green); border: 1px solid rgba(45,212,160,0.25); }
  .status-approved .ap-status-dot { background: var(--green); box-shadow: 0 0 6px var(--green); }
  .status-rejected { background: rgba(240,96,96,0.14); color: var(--red); border: 1px solid rgba(240,96,96,0.25); }
  .status-rejected .ap-status-dot { background: var(--red); box-shadow: 0 0 6px var(--red); }
  .ap-card-body { padding: 16px 18px 18px; }
  .ap-card-title { font-family: 'Fraunces', serif; font-size: 1rem; font-weight: 500; color: var(--text-primary); line-height: 1.4; letter-spacing: -0.01em; margin-bottom: 10px; }
  .ap-rejection-box { margin-bottom: 12px; padding: 9px 12px; background: var(--red-dim); border: 1px solid rgba(240,96,96,0.2); border-radius: 8px; font-size: 0.74rem; color: #fca5a5; line-height: 1.5; }
  .ap-rejection-box strong { display: block; font-family: 'IBM Plex Mono', monospace; font-size: 0.65rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--red); margin-bottom: 3px; }
  .ap-card-meta { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; padding-bottom: 14px; border-bottom: 1px solid var(--border); }
  .ap-card-price { font-size: 1.15rem; font-weight: 600; color: var(--gold); font-family: 'Fraunces', serif; letter-spacing: -0.02em; }
  .ap-card-commission { font-size: 0.68rem; color: var(--text-secondary); background: var(--surface3); padding: 4px 10px; border-radius: 20px; border: 1px solid var(--border); font-family: 'IBM Plex Mono', monospace; }
  .ap-card-actions { display: flex; gap: 6px; }
  .btn-icon { flex: 1; display: flex; align-items: center; justify-content: center; gap: 5px; border: 1px solid var(--border); background: transparent; color: var(--text-secondary); padding: 8px 0; border-radius: 9px; font-size: 0.73rem; font-family: 'Outfit', sans-serif; font-weight: 500; cursor: pointer; transition: all 0.18s; white-space: nowrap; }
  .btn-icon:hover:not(:disabled) { background: var(--surface3); color: var(--text-primary); border-color: var(--border-hover); }
  .btn-icon:disabled { opacity: 0.22; cursor: not-allowed; }
  .btn-icon.danger { flex: 0 0 36px; padding: 8px; }
  .btn-icon.danger:hover:not(:disabled) { border-color: rgba(240,96,96,0.3); background: var(--red-dim); color: var(--red); }
  .ap-overlay { position: fixed; inset: 0; background: rgba(4,5,10,0.92); backdrop-filter: blur(12px); display: flex; align-items: center; justify-content: center; z-index: 100; animation: fadeIn 0.2s ease; }
  @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
  .ap-modal { background: var(--surface); border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; width: 460px; max-width: 95vw; max-height: 90vh; overflow-y: auto; box-shadow: 0 48px 96px rgba(0,0,0,0.8); }
  .ap-modal-header { padding: 22px 24px 20px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; background: var(--surface); z-index: 2; border-radius: 20px 20px 0 0; }
  .ap-modal-header-left { display: flex; flex-direction: column; gap: 3px; }
  .ap-modal-header h3 { font-family: 'Fraunces', serif; font-size: 1.15rem; font-weight: 700; color: var(--text-primary); letter-spacing: -0.02em; }
  .ap-modal-header span { font-size: 0.68rem; color: var(--text-secondary); font-family: 'IBM Plex Mono', monospace; letter-spacing: 0.08em; text-transform: uppercase; }
  .btn-close { background: var(--surface3); border: 1px solid var(--border); color: var(--text-secondary); width: 32px; height: 32px; border-radius: 9px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.15s; font-size: 0.9rem; }
  .btn-close:hover { color: var(--text-primary); border-color: var(--border-hover); }
  .ap-modal-body { padding: 22px 24px 16px; display: flex; flex-direction: column; gap: 16px; }
  .ap-upload-zone { border: 1.5px dashed rgba(255,255,255,0.08); border-radius: 13px; overflow: hidden; cursor: pointer; position: relative; transition: all 0.2s; background: var(--surface2); }
  .ap-upload-zone:hover { border-color: rgba(212,168,67,0.3); }
  .ap-upload-placeholder { padding: 28px; display: flex; flex-direction: column; align-items: center; gap: 8px; color: var(--text-muted); }
  .ap-upload-placeholder span { font-size: 0.72rem; letter-spacing: 0.1em; text-transform: uppercase; font-family: 'IBM Plex Mono', monospace; }
  .ap-upload-zone input[type="file"] { position: absolute; inset: 0; opacity: 0; cursor: pointer; }
  .ap-preview-img { width: 100%; height: 165px; object-fit: cover; display: block; }
  .ap-field-group { display: flex; flex-direction: column; gap: 6px; }
  .ap-field-group label { font-size: 0.68rem; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.12em; font-family: 'IBM Plex Mono', monospace; font-weight: 500; }
  .ap-input { background: var(--surface2); border: 1px solid var(--border); border-radius: 10px; padding: 10px 13px; color: var(--text-primary); font-family: 'Outfit', sans-serif; font-size: 0.88rem; width: 100%; transition: all 0.18s; outline: none; resize: vertical; appearance: none; }
  .ap-input:focus { border-color: rgba(212,168,67,0.35); background: var(--surface3); box-shadow: 0 0 0 3px rgba(212,168,67,0.06); }
  .ap-input::placeholder { color: var(--text-muted); }
  .ap-input-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .ap-field-hint { font-size: 0.68rem; color: var(--text-muted); font-family: 'IBM Plex Mono', monospace; margin-top: 2px; }
  .ap-modal-footer { padding: 16px 24px 24px; display: flex; gap: 10px; }
  .btn-save { flex: 1; background: var(--gold); color: #08090e; border: none; padding: 12px; border-radius: 11px; font-family: 'Outfit', sans-serif; font-size: 0.9rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
  .btn-save:hover:not(:disabled) { background: #e8bc55; box-shadow: 0 0 24px var(--gold-glow); transform: translateY(-1px); }
  .btn-save:disabled { opacity: 0.35; cursor: not-allowed; }
  .btn-cancel { background: var(--surface2); color: var(--text-secondary); border: 1px solid var(--border); padding: 12px 20px; border-radius: 11px; font-family: 'Outfit', sans-serif; font-size: 0.88rem; cursor: pointer; transition: all 0.18s; }
  .btn-cancel:hover { background: var(--surface3); color: var(--text-primary); border-color: var(--border-hover); }
  .ap-toast { position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%); background: var(--surface3); border: 1px solid var(--border-hover); color: var(--text-primary); padding: 12px 22px; border-radius: 12px; font-size: 0.84rem; font-family: 'Outfit', sans-serif; font-weight: 500; z-index: 999; pointer-events: none; box-shadow: 0 16px 40px rgba(0,0,0,0.5); white-space: nowrap; }
  @media (max-width: 640px) {
    .ap-inner { padding: 0 16px 40px; }
    .ap-header { flex-wrap: wrap; gap: 14px; }
    .ap-grid { grid-template-columns: 1fr; }
    .ap-input-row { grid-template-columns: 1fr; }
  }
`;

export default function AffiliateProducts() {
  const [showModal, setShowModal] = useState(false);
  const [products, setProducts] = useState([]);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [toast, setToast] = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2800); };
  const closeModal = () => { setShowModal(false); setEditingProduct(null); setPreview(null); };

  useEffect(() => {
    fetch(`${API_BASE}/seller/products/`, { credentials: "include" })
      .then((r) => r.json())
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch(() => setProducts([]));
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleEdit = (product) => { setEditingProduct(product); setPreview(product.image_base64); setShowModal(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      title: e.target.name.value,
      description: e.target.description.value,
      price: Number(e.target.price.value),
      commission_percent: Number(e.target.commission.value),
      product_type: e.target.product_type.value,
      product_access_url: e.target.access_url.value,
      image_base64: preview,
    };
    try {
      let res, saved;
      if (editingProduct) {
        res = await fetch(`${API_BASE}/seller/products/${editingProduct.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify(payload) });
        if (!res.ok) throw new Error();
        saved = await res.json();
        setProducts((p) => p.map((x) => (x.id === saved.id ? saved : x)));
        showToast("✓ Product updated");
      } else {
        res = await fetch(`${API_BASE}/seller/products/`, { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify(payload) });
        if (!res.ok) throw new Error();
        saved = await res.json();
        setProducts((p) => [...p, saved]);
        showToast("✓ Product created");
      }
      closeModal();
    } catch { showToast("✗ Save failed — try again"); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      const res = await fetch(`${API_BASE}/seller/products/${id}`, { method: "DELETE", credentials: "include" });
      if (!res.ok) throw new Error();
      setProducts((p) => p.filter((x) => x.id !== id));
      showToast("✓ Product deleted");
    } catch { showToast("✗ Delete failed"); }
  };

  const statusClass = (s) => s === "approved" ? "status-approved" : s === "rejected" ? "status-rejected" : "status-pending";

  return (
    <>
      <style>{styles}</style>
      <div className="ap-root">
        <div className="ap-inner">
          <div className="ap-header">
            <div className="ap-brand">
              <div className="ap-brand-icon">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <rect x="1" y="1" width="7" height="7" rx="2" fill="#d4a843" opacity="0.9"/>
                  <rect x="10" y="1" width="7" height="7" rx="2" fill="#d4a843" opacity="0.4"/>
                  <rect x="1" y="10" width="7" height="7" rx="2" fill="#d4a843" opacity="0.4"/>
                  <rect x="10" y="10" width="7" height="7" rx="2" fill="#d4a843" opacity="0.9"/>
                </svg>
              </div>
              <div className="ap-title-block">
                <h1>Products</h1>
                <p>Seller catalogue</p>
              </div>
            </div>
            <div className="ap-header-right">
              <div className="ap-stats-pill"><strong>{products.length}</strong> listed</div>
              <button className="btn-add" onClick={() => { setEditingProduct(null); setPreview(null); setShowModal(true); }}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <line x1="6" y1="0.5" x2="6" y2="11.5"/><line x1="0.5" y1="6" x2="11.5" y2="6"/>
                </svg>
                Add Product
              </button>
            </div>
          </div>

          {products.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <rect x="4" y="7" width="20" height="17" rx="3" stroke="#30334a" strokeWidth="1.5"/>
                  <path d="M10 7V5.5a4 4 0 018 0V7" stroke="#30334a" strokeWidth="1.5" strokeLinecap="round"/>
                  <line x1="10" y1="15.5" x2="18" y2="15.5" stroke="#30334a" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <h3>No products yet</h3>
              <p>Add your first to get started</p>
            </div>
          ) : (
            <div className="ap-grid">
              {products.map((product, i) => (
                <div key={product.id} className="ap-card" style={{ animationDelay: `${i * 60}ms` }}>
                  <div className="ap-card-img-wrap">
                    {product.image_base64 ? (
                      <img src={product.image_base64.startsWith("data:") ? product.image_base64 : `data:image/jpeg;base64,${product.image_base64}`} alt={product.title} className="ap-card-img" />
                    ) : (
                      <div className="ap-card-img-placeholder">
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                          <rect x="3" y="5" width="26" height="22" rx="4" stroke="currentColor" strokeWidth="1.5"/>
                          <circle cx="11" cy="13" r="3" stroke="currentColor" strokeWidth="1.5"/>
                          <path d="M3 23l8-7 6 6 4-3 8 8" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    )}
                    <div className={`ap-status-badge ${statusClass(product.status)}`}>
                      <span className="ap-status-dot" />{product.status || "pending"}
                    </div>
                  </div>
                  <div className="ap-card-body">
                    <div className="ap-card-title">{product.title}</div>
                    {product.status === "rejected" && product.rejection_reason && (
                      <div className="ap-rejection-box"><strong>Rejection reason</strong>{product.rejection_reason}</div>
                    )}
                    <div className="ap-card-meta">
                      <span className="ap-card-price">₹{product.price?.toLocaleString()}</span>
                      <span className="ap-card-commission">{product.commission_percent}% comm.</span>
                    </div>
                    <div className="ap-card-actions">
                      <button className="btn-icon" onClick={() => handleEdit(product)} disabled={product.status === "approved"}>
                        <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M7.5 1.5l2 2L3 10H1V8L7.5 1.5z"/></svg>
                        {product.status === "rejected" ? "Edit & Resubmit" : "Edit"}
                      </button>
                      <button className="btn-icon danger" onClick={() => handleDelete(product.id)}>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                          <line x1="1.5" y1="2.5" x2="10.5" y2="2.5"/>
                          <path d="M3.5 2.5V2a2.5 2.5 0 015 0v.5"/>
                          <path d="M2.5 2.5l.7 8.5h5.6l.7-8.5"/>
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

      {showModal && (
        <div className="ap-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="ap-modal">
            <div className="ap-modal-header">
              <div className="ap-modal-header-left">
                <h3>{editingProduct ? "Edit Product" : "New Product"}</h3>
                <span>{editingProduct ? "Update listing details" : "Add to your catalogue"}</span>
              </div>
              <button className="btn-close" onClick={closeModal}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="ap-modal-body">
                <div className="ap-upload-zone">
                  {preview ? <img src={preview} alt="preview" className="ap-preview-img" /> : (
                    <div className="ap-upload-placeholder">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
                        <rect x="3" y="3" width="18" height="18" rx="4"/>
                        <circle cx="8.5" cy="8.5" r="1.8"/>
                        <path d="M3 16l5-5 4 4 3-2.5 6 6.5"/>
                      </svg>
                      <span>Upload image</span>
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={handleImageChange} />
                </div>
                <div className="ap-field-group">
                  <label>Product name</label>
                  <input name="name" className="ap-input" placeholder="e.g. Advanced React Course" defaultValue={editingProduct?.title || ""} required />
                </div>
                <div className="ap-field-group">
                  <label>Description</label>
                  <textarea name="description" className="ap-input" rows={3} placeholder="Explain what the buyer will get" defaultValue={editingProduct?.description || ""} required />
                </div>
                <div className="ap-field-group">
                  <label>Product Type</label>
                  <select name="product_type" className="ap-input" defaultValue={editingProduct?.product_type || "course"} required>
                    <option value="course">Course</option>
                    <option value="software">Software</option>
                    <option value="ebook">Ebook</option>
                    <option value="service">Service</option>
                  </select>
                </div>
                <div className="ap-input-row">
                  <div className="ap-field-group">
                    <label>Price (₹)</label>
                    <input name="price" type="number" className="ap-input" placeholder="0" defaultValue={editingProduct?.price || ""} required />
                  </div>
                  <div className="ap-field-group">
                    <label>Commission %</label>
                    <input name="commission" type="number" className="ap-input" placeholder="0" defaultValue={editingProduct?.commission_percent || ""} required />
                  </div>
                </div>
                <div className="ap-field-group">
                  <label>Product Access Link</label>
                  <input name="access_url" type="url" className="ap-input" placeholder="https://drive.google.com/…" defaultValue={editingProduct?.product_access_url || ""} required />
                  <span className="ap-field-hint">Shared only after successful payment</span>
                </div>
              </div>
              <div className="ap-modal-footer">
                <button type="submit" className="btn-save" disabled={loading}>
                  {loading ? "Saving…" : editingProduct ? "Update Product" : "Save Product"}
                </button>
                <button type="button" className="btn-cancel" onClick={closeModal}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {toast && <div className="ap-toast">{toast}</div>}
    </>
  );
}