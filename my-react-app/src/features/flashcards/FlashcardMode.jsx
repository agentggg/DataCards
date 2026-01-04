import { useEffect, useMemo, useState } from "react";
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

export default function FlashcardMode() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [items, setItems] = useState([]);

  const [course, setCourse] = useState("");
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [showReasoning, setShowReasoning] = useState(false);

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

  useEffect(() => {
    loadFlashcards();
  }, []);

  const courses = useMemo(() => {
    const set = new Set(items.map((x) => x.course).filter(Boolean));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [items]);

  const deck = useMemo(() => {
    const c = normalizeCourse(course);
    const filtered = items.filter((x) => x.course === c);

    filtered.sort((a, b) => {
      const ai = Number(a.id ?? 0);
      const bi = Number(b.id ?? 0);
      return ai - bi;
    });

    return filtered;
  }, [items, course]);

  const current = deck[index] || null;
  const progress = deck.length ? Math.round(((index + 1) / deck.length) * 100) : 0;

  function resetDeckState() {
    setIndex(0);
    setFlipped(false);
    setShowReasoning(false);
  }

  function onPickCourse(nextCourse) {
    setCourse(nextCourse);
    resetDeckState();
  }

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

  return (
    <div className="page">
      <div className="pageHeader">
        <div>
          <div className="kicker">Classic Mode</div>
          <h2 className="pageTitle">Flashcards</h2>
          <p className="pageSub">
            Pick a course first. Then flip cards, grind reps, and build confidence.
          </p>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button className="backLink" type="button" onClick={loadFlashcards}>
            Refresh
          </button>
          <Link className="backLink" to="/">
            ← Home
          </Link>
        </div>
      </div>

      {loading && (
        <div className="emptyState" style={{ marginTop: 16 }}>
          <div className="emptyState__big">Loading flashcards…</div>
          <div className="emptyState__sub">Getting the latest from your backend.</div>
        </div>
      )}

      {!loading && err && (
        <div className="emptyState" style={{ marginTop: 16 }}>
          <div className="emptyState__big">Could not load flashcards</div>
          <div className="emptyState__sub">{err}</div>
          <div style={{ marginTop: 12, display: "flex", gap: 10 }}>
            <button className="actionBtn" type="button" onClick={loadFlashcards}>
              Try Again
            </button>
          </div>
        </div>
      )}

      {!loading && !err && (
        <div style={{ marginTop: 16 }}>
          <CourseSelect
            courses={courses}
            selected={course}
            onSelect={onPickCourse}
            countByCourse={(c) => items.filter((x) => x.course === normalizeCourse(c)).length}
          />

          {!course && (
            <div className="emptyState" style={{ marginTop: 14 }}>
              <div className="emptyState__big">Choose a course to start.</div>
              <div className="emptyState__sub">
                Your questions will show up right after you pick one.
              </div>
            </div>
          )}

          {course && deck.length === 0 && (
            <div className="emptyState" style={{ marginTop: 14 }}>
              <div className="emptyState__big">No cards found for “{course}”.</div>
              <div className="emptyState__sub">
                Either the backend returned none, or the course label doesn’t match.
              </div>
            </div>
          )}

          {course && deck.length > 0 && current && (
            <div className="deckWrap">
              <button
                className={`flipCard ${flipped ? "isFlipped" : ""}`}
                type="button"
                onClick={() => setFlipped((v) => !v)}
              >
                <div className="flipCard__inner">
                  <div className="flipCard__face flipCard__front">
                    <div className="flipCard__label">Question • {course}</div>
                    <div className="flipCard__big">{current.question}</div>
                    <div className="flipCard__hint">Tap to reveal</div>
                  </div>

                  <div className="flipCard__face flipCard__back">
                    <div className="flipCard__label">Answer</div>
                    <div className="flipCard__big">{current.answer}</div>

                    <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
                      <button
                        className="miniBtn"
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowReasoning((v) => !v);
                        }}
                      >
                        {showReasoning ? "Hide reasoning" : "Show reasoning"}
                      </button>

                      {showReasoning && (
                        <button
                          className="miniBtn"
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            learnMore();
                          }}
                          title="Opens Google in a new tab"
                        >
                          Learn more
                        </button>
                      )}

                      <button
                        className="miniBtn miniBtn--ghost"
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFlipped(false);
                          setShowReasoning(false);
                        }}
                      >
                        Back to question
                      </button>
                    </div>

                    {showReasoning && (
                      <div className="aiIdeal" style={{ marginTop: 12 }}>
                        <div className="aiIdeal__label">Reasoning</div>
                        <div className="aiIdeal__text">
                          {current.reasoning || "No reasoning provided."}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </button>

              <div className="deckControls">
                <button className="actionBtn actionBtn--ghost" type="button" onClick={prev}>
                  Prev
                </button>

                <div className="deckMeter">
                  <div className="deckMeter__top">
                    <span>
                      Card {index + 1} / {deck.length}
                    </span>
                    <span>{progress}%</span>
                  </div>
                  <div className="meterTrack">
                    <div className="meterFill" style={{ width: `${progress}%` }} />
                  </div>
                </div>

                <button className="actionBtn" type="button" onClick={next}>
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}