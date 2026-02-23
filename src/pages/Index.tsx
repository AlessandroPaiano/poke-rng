import { useGameState } from '@/hooks/useGameState';
import SpinWheel from '@/components/game/SpinWheel';
import PartyDisplay from '@/components/game/PartyDisplay';
import RunLog from '@/components/game/RunLog';
import GameSettings from '@/components/game/GameSettings';
import ItemsPanel from '@/components/game/ItemsPanel';
import { TYPE_COLORS } from '@/data/types';
import { STAGES } from '@/data/stages';

const Index = () => {
  const { state, processResult, restart, toggleDark, toggleExplanations } = useGameState();
  const isEnd = state.wheelMode === 'victory' || state.wheelMode === 'gameOver';
  const stage = STAGES[state.stageIndex];

  return (
    <div className="min-h-screen bg-background flex justify-center">
      <div className="w-full max-w-md flex flex-col items-center gap-4 p-4 pb-8">
        {/* Title */}
        <h1 className="text-xl font-black tracking-tight text-primary">
          ⚡ Pokémon RNG Run
        </h1>

        {/* Settings */}
        <GameSettings
          darkMode={state.darkMode}
          lessExplanations={state.lessExplanations}
          onToggleDark={toggleDark}
          onToggleExplanations={toggleExplanations}
          onRestart={restart}
        />

        {/* Progress bar */}
        <div className="w-full">
          <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
            <span>Progress</span>
            <span>{state.stageIndex}/{STAGES.length}</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${(state.stageIndex / STAGES.length) * 100}%` }}
            />
          </div>
          <div className="flex gap-0.5 mt-1">
            {STAGES.map((st, i) => (
              <div
                key={i}
                className="flex-1 h-1 rounded-full transition-all"
                style={{
                  backgroundColor: i < state.stageIndex
                    ? TYPE_COLORS[st.type]
                    : i === state.stageIndex && !isEnd
                    ? TYPE_COLORS[st.type] + '80'
                    : 'hsl(var(--muted))',
                }}
                title={`${st.name} (${st.type})`}
              />
            ))}
          </div>
        </div>

        {/* Phase Label */}
        <div className="text-center">
          <h2 className="text-lg font-bold text-foreground">{state.phaseLabel}</h2>
          {stage && state.wheelMode === 'battle' && (
            <span
              className="text-xs px-2 py-0.5 rounded-full font-semibold inline-block mt-1"
              style={{ backgroundColor: TYPE_COLORS[stage.type] + '30', color: TYPE_COLORS[stage.type] }}
            >
              {stage.type} Type
            </span>
          )}
        </div>

        {/* Win Chance + Items */}
        <ItemsPanel
          items={state.items}
          trainBonus={state.trainBonus}
          luckyCharm={state.luckyCharm}
          typeShield={state.typeShield}
          winChance={state.winChance}
        />

        {/* Wheel or End Screen */}
        {!isEnd ? (
          <SpinWheel
            segments={state.segments}
            onResult={processResult}
          />
        ) : (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">{state.wheelMode === 'victory' ? '🏆' : '💀'}</div>
            <p className="text-lg font-bold text-foreground mb-4">
              {state.wheelMode === 'victory'
                ? 'You became the Pokémon Champion!'
                : `Defeated at stage ${state.stageIndex + 1}`}
            </p>
            <button
              onClick={restart}
              className="px-6 py-3 rounded-full font-bold bg-primary text-primary-foreground hover:scale-105 transition glow-primary"
            >
              🔄 New Run
            </button>
          </div>
        )}

        {/* Party */}
        <PartyDisplay party={state.party} bonusSlot={state.bonusSlot} />

        {/* Log */}
        <RunLog log={state.log} lessExplanations={state.lessExplanations} />
      </div>
    </div>
  );
};

export default Index;
