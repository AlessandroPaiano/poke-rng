export interface Stage {
  name: string;
  type: string;
  phase: 'gym' | 'elite4' | 'champion';
  badge?: string;
}

export const STAGES: Stage[] = [
  { name: 'Brock', type: 'Rock', phase: 'gym', badge: 'Boulder' },
  { name: 'Misty', type: 'Water', phase: 'gym', badge: 'Cascade' },
  { name: 'Lt. Surge', type: 'Electric', phase: 'gym', badge: 'Thunder' },
  { name: 'Erika', type: 'Grass', phase: 'gym', badge: 'Rainbow' },
  { name: 'Koga', type: 'Poison', phase: 'gym', badge: 'Soul' },
  { name: 'Sabrina', type: 'Psychic', phase: 'gym', badge: 'Marsh' },
  { name: 'Blaine', type: 'Fire', phase: 'gym', badge: 'Volcano' },
  { name: 'Giovanni', type: 'Ground', phase: 'gym', badge: 'Earth' },
  { name: 'Lorelei', type: 'Ice', phase: 'elite4' },
  { name: 'Bruno', type: 'Fighting', phase: 'elite4' },
  { name: 'Agatha', type: 'Ghost', phase: 'elite4' },
  { name: 'Lance', type: 'Dragon', phase: 'elite4' },
  { name: 'Champion', type: 'Mixed', phase: 'champion' },
];

export const INTERMISSION_ACTIONS = [
  { id: 'capture', name: 'Capture', color: '#4CAF50', weight: 20, desc: 'Attempt to catch a wild Pokémon!' },
  { id: 'double_capture', name: '2x Capture', color: '#2E7D32', weight: 5, desc: 'Catch two Pokémon!' },
  { id: 'heal', name: 'Heal Party', color: '#E91E63', weight: 10, desc: 'Rest and recover. +2% next battle.' },
  { id: 'train', name: 'Train', color: '#FF9800', weight: 10, desc: 'Train hard! +5% next battle.' },
  { id: 'item', name: 'Find Item', color: '#9C27B0', weight: 8, desc: 'Found a useful item! +5% one-time bonus.' },
  { id: 'shield', name: 'Type Shield', color: '#00BCD4', weight: 5, desc: 'Ignore 1 type weakness next battle.' },
  { id: 'reorg', name: 'Reorganize', color: '#607D8B', weight: 5, desc: 'Shuffle party for best matchup.' },
  { id: 'scout', name: 'Scout', color: '#795548', weight: 8, desc: 'Scout ahead! +10% next battle.' },
  { id: 'charm', name: 'Lucky Charm', color: '#FFD700', weight: 3, desc: 'Get a reroll if you lose next battle!' },
  { id: 'rare', name: 'Rare Mon!', color: '#FF5722', weight: 4, desc: 'Encounter a rare Pokémon!' },
  { id: 'synergy', name: 'Synergy', color: '#3F51B5', weight: 5, desc: 'Bonus if party shares types.' },
  { id: 'adaptive', name: 'Adaptive', color: '#009688', weight: 5, desc: 'Bonus for type diversity.' },
  { id: 'nothing', name: 'Nothing', color: '#9E9E9E', weight: 7, desc: 'Nothing happened...' },
  { id: 'foresight', name: 'Foresight', color: '#673AB7', weight: 3, desc: 'Reveal next gym type!' },
  { id: 'bonus_slot', name: 'Bonus Slot', color: '#F44336', weight: 2, desc: 'Temporary 7th Pokémon for next battle!' },
];
