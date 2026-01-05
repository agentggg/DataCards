import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const PROMPTS = [
  {
    q: "Explain what an API is (simple).",
    ideal: "An API is a way for programs to talk to each other, usually by sending requests and getting responses.",
  },
  {
    q: "What is React used for?",
    ideal: "React is a library for building user interfaces using components and state.",
  },
];

function scoreAnswer(user, ideal) {
  const u = String(user || "").toLowerCase();
  const i = String(ideal || "").toLowerCase();

  let points = 0;
  const hits = ["request", "response", "talk", "program", "interface", "component", "state", "data", "server"];
  for (const h of hits) if (u.includes(h) && i.includes(h)) points += 7;

  if (u.length > 25) points += 10;
  if (u.length > 60) points += 10;

  return Math.max(0, Math.min(100, points));
}

function feedback(score) {
  if (score >= 85) return { tag: "Awesome", line: "That’s clean. You’re cooking." };
  if (score >= 60) return { tag: "High", line: "Good answer. Add one more detail for a perfect hit." };
  if (score >= 35) return { tag: "Medium", line: "You’re in the area. Tighten the definition a bit." };
  if (score >= 15) return { tag: "Low", line: "Not quite. Try describing what it does and why it matters." };
  return { tag: "Fail", line: "We’re lost—but it’s fine. Re-read the prompt and take another swing." };
}

export default function AiFlashcards() {
  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const item = useMemo(() => PROMPTS[idx], [idx]);
  const score = useMemo(() => scoreAnswer(answer, item.ideal), [answer, item.ideal]);
  const fb = useMemo(() => feedback(score), [score]);

  function submit() {
    setSubmitted(true);
  }

  function next() {
    setSubmitted(false);
    setAnswer("");
    setIdx((v) => (v + 1) % PROMPTS.length);
  }

  return (
    <div className="page">
      <div className="pageHeader">
        <div>
          <div className="kicker">AI Mode</div>
          <h2 className="pageTitle">ModelQ - AI Flashcards</h2>
          <p className="pageSub">Write your answer, submit, get feedback. No fear. Just reps.</p>
        </div>
        <Link className="backLink" to="/">← Home</Link>
      </div>

      <div className="aiPanel">
        <div className="aiPrompt">
          <div className="aiPrompt__label">Prompt</div>
          <div className="aiPrompt__text">{item.q}</div>
        </div>

        <div className="aiAnswer">
          <div className="aiAnswer__label">Your Answer</div>
          <textarea
            className="aiTextarea"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type like a human. No pressure."
            rows={6}
          />
          <div className="aiActions">
            <button className="actionBtn" type="button" onClick={submit} disabled={!answer.trim()}>
              Submit
            </button>
            <button className="actionBtn actionBtn--ghost" type="button" onClick={next}>
              Next
            </button>
          </div>
        </div>

        {submitted && (
          <div className="aiResult">
            <div className="aiResult__top">
              <div className={`tag tag--${fb.tag.toLowerCase()}`}>{fb.tag}</div>
              <div className="scorePill">{score}/100</div>
            </div>

            <div className="aiResult__line">{fb.line}</div>

            <div className="aiIdeal">
              <div className="aiIdeal__label">One solid version</div>
              <div className="aiIdeal__text">{item.ideal}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}