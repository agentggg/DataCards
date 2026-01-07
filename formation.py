<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>DeckForge Uploader</title>
    <link rel="stylesheet" href="styles.css" />
  <style>
    :root{
      --bg: #0b0f17;
      --panel: rgba(255,255,255,0.06);
      --border: rgba(255,255,255,0.12);
      --text: rgba(255,255,255,0.92);
      --muted: rgba(255,255,255,0.68);
      --muted2: rgba(255,255,255,0.52);
      --accent: #ea5a28;
      --shadow: 0 18px 50px rgba(0,0,0,0.45);
      --radius-xl: 18px;
      --radius-lg: 14px;
      --radius-md: 12px;
      --font: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji";
      --mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
    }

    *{ box-sizing: border-box; }
    html,body{ height:100%; }
    body{
      margin:0;
      font-family: var(--font);
      color: var(--text);
      background:
        radial-gradient(1200px 800px at 20% 0%, rgba(234,90,40,0.14), transparent 55%),
        radial-gradient(900px 700px at 85% 20%, rgba(120,170,255,0.10), transparent 60%),
        var(--bg);
    }

    .app{ min-height:100%; display:flex; flex-direction:column; }

    .topbar{
      border-bottom: 1px solid var(--border);
      backdrop-filter: blur(10px);
      background: rgba(15, 20, 30, 0.55);
    }

    .brand{
      max-width: 980px;
      margin: 0 auto;
      padding: 18px 16px;
      display:flex;
      align-items:center;
      gap:14px;
    }

    .logo{
      width:44px;
      height:44px;
      border-radius: 14px;
      display:grid;
      place-items:center;
      font-weight: 800;
      letter-spacing: 0.5px;
      background: linear-gradient(135deg, rgba(234,90,40,0.95), rgba(234,90,40,0.55));
      box-shadow: 0 12px 30px rgba(234,90,40,0.18);
      user-select:none;
    }

    .brand-text h1{
      margin:0;
      font-size: 16px;
      line-height: 1.2;
      letter-spacing: 0.3px;
    }

    .brand-text p{
      margin:4px 0 0;
      color: var(--muted);
      font-size: 13px;
    }

    .container{
      width:100%;
      max-width: 980px;
      margin: 0 auto;
      padding: 18px 16px 26px;
      display:grid;
      grid-template-columns: 1fr;
      gap: 16px;
    }

    .card{
      border: 1px solid var(--border);
      background: linear-gradient(180deg, var(--panel), rgba(255,255,255,0.04));
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow);
      padding: 20px;
      overflow:hidden;
    }

    .card-header{ margin-bottom: 12px; }

    .card-header h2{
      margin: 0 0 6px;
      font-size: 15px;
      letter-spacing: 0.2px;
    }

    .muted{ color: var(--muted); }

    .card-header p{
      margin:0;
      font-size: 13px;
      color: var(--muted);
    }

    code{
      font-family: var(--mono);
      font-size: 0.95em;
      color: rgba(255,255,255,0.86);
      background: rgba(255,255,255,0.08);
      border: 1px solid rgba(255,255,255,0.10);
      padding: 2px 6px;
      border-radius: 10px;
    }

    .grid{
      display:grid;
      grid-template-columns: 1fr;
      gap: 12px;
      margin-bottom: 12px;
    }

    .field{ display:flex; flex-direction:column; gap: 7px; }

    label{ font-size: 12px; color: rgba(255,255,255,0.78); }

    .hint{ color: var(--muted2); font-size: 12px; line-height: 1.35; }

    input, textarea, select{
      width:100%;
      color: var(--text);
      background: rgba(10, 14, 22, 0.55);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      padding: 12px 12px;
      outline: none;
      transition: border-color 160ms ease, box-shadow 160ms ease, transform 160ms ease;
    }

    input::placeholder, textarea::placeholder{ color: rgba(255,255,255,0.35); }

    input:focus, textarea:focus, select:focus{
      border-color: rgba(234,90,40,0.60);
      box-shadow: 0 0 0 4px rgba(234,90,40,0.18);
    }

    textarea{
      min-height: 520px;
      resize: vertical;
      font-family: var(--mono);
      font-size: 12px;
      line-height: 1.55;
      padding: 14px;
    }

    .meta-row{ display:flex; flex-wrap:wrap; gap:8px; margin-top: 8px; }

    .chip{
      display:inline-flex;
      align-items:center;
      gap:8px;
      padding: 8px 10px;
      border-radius: 999px;
      border: 1px solid var(--border);
      background: rgba(255,255,255,0.06);
      color: rgba(255,255,255,0.78);
      font-size: 12px;
    }

    .chip--soft{ background: rgba(234,90,40,0.10); border-color: rgba(234,90,40,0.22); }

    .actions{ display:flex; flex-wrap:wrap; gap:10px; margin-top: 14px; }

    .btn{
      appearance:none;
      border: 1px solid var(--border);
      background: rgba(255,255,255,0.06);
      color: var(--text);
      border-radius: 999px;
      padding: 10px 14px;
      font-size: 13px;
      cursor:pointer;
      transition: transform 140ms ease, background 140ms ease, border-color 140ms ease, box-shadow 140ms ease;
    }

    .btn:hover{ transform: translateY(-1px); background: rgba(255,255,255,0.09); }
    .btn:active{ transform: translateY(0px); }

    .btn--ghost{ background: rgba(255,255,255,0.04); }

    .btn--primary{
      border-color: rgba(234,90,40,0.40);
      background: linear-gradient(135deg, rgba(234,90,40,0.95), rgba(234,90,40,0.55));
      box-shadow: 0 14px 30px rgba(234,90,40,0.16);
    }

    .btn--primary:hover{ box-shadow: 0 18px 45px rgba(234,90,40,0.22); }

    .divider{ height:1px; background: var(--border); margin: 18px 0; }

    .status{ display:grid; grid-template-columns: 1fr; gap: 10px; }

    .status-box{
      border: 1px solid var(--border);
      background: rgba(255,255,255,0.05);
      border-radius: var(--radius-lg);
      padding: 12px 12px;
      font-size: 13px;
    }

    .status-box strong{ display:inline-block; margin-right: 6px; color: rgba(255,255,255,0.86); }

    #statusBox[data-type="loading"]{ border-color: rgba(234,90,40,0.35); background: rgba(234,90,40,0.08); }
    #statusBox[data-type="success"]{ border-color: rgba(90, 200, 120, 0.35); background: rgba(90, 200, 120, 0.08); }
    #statusBox[data-type="error"]{ border-color: rgba(255, 90, 90, 0.40); background: rgba(255, 90, 90, 0.08); }
    #statusBox[data-type="info"]{ border-color: rgba(140, 170, 255, 0.35); background: rgba(140, 170, 255, 0.08); }

    .preview{
      margin-top: 14px;
      border: 1px solid var(--border);
      background: rgba(255,255,255,0.04);
      border-radius: var(--radius-lg);
      padding: 12px;
    }

    .preview-head{ display:flex; justify-content: space-between; align-items: baseline; margin-bottom: 10px; gap: 12px; }

    .preview-list{
      list-style: none;
      margin: 0;
      padding: 0;
      display:flex;
      flex-direction:column;
      gap:10px;
    }

    .preview-item{
      border: 1px solid rgba(255,255,255,0.10);
      background: rgba(10, 14, 22, 0.55);
      border-radius: 14px;
      padding: 12px;
    }

    .preview-top{ display:flex; justify-content: space-between; align-items:center; gap:10px; margin-bottom: 8px; }

    .badge{
      display:inline-flex;
      align-items:center;
      padding: 6px 10px;
      border-radius: 999px;
      border: 1px solid rgba(234,90,40,0.22);
      background: rgba(234,90,40,0.10);
      font-size: 12px;
      color: rgba(255,255,255,0.86);
      max-width: 100%;
    }

    .idx{ font-family: var(--mono); font-size: 12px; color: rgba(255,255,255,0.55); }

    .preview-item .q{ font-weight: 700; margin: 4px 0 8px; color: rgba(255,255,255,0.92); }

    .preview-item .a, .preview-item .r{
      font-size: 12.5px;
      color: rgba(255,255,255,0.78);
      line-height: 1.45;
      margin: 4px 0 0;
      word-break: break-word;
    }

    .preview-item .a span, .preview-item .r span{ color: rgba(255,255,255,0.92); font-weight: 700; }

    .help-card[hidden]{ display:none; }

    .codeblock{
      border: 1px solid rgba(255,255,255,0.12);
      background: rgba(10, 14, 22, 0.60);
      border-radius: var(--radius-lg);
      padding: 12px;
      overflow:auto;
    }

    .codeblock pre{ margin:0; font-family: var(--mono); font-size: 12px; line-height: 1.55; color: rgba(255,255,255,0.84); }

    .note{
      margin-top: 14px;
      padding: 14px;
      border-radius: var(--radius-lg);
      border: 1px solid rgba(234,90,40,0.18);
      background: rgba(234,90,40,0.08);
    }

    .note h3{ margin:0 0 8px; font-size: 13px; }

    .note ul{ margin:0; padding-left: 18px; color: rgba(255,255,255,0.80); font-size: 13px; line-height: 1.55; }

    .footer{
      margin-top:auto;
      padding: 16px;
      text-align:center;
      color: var(--muted2);
      font-size: 12px;
      border-top: 1px solid rgba(255,255,255,0.08);
      background: rgba(15, 20, 30, 0.35);
    }

    @media (max-width: 620px){
      textarea{ min-height: 460px; }
      .card{ padding: 16px; }
    }
  </style>
  </head>
  <body>
    <div class="app">
      <header class="topbar">
        <div class="brand">
          <div class="logo">DF</div>
          <div class="brand-text">
            <h1>DeckForge Uploader</h1>
            <p>Bulk-submit JSON flashcard arrays to your API.</p>
          </div>
        </div>
      </header>

      <main class="container" role="main">
        <form id="flashcardForm" class="card" autocomplete="off" spellcheck="false" novalidate>
          <div class="card-header">
            <h2>Flashcard JSON</h2>
            <p class="muted">Paste your JSON array of flashcards here.</p>
          </div>

          <div class="grid">
            <div class="field">
              <label for="endpointSelect">Backend environment</label>
              <select id="endpointSelect" name="endpointSelect" required>
                <option value="" disabled selected>Select an endpoint…</option>
                <option value="http://localhost:8000">Dev (localhost:8000)</option>
                <option value="https://big-gave-coordination-length.trycloudflare.com">Fireon6 (Cloudflare)</option>
                <option value="https://ict-agentofgod.pythonanywhere.com">Python Server (PythonAnywhere)</option>
              </select>
              <small class="hint">This selection determines where your JSON will be POSTed.</small>
            </div>
          </div>

          <div class="field">
            <textarea
              id="jsonInput"
              name="jsonInput"
              placeholder='[{"q":"Question?","a":"Answer."}]'
              spellcheck="false"
              required
            ></textarea>
          </div>

          <div class="actions">
            <button id="btnValidate" type="button" class="btn btn--ghost">Validate JSON</button>
            <button id="btnPreview" type="button" class="btn btn--ghost">Preview Cards</button>
            <button id="btnHelp" type="button" class="btn btn--ghost">Help</button>
            <button id="btnSend" type="submit" class="btn btn--primary">Submit</button>
          </div>

          <div id="statusBox" class="status-box" aria-live="polite" role="status"></div>

          <div id="preview" class="preview" aria-live="polite" role="region" aria-label="Flashcard preview"></div>
        </form>

      <section class="card help-card" id="helpCard" hidden>
        <div class="card-header">
          <h2>Help &amp; Schema</h2>
          <p class="muted">Click Help again to hide this panel.</p>
        </div>

        <div class="codeblock">
          <pre>{
  "q": "Question text",
  "a": "Answer text",
  "r": "Optional rationale",
  "tags": ["optional", "tags"]
}</pre>
        </div>

        <div class="note">
          <h3>Notes</h3>
          <ul>
            <li>Each item must have <code>q</code> and <code>a</code> fields.</li>
            <li><code>r</code> and <code>tags</code> are optional.</li>
            <li>Submit an array of such objects.</li>
          </ul>
        </div>
      </section>
      </main>

      <footer class="footer">
        &copy; 2024 DeckForge
      </footer>
    </div>

    <script>
      (() => {
        "use strict";

        function $(id) {
          return document.getElementById(id);
        }

        function setStatus(type, title, message) {
          const box = $("statusBox");
          box.dataset.type = type;
          box.innerHTML = `<strong>${title}</strong> ${message}`;
        }

        function tryParseJSON(jsonString) {
          try {
            const o = JSON.parse(jsonString);
            if (o && typeof o === "object") {
              return { valid: true, value: o };
            }
          } catch (e) {}
          return { valid: false, value: null };
        }

        function validateFlashcardsArray(arr) {
          if (!Array.isArray(arr)) return false;
          for (const item of arr) {
            if (
              typeof item !== "object" ||
              item === null ||
              typeof item.q !== "string" ||
              typeof item.a !== "string"
            ) {
              return false;
            }
          }
          return true;
        }

        function readAndValidatePayload() {
          const jsonInput = $("jsonInput").value.trim();
          if (!jsonInput) {
            setStatus("error", "Empty input", "Please paste your JSON flashcard array.");
            return null;
          }

          const parsed = tryParseJSON(jsonInput);
          if (!parsed.valid) {
            setStatus("error", "Invalid JSON", "Please enter valid JSON.");
            return null;
          }

          const arr = parsed.value;

          const valid = validateFlashcardsArray(arr);
          if (!valid) {
            setStatus("error", "Invalid flashcard data", "Each item must be an object with string fields 'q' and 'a'.");
            return null;
          }

          setStatus("success", "Valid JSON", `Parsed ${arr.length} flashcard(s).`);
          return arr;
        }

        function previewCards(cards) {
          const preview = $("preview");
          if (!cards || cards.length === 0) {
            preview.innerHTML = "<p>No cards to preview.</p>";
            return;
          }
          const listItems = cards.map((card, i) => {
            const rationaleHtml = card.r ? `<div class="r"><span>Rationale:</span> ${card.r}</div>` : "";
            const tagsHtml = Array.isArray(card.tags) && card.tags.length > 0
              ? `<div class="tags"><span>Tags:</span> ${card.tags.join(", ")}</div>`
              : "";
            return `
              <li class="preview-item">
                <div class="preview-top">
                  <span class="idx">#${i + 1}</span>
                  ${tagsHtml}
                </div>
                <div class="q">${card.q}</div>
                <div class="a"><span>Answer:</span> ${card.a}</div>
                ${rationaleHtml}
              </li>
            `;
          }).join("");
          preview.innerHTML = `<ul class="preview-list">${listItems}</ul>`;
        }

        document.addEventListener("DOMContentLoaded", () => {
          const form = $("flashcardForm");
          const validateBtn = $("btnValidate");
          const previewBtn = $("btnPreview");
          const helpBtn = $("btnHelp");
          const sendBtn = $("btnSend");

          const helpCard = $("helpCard");
          helpBtn.addEventListener("click", () => {
            const isHidden = helpCard.hasAttribute("hidden");
            if (isHidden) {
              helpCard.removeAttribute("hidden");
              setStatus("info", "Help opened", "Schema and notes are now visible below.");
            } else {
              helpCard.setAttribute("hidden", "");
              setStatus("info", "Help closed", "Schema and notes are hidden.");
            }
          });

          validateBtn.addEventListener("click", () => {
            readAndValidatePayload();
          });

          previewBtn.addEventListener("click", () => {
            const cards = readAndValidatePayload();
            if (cards) {
              previewCards(cards);
            }
          });

          form.addEventListener("submit", async (evt) => {
            evt.preventDefault();

            const endpoint = String($("endpointSelect").value || "").trim();
            if (!endpoint) return setStatus("error", "Missing endpoint", "Select a backend environment.");

            const cards = readAndValidatePayload();
            if (!cards) return;

            setStatus("loading", "Sending", `POSTing ${cards.length} flashcard(s) to backend...`);

            try {
              const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(cards),
              });
              if (!response.ok) {
                const text = await response.text();
                setStatus("error", `Error ${response.status}`, text || "Unknown error");
                return;
              }
              setStatus("success", "Success", "Flashcards uploaded successfully.");
            } catch (err) {
              setStatus("error", "Network error", err.message || "Failed to send flashcards.");
            }
          });
        });
      })();
    </script>
  </body>
</html>
