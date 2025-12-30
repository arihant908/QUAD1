import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";

export default function Auth() {
  const signIn = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Quad</h1>
      <p>Buy & sell inside your campus</p>
      <button onClick={signIn}>Sign in with Google</button>
    </div>
  );
}
