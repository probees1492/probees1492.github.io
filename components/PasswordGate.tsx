"use client";
import { useEffect, useRef, useState } from "react";

const PASSCODE = "2026"; // 4-digit. Note: visible in client bundle.
const STORAGE_KEY = "seo-journey-unlocked";
const LENGTH = PASSCODE.length;

export default function PasswordGate({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState(false);
  const [ready, setReady] = useState(false);
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === "1") {
        setUnlocked(true);
      }
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!unlocked && ready) inputRef.current?.focus();
  }, [unlocked, ready]);

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value.replace(/\D/g, "").slice(0, LENGTH);
    setValue(v);
    if (v.length === LENGTH) {
      if (v === PASSCODE) {
        try {
          localStorage.setItem(STORAGE_KEY, "1");
        } catch {}
        setUnlocked(true);
      } else {
        setError(true);
        setTimeout(() => {
          setError(false);
          setValue("");
          inputRef.current?.focus();
        }, 500);
      }
    }
  }

  if (!ready) {
    return <div style={{ position: "fixed", inset: 0, background: "#e5e5e5" }} />;
  }
  if (unlocked) return <>{children}</>;

  return (
    <div className="gate-root" onClick={() => inputRef.current?.focus()}>
      <div className="gate-card">
        <div className="gate-title">SEO's Journey</div>
        <div className="gate-subtitle">ENTER 4-DIGIT CODE</div>
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          pattern="\\d*"
          value={value}
          onChange={onChange}
          maxLength={LENGTH}
          className="gate-hidden-input"
          aria-label="4-digit passcode"
        />
        <div className={`gate-dots ${error ? "gate-shake" : ""}`}>
          {Array.from({ length: LENGTH }).map((_, i) => (
            <div
              key={i}
              className={`gate-dot ${i < value.length ? "filled" : ""} ${error ? "error" : ""}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
