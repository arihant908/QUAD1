import { useEffect, useState, useRef } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

/* ---------------- CLOUDINARY CONFIG ---------------- */
const CLOUD_NAME = "dkcwmape4";
const UPLOAD_PRESET = "quad_unsigned";

/* ---------------- IMAGE COMPRESSION (NO LIBS) ---------------- */
async function compressImage(file, maxSize = 1280, quality = 0.65) {
  const img = new Image();
  const url = URL.createObjectURL(file);

  await new Promise((res, rej) => {
    img.onload = res;
    img.onerror = rej;
    img.src = url;
  });

  let { width, height } = img;
  if (width > height && width > maxSize) {
    height = Math.round((height * maxSize) / width);
    width = maxSize;
  } else if (height >= width && height > maxSize) {
    width = Math.round((width * maxSize) / height);
    height = maxSize;
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, width, height);

  const blob = await new Promise((res) =>
    canvas.toBlob(res, "image/jpeg", quality)
  );

  URL.revokeObjectURL(url);
  return new File([blob], "image.jpg", { type: "image/jpeg" });
}

/* ---------------- CLOUDINARY UPLOAD ---------------- */
async function uploadToCloudinary(file) {
  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", UPLOAD_PRESET);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: form,
    }
  );

  const data = await res.json();
  if (!data.secure_url) {
    console.error(data);
    throw new Error("Cloudinary upload failed");
  }

  return data.secure_url;
}

/* ---------------- UI ---------------- */
export default function SellerDashboard({ user }) {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [busy, setBusy] = useState(false);

  const [listings, setListings] = useState([]);
  const [requests, setRequests] = useState([]);

  const fileInputRef = useRef(null);

  /* My listings */
  useEffect(() => {
    const q = query(
      collection(db, "listings"),
      where("sellerId", "==", user.uid),
      orderBy("createdAt", "desc")
    );
    return onSnapshot(q, (snap) =>
      setListings(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    );
  }, [user.uid]);

  /* Incoming requests */
  useEffect(() => {
    const q = query(
      collection(db, "requests"),
      where("sellerId", "==", user.uid),
      orderBy("createdAt", "desc")
    );
    return onSnapshot(q, (snap) =>
      setRequests(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    );
  }, [user.uid]);

  /* Image select */
  const onPickImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;

    const compressed = await compressImage(file);
    setImageFile(compressed);
    setPreviewUrl(URL.createObjectURL(compressed));
  };

  const openPicker = () => fileInputRef.current?.click();

  /* Create listing (image mandatory) */
  const createListing = async () => {
    if (!title || !price || !imageFile || busy) return;
    setBusy(true);

    // 1) Create listing doc first
    const docRef = await addDoc(collection(db, "listings"), {
      title,
      price,
      sellerId: user.uid,
      sellerName: user.displayName,
      status: "active",
      createdAt: serverTimestamp(),
    });

    // 2) Upload image to Cloudinary
    const imageUrl = await uploadToCloudinary(imageFile);

    // 3) Save image URL
    await updateDoc(doc(db, "listings", docRef.id), { imageUrl });

    // reset
    setTitle("");
    setPrice("");
    setImageFile(null);
    setPreviewUrl("");
    setBusy(false);
  };

  const acceptRequest = async (req) => {
    await updateDoc(doc(db, "requests", req.id), {
      status: "accepted",
      meetupPlace: "Campus Quad",
      meetupTime: "Evening",
    });
    await updateDoc(doc(db, "listings", req.listingId), {
      status: "sold",
    });
  };

  return (
    <section>
      {/* POST */}
      <div className="reveal">
        <Label text="POST" />

        <div style={{ display: "flex", gap: "1.5rem", alignItems: "baseline" }}>
          <input
            placeholder="Item"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={inputStyle}
          />
          <input
            placeholder="Asking"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            style={inputStyle}
          />

          <button className="linkish" onClick={openPicker}>
            {imageFile ? "Replace image" : "Add image"}
          </button>

          <button
            className="linkish"
            onClick={createListing}
            style={{ opacity: title && price && imageFile && !busy ? 1 : 0.35 }}
            disabled={!title || !price || !imageFile || busy}
          >
            {busy ? "Posting…" : "Post"}
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          style={{ display: "none" }}
          onChange={onPickImage}
        />

        {previewUrl && (
          <div style={{ marginTop: "1.5rem" }}>
            <img
              src={previewUrl}
              alt="preview"
              style={{ width: "220px", borderRadius: "6px", opacity: 0.9 }}
            />
          </div>
        )}
      </div>

      {/* MY LISTINGS */}
      <div className="reveal" style={{ marginTop: "5rem" }}>
        <Label text="MY LISTINGS" />
        {listings.map((l) => (
          <Row
            key={l.id}
            title={l.title}
            meta={`Asking ₹${l.price}`}
            status={l.status}
          />
        ))}
      </div>

      {/* INCOMING */}
      <div className="reveal" style={{ marginTop: "5rem" }}>
        <Label text="INCOMING" />
        {requests.map((r) => (
          <article
            key={r.id}
            className="reveal"
            style={{
              padding: "2.6rem 0",
              borderTop: "1px solid var(--border-soft)",
            }}
          >
            <div style={{ fontSize: "1.4rem", fontWeight: 500 }}>
              {r.listingTitle}
            </div>
            <div
              style={{
                marginTop: "0.4rem",
                fontSize: "0.8rem",
                color: "var(--text-muted)",
              }}
            >
              Requested by {r.buyerName}
            </div>

            {r.status === "held" && (
              <button
                className="linkish"
                onClick={() => acceptRequest(r)}
                style={{ marginTop: "1.2rem", fontSize: "0.85rem" }}
              >
                Accept
              </button>
            )}

            {r.status === "accepted" && (
              <div
                style={{
                  marginTop: "1rem",
                  fontSize: "0.8rem",
                  color: "var(--accent)",
                }}
              >
                Accepted
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

/* ---------------- SMALL PIECES ---------------- */
function Label({ text }) {
  return (
    <div
      style={{
        fontSize: "0.75rem",
        letterSpacing: "0.28em",
        color: "var(--accent)",
        marginBottom: "2.2rem",
      }}
    >
      {text}
    </div>
  );
}

function Row({ title, meta, status }) {
  return (
    <article
      className="reveal"
      style={{
        padding: "2.6rem 0",
        borderTop: "1px solid var(--border-soft)",
        opacity: status === "sold" ? 0.35 : 1,
      }}
    >
      <div style={{ fontSize: "1.4rem", fontWeight: 500 }}>{title}</div>
      <div
        style={{
          marginTop: "0.4rem",
          fontSize: "0.8rem",
          color: "var(--text-muted)",
        }}
      >
        {meta}
      </div>
    </article>
  );
}

const inputStyle = {
  background: "transparent",
  border: "none",
  borderBottom: "1px solid var(--border-soft)",
  color: "var(--text-main)",
  padding: "0.2rem 0",
  fontSize: "1rem",
  width: "160px",
  outline: "none",
};
