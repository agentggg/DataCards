import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function funnyLine(score) {
  if (score >= 90) return "You’re basically a walking answer key.";
  if (score >= 70) return "Solid. Your brain is doing push-ups.";
  if (score >= 50) return "We’re warming up. Don’t quit now.";
  if (score >= 30) return "It’s fine. Even geniuses miss on purpose.";
  return "Okay… we’re learning with confidence today.";
}

function ModeCard({ title, subtitle, badge, tone, onClick, children, innerRef }) {
  return (
    <button
      ref={innerRef}
      className={`modeCard modeCard--${tone}`}
      onClick={onClick}
      type="button"
    >
      <div className="modeCard__top">
        <div className="modeCard__badge">{badge}</div>
        <div className="modeCard__chev" aria-hidden="true">
          ↗
        </div>
      </div>

      <div className="modeCard__title">{title}</div>
      <div className="modeCard__subtitle">{subtitle}</div>

      <div className="modeCard__meta">{children}</div>
      <div className="modeCard__cta">Enter Mode</div>
    </button>
  );
}

/**
 * Simple onboarding tour:
 * - Shows on first visit (or if you clear localStorage)
 * - Highlights the "current" UI target
 * - Next/Back/Skip/Done
 */
function OnboardingTour({ steps, isOpen, onClose, onStepChange }) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (!isOpen) return;
    setIdx(0);
    onStepChange?.(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    onStepChange?.(idx);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, isOpen]);

  if (!isOpen) return null;

  const step = steps[idx];
  const isLast = idx === steps.length - 1;
  const isFirst = idx === 0;

  return (
    <div className="tourOverlay" role="dialog" aria-modal="true" aria-label="How to use this page">
      <div className="tourBackdrop" onClick={onClose} />

      <div className="tourCard">
        <div className="tourTop">
          <div className="tourKicker">
            Quick tour <span className="tourPill">{idx + 1}/{steps.length}</span>
          </div>
          <button className="tourX" type="button" onClick={onClose} aria-label="Close tour">
            ×
          </button>
        </div>

        <div className="tourTitle">{step.title}</div>
        <div className="tourBody">{step.body}</div>

        {step.footer && <div className="tourFooter">{step.footer}</div>}

        <div className="tourActions">
          <button className="tourBtn tourBtn--ghost" type="button" onClick={onClose}>
            Skip
          </button>

          <div className="tourActions__right">
            <button
              className="tourBtn tourBtn--ghost"
              type="button"
              disabled={isFirst}
              onClick={() => setIdx((v) => Math.max(0, v - 1))}
              title={isFirst ? "You're already at the beginning." : "Go back"}
            >
              Back
            </button>

            {!isLast ? (
              <button className="tourBtn" type="button" onClick={() => setIdx((v) => Math.min(steps.length - 1, v + 1))}>
                Next
              </button>
            ) : (
              <button className="tourBtn" type="button" onClick={onClose}>
                Done
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const nav = useNavigate();
  const [xp, setXp] = useState(12);

  // ---- refs used to highlight elements during tour ----
  const heroRef = useRef(null);
  const xpCardRef = useRef(null);
  const flashRef = useRef(null);
  const aiRef = useRef(null);
  const codeRef = useRef(null);

  const [tourOpen, setTourOpen] = useState(false);
  const [activeHighlight, setActiveHighlight] = useState(null);

  const progress = useMemo(() => {
    const v = Math.max(0, Math.min(100, xp));
    return v;
  }, [xp]);

  const steps = useMemo(
    () => [
      {
        key: "welcome",
        title: "Welcome. This takes 20 seconds.",
        body: (
          <>
            This page is your “pick a lane” hub. Choose a mode, do small reps, get better fast.
            <br />
            <br />
            Rule #1: You don’t need motivation. You need momentum.
          </>
        ),
        footer: (
          <>
            Tip: If you hate tours, hit <strong>Skip</strong>. I won’t take it personally.
          </>
        ),
        target: xpCardRef,
      },
      {
        key: "xp",
        title: "Daily XP = tiny wins, stacked.",
        body: (
          <>
            This is your daily progress bar. Keep it moving and your future self will say “respect.”
            <br />
            <br />
            Tap <strong>+10 XP</strong> to simulate progress while you’re building/testing.
          </>
        ),
        target: xpCardRef,
      },
      {
        key: "flash",
        title: "Flashcards = speed reps.",
        body: (
          <>
            Use this when you want quick prompts and fast memory loops.
            <br />
            It’s the “I have 5 minutes—make it count” mode.
          </>
        ),
        target: flashRef,
      },
      {
        key: "ai",
        title: "ModelQ = smarter feedback.",
        body: (
          <>
            This mode uses AI-powered grading/feedback so you spend less time guessing and more time leveling up.
            <br />
            <br />
            If it feels like a coach, that’s on purpose.
          </>
        ),
        footer: (
          <>
            Powered by AI logic coded by <strong>Stevenson Gerard</strong> from the ground up.
            <br />
            Stack (high level): <strong>ReactJS</strong> on the frontend, backed by an <strong>Python</strong>.
          </>
        ),
        target: aiRef,
      },
      {
        key: "code",
        title: "Live Coding = learn by doing.",
        body: (
          <>
            Tiny challenges. Real muscle memory.
            <br />
            If you can do it under light pressure here, you can do it for real later.
          </>
        ),
        target: codeRef,
      },
    ],
    []
  );

  // open tour on first visit (or when localStorage flag missing)
  useEffect(() => {
    const seen = localStorage.getItem("homeTourSeen") === "1";
    if (!seen) setTourOpen(true);
  }, []);

  function closeTour() {
    setTourOpen(false);
    setActiveHighlight(null);
    localStorage.setItem("homeTourSeen", "1");
  }

  // add/remove highlight class on the target element
  useEffect(() => {
    // clear all highlights first
    const refs = [heroRef, xpCardRef, flashRef, aiRef, codeRef];
    refs.forEach((r) => r.current?.classList.remove("tourHighlight"));

    if (!tourOpen) return;
    if (!activeHighlight) return;

    activeHighlight.current?.classList.add("tourHighlight");

    return () => {
      activeHighlight.current?.classList.remove("tourHighlight");
    };
  }, [tourOpen, activeHighlight]);

  return (
    <div className="page">
      <OnboardingTour
        steps={steps}
        isOpen={tourOpen}
        onClose={closeTour}
        onStepChange={(i) => setActiveHighlight(steps[i]?.target || null)}
      />

      <div className="hero" ref={heroRef}>
        <div className="hero__left">
          <div className="kicker">Choose your study mode</div>
          <h1 className="hero__h1">
            Learn fast.
            <span className="hero__accent"> Laugh a little.</span>
            <br />
            Actually remember it.
          </h1>
          <p className="hero__p">
            Pick a lane. Each mode is designed to feel like a game, not a chore.
            Your mission: stack small wins until you’re dangerous.
          </p>

          <div className="xpCard" ref={xpCardRef}>
            <div className="xpCard__row">
              <div className="xpCard__label">Daily XP</div>
              <div className="xpCard__value">{progress}/100</div>
            </div>

            <div
              className="progressTrack"
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div className="progressFill" style={{ width: `${progress}%` }} />
              <div className="progressGlow" style={{ left: `calc(${progress}% - 18px)` }} />
            </div>

            <div className="xpCard__row xpCard__row--bottom">
              <div className="xpCard__hint">{funnyLine(progress)}</div>
              <div className="xpCard__btns">
                <button className="miniBtn" type="button" onClick={() => setXp((v) => Math.min(100, v + 10))}>
                  +10 XP
                </button>
                <button className="miniBtn miniBtn--ghost" type="button" onClick={() => setXp(12)}>
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="hero__right">
          <div className="orbGrid" aria-hidden="true">
            <div className="orb orb--1" />
            <div className="orb orb--2" />
            <div className="orb orb--3" />
            <div className="orb orb--4" />
          </div>

          <div className="statStack">
            <div className="statCard">
              <div className="statCard__label">Streak</div>
              <div className="statCard__value">3 days</div>
              <div className="statCard__sub">Keep it alive.</div>
            </div>
            <div className="statCard">
              <div className="statCard__label">Accuracy</div>
              <div className="statCard__value">67%</div>
              <div className="statCard__sub">WIP (like everyone).</div>
            </div>
            <div className="statCard">
              <div className="statCard__label">Mood</div>
              <div className="statCard__value">Locked in</div>
              <div className="statCard__sub">No doom scrolling.</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid3">
        <ModeCard
          innerRef={flashRef}
          tone="flash"
          badge="Classic"
          title="Flashcards"
          subtitle="Quick prompts, fast reps, instant confidence."
          onClick={() => nav("/flashcards")}
        >
          <div className="chips">
            <span className="chip">Speed</span>
            <span className="chip">Memory</span>
            <span className="chip">Basics</span>
          </div>
        </ModeCard>

        <ModeCard
          innerRef={aiRef}
          tone="ai"
          badge="AI"
          title="ModelQ - AI Flashcards"
          subtitle="Smarter feedback. Less guessing. More leveling up."
          onClick={() => nav("/ai-flashcards")}
        >
          <div className="chips">
            <span className="chip">Feedback</span>
            <span className="chip">Hints</span>
            <span className="chip">Adaptive</span>
          </div>
        </ModeCard>

        <ModeCard
          innerRef={codeRef}
          tone="code"
          badge="Code"
          title="Live Coding Flashcards"
          subtitle="Tiny coding challenges that teach by doing."
          onClick={() => nav("/live-coding")}
        >
          <div className="chips">
            <span className="chip">Practice</span>
            <span className="chip">Muscle memory</span>
            <span className="chip">Build</span>
          </div>
        </ModeCard>
      </div>
    </div>
  );
}
