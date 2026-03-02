import { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { api } from "../../api/client";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,500;0,9..144,700;1,9..144,400&family=IBM+Plex+Mono:wght@400;500&family=Outfit:wght@300;400;500;600&display=swap');

  :root {
    --bg: #080910; --surface: #0d0f18; --surface2: #111420; --surface3: #161928;
    --border: rgba(255,255,255,0.06); --border-hover: rgba(255,255,255,0.12);
    --gold: #d4a843; --gold-dim: rgba(212,168,67,0.12); --gold-glow: rgba(212,168,67,0.25);
    --text-primary: #f0ede8; --text-secondary: #6b6f85; --text-muted: #30334a;
    --green: #2dd4a0; --green-dim: rgba(45,212,160,0.1); --green-border: rgba(45,212,160,0.25);
    --red: #f06060;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .pd-root { font-family: 'Outfit', sans-serif; background: var(--bg); min-height: 100vh; color: var(--text-primary); display: flex; align-items: flex-start; justify-content: center; padding: 48px 24px; }
  .pd-root::before { content:''; position:fixed; top:-200px; right:-200px; width:700px; height:700px; background:radial-gradient(circle, rgba(212,168,67,0.04) 0%, transparent 70%); pointer-events:none; z-index:0; }

  .pd-card { position:relative; z-index:1; background:var(--surface); border:1px solid var(--border); border-radius:24px; max-width:960px; width:100%; display:grid; grid-template-columns:1fr 1fr; overflow:hidden; box-shadow:0 48px 96px rgba(0,0,0,0.6); animation:cardIn 0.4s cubic-bezier(0.22,1,0.36,1); }
  @keyframes cardIn { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }

  .pd-image-panel { position:relative; min-height:520px; overflow:hidden; background:var(--surface2); }
  .pd-image-panel img { width:100%; height:100%; object-fit:cover; display:block; filter:brightness(0.85); transition:transform 0.6s ease; }
  .pd-image-panel:hover img { transform:scale(1.04); }
  .pd-img-placeholder { width:100%; height:100%; display:flex; align-items:center; justify-content:center; color:var(--text-muted); }

  .pd-type-badge { position:absolute; top:16px; left:16px; font-size:0.62rem; font-family:'IBM Plex Mono',monospace; letter-spacing:0.1em; text-transform:uppercase; padding:5px 12px; border-radius:20px; background:rgba(8,9,16,0.8); border:1px solid var(--border-hover); color:var(--text-secondary); backdrop-filter:blur(8px); }

  .pd-ref-badge { position:absolute; top:16px; right:16px; font-size:0.6rem; font-family:'IBM Plex Mono',monospace; letter-spacing:0.08em; text-transform:uppercase; padding:5px 10px; border-radius:20px; background:rgba(212,168,67,0.15); border:1px solid rgba(212,168,67,0.3); color:var(--gold); backdrop-filter:blur(8px); display:flex; align-items:center; gap:5px; }
  .pd-ref-dot { width:5px; height:5px; border-radius:50%; background:var(--gold); box-shadow:0 0 6px var(--gold); }

  .pd-info-panel { padding:48px 44px; display:flex; flex-direction:column; gap:24px; }
  .pd-eyebrow { font-size:0.65rem; font-family:'IBM Plex Mono',monospace; color:var(--gold); text-transform:uppercase; letter-spacing:0.2em; }
  .pd-title { font-family:'Fraunces',serif; font-size:clamp(1.6rem,3vw,2.2rem); font-weight:700; letter-spacing:-0.03em; line-height:1.2; color:var(--text-primary); }
  .pd-description { font-size:0.88rem; color:var(--text-secondary); line-height:1.7; }
  .pd-divider { height:1px; background:var(--border); }
  .pd-price-label { font-size:0.62rem; font-family:'IBM Plex Mono',monospace; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.12em; margin-bottom:6px; }
  .pd-price { font-family:'Fraunces',serif; font-size:2.4rem; font-weight:700; color:var(--gold); letter-spacing:-0.05em; line-height:1; }
  .pd-price-currency { font-size:1.2rem; color:var(--text-secondary); }

  .pd-features { display:flex; flex-direction:column; gap:8px; }
  .pd-feature { display:flex; align-items:center; gap:10px; font-size:0.82rem; color:var(--text-secondary); }
  .pd-feature-dot { width:5px; height:5px; border-radius:50%; background:var(--green); flex-shrink:0; }

  .btn-buy { width:100%; background:var(--gold); color:#08090e; border:none; padding:15px; border-radius:13px; font-family:'Outfit',sans-serif; font-size:0.95rem; font-weight:700; cursor:pointer; transition:all 0.2s; display:flex; align-items:center; justify-content:center; gap:8px; }
  .btn-buy:hover { background:#e8bc55; box-shadow:0 0 32px var(--gold-glow); transform:translateY(-2px); }
  .pd-email-note { font-size:0.7rem; color:var(--text-muted); font-family:'IBM Plex Mono',monospace; text-align:center; letter-spacing:0.04em; }

  .pd-loading { min-height:100vh; display:flex; align-items:center; justify-content:center; background:var(--bg); }
  .pd-spinner { width:36px; height:36px; border:2.5px solid var(--surface3); border-top-color:var(--gold); border-radius:50%; animation:spin 0.7s linear infinite; }
  @keyframes spin { to{transform:rotate(360deg)} }

  .pd-overlay { position:fixed; inset:0; background:rgba(4,5,10,0.92); backdrop-filter:blur(12px); display:flex; align-items:center; justify-content:center; z-index:100; animation:fadeIn 0.2s ease; padding:24px; }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }

  .pd-modal { background:var(--surface); border:1px solid rgba(255,255,255,0.08); border-radius:22px; width:100%; max-width:420px; box-shadow:0 48px 96px rgba(0,0,0,0.8); animation:modalIn 0.25s cubic-bezier(0.22,1,0.36,1); overflow:hidden; }
  @keyframes modalIn { from{opacity:0;transform:translateY(20px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }

  .pd-modal-header { padding:26px 28px 22px; border-bottom:1px solid var(--border); }
  .pd-modal-header h3 { font-family:'Fraunces',serif; font-size:1.25rem; font-weight:700; letter-spacing:-0.02em; margin-bottom:4px; }
  .pd-modal-header p { font-size:0.76rem; color:var(--text-secondary); }

  .pd-modal-body { padding:22px 28px; display:flex; flex-direction:column; gap:16px; }
  .pd-order-summary { background:var(--surface2); border:1px solid var(--border); border-radius:12px; padding:16px; display:flex; justify-content:space-between; align-items:center; }
  .pd-order-name { font-size:0.88rem; font-weight:500; color:var(--text-primary); max-width:200px; }
  .pd-order-price { font-family:'Fraunces',serif; font-size:1.3rem; font-weight:700; color:var(--gold); }

  .pd-email-field { display:flex; flex-direction:column; gap:6px; }
  .pd-email-field label { font-size:0.64rem; color:var(--text-secondary); text-transform:uppercase; letter-spacing:0.12em; font-family:'IBM Plex Mono',monospace; }
  .pd-email-input { background:var(--surface2); border:1px solid var(--border); border-radius:10px; padding:11px 13px; color:var(--text-primary); font-family:'Outfit',sans-serif; font-size:0.88rem; outline:none; transition:all 0.18s; }
  .pd-email-input:focus { border-color:rgba(212,168,67,0.35); box-shadow:0 0 0 3px rgba(212,168,67,0.06); }
  .pd-email-input::placeholder { color:var(--text-muted); }

  .pd-notice { background:var(--surface2); border:1px solid var(--border); border-radius:11px; padding:14px 16px; display:flex; gap:12px; align-items:flex-start; }
  .pd-notice-icon { color:var(--gold); flex-shrink:0; margin-top:1px; }
  .pd-notice p { font-size:0.76rem; color:var(--text-secondary); line-height:1.5; }
  .pd-notice strong { color:var(--text-primary); }

  .pd-modal-footer { padding:16px 28px 26px; display:flex; gap:10px; }
  .btn-confirm { flex:1; background:var(--gold); color:#08090e; border:none; padding:13px; border-radius:11px; font-family:'Outfit',sans-serif; font-size:0.92rem; font-weight:700; cursor:pointer; transition:all 0.2s; }
  .btn-confirm:hover:not(:disabled) { background:#e8bc55; }
  .btn-confirm:disabled { opacity:0.4; cursor:not-allowed; }
  .btn-cancel { background:var(--surface2); color:var(--text-secondary); border:1px solid var(--border); padding:13px 20px; border-radius:11px; font-family:'Outfit',sans-serif; font-size:0.88rem; cursor:pointer; transition:all 0.18s; }
  .btn-cancel:hover { background:var(--surface3); color:var(--text-primary); }

  .pd-success { padding:40px 28px; text-align:center; display:flex; flex-direction:column; align-items:center; gap:16px; }
  .pd-success-icon { width:72px; height:72px; background:var(--green-dim); border:1px solid var(--green-border); border-radius:50%; display:flex; align-items:center; justify-content:center; margin-bottom:4px; }
  .pd-success h3 { font-family:'Fraunces',serif; font-size:1.5rem; font-weight:700; letter-spacing:-0.02em; }
  .pd-success p { font-size:0.84rem; color:var(--text-secondary); line-height:1.6; max-width:300px; }

  .pd-access-box { width:100%; background:var(--surface2); border:1px solid var(--green-border); border-radius:11px; padding:14px 16px; display:flex; align-items:center; justify-content:space-between; gap:10px; }
  .pd-access-url { font-size:0.74rem; font-family:'IBM Plex Mono',monospace; color:var(--green); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .btn-access { flex-shrink:0; background:var(--green-dim); border:1px solid var(--green-border); color:var(--green); padding:8px 14px; border-radius:8px; font-family:'Outfit',sans-serif; font-size:0.78rem; font-weight:600; cursor:pointer; transition:all 0.15s; text-decoration:none; display:inline-block; }
  .btn-access:hover { background:rgba(45,212,160,0.2); }

  .btn-done { background:var(--surface2); color:var(--text-secondary); border:1px solid var(--border); padding:12px 32px; border-radius:11px; font-family:'Outfit',sans-serif; font-size:0.88rem; cursor:pointer; transition:all 0.18s; margin-top:4px; }
  .btn-done:hover { background:var(--surface3); color:var(--text-primary); }
  .pd-err { font-size:0.74rem; color:var(--red); font-family:'IBM Plex Mono',monospace; }

  @media (max-width:680px) {
    .pd-root { padding:24px 12px; }
    .pd-card { grid-template-columns:1fr; }
    .pd-image-panel { min-height:260px; }
    .pd-info-panel { padding:28px 24px; }
  }
`;

export default function ProductDetail() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const ref = searchParams.get("ref");

  const [product, setProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [ordering, setOrdering] = useState(false);
  const [orderResult, setOrderResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/products/" + id)
      .then((res) => setProduct(res.data))
      .catch(() => navigate("/"))
      .finally(() => setLoading(false));
  }, [id]);

const handleConfirmOrder = async () => {
  if (!email.trim() || !email.includes("@")) {
    setError("Please enter a valid email address");
    return;
  }
  setError("");
  setOrdering(true);
  try {
    // Step 1 — create order
    const createRes = await api.post("/orders/create", null, {
      params: { product_id: product.id, ref_code: ref || undefined },
    });
    const orderId = createRes.data.order_id;

    // Step 2 — initiate PhonePe payment
    const payRes = await api.post("/orders/" + orderId + "/initiate-payment");

    // Step 3 — redirect to PhonePe payment page
    window.location.href = payRes.data.payment_url;

  } catch {
    setError("Something went wrong. Please try again.");
    setOrdering(false);
  }
};

  const handleClose = () => {
    setShowModal(false);
    setOrderResult(null);
    setEmail("");
    setError("");
  };

  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <div className="pd-loading"><div className="pd-spinner" /></div>
      </>
    );
  }

  if (!product) return null;

  const imgSrc = product.image_base64
    ? (product.image_base64.startsWith("data:") ? product.image_base64 : "data:image/jpeg;base64," + product.image_base64)
    : null;

  return (
    <>
      <style>{styles}</style>
      <div className="pd-root">
        <div className="pd-card">

          <div className="pd-image-panel">
            {imgSrc ? (
              <img src={imgSrc} alt={product.title} />
            ) : (
              <div className="pd-img-placeholder">
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                  <rect x="4" y="8" width="56" height="48" rx="8" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="22" cy="26" r="7" stroke="currentColor" strokeWidth="2"/>
                  <path d="M4 46l16-14 12 12 8-7 20 18" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                </svg>
              </div>
            )}
            <span className="pd-type-badge">{product.product_type || "product"}</span>
            {ref && (
              <span className="pd-ref-badge">
                <span className="pd-ref-dot" />
                Referral active
              </span>
            )}
          </div>

          <div className="pd-info-panel">
            <div className="pd-eyebrow">Digital Product</div>
            <h1 className="pd-title">{product.title}</h1>
            {product.description && <p className="pd-description">{product.description}</p>}
            <div className="pd-divider" />
            <div>
              <div className="pd-price-label">Price</div>
              <div className="pd-price">
                <span className="pd-price-currency">Rs. </span>
                {product.price?.toLocaleString()}
              </div>
            </div>
            <div className="pd-features">
              <div className="pd-feature"><span className="pd-feature-dot" />Instant access after payment</div>
              <div className="pd-feature"><span className="pd-feature-dot" />Digital delivery via secure link</div>
              <div className="pd-feature"><span className="pd-feature-dot" />One-time purchase, lifetime access</div>
            </div>
            <button className="btn-buy" onClick={() => setShowModal(true)}>
              Buy Now — Rs. {product.price?.toLocaleString()}
            </button>
            <p className="pd-email-note">Secure checkout · Instant digital delivery</p>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="pd-overlay" onClick={(e) => e.target === e.currentTarget && handleClose()}>
          <div className="pd-modal">
            {!orderResult ? (
              <>
                <div className="pd-modal-header">
                  <h3>Complete Purchase</h3>
                  <p>Enter your email to receive the product access link</p>
                </div>
                <div className="pd-modal-body">
                  <div className="pd-order-summary">
                    <div className="pd-order-name">{product.title}</div>
                    <div className="pd-order-price">Rs. {product.price?.toLocaleString()}</div>
                  </div>
                  <div className="pd-email-field">
                    <label>Your Email</label>
                    <input
                      className="pd-email-input"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoFocus
                    />
                    {error && <span className="pd-err">{error}</span>}
                  </div>
                  <div className="pd-notice">
                    <div className="pd-notice-icon">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                        <circle cx="8" cy="8" r="7"/>
                        <line x1="8" y1="5" x2="8" y2="8"/>
                        <circle cx="8" cy="11" r="0.5" fill="currentColor"/>
                      </svg>
                    </div>
                    <p><strong>Payment gateway coming soon.</strong> Clicking confirm simulates a successful payment and grants access.</p>
                  </div>
                </div>
                <div className="pd-modal-footer">
                  <button className="btn-confirm" onClick={handleConfirmOrder} disabled={ordering}>
                    {ordering ? "Processing..." : "Confirm & Pay"}
                  </button>
                  <button className="btn-cancel" onClick={handleClose}>Cancel</button>
                </div>
              </>
            ) : (
              <div className="pd-success">
                <div className="pd-success-icon">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#2dd4a0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 16l7 7 13-13"/>
                  </svg>
                </div>
                <h3>Payment Successful!</h3>
                <p>Your order for <strong>{product.title}</strong> is confirmed. Access your product below.</p>
                {orderResult.access_url && (
                  <div className="pd-access-box">
                    <span className="pd-access-url">{orderResult.access_url}</span>
                    <a href={orderResult.access_url} target="_blank" rel="noopener noreferrer" className="btn-access">
                      Open
                    </a>
                  </div>
                )}
                <button className="btn-done" onClick={handleClose}>Done</button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}