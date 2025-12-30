import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import AnimatedList from "../components/AnimatedList";

export default function BuyerDashboard({ user }) {
  const [listings, setListings] = useState([]);
  const [active, setActive] = useState(null);

  useEffect(() => {
    const q = query(
      collection(db, "listings"),
      where("status", "==", "active"),
      orderBy("createdAt", "desc")
    );

    return onSnapshot(q, (snap) => {
      setListings(
        snap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .filter((l) => l.sellerId !== user.uid)
      );
    });
  }, [user.uid]);

  const take = async (l) => {
    setActive(l.id);

    await addDoc(collection(db, "requests"), {
      listingId: l.id,
      listingTitle: l.title,
      asking: l.price,
      sellerId: l.sellerId,
      sellerName: l.sellerName,
      buyerId: user.uid,
      buyerName: user.displayName,
      status: "held",
      createdAt: serverTimestamp(),
    });

    setActive(null);
  };

  return (
    <section>
      <div
        style={{
          fontSize: "0.75rem",
          letterSpacing: "0.28em",
          color: "var(--accent)",
          marginBottom: "3rem",
        }}
      >
        AVAILABLE
      </div>

      <AnimatedList
        items={listings}
        renderItem={(l, hovered) => (
          <article
            style={{
              padding: "2.6rem 0",
              borderTop: "1px solid var(--border-soft)",
            }}
          >
            {/* IMAGE (Cloudinary URL) */}
            {l.imageUrl && (
              <div style={{ marginBottom: "1.2rem" }}>
                <img
                  src={l.imageUrl}
                  alt={l.title}
                  loading="lazy"
                  style={{
                    width: "100%",
                    maxWidth: "420px",
                    borderRadius: "6px",
                    filter: hovered ? "blur(0px)" : "blur(10px)",
                    transition: "filter 0.4s ease",
                    opacity: 0.9,
                  }}
                />
              </div>
            )}

            <div
              style={{
                fontSize: "1.55rem",
                fontWeight: 500,
                letterSpacing: "-0.01em",
                color: hovered ? "var(--accent)" : "var(--text-main)",
                transition: "color 0.3s ease",
              }}
            >
              {l.title}
            </div>

            <div
              style={{
                marginTop: "0.35rem",
                fontSize: "0.8rem",
                color: "var(--text-muted)",
              }}
            >
              Posted by {l.sellerName}
            </div>

            <div style={{ marginTop: "0.9rem" }}>
              Asking ₹{l.price}
            </div>

            <button
              className="linkish"
              disabled={active === l.id}
              onClick={() => take(l)}
              style={{
                marginTop: "1.2rem",
                fontSize: "0.85rem",
                opacity: active === l.id ? 0.35 : 1,
              }}
            >
              {active === l.id ? "Holding…" : "Take"}
            </button>
          </article>
        )}
      />
    </section>
  );
}
