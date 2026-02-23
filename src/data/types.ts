export type PokemonType = 'Normal' | 'Fire' | 'Water' | 'Electric' | 'Grass' | 'Ice' | 'Fighting' | 'Poison' | 'Ground' | 'Flying' | 'Psychic' | 'Bug' | 'Rock' | 'Ghost' | 'Dragon';

export const TYPE_COLORS: Record<string, string> = {
  Normal: '#A8A77A', Fire: '#EE8130', Water: '#6390F0', Electric: '#F7D02C',
  Grass: '#7AC74C', Ice: '#96D9D6', Fighting: '#C22E28', Poison: '#A33EA1',
  Ground: '#E2BF65', Flying: '#A98FF3', Psychic: '#F95587', Bug: '#A6B91A',
  Rock: '#B6A136', Ghost: '#735797', Dragon: '#6F35FC', Mixed: '#888888',
};

const chart: Record<string, Record<string, number>> = {
  Normal: { Rock: 0.5, Ghost: 0 },
  Fire: { Fire: 0.5, Water: 0.5, Grass: 2, Ice: 2, Bug: 2, Rock: 0.5, Dragon: 0.5 },
  Water: { Fire: 2, Water: 0.5, Grass: 0.5, Ground: 2, Rock: 2, Dragon: 0.5 },
  Electric: { Water: 2, Electric: 0.5, Grass: 0.5, Ground: 0, Flying: 2, Dragon: 0.5 },
  Grass: { Fire: 0.5, Water: 2, Grass: 0.5, Poison: 0.5, Ground: 2, Flying: 0.5, Bug: 0.5, Rock: 2, Dragon: 0.5 },
  Ice: { Fire: 0.5, Water: 0.5, Grass: 2, Ice: 0.5, Ground: 2, Flying: 2, Dragon: 2 },
  Fighting: { Normal: 2, Ice: 2, Poison: 0.5, Flying: 0.5, Psychic: 0.5, Bug: 0.5, Rock: 2, Ghost: 0 },
  Poison: { Grass: 2, Poison: 0.5, Ground: 0.5, Rock: 0.5, Ghost: 0.5 },
  Ground: { Fire: 2, Electric: 2, Grass: 0.5, Poison: 2, Flying: 0, Bug: 0.5, Rock: 2 },
  Flying: { Electric: 0.5, Grass: 2, Fighting: 2, Bug: 2, Rock: 0.5 },
  Psychic: { Fighting: 2, Poison: 2, Psychic: 0.5 },
  Bug: { Fire: 0.5, Grass: 2, Fighting: 0.5, Poison: 0.5, Flying: 0.5, Psychic: 2, Ghost: 0.5 },
  Rock: { Fire: 2, Ice: 2, Fighting: 0.5, Ground: 0.5, Flying: 2, Bug: 2 },
  Ghost: { Normal: 0, Ghost: 2, Psychic: 2 },
  Dragon: { Dragon: 2 },
};

export function getEffectiveness(attackType: string, defendType: string): number {
  return chart[attackType]?.[defendType] ?? 1;
}

export function getMatchupScore(pType1: string, pType2: string | null, gymType: string): number {
  if (gymType === 'Mixed') return 0;
  
  const atk1 = getEffectiveness(pType1, gymType);
  const atk2 = pType2 ? getEffectiveness(pType2, gymType) : 1;
  const bestAtk = Math.max(atk1, atk2);

  const def1 = getEffectiveness(gymType, pType1);
  const def2 = pType2 ? getEffectiveness(gymType, pType2) : 1;
  const worstDef = Math.max(def1, def2);

  let score = 0;
  if (bestAtk >= 2) score += 2;
  else if (bestAtk >= 1) score += 1;
  else if (bestAtk > 0) score -= 1;
  else score -= 2;

  if (worstDef >= 2) score -= 1;
  else if (worstDef === 0) score += 1;

  return score;
}
