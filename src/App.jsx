import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

import Auth from "./auth/Auth";
import Marketplace from "./pages/Marketplace";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        const ref = doc(db, "users", u.uid);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          await setDoc(ref, {
            uid: u.uid,
            name: u.displayName,
            email: u.email,
            photo: u.photoURL,
            createdAt: serverTimestamp(),
          });
        }

        setUser(u);
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    return () => unsub();
  }, []);

  if (loading) return <h2>Loading...</h2>;

  return user ? <Marketplace user={user} /> : <Auth />;
}
