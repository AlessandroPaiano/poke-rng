import { useState } from 'react';

interface Props {
  darkMode: boolean;
  lessExplanations: boolean;
  onToggleDark: () => void;
  onToggleExplanations: () => void;
  onRestart: () => void;
}

export default function GameSettings({ darkMode, lessExplanations, onToggleDark, onToggleExplanations, onRestart }: Props) {
  const [showCredits, setShowCredits] = useState(false);

  return (
    <div className="w-full flex flex-wrap items-center gap-2 text-xs">
      <button
        onClick={onToggleDark}
        className="px-3 py-1.5 rounded-md bg-secondary text-secondary-foreground hover:opacity-80 transition"
      >
        {darkMode ? '☀️ Light' : '🌙 Dark'}
      </button>
      <button
        onClick={onToggleExplanations}
        className="px-3 py-1.5 rounded-md bg-secondary text-secondary-foreground hover:opacity-80 transition"
      >
        {lessExplanations ? '📖 More' : '📕 Less'} Info
      </button>
      <button
        onClick={onRestart}
        className="px-3 py-1.5 rounded-md bg-accent text-accent-foreground hover:opacity-80 transition"
      >
        🔄 Restart
      </button>
      <button
        onClick={() => setShowCredits(!showCredits)}
        className="px-3 py-1.5 rounded-md bg-secondary text-secondary-foreground hover:opacity-80 transition"
      >
        ℹ️ Credits
      </button>
      {showCredits && (
        <div className="w-full mt-1 p-2 rounded-md bg-card border border-border text-card-foreground">
          Pokémon RNG Run — Gen 1 Edition. Pokémon © Nintendo/Game Freak. Sprites from PokeAPI.
        </div>
      )}
    </div>
  );
}
