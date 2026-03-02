import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { api } from "../api/client";

export default function PaymentVerify() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get("order_id");
  const [status, setStatus] = useState("verifying"); // verifying | success | failed
  const [accessUrl, setAccessUrl] = useState("");

  useEffect(() => {
    if (!orderId) { navigate("/"); return; }

    api.post("/orders/" + orderId + "/verify-payment")
      .then((res) => {
        setAccessUrl(res.data.access_url || "");
        setStatus("success");
      })
      .catch(() => setStatus("failed"));
  }, [orderId]);

  const styles = `
    body { background: #080910; font-family: 'Outfit', sans-serif; }
    .pv { min-height:100vh; display:flex; align-items:center; justify-content:center; background:#080910; color:#f0ede8; }
    .pv-card { background:#0d0f18; border:1px solid rgba(255,255,255,0.06); border-radius:20px; padding:48px 40px; text-align:center; max-width:400px; width:90%; }
    .pv-icon { width:72px; height:72px; border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 auto 20px; }
    .pv-icon.success { background:rgba(45,212,160,0.1); border:1px solid rgba(45,212,160,0.25); }
    .pv-icon.failed { background:rgba(240,96,96,0.1); border:1px solid rgba(240,96,96,0.25); }
    .pv-icon.verifying { background:rgba(212,168,67,0.1); border:1px solid rgba(212,168,67,0.25); }
    .pv-title { font-family:'Fraunces',serif; font-size:1.6rem; font-weight:700; margin-bottom:8px; }
    .pv-sub { font-size:0.84rem; color:#6b6f85; margin-bottom:28px; line-height:1.6; }
    .pv-access { background:#111420; border:1px solid rgba(45,212,160,0.25); border-radius:10px; padding:12px 16px; display:flex; align-items:center; justify-content:space-between; gap:10px; margin-bottom:20px; }
    .pv-url { font-size:0.72rem; font-family:monospace; color:#2dd4a0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
    .btn-open { background:rgba(45,212,160,0.1); border:1px solid rgba(45,212,160,0.25); color:#2dd4a0; padding:8px 14px; border-radius:8px; font-size:0.78rem; font-weight:600; cursor:pointer; text-decoration:none; }
    .btn-home { background:#161928; color:#6b6f85; border:1px solid rgba(255,255,255,0.06); padding:12px 28px; border-radius:10px; font-size:0.88rem; cursor:pointer; }
    .spinner { width:32px; height:32px; border:2.5px solid #161928; border-top-color:#d4a843; border-radius:50%; animation:spin 0.7s linear infinite; margin:0 auto; }
    @keyframes spin { to{transform:rotate(360deg)} }
  `;

  return (
    <>
      <style>{styles}</style>
      <div className="pv">
        <div className="pv-card">
          {status === "verifying" && (
            <>
              <div className="pv-icon verifying"><div className="spinner" /></div>
              <div className="pv-title">Verifying Payment</div>
              <div className="pv-sub">Please wait while we confirm your payment...</div>
            </>
          )}

          {status === "success" && (
            <>
              <div className="pv-icon success">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#2dd4a0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 16l7 7 13-13"/>
                </svg>
              </div>
              <div className="pv-title">Payment Successful!</div>
              <div className="pv-sub">Your purchase is confirmed. Access your product below.</div>
              {accessUrl && (
                <div className="pv-access">
                  <span className="pv-url">{accessUrl}</span>
                  <a href={accessUrl} target="_blank" rel="noopener noreferrer" className="btn-open">Open</a>
                </div>
              )}
              <button className="btn-home" onClick={() => navigate("/")}>Back to Store</button>
            </>
          )}

          {status === "failed" && (
            <>
              <div className="pv-icon failed">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#f06060" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="6" y1="6" x2="22" y2="22"/><line x1="22" y1="6" x2="6" y2="22"/>
                </svg>
              </div>
              <div className="pv-title">Payment Failed</div>
              <div className="pv-sub">Something went wrong. Please try again or contact support.</div>
              <button className="btn-home" onClick={() => navigate("/")}>Back to Store</button>
            </>
          )}
        </div>
      </div>
    </>
  );
}