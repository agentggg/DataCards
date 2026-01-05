import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import CourseSelect from "../flashcards/components/CourseSelect";

// List endpoint: returns array of cards with {id, language, question, official_answer, ...}

// Grade endpoint: POST { id, answer } -> { grade_check: [...], answer: "..." }
// const AI_FLASHCARD_GRADE_ENDPOINT = "http://localhost:8000/grade_ai_answers";
// const AI_FLASHCARD_LIST_ENDPOINT = "http://localhost:8000/get_ai_questions";

const AI_FLASHCARD_GRADE_ENDPOINT = "https://big-gave-coordination-length.trycloudflare.com/grade_ai_answers";
const AI_FLASHCARD_LIST_ENDPOINT = "https://big-gave-coordination-length.trycloudflare.com/get_ai_questions";

function normalizeLang(v) {
  return String(v || "").trim().toLowerCase();
}
 
function normalizeLevel(v) {
  const l = String(v || "").trim().toLowerCase();
  return l || "medium";
}

function levelClass(level) {
  const l = normalizeLevel(level);
  if (l === "awesome") return "tag tag--awesome";
  if (l === "high") return "tag tag--high";
  if (l === "medium") return "tag tag--medium";
  if (l === "low") return "tag tag--low";
  if (l === "fail") return "tag tag--fail";
  return "tag";
}

function buildGoogleLearnMoreUrl({ language, question }) {
  const q = `${String(language || "").trim()} ${String(question || "").trim()}`.trim();
  return `https://www.google.com/search?q=${encodeURIComponent(q)}`;
}

function shuffleArray(arr) {
  const a = Array.isArray(arr) ? [...arr] : [];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function AiFlashcardMode() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [items, setItems] = useState([]);

  const [language, setLanguage] = useState("");
  const [index, setIndex] = useState(0);

  const [typed, setTyped] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [gradeResult, setGradeResult] = useState(null);
  const [gradeErr, setGradeErr] = useState("");
  const [deckSeed, setDeckSeed] = useState(0);

  async function loadAll() {
    setLoading(true);
    setErr("");

    try {
      const res = await axios.get(AI_FLASHCARD_LIST_ENDPOINT, {
        headers: { "Content-Type": "application/json" },
      });

      const data = Array.isArray(res.data) ? res.data : res.data?.results || [];
      const cleaned = (Array.isArray(data) ? data : [])
        .map((x) => ({
          id: x.id,
          language: normalizeLang(x.language),
          question: String(x.question || "").trim(),
          official_answer: String(x.official_answer || "").trim(),
          require_keypoints: x.require_keypoints,
          pass_score: x.pass_score,
        }))
        .filter((x) => x.id != null && x.language && x.question);

      setItems(cleaned);
      // reshuffle deck order whenever we reload from the backend
      setDeckSeed((s) => s + 1);
    } catch (e) {
      setErr(
        e?.response?.data?.error ||
          e?.message ||
          "Could not load ModelQ AI Flashcards. Check endpoint + server."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  const languages = useMemo(() => {
    const set = new Set(items.map((x) => x.language).filter(Boolean));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [items]);

  const deck = useMemo(() => {
    const l = normalizeLang(language);
    const filtered = items.filter((x) => x.language === l);

    // stable shuffle: only changes when items/language change or deckSeed increments
    return shuffleArray(filtered);
  }, [items, language, deckSeed]);

  const current = deck[index] || null;
  const progress = deck.length ? Math.round(((index + 1) / deck.length) * 100) : 0;

  useEffect(() => {
    if (!deck.length) return;
    if (index >= deck.length) setIndex(0);
  }, [deck.length]);

  function resetQuestionState() {
    setTyped("");
    setGradeResult(null);
    setGradeErr("");
  }

  function onPickLanguage(nextLang) {
    setLanguage(nextLang);
    setIndex(0);
    // reshuffle the deck each time a new language is selected
    setDeckSeed((s) => s + 1);
    resetQuestionState();
  }

  function next() {
    if (!deck.length) return;
    setIndex((v) => (v + 1) % deck.length);
    resetQuestionState();
  }

  function prev() {
    if (!deck.length) return;
    setIndex((v) => (v - 1 + deck.length) % deck.length);
    resetQuestionState();
  }

  function learnMore() {
    if (!current) return;
    const url = buildGoogleLearnMoreUrl({ language, question: current.question });
    window.open(url, "_blank", "noopener,noreferrer");
  }

  async function submitAnswer() {
    if (!current) return;

    const answerToSend = String(typed || "").trim();
    if (!answerToSend) {
      setGradeErr("Type an answer first.");
      return;
    }

    setSubmitting(true);
    setGradeErr("");
    setGradeResult(null);

    try {
      const res = await axios.post(
        AI_FLASHCARD_GRADE_ENDPOINT,
        { id: current.id, answer: answerToSend },
        { headers: { "Content-Type": "application/json" } }
      );

      setGradeResult(res.data || null);
    } catch (e) {
      setGradeErr(
        e?.response?.data?.error ||
          e?.message ||
          "Could not submit your answer. Check endpoint + server."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page">
      <div className="pageHeader">
        <div>
          <div className="kicker">AI Mode</div>
          <h2 className="pageTitle">ModelQ AI Flashcards</h2>
          <p className="pageSub">
            Pick a language, answer in your own words, then get a breakdown by model.
          </p>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button className="backLink" type="button" onClick={loadAll}>
            Refresh
          </button>
          <Link className="backLink" to="/">
            ← Home
          </Link>
        </div>
      </div>

      {loading && (
        <div className="emptyState" style={{ marginTop: 16 }}>
          <div className="emptyState__big">Loading ModelQ AI Flashcards…</div>
          <div className="emptyState__sub">Pulling the latest questions.</div>
        </div>
      )}

      {!loading && err && (
        <div className="emptyState" style={{ marginTop: 16 }}>
          <div className="emptyState__big">Could not load ModelQ AI Flashcards</div>
          <div className="emptyState__sub">{err}</div>
          <div style={{ marginTop: 12, display: "flex", gap: 10 }}>
            <button className="actionBtn" type="button" onClick={loadAll}>
              Try Again
            </button>
          </div>
        </div>
      )}

      {!loading && !err && (
        <div style={{ marginTop: 16 }}>
          {/* Reuse your CourseSelect as a Language select */}
          <CourseSelect
            courses={languages}
            selected={language}
            onSelect={onPickLanguage}
            countByCourse={(l) => items.filter((x) => x.language === normalizeLang(l)).length}
          />

          {!language && (
            <div className="emptyState" style={{ marginTop: 14 }}>
              <div className="emptyState__big">Choose a language to start.</div>
              <div className="emptyState__sub">
                You’ll answer questions and see grading feedback instantly.
              </div>
            </div>
          )}

          {language && deck.length === 0 && (
            <div className="emptyState" style={{ marginTop: 14 }}>
              <div className="emptyState__big">No questions found for “{language}”.</div>
              <div className="emptyState__sub">
                Either the backend returned none, or the language label doesn’t match.
              </div>
            </div>
          )}

          {language && deck.length > 0 && current && (
            <div className="aiPanel">
              {/* Question */}
              <div className="aiPrompt">
                <div className="aiPrompt__label">Question • {language}</div>
                <div className="aiPrompt__text">{current.question}</div>

                <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button className="miniBtn" type="button" onClick={learnMore}>
                    Learn more
                  </button>
                </div>

                <div className="miniNote" style={{ marginTop: 12 }}>
                  Passing score: <span className="mono">{String(current.pass_score ?? "")}</span>{" "}
                  • Required keypoints: <span className="mono">{String(current.require_keypoints ?? "")}</span>
                </div>
              </div>

              {/* Answer input */}
              <div className="aiAnswer">
                <div className="aiAnswer__label">Your answer</div>
                <textarea
                  className="aiTextarea"
                  value={typed}
                  onChange={(e) => setTyped(e.target.value)}
                  placeholder="Type your answer here..."
                />

                <div className="aiActions">
                  <button
                    className="actionBtn actionBtn--ghost"
                    type="button"
                    disabled={submitting}
                    onClick={resetQuestionState}
                  >
                    Clear
                  </button>

                  <button
                    className="actionBtn"
                    type="button"
                    disabled={submitting || !String(typed || "").trim()}
                    onClick={submitAnswer}
                  >
                    {submitting ? "Submitting..." : "Submit answer"}
                  </button>
                </div>

                {gradeErr && (
                  <div className="miniNote" style={{ marginTop: 10, borderColor: "rgba(239,68,68,0.35)" }}>
                    {gradeErr}
                  </div>
                )}
              </div>

              {/* Results */}
              <div className="aiResult">
                <div className="aiResult__top">
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                    <span className="tag">Results</span>
                    <span className="scorePill">
                      Card {index + 1} / {deck.length} • {progress}%
                    </span>
                  </div>

                  <div style={{ display: "flex", gap: 10 }}>
                    <button className="actionBtn actionBtn--ghost" type="button" onClick={prev}>
                      Prev
                    </button>
                    <button className="actionBtn" type="button" onClick={next}>
                      Next
                    </button>
                  </div>
                </div>

                {!gradeResult && (
                  <div className="emptyState" style={{ marginTop: 12 }}>
                    <div className="emptyState__big">Submit an answer to see feedback.</div>
                    <div className="emptyState__sub">
                      You’ll see each model result plus the official/ideal answer.
                    </div>
                  </div>
                )}

                {gradeResult && (
                  <>
                    <div className="resultList" style={{ marginTop: 12 }}>
                      {(Array.isArray(gradeResult.grade_check) ? gradeResult.grade_check : []).map((row, i) => (
                        <div
                          key={`${row?.model || "model"}-${i}`}
                          className="resultRow"
                        >
                          <div className="resultHead">
                            <div className="resultModel">{row?.model || "Model"}</div>
                            <span className={levelClass(row?.level)}>{normalizeLevel(row?.level)}</span>
                          </div>

                          <div className="resultBody">
                            <div className="resultLine">{row?.message || "No message."}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Official answer area */}
                    <div className="aiIdeal" style={{ marginTop: 14 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                        <div className="aiIdeal__label">Official answer</div>
                        <button
                          className="miniBtn"
                          type="button"
                          onClick={() => {
                            const q = `${language} ${current.question} ${String(
                              gradeResult.answer || current.official_answer || ""
                            ).trim()}`.trim();
                            window.open(
                              `https://www.google.com/search?q=${encodeURIComponent(q)}`,
                              "_blank",
                              "noopener,noreferrer"
                            );
                          }}
                        >
                          Learn more
                        </button>
                      </div>

                      <div className="aiIdeal__text">
                        {gradeResult.answer || current.official_answer || "No official answer returned."}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}