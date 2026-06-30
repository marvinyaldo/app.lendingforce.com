import { useEffect, useState, type ReactNode } from "react";

const UNLOCK_KEY = "lfUnlocked";
const EXPECTED_HASH = (import.meta.env.VITE_APP_PIN_HASH ?? "").toLowerCase();

async function sha256(text: string): Promise<string> {
  const buf = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

interface PinGateProps {
  children: ReactNode;
}

export function PinGate({ children }: PinGateProps) {
  // If no PIN configured at build time, the gate is disabled (fail-open for dev).
  const gateEnabled = EXPECTED_HASH.length === 64;

  const [unlocked, setUnlocked] = useState<boolean>(() => {
    if (!gateEnabled) return true;
    try {
      return sessionStorage.getItem(UNLOCK_KEY) === "1";
    } catch {
      return false;
    }
  });
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Re-lock if another tab clears the session.
  useEffect(() => {
    if (!gateEnabled) return;
    const onStorage = () => {
      try {
        setUnlocked(sessionStorage.getItem(UNLOCK_KEY) === "1");
      } catch {
        /* ignore */
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [gateEnabled]);

  if (unlocked) return <>{children}</>;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const hash = await sha256(pin.trim());
      if (hash === EXPECTED_HASH) {
        try {
          sessionStorage.setItem(UNLOCK_KEY, "1");
        } catch {
          /* ignore */
        }
        setUnlocked(true);
      } else {
        setError("Incorrect PIN. Please try again.");
        setPin("");
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="pin-gate">
      <form className="pin-card" onSubmit={onSubmit}>
        <div className="brand-kicker">
          <span className="bar" /> Lending Force
        </div>
        <h1>Enter Company PIN</h1>
        <p>Access is restricted to authorized Lending Force team members.</p>
        <input
          type="password"
          inputMode="numeric"
          autoComplete="off"
          autoFocus
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          placeholder="••••••"
          aria-label="Company PIN"
        />
        {error && <div className="pin-error" role="alert">{error}</div>}
        <button type="submit" disabled={busy || !pin}>
          {busy ? "Checking…" : "Unlock"}
        </button>
        <p className="pin-foot">
          The PIN unlocks this browser session only. Closing the browser re-locks the app.
        </p>
      </form>
    </div>
  );
}
