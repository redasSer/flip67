import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Lobby from "./pages/Lobby";
import GamePage from "./pages/GamePage";
import { useRestoreSession } from "./hooks/useGameMutations";

function SessionRestorer() {
  useRestoreSession();
  return null;
}

function App() {
  return (
    <BrowserRouter>
      <SessionRestorer />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/lobby" element={<Lobby />} />
        <Route path="/game" element={<GamePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
