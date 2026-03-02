import { useEffect, useState } from "react";

const API_BASE = "";


export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ---------------- LOAD SELLER PRODUCTS ---------------- */

  useEffect(() => {
    fetch(`${API_BASE}/seller/products/`)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch(() => alert("Failed to load products"));
  }, []);

  /* ---------------- IMAGE HANDLER ---------------- */

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  /* ---------------- OPEN EDIT ---------------- */

  const handleEdit = (product) => {
    setEditingProduct(product);
    setPreview(product.image_base64 || null);
    setShowModal(true);
  };

  /* ---------------- CREATE / UPDATE ---------------- */

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      title: e.target.title.value,
      description: "",
      price: Number(e.target.price.value),
      commission_percent: Number(e.target.commission.value),
      product_type: "course",
      image_base64: preview,
    };

    try {
      const url = editingProduct
        ? `${API_BASE}/seller/products/${editingProduct.id}`
        : `${API_BASE}/seller/products/`;

      const method = editingProduct ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error();

      const saved = await res.json();

      setProducts((prev) =>
        editingProduct
          ? prev.map((p) => (p.id === saved.id ? saved : p))
          : [...prev, saved]
      );

      setShowModal(false);
      setEditingProduct(null);
      setPreview(null);
    } catch {
      alert("Save failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <div style={{ textAlign: "right", marginBottom: 20 }}>
        <button onClick={() => setShowModal(true)} style={btnPrimary}>
          ➕ Add Product
        </button>
      </div>

      {products.length === 0 ? (
        <p>No products yet</p>
      ) : (
        <div style={grid}>
          {products.map((product) => (
            <div key={product.id} style={card}>
              {product.image_base64 && (
                <img src={product.image_base64} alt="" style={img} />
              )}

              <h4>{product.title}</h4>
              <p>₹{product.price}</p>
              <p>Commission: {product.commission_percent}%</p>

              {/* STATUS */}
              {product.status === "pending" && (
                <p style={pending}>⏳ Awaiting admin approval</p>
              )}

              {product.status === "approved" && (
                <p style={approved}>✅ Approved</p>
              )}

              {product.status === "rejected" && (
                <>
                  <p style={rejected}>❌ Rejected</p>
                  <p style={reason}>
                    Reason: {product.rejection_reason}
                  </p>
                </>
              )}

              <button
                onClick={() => handleEdit(product)}
                disabled={product.status === "approved"}
                style={{
                  ...btnSecondary,
                  background:
                    product.status === "approved" ? "#9ca3af" : "#2563eb",
                  cursor:
                    product.status === "approved"
                      ? "not-allowed"
                      : "pointer",
                }}
              >
                ✏️{" "}
                {product.status === "rejected"
                  ? "Edit & Resubmit"
                  : "Edit"}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <div style={overlay}>
          <div style={modal}>
            <h3>{editingProduct ? "Edit Product" : "Add Product"}</h3>

            <form onSubmit={handleSubmit}>
              <input type="file" accept="image/*" onChange={handleImageChange} />
              {preview && <img src={preview} style={previewImg} />}

              <input
                name="title"
                placeholder="Product title"
                defaultValue={editingProduct?.title || ""}
                required
              />

              <input
                name="price"
                type="number"
                placeholder="Price"
                defaultValue={editingProduct?.price || ""}
                required
              />

              <input
                name="commission"
                type="number"
                placeholder="Commission %"
                defaultValue={editingProduct?.commission_percent || ""}
                required
              />

              <div style={{ marginTop: 12 }}>
                <button type="submit" style={btnPrimary} disabled={loading}>
                  {loading ? "Saving..." : "Save"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingProduct(null);
                    setPreview(null);
                  }}
                  style={btnDanger}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
  gap: 20,
};

const card = {
  border: "1px solid #e5e7eb",
  padding: 14,
  borderRadius: 10,
  background: "#fff",
};

const img = {
  width: "100%",
  height: 140,
  objectFit: "cover",
  borderRadius: 8,
};

const previewImg = {
  width: "100%",
  height: 120,
  objectFit: "cover",
  marginTop: 8,
};

const pending = { color: "#f59e0b", fontWeight: "bold" };
const approved = { color: "#10b981", fontWeight: "bold" };
const rejected = { color: "#ef4444", fontWeight: "bold" };
const reason = { fontSize: 13, color: "#6b7280" };

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const modal = {
  background: "#fff",
  padding: 20,
  borderRadius: 10,
  width: 360,
};

const btnPrimary = {
  background: "#2563eb",
  color: "#fff",
  border: "none",
  padding: "8px 14px",
  borderRadius: 6,
};

const btnSecondary = {
  color: "#fff",
  border: "none",
  padding: "6px 12px",
  borderRadius: 6,
  marginTop: 8,
};

const btnDanger = {
  background: "#ef4444",
  color: "#fff",
  border: "none",
  padding: "6px 12px",
  borderRadius: 6,
};
