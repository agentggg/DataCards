// src/features/flashcards/FlashcardMode.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import CourseSelect from "./components/CourseSelect";

const FLASHCARD_ENDPOINT = "https://ict-agentofgod.pythonanywhere.com/get_flashcard";
// const FLASHCARD_ENDPOINT = "http://localhost:8000/get_flashcard";

function normalizeCourse(v) {
  return String(v || "").trim().toLowerCase();
}

function buildGoogleLearnMoreUrl({ course, question }) {
  const q = `${String(course || "").trim()} ${String(question || "").trim()}`.trim();
  return `https://www.google.com/search?q=${encodeURIComponent(q)}`;
}

function funnyLoadingLine() {
  const lines = [
    "Shuffling the deck… 🎲",
    "Summoning flashcards from the backend… 📡",
    "Loading knowledge… please keep hands inside the brain at all times 🧠",
    "Fetching cards… your future self says thanks 🙏",
  ];
  return lines[Math.floor(Math.random() * lines.length)];
}

/**
 * Onboarding Tour Popup
 * - Shows on first visit to this page (localStorage flag)
 * - Highlights the current target UI element
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
    <div className="tourOverlay" role="dialog" aria-modal="true" aria-label="How to use Flashcard Mode">
      <div className="tourBackdrop" onClick={onClose} />

      <div className="tourCard">
        <div className="tourTop">
          <div className="tourKicker">
            Quick tour ✨ <span className="tourPill">{idx + 1}/{steps.length}</span>
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
            Skip 🏃‍♂️💨
          </button>

          <div className="tourActions__right">
            <button
              className="tourBtn tourBtn--ghost"
              type="button"
              disabled={isFirst}
              onClick={() => setIdx((v) => Math.max(0, v - 1))}
              title={isFirst ? "You're already at the beginning." : "Go back"}
            >
              Back ⬅️
            </button>

            {!isLast ? (
              <button
                className="tourBtn"
                type="button"
                onClick={() => setIdx((v) => Math.min(steps.length - 1, v + 1))}
              >
                Next ➡️
              </button>
            ) : (
              <button className="tourBtn" type="button" onClick={onClose}>
                Done ✅
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FlashcardMode() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [items, setItems] = useState([]);

  const [course, setCourse] = useState("");
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [showReasoning, setShowReasoning] = useState(false);

  // Re-seed to reshuffle the deck when:
  // - you refresh
  // - you switch courses
  const [deckSeed, setDeckSeed] = useState(0);

  // ---- refs used to highlight elements during tour ----
  const headerRef = useRef(null);
  const courseSelectRef = useRef(null);
  const cardRef = useRef(null);
  const controlsRef = useRef(null);
  const refreshRef = useRef(null);

  const [tourOpen, setTourOpen] = useState(false);
  const [activeHighlight, setActiveHighlight] = useState(null);

  function shuffleArray(arr) {
    const a = Array.isArray(arr) ? [...arr] : [];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  async function loadFlashcards() {
    setLoading(true);
    setErr("");

    try {
      const res = await axios.get(FLASHCARD_ENDPOINT, {
        headers: { "Content-Type": "application/json" },
      });

      const data = Array.isArray(res.data) ? res.data : res.data?.results || [];

      const cleaned = (Array.isArray(data) ? data : [])
        .map((x) => ({
          id: x.id,
          question: String(x.question || "").trim(),
          answer: String(x.answer || "").trim(),
          reasoning: String(x.reasoning || "").trim(),
          course: normalizeCourse(x.course),
        }))
        .filter((x) => x.question && x.answer && x.course);

      setItems(cleaned);
      setDeckSeed((s) => s + 1); // reshuffle after reload
    } catch (e) {
      setErr(
        e?.response?.data?.error ||
          e?.message ||
          "Could not load flashcards. Check endpoint + server."
      );
    } finally {
      setLoading(false);
    }
  }

  // Load once on mount
  useEffect(() => {
    loadFlashcards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const courses = useMemo(() => {
    const set = new Set(items.map((x) => x.course).filter(Boolean));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [items]);

  const deck = useMemo(() => {
    const c = normalizeCourse(course);
    const filtered = items.filter((x) => x.course === c);
    return shuffleArray(filtered);
  }, [items, course, deckSeed]);

  const current = deck[index] || null;
  const progress = deck.length ? Math.round(((index + 1) / deck.length) * 100) : 0;

  function resetDeckState() {
    setIndex(0);
    setFlipped(false);
    setShowReasoning(false);
  }

  function onPickCourse(nextCourse) {
    setCourse(nextCourse);
    setDeckSeed((s) => s + 1); // reshuffle when switching courses
    resetDeckState();
  }

  // Safety: if the deck size changes and index is out of bounds, reset index
  useEffect(() => {
    if (!deck.length) return;
    if (index > deck.length - 1) setIndex(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deck.length]);

  function next() {
    if (!deck.length) return;
    setFlipped(false);
    setShowReasoning(false);
    setIndex((v) => (v + 1) % deck.length);
  }

  function prev() {
    if (!deck.length) return;
    setFlipped(false);
    setShowReasoning(false);
    setIndex((v) => (v - 1 + deck.length) % deck.length);
  }

  function learnMore() {
    if (!current) return;
    const url = buildGoogleLearnMoreUrl({ course, question: current.question });
    window.open(url, "_blank", "noopener,noreferrer");
  }

  // Tour steps
  const steps = useMemo(
    () => [
      {
        key: "welcome",
        title: "Welcome to Classic Flashcards 🎴",
        body: (
          <>
            This page is your drill zone.
            <br />
            Pick a course 📚, flip the card 🃏, and run reps 🔁 until it’s automatic.
          </>
        ),
        footer: (
          <>
            Pro tip: If you hate tours, hit <strong>Skip</strong> 🏃‍♂️💨
          </>
        ),
        target: headerRef,
      },
      {
        key: "course",
        title: "Step 1: Choose your course 📚",
        body: (
          <>
            The course picker filters your deck.
            <br />
            No course = no cards (by design).
          </>
        ),
        footer: <>Pick one, and the deck instantly shuffles for that course 🎲</>,
        target: courseSelectRef,
      },
      {
        key: "card",
        title: "Step 2: Tap the card to flip 🃏",
        body: (
          <>
            Front = question 🧩
            <br />
            Back = answer ✅
          </>
        ),
        footer: <>Tap anywhere on the card to flip. Buttons on the back won’t flip it.</>,
        target: cardRef,
      },
      {
        key: "reasoning",
        title: "Step 3: Use “Explain it” for the coach 🧠",
        body: (
          <>
            On the answer side, you can open reasoning 💡.
            <br />
            Then use <strong>Learn more</strong> 🔎 to Google the topic in a new tab.
          </>
        ),
        footer: <>Reasoning is optional. If it’s missing, you’ll see a friendly message ✍️</>,
        target: cardRef,
      },
      {
        key: "controls",
        title: "Step 4: Navigate the deck 🔁",
        body: (
          <>
            Use <strong>Prev</strong> ⬅️ / <strong>Next</strong> ➡️ to cycle cards.
            <br />
            The meter shows progress through the course deck 🧾
          </>
        ),
        footer: <>Each time you refresh or switch courses, the deck reshuffles 🎲</>,
        target: controlsRef,
      },
      {
        key: "refresh",
        title: "Refresh pulls new cards from your backend 🔄",
        body: (
          <>
            Refresh re-downloads flashcards from the API 📡
            <br />
            Then it reshuffles so you don’t memorize the order.
          </>
        ),
        footer: <>If you add new cards in the backend, refresh to see them instantly ⚡</>,
        target: refreshRef,
      },
    ],
    []
  );

  // Open tour on first visit to this page
  useEffect(() => {
    const seen = localStorage.getItem("flashTourSeen") === "1";
    if (!seen) setTourOpen(true);
  }, []);

  function closeTour() {
    setTourOpen(false);
    setActiveHighlight(null);
    localStorage.setItem("flashTourSeen", "1");
  }

  // add/remove highlight class on the target element
  useEffect(() => {
    const refs = [headerRef, courseSelectRef, cardRef, controlsRef, refreshRef];
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

      <div className="pageHeader" ref={headerRef}>
        <div>
          <div className="kicker">Classic Mode 🎴</div>
          <h2 className="pageTitle">Flashcards ⚡</h2>
          <p className="pageSub">
            Pick a course first 📚 → then flip cards 🃏 → grind reps 🔁 → build confidence 💪
          </p>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <button
            ref={refreshRef}
            className="backLink"
            type="button"
            onClick={() => {
              resetDeckState();
              loadFlashcards();
            }}
            title="Reload from backend + reshuffle"
          >
            Refresh 🔄
          </button>

          <Link className="backLink" to="/">
            ← Home 🏠
          </Link>
        </div>
      </div>

      {loading && (
        <div className="emptyState" style={{ marginTop: 16 }}>
          <div className="emptyState__big">{funnyLoadingLine()}</div>
          <div className="emptyState__sub">Getting the latest cards from your backend…</div>
        </div>
      )}

      {!loading && err && (
        <div className="emptyState" style={{ marginTop: 16 }}>
          <div className="emptyState__big">Uh-oh… backend said “not today” 😅</div>
          <div className="emptyState__sub">{err}</div>
          <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button className="actionBtn" type="button" onClick={loadFlashcards}>
              Try Again 🚀
            </button>
            <Link className="backLink" to="/">
              Back Home 🏠
            </Link>
          </div>
        </div>
      )}

      {!loading && !err && (
        <div style={{ marginTop: 16 }}>
          <div ref={courseSelectRef}>
            <CourseSelect
              courses={courses}
              selected={course}
              onSelect={onPickCourse}
              countByCourse={(c) => items.filter((x) => x.course === normalizeCourse(c)).length}
            />
          </div>

          {!course && (
            <div className="emptyState" style={{ marginTop: 14 }}>
              <div className="emptyState__big">Pick a course to unlock the deck 🔓🎴</div>
              <div className="emptyState__sub">
                Once you choose, I’ll start dealing cards immediately.
              </div>
            </div>
          )}

          {course && deck.length === 0 && (
            <div className="emptyState" style={{ marginTop: 14 }}>
              <div className="emptyState__big">No cards found for “{course}” 😭</div>
              <div className="emptyState__sub">
                Either the backend returned none, or the course label doesn’t match.
              </div>
            </div>
          )}

          {course && deck.length > 0 && current && (
            <div className="deckWrap">
              <div ref={cardRef}>
                {/* Card: tap anywhere to flip */}
                <button
                  className={`flipCard ${flipped ? "isFlipped" : ""}`}
                  type="button"
                  onClick={() => setFlipped((v) => !v)}
                  aria-label="Flashcard (tap to flip)"
                >
                  <div className="flipCard__inner">
                    {/* FRONT */}
                    <div className="flipCard__face flipCard__front">
                      <div className="flipCard__label">Question • {course} 🧩</div>
                      <div className="flipCard__big">{current.question}</div>
                      <div className="flipCard__hint">Tap to reveal 👆</div>
                    </div>

                    {/* BACK */}
                    <div className="flipCard__face flipCard__back">
                      <div className="flipCard__label">Answer ✅</div>
                      <div className="flipCard__big">{current.answer}</div>

                      <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
                        <button
                          className="miniBtn"
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowReasoning((v) => !v);
                          }}
                          title="Show the explanation"
                        >
                          {showReasoning ? "Hide coach 🙈" : "Explain it 🧠"}
                        </button>

                        <button
                          className="miniBtn"
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            learnMore();
                          }}
                          title="Opens Google in a new tab"
                        >
                          Learn more 🔎
                        </button>

                        <button
                          className="miniBtn miniBtn--ghost"
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setFlipped(false);
                            setShowReasoning(false);
                          }}
                          title="Return to the question side"
                        >
                          Back to question ↩️
                        </button>
                      </div>

                      {showReasoning && (
                        <div
                          key={`reasoning-${current?.id}-${showReasoning ? "on" : "off"}`}
                          className="aiIdeal"
                          style={{ marginTop: 12 }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="aiIdeal__label">Reasoning 💡</div>
                          <div className="aiIdeal__text">
                            {current.reasoning || "No reasoning provided yet. Add it in your backend ✍️"}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              </div>

              {/* Controls */}
              <div className="deckControls" ref={controlsRef}>
                <button
                  className="actionBtn actionBtn--ghost"
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    prev();
                  }}
                >
                  Prev ⬅️
                </button>

                <div className="deckMeter" aria-label="Deck progress">
                  <div className="deckMeter__top">
                    <span>
                      Card {index + 1} / {deck.length} 🧾
                    </span>
                    <span>{progress}% 🔥</span>
                  </div>
                  <div className="meterTrack">
                    <div className="meterFill" style={{ width: `${progress}%` }} />
                  </div>
                </div>

                <button
                  className="actionBtn"
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    next();
                  }}
                >
                  Next ➡️
                </button>
              </div>

              <div className="miniNote" style={{ marginTop: 12 }}>
                Tip: Tap the card to flip 🃏. Use Prev/Next to drill reps 🔁. Use “Explain it” when you want the coach 🧠.
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}