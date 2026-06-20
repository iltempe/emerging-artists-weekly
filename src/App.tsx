import { Routes, Route, Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import PlayerBar from "./components/PlayerBar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ArtistPage from "./pages/ArtistPage";

function Layout() {
  return (
    <div className="min-h-dvh pb-24">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <PlayerBar />
      <footer className="mx-auto max-w-5xl px-4 py-10 text-center text-xs text-dim">
        OpenStage — progetto open source ·{" "}
        <a href="https://github.com/iltempe/emerging-artists-weekly" target="_blank" rel="noopener">
          GitHub
        </a>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        {/* /@slug — react-router non supporta param parziali, cattura il segmento intero */}
        <Route path="/:handle" element={<ArtistPage />} />
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  );
}
