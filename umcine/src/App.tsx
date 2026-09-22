import { createContext, useContext, useState } from "react";

type StudyMode = "focus" | "break";

const StudyModeContext = createContext<StudyMode>("focus");

function StudyModeStatus() {
  const mode = useContext(StudyModeContext);

  return <p>현재 모드: {mode === "focus" ? "집중" : "휴식"}</p>;
}

export default function App() {
  const [mode, setMode] = useState<StudyMode>("focus");

  function handleToggleMode() {
    setMode((currentMode) => (currentMode === "focus" ? "break" : "focus"));
  }

  return (
    <StudyModeContext value={mode}>
      <StudyModeStatus />
      <button onClick={handleToggleMode}>모드 바꾸기</button>
    </StudyModeContext>
  );
}