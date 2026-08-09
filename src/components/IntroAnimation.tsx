"use client";

import { useState } from "react";

export default function IntroAnimation() {
  const [skipped, setSkipped] = useState(false);
  const [hidden, setHidden] = useState(false);

  if (hidden) return null;

  return (
    <div
      className={`intro-overlay${skipped ? " is-skipped" : ""}`}
      role="presentation"
      aria-hidden="true"
      onClick={() => setSkipped(true)}
      onAnimationEnd={(e) => {
        if (e.animationName === "introOverlayOut") {
          setHidden(true);
          window.__introDismissed = true;
          window.dispatchEvent(new Event("introDone"));
        }
      }}
    >
      <div className="flex flex-col items-center">
        <div className="intro-mark-wrap">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="intro-mark" src="/brand/logo-mark.png" alt="Pro Loco Montalbano Elicona" />
          <span className="intro-ripple" aria-hidden="true" />
        </div>
        <p className="intro-tagline">Montalbano Elicona</p>
      </div>
    </div>
  );
}
