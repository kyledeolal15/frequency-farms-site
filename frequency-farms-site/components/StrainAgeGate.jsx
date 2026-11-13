import { useEffect, useState } from "react";

// Same storage key as the landing page gate, so someone who already
// confirmed 21+ on the main site isn't asked again after scanning a bag.
const GATE_STORAGE_KEY = "ff_gate_complete";
const EXIT_URL = "https://www.google.com";

// Renders children ONLY after age is confirmed (nothing is in the page
// for an under-21 visitor to see behind the gate).
export default function StrainAgeGate({ children }) {
  const [state, setState] = useState("checking"); // checking | ask | ok

  useEffect(() => {
    let ok = false;
    try {
      ok = window.localStorage.getItem(GATE_STORAGE_KEY) === "true";
    } catch {}
    setState(ok ? "ok" : "ask");
  }, []);

  function yes() {
    try {
      window.localStorage.setItem(GATE_STORAGE_KEY, "true");
    } catch {}
    setState("ok");
  }

  if (state === "ok") return children;
  if (state === "checking") return <div className="ff-sg-blank" />;

  return (
    <div className="ff-sg">
      <img src="/frequency-farms-logo.png" alt="Frequency Farms" className="ff-sg-logo" />
      <h1>Are you 21 years of age or older?</h1>
      <p>You must be 21+ to view this page.</p>
      <div className="ff-sg-actions">
        <button className="ff-sg-btn" onClick={yes}>Yes, I'm 21+</button>
        <button className="ff-sg-btn ff-sg-btn-ghost" onClick={() => (window.location.href = EXIT_URL)}>
          No
        </button>
      </div>
    </div>
  );
}
