import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

function funnyLine(score) {
  if (score >= 90) return "You’re basically a walking answer key.";
  if (score >= 70) return "Solid. Your brain is doing push-ups.";
  if (score >= 50) return "We’re warming up. Don’t quit now.";
  if (score >= 30) return "It’s fine. Even geniuses miss on purpose.";
  return "Okay… we’re learning with confidence today.";
}

function ModeCard({ title, subtitle, badge, tone, onClick, children }) {
  return (
    <button className={`modeCard modeCard--${tone}`} onClick={onClick} type="button">
      <div className="modeCard__top">
        <div className="modeCard__badge">{badge}</div>
        <div className="modeCard__chev" aria-hidden="true">↗</div>
      </div>

      <div className="modeCard__title">{title}</div>
      <div className="modeCard__subtitle">{subtitle}</div>

      <div className="modeCard__meta">{children}</div>
      <div className="modeCard__cta">Enter Mode</div>
    </button>
  );
}

export default function Home() {
  const nav = useNavigate();
  const [xp, setXp] = useState(12);

  const progress = useMemo(() => {
    const v = Math.max(0, Math.min(100, xp));
    return v;
  }, [xp]);

  return (
    <div className="page">
      <div className="hero">
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

          <div className="xpCard">
            <div className="xpCard__row">
              <div className="xpCard__label">Daily XP</div>
              <div className="xpCard__value">{progress}/100</div>
            </div>

            <div className="progressTrack" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
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
          tone="ai"
          badge="AI"
          title="AI Flashcards"
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