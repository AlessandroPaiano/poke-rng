interface Props {
  items: string[];
  trainBonus: number;
  luckyCharm: boolean;
  typeShield: boolean;
  winChance: number | null;
}

export default function ItemsPanel({ items, trainBonus, luckyCharm, typeShield, winChance }: Props) {
  const activeEffects: string[] = [];
  if (trainBonus > 0) activeEffects.push(`💪 Training +${trainBonus}%`);
  if (luckyCharm) activeEffects.push('🍀 Lucky Charm');
  if (typeShield) activeEffects.push('🛡️ Type Shield');

  if (activeEffects.length === 0 && items.length === 0 && winChance === null) return null;

  return (
    <div className="w-full">
      {winChance !== null && (
        <div className="mb-2 p-2 rounded-lg border border-border bg-card text-center">
          <span className="text-sm font-bold text-card-foreground">
            Win Chance: <span className={winChance >= 60 ? 'text-green-400' : winChance >= 40 ? 'text-yellow-400' : 'text-red-400'}>
              {winChance}%
            </span>
          </span>
          <div className="mt-1 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${winChance}%`,
                background: winChance >= 60 ? '#4CAF50' : winChance >= 40 ? '#FF9800' : '#E53935',
              }}
            />
          </div>
        </div>
      )}
      {activeEffects.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-1">
          {activeEffects.map((e, i) => (
            <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30">
              {e}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
