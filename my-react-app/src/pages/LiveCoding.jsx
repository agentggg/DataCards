import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const CHALLENGES = [
  {
    title: "Reverse a string",
    prompt: "Write a function reverseStr(s) that returns the reversed string.",
    tests: [
      { input: "hello", output: "olleh" },
      { input: "abc", output: "cba" },
    ],
    starter: `function reverseStr(s) {
  // your code
}`,
    hint: "Split → reverse → join is a classic, but loops are welcome too.",
  },
  {
    title: "Sum an array",
    prompt: "Write a function sumArr(arr) that returns the sum of numbers.",
    tests: [
      { input: [1, 2, 3], output: 6 },
      { input: [10, -2], output: 8 },
    ],
    starter: `function sumArr(arr) {
  // your code
}`,
    hint: "reduce is clean. A loop is fine too.",
  },
];

function safeRun(code, fnName, arg) {
  // Minimal sandbox-ish approach: new Function. For real apps, use a sandbox/worker.
  const wrapped = `
"use strict";
${code}
return (typeof ${fnName} === "function") ? ${fnName} : null;
`;
  const fn = new Function(wrapped)();
  if (!fn) return { ok: false, error: `Could not find function named ${fnName}()` };
  try {
    const result = fn(arg);
    return { ok: true, result };
  } catch (e) {
    return { ok: false, error: String(e?.message || e) };
  }
}

export default function LiveCoding() {
  const [idx, setIdx] = useState(0);
  const [code, setCode] = useState(CHALLENGES[0].starter);
  const [report, setReport] = useState(null);

  const c = useMemo(() => CHALLENGES[idx], [idx]);

  function run() {
    const fnName = idx === 0 ? "reverseStr" : "sumArr";
    const results = c.tests.map((t) => {
      const r = safeRun(code, fnName, t.input);
      if (!r.ok) return { pass: false, input: t.input, expected: t.output, got: r.error, error: true };
      const pass = JSON.stringify(r.result) === JSON.stringify(t.output);
      return { pass, input: t.input, expected: t.output, got: r.result, error: false };
    });
    setReport(results);
  }

  function next() {
    const nextIdx = (idx + 1) % CHALLENGES.length;
    setIdx(nextIdx);
    setCode(CHALLENGES[nextIdx].starter);
    setReport(null);
  }

  const passedCount = report ? report.filter((x) => x.pass).length : 0;

  return (
    <div className="page">
      <div className="pageHeader">
        <div>
          <div className="kicker">Code Mode</div>
          <h2 className="pageTitle">Live Coding Flashcards</h2>
          <p className="pageSub">Tiny challenges. Instant feedback. Your keyboard is the gym.</p>
        </div>
        <Link className="backLink" to="/">← Home</Link>
      </div>

      <div className="codeLayout">
        <div className="codeLeft">
          <div className="codeCard">
            <div className="codeCard__top">
              <div className="codeTitle">{c.title}</div>
              <div className="codeHint">{c.hint}</div>
            </div>
            <div className="codePrompt">{c.prompt}</div>

            <textarea
              className="codeEditor"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
            />

            <div className="codeActions">
              <button className="actionBtn" type="button" onClick={run}>Run Tests</button>
              <button className="actionBtn actionBtn--ghost" type="button" onClick={next}>Next</button>
            </div>
          </div>
        </div>

        <div className="codeRight">
          <div className="resultCard">
            <div className="resultCard__top">
              <div className="resultTitle">Results</div>
              {report && (
                <div className="scorePill">{passedCount}/{report.length} passed</div>
              )}
            </div>

            {!report ? (
              <div className="emptyState">
                <div className="emptyState__big">Run tests when ready.</div>
                <div className="emptyState__sub">If it fails, good. That means it’s teaching you.</div>
              </div>
            ) : (
              <div className="resultList">
                {report.map((r, n) => (
                  <div key={n} className={`resultRow ${r.pass ? "isPass" : "isFail"}`}>
                    <div className="resultBadge">{r.pass ? "PASS" : "FAIL"}</div>
                    <div className="resultBody">
                      <div className="resultLine">
                        <span className="muted">Input:</span> {JSON.stringify(r.input)}
                      </div>
                      <div className="resultLine">
                        <span className="muted">Expected:</span> {JSON.stringify(r.expected)}
                      </div>
                      <div className="resultLine">
                        <span className="muted">Got:</span> {typeof r.got === "string" ? r.got : JSON.stringify(r.got)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="miniNote">
            Note: this “run” uses <span className="mono">new Function</span> for a simple demo.
            For production, move execution into a sandboxed worker or backend.
          </div>
        </div>
      </div>
    </div>
  );
}