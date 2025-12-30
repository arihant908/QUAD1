import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

export default function CreateListing({ user, goBack }) {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!title || !price) {
      alert("Title and price required");
      return;
    }

    setLoading(true);

    await addDoc(collection(db, "listings"), {
      title,
      description: desc,
      price: Number(price),
      sellerId: user.uid,
      sellerName: user.displayName,
      status: "active",
      createdAt: serverTimestamp(),
    });

    setLoading(false);
    goBack();
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Create Listing</h2>

      <input
        placeholder="Item title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <br /><br />

      <input
        placeholder="Price"
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <br /><br />

      <textarea
        placeholder="Description (optional)"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
      />
      <br /><br />

      <button onClick={submit} disabled={loading}>
        {loading ? "Posting..." : "Post Listing"}
      </button>

      <button onClick={goBack} style={{ marginLeft: "1rem" }}>
        Cancel
      </button>
    </div>
  );
}
