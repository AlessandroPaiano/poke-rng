import { useState, useCallback, useEffect } from 'react';
import { ALL_POKEMON, Pokemon, pickRandom, getByRarity } from '@/data/pokemon';
import { STAGES, INTERMISSION_ACTIONS } from '@/data/stages';
import { getMatchupScore, TYPE_COLORS } from '@/data/types';

export interface WheelSegment {
  label: string;
  color: string;
  weight: number;
  data?: any;
}

export interface GameState {
  wheelMode: string;
  segments: WheelSegment[];
  phaseLabel: string;
  stageIndex: number;
  party: Pokemon[];
  log: string[];
  items: string[];
  trainBonus: number;
  itemBonus: number;
  scoutBonus: number;
  typeShield: boolean;
  luckyCharm: boolean;
  bonusSlot: Pokemon | null;
  pendingPokemon: Pokemon | null;
  capturesRemaining: number;
  darkMode: boolean;
  lessExplanations: boolean;
  winChance: number | null;
  futureSight: string | null;
}

function clamp(v: number, min: number, max: number) { return Math.max(min, Math.min(max, v)); }

function calcWinChance(party: Pokemon[], stageIndex: number, train: number, item: number, scout: number, shield: boolean): number {
  const stage = STAGES[stageIndex];
  if (!stage) return 50;
  const gymType = stage.type;
  if (gymType === 'Mixed') return clamp(50 + train + item + scout, 5, 95);

  const scores = party.map(p => {
    let s = getMatchupScore(p.type1, p.type2, gymType);
    if (shield) s = Math.max(s, 0);
    return s;
  });
  scores.sort((a, b) => b - a);
  const best3 = scores.slice(0, 3);
  const total = best3.reduce((s, v) => s + v, 0);
  return clamp(45 + total * 8 + train + item + scout, 5, 95);
}

function makeStarterSegments(): WheelSegment[] {
  const pool = ALL_POKEMON.filter(p => p.rarity <= 1 && !['Magikarp', 'Metapod', 'Kakuna', 'Caterpie', 'Weedle'].includes(p.name));
  const picks = pickRandom(pool, 8);
  return picks.map(p => ({ label: p.name, color: TYPE_COLORS[p.type1] || '#888', weight: 1, data: p }));
}

function makeBattleSegments(wc: number): WheelSegment[] {
  return [
    { label: 'WIN', color: '#4CAF50', weight: wc, data: 'win' },
    { label: 'LOSE', color: '#E53935', weight: 100 - wc, data: 'lose' },
  ];
}

function makeIntermissionSegments(): WheelSegment[] {
  return INTERMISSION_ACTIONS.map(a => ({ label: a.name, color: a.color, weight: a.weight, data: a }));
}

function makeTierSegments(): WheelSegment[] {
  return [
    { label: 'Common', color: '#78909C', weight: 50, data: 0 },
    { label: 'Uncommon', color: '#42A5F5', weight: 35, data: 1 },
    { label: 'Rare', color: '#FFD700', weight: 15, data: 2 },
  ];
}

function makePokemonSegments(rarity: number): WheelSegment[] {
  const pool = getByRarity(rarity);
  const picks = pickRandom(pool, Math.min(8, pool.length));
  return picks.map(p => ({ label: p.name, color: TYPE_COLORS[p.type1] || '#888', weight: 1, data: p }));
}

function makeCaptureResultSegments(): WheelSegment[] {
  return [
    { label: 'Failed!', color: '#E53935', weight: 30, data: 'fail' },
    { label: 'Caught!', color: '#4CAF50', weight: 55, data: 'success' },
    { label: 'Critical!', color: '#FFD700', weight: 15, data: 'critical' },
  ];
}

function makeReplaceSegments(party: Pokemon[], newMon: Pokemon): WheelSegment[] {
  return [
    { label: 'Replace Random', color: '#FF9800', weight: 1, data: 'random' },
    { label: 'Replace Weakest', color: '#F44336', weight: 1, data: 'weakest' },
    { label: 'Discard New', color: '#9E9E9E', weight: 1, data: 'discard' },
  ];
}

function getPhaseLabel(state: GameState): string {
  const stage = STAGES[state.stageIndex];
  switch (state.wheelMode) {
    case 'starter': return '⭐ Choose Your Starter!';
    case 'battle': {
      if (!stage) return 'Battle';
      if (stage.phase === 'gym') return `⚔️ Gym Battle: ${stage.name} (${stage.type})`;
      if (stage.phase === 'elite4') return `🏆 Elite Four: ${stage.name} (${stage.type})`;
      return `👑 Champion Battle!`;
    }
    case 'intermission': return '🎲 Intermission';
    case 'capture_tier': return '🔍 Encounter Tier';
    case 'capture_pokemon': return '🐾 Wild Pokémon!';
    case 'capture_result': return '⚡ Capture Attempt!';
    case 'capture_replace': return '🔄 Party Full!';
    case 'victory': return '🎉 CHAMPION! YOU WIN!';
    case 'gameOver': return '💀 GAME OVER';
    default: return '';
  }
}

function initState(): GameState {
  return {
    wheelMode: 'starter',
    segments: makeStarterSegments(),
    phaseLabel: '⭐ Choose Your Starter!',
    stageIndex: 0,
    party: [],
    log: ['Your Pokémon RNG Run begins! Spin to choose your starter!'],
    items: [],
    trainBonus: 0, itemBonus: 0, scoutBonus: 0,
    typeShield: false, luckyCharm: false,
    bonusSlot: null, pendingPokemon: null,
    capturesRemaining: 0,
    darkMode: true, lessExplanations: false,
    winChance: null, futureSight: null,
  };
}

function advanceToBattle(state: GameState): Partial<GameState> {
  const wc = calcWinChance(state.party, state.stageIndex, state.trainBonus, state.itemBonus, state.scoutBonus, state.typeShield);
  const stage = STAGES[state.stageIndex];
  const foresightMsg = state.futureSight && state.stageIndex < STAGES.length
    ? [`🔮 Foresight: Next opponent uses ${stage?.type} type!`] : [];
  return {
    wheelMode: 'battle',
    segments: makeBattleSegments(wc),
    winChance: wc,
    log: [...state.log, ...foresightMsg, `Preparing for battle against ${stage?.name}... Win chance: ${wc}%`],
  };
}

function advanceToIntermission(state: GameState, stageIndex: number): Partial<GameState> {
  return {
    wheelMode: 'intermission',
    segments: makeIntermissionSegments(),
    stageIndex: stageIndex + 1,
    itemBonus: 0, scoutBonus: 0, typeShield: false, bonusSlot: null,
    winChance: null,
  };
}

export function useGameState() {
  const [state, setState] = useState<GameState>(initState);

  useEffect(() => {
    if (state.darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [state.darkMode]);

  const processResult = useCallback((segment: WheelSegment) => {
    setState(prev => {
      const s = { ...prev, log: [...prev.log] };

      switch (prev.wheelMode) {
        case 'starter': {
          const p = segment.data as Pokemon;
          s.party = [p];
          s.log.push(`🎉 You chose ${p.name} as your starter!`);
          const battle = advanceToBattle({ ...s, stageIndex: 0 });
          return { ...s, ...battle, stageIndex: 0, phaseLabel: '' } as GameState;
        }

        case 'battle': {
          if (segment.data === 'win') {
            const stage = STAGES[prev.stageIndex];
            s.log.push(`✅ Victory against ${stage.name}!`);
            if (stage.badge) s.log.push(`🏅 Earned the ${stage.badge} Badge!`);
            s.trainBonus = 0;
            if (prev.stageIndex >= STAGES.length - 1) {
              return { ...s, wheelMode: 'victory', segments: [], winChance: null, phaseLabel: getPhaseLabel({ ...s, wheelMode: 'victory' } as GameState) };
            }
            const inter = advanceToIntermission(s, prev.stageIndex);
            const ns = { ...s, ...inter };
            ns.phaseLabel = getPhaseLabel(ns as GameState);
            return ns as GameState;
          } else {
            if (prev.luckyCharm) {
              s.log.push('🍀 Lucky Charm activated! Re-spinning!');
              s.luckyCharm = false;
              const wc = calcWinChance(s.party, s.stageIndex, s.trainBonus, s.itemBonus, s.scoutBonus, s.typeShield);
              s.segments = makeBattleSegments(wc);
              s.winChance = wc;
              s.phaseLabel = getPhaseLabel(s as GameState);
              return s as GameState;
            }
            s.log.push(`💀 Defeated by ${STAGES[prev.stageIndex].name}... Run over!`);
            return { ...s, wheelMode: 'gameOver', segments: [], winChance: null, phaseLabel: getPhaseLabel({ ...s, wheelMode: 'gameOver' } as GameState) };
          }
        }

        case 'intermission': {
          const action = segment.data;
          s.log.push(`🎲 ${action.name}: ${action.desc}`);

          switch (action.id) {
            case 'capture':
            case 'rare':
              s.capturesRemaining = 1;
              if (action.id === 'rare') {
                s.segments = makePokemonSegments(2);
                s.wheelMode = 'capture_pokemon';
              } else {
                s.segments = makeTierSegments();
                s.wheelMode = 'capture_tier';
              }
              break;
            case 'double_capture':
              s.capturesRemaining = 2;
              s.segments = makeTierSegments();
              s.wheelMode = 'capture_tier';
              break;
            case 'heal':
              s.trainBonus += 2;
              return goToBattle(s);
            case 'train':
              s.trainBonus += 5;
              return goToBattle(s);
            case 'item':
              s.itemBonus += 5;
              s.items = [...s.items, 'Battle Item (+5%)'];
              return goToBattle(s);
            case 'shield':
              s.typeShield = true;
              s.items = [...s.items, 'Type Shield'];
              return goToBattle(s);
            case 'reorg':
              return goToBattle(s);
            case 'scout':
              s.scoutBonus += 10;
              s.items = [...s.items, 'Scout Intel (+10%)'];
              return goToBattle(s);
            case 'charm':
              s.luckyCharm = true;
              s.items = [...s.items, '🍀 Lucky Charm'];
              return goToBattle(s);
            case 'synergy': {
              const types = s.party.map(p => p.type1);
              const dupes = types.length - new Set(types).size;
              const bonus = dupes * 3;
              s.trainBonus += bonus;
              s.log.push(`Synergy bonus: +${bonus}%`);
              return goToBattle(s);
            }
            case 'adaptive': {
              const uniqueTypes = new Set(s.party.flatMap(p => [p.type1, p.type2].filter(Boolean)));
              const bonus = Math.min(uniqueTypes.size * 2, 12);
              s.trainBonus += bonus;
              s.log.push(`Adaptive bonus: +${bonus}%`);
              return goToBattle(s);
            }
            case 'nothing':
              return goToBattle(s);
            case 'foresight': {
              const next = STAGES[s.stageIndex];
              if (next) {
                s.futureSight = next.type;
                s.log.push(`🔮 Next opponent uses ${next.type} type!`);
              }
              return goToBattle(s);
            }
            case 'bonus_slot': {
              const rare = pickRandom(getByRarity(2), 1)[0];
              if (rare) {
                s.bonusSlot = rare;
                s.log.push(`🎁 Bonus slot: ${rare.name} joins for next battle!`);
              }
              return goToBattle(s);
            }
            default:
              return goToBattle(s);
          }
          s.phaseLabel = getPhaseLabel(s as GameState);
          return s as GameState;
        }

        case 'capture_tier': {
          const tier = segment.data as number;
          s.log.push(`Encounter tier: ${segment.label}`);
          s.segments = makePokemonSegments(tier);
          s.wheelMode = 'capture_pokemon';
          s.phaseLabel = getPhaseLabel({ ...s, wheelMode: 'capture_pokemon' } as GameState);
          return s as GameState;
        }

        case 'capture_pokemon': {
          const p = segment.data as Pokemon;
          s.pendingPokemon = p;
          s.log.push(`Wild ${p.name} appeared!`);
          s.segments = makeCaptureResultSegments();
          s.wheelMode = 'capture_result';
          s.phaseLabel = getPhaseLabel({ ...s, wheelMode: 'capture_result' } as GameState);
          return s as GameState;
        }

        case 'capture_result': {
          const result = segment.data as string;
          const mon = s.pendingPokemon!;
          if (result === 'fail') {
            s.log.push(`${mon.name} escaped!`);
            s.capturesRemaining--;
            if (s.capturesRemaining > 0) {
              s.segments = makeTierSegments();
              s.wheelMode = 'capture_tier';
              s.phaseLabel = getPhaseLabel({ ...s, wheelMode: 'capture_tier' } as GameState);
              return s as GameState;
            }
            s.pendingPokemon = null;
            return goToBattle(s);
          }
          if (result === 'critical') s.log.push(`✨ Critical capture! ${mon.name} caught with bonus!`);
          else s.log.push(`✅ Caught ${mon.name}!`);

          if (s.party.length < 6) {
            s.party = [...s.party, mon];
            s.capturesRemaining--;
            if (s.capturesRemaining > 0) {
              s.segments = makeTierSegments();
              s.wheelMode = 'capture_tier';
              s.phaseLabel = getPhaseLabel({ ...s, wheelMode: 'capture_tier' } as GameState);
              return s as GameState;
            }
            s.pendingPokemon = null;
            return goToBattle(s);
          }
          // Party full
          s.segments = makeReplaceSegments(s.party, mon);
          s.wheelMode = 'capture_replace';
          s.phaseLabel = getPhaseLabel({ ...s, wheelMode: 'capture_replace' } as GameState);
          return s as GameState;
        }

        case 'capture_replace': {
          const choice = segment.data as string;
          const mon = s.pendingPokemon!;
          if (choice === 'discard') {
            s.log.push(`Discarded ${mon.name}.`);
          } else if (choice === 'random') {
            const idx = Math.floor(Math.random() * s.party.length);
            s.log.push(`Replaced ${s.party[idx].name} with ${mon.name}!`);
            s.party = [...s.party];
            s.party[idx] = mon;
          } else {
            const stage = STAGES[s.stageIndex];
            const scores = s.party.map((p, i) => ({ i, score: getMatchupScore(p.type1, p.type2, stage?.type || 'Normal') }));
            scores.sort((a, b) => a.score - b.score);
            const idx = scores[0].i;
            s.log.push(`Replaced ${s.party[idx].name} with ${mon.name}!`);
            s.party = [...s.party];
            s.party[idx] = mon;
          }
          s.capturesRemaining--;
          if (s.capturesRemaining > 0) {
            s.segments = makeTierSegments();
            s.wheelMode = 'capture_tier';
            s.pendingPokemon = null;
            s.phaseLabel = getPhaseLabel({ ...s, wheelMode: 'capture_tier' } as GameState);
            return s as GameState;
          }
          s.pendingPokemon = null;
          return goToBattle(s);
        }

        default:
          return prev;
      }
    });
  }, []);

  const restart = useCallback(() => setState(initState()), []);
  const toggleDark = useCallback(() => setState(s => ({ ...s, darkMode: !s.darkMode })), []);
  const toggleExplanations = useCallback(() => setState(s => ({ ...s, lessExplanations: !s.lessExplanations })), []);

  // Update phaseLabel
  const stateWithLabel = { ...state, phaseLabel: getPhaseLabel(state) };

  return { state: stateWithLabel, processResult, restart, toggleDark, toggleExplanations };
}

function goToBattle(s: GameState): GameState {
  const battle = advanceToBattle(s);
  const ns = { ...s, ...battle };
  ns.phaseLabel = getPhaseLabel(ns as GameState);
  return ns as GameState;
}
