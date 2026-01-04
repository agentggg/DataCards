import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home.jsx";
import FlashcardMode from "./features/flashcards/FlashcardMode.jsx";
import AiFlashcardMode from "./features/aiFlashcards/AiFlashcardMode.jsx";
import LiveCoding from "./pages/LiveCoding.jsx";

function TopGlow() {
  const location = useLocation();
  const map = {
    "/": "Home",
    "/flashcards": "Flashcards",
    "/ai-flashcards": "AI Flashcards",
    "/live-coding": "Live Coding",
  };
  const label = map[location.pathname] ?? "Learn Mode";

  return (
    <div className="topbar">
      <div className="topbar__left">
        <div className="logoMark" aria-hidden="true">
          <span className="logoOrb" />
          <span className="logoOrb logoOrb--2" />
          <span className="logoOrb logoOrb--3" />
        </div>
        <div className="topbar__brand">
          <div className="topbar__title">Study Arcade</div>
          <div className="topbar__subtitle">{label}</div>
        </div>
      </div>

      <div className="topbar__right">
        <div className="pill">
          <span className="pillDot" />
          <span className="pillText">Brain cells online</span>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div className="appShell">
      <TopGlow />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/flashcards" element={<FlashcardMode />} />
        <Route path="/ai-flashcards" element={<AiFlashcardMode />} />
        <Route path="/live-coding" element={<LiveCoding />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <div className="footer">
        <span className="footer__left">Tip: pick a mode and don’t be afraid to be wrong.</span>
        <span className="footer__right">v1.0</span>
      </div>
    </div>
  ); 
}