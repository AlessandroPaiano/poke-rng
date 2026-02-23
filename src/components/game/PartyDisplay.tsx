import type { Pokemon } from '@/data/pokemon';
import { getSpriteUrl } from '@/data/pokemon';
import { TYPE_COLORS } from '@/data/types';

interface Props {
  party: Pokemon[];
  bonusSlot?: Pokemon | null;
}

export default function PartyDisplay({ party, bonusSlot }: Props) {
  const slots = Array.from({ length: 6 }, (_, i) => party[i] || null);

  return (
    <div className="w-full">
      <h3 className="text-sm font-bold text-muted-foreground mb-2">🎒 Party ({party.length}/6)</h3>
      <div className="grid grid-cols-6 gap-1.5">
        {slots.map((p, i) => (
          <div
            key={i}
            className="aspect-square rounded-lg border-2 flex flex-col items-center justify-center overflow-hidden transition-all"
            style={{
              borderColor: p ? TYPE_COLORS[p.type1] : 'hsl(var(--border))',
              backgroundColor: p ? TYPE_COLORS[p.type1] + '20' : 'hsl(var(--muted))',
            }}
          >
            {p ? (
              <>
                <img
                  src={getSpriteUrl(p.id)}
                  alt={p.name}
                  className="w-8 h-8 sm:w-10 sm:h-10 pixelated"
                  style={{ imageRendering: 'pixelated' }}
                  loading="lazy"
                />
                <span className="text-[8px] sm:text-[10px] font-bold truncate w-full text-center leading-tight text-foreground">
                  {p.name}
                </span>
              </>
            ) : (
              <span className="text-muted-foreground text-lg">?</span>
            )}
          </div>
        ))}
      </div>
      {bonusSlot && (
        <div className="mt-1 text-xs text-primary">
          🎁 Bonus: {bonusSlot.name}
        </div>
      )}
    </div>
  );
}
