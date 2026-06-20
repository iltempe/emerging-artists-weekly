import { useEffect } from "react";
import Home from "./pages/Home";
import PlayerBar from "./components/PlayerBar";
import { config } from "./lib/config";
import { applyAccent } from "./lib/theme";

export default function App() {
  useEffect(() => {
    applyAccent(config.artist.accentColor);
    document.title = config.artist.name;
  }, []);

  return (
    <div className="min-h-dvh">
      <Home />
      <PlayerBar />
      <footer className="mx-auto max-w-3xl px-4 pb-28 pt-6 text-center text-xs text-dim">
        Sito di {config.artist.name} · creato con{" "}
        <a href="https://github.com/iltempe/emerging-artists-weekly" target="_blank" rel="noopener">
          OpenStage
        </a>
      </footer>
    </div>
  );
}
