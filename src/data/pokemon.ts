export interface Pokemon {
  id: number;
  name: string;
  type1: string;
  type2: string | null;
  rarity: number; // 0=common, 1=uncommon, 2=rare
}

// [id, name, type1, type2, rarity]
const RAW: [number, string, string, string | null, number][] = [
  [1,"Bulbasaur","Grass","Poison",1],[2,"Ivysaur","Grass","Poison",1],[3,"Venusaur","Grass","Poison",2],
  [4,"Charmander","Fire",null,1],[5,"Charmeleon","Fire",null,1],[6,"Charizard","Fire","Flying",2],
  [7,"Squirtle","Water",null,1],[8,"Wartortle","Water",null,1],[9,"Blastoise","Water",null,2],
  [10,"Caterpie","Bug",null,0],[11,"Metapod","Bug",null,0],[12,"Butterfree","Bug","Flying",1],
  [13,"Weedle","Bug","Poison",0],[14,"Kakuna","Bug","Poison",0],[15,"Beedrill","Bug","Poison",1],
  [16,"Pidgey","Normal","Flying",0],[17,"Pidgeotto","Normal","Flying",0],[18,"Pidgeot","Normal","Flying",1],
  [19,"Rattata","Normal",null,0],[20,"Raticate","Normal",null,0],
  [21,"Spearow","Normal","Flying",0],[22,"Fearow","Normal","Flying",1],
  [23,"Ekans","Poison",null,0],[24,"Arbok","Poison",null,1],
  [25,"Pikachu","Electric",null,1],[26,"Raichu","Electric",null,2],
  [27,"Sandshrew","Ground",null,0],[28,"Sandslash","Ground",null,1],
  [29,"Nidoran F","Poison",null,0],[30,"Nidorina","Poison",null,1],[31,"Nidoqueen","Poison","Ground",2],
  [32,"Nidoran M","Poison",null,0],[33,"Nidorino","Poison",null,1],[34,"Nidoking","Poison","Ground",2],
  [35,"Clefairy","Normal",null,1],[36,"Clefable","Normal",null,2],
  [37,"Vulpix","Fire",null,0],[38,"Ninetales","Fire",null,2],
  [39,"Jigglypuff","Normal",null,1],[40,"Wigglytuff","Normal",null,2],
  [41,"Zubat","Poison","Flying",0],[42,"Golbat","Poison","Flying",1],
  [43,"Oddish","Grass","Poison",0],[44,"Gloom","Grass","Poison",1],[45,"Vileplume","Grass","Poison",2],
  [46,"Paras","Bug","Grass",0],[47,"Parasect","Bug","Grass",1],
  [48,"Venonat","Bug","Poison",0],[49,"Venomoth","Bug","Poison",1],
  [50,"Diglett","Ground",null,0],[51,"Dugtrio","Ground",null,1],
  [52,"Meowth","Normal",null,0],[53,"Persian","Normal",null,1],
  [54,"Psyduck","Water",null,0],[55,"Golduck","Water",null,1],
  [56,"Mankey","Fighting",null,0],[57,"Primeape","Fighting",null,1],
  [58,"Growlithe","Fire",null,1],[59,"Arcanine","Fire",null,2],
  [60,"Poliwag","Water",null,0],[61,"Poliwhirl","Water",null,1],[62,"Poliwrath","Water","Fighting",2],
  [63,"Abra","Psychic",null,0],[64,"Kadabra","Psychic",null,1],[65,"Alakazam","Psychic",null,2],
  [66,"Machop","Fighting",null,0],[67,"Machoke","Fighting",null,1],[68,"Machamp","Fighting",null,2],
  [69,"Bellsprout","Grass","Poison",0],[70,"Weepinbell","Grass","Poison",1],[71,"Victreebel","Grass","Poison",2],
  [72,"Tentacool","Water","Poison",0],[73,"Tentacruel","Water","Poison",1],
  [74,"Geodude","Rock","Ground",0],[75,"Graveler","Rock","Ground",1],[76,"Golem","Rock","Ground",2],
  [77,"Ponyta","Fire",null,0],[78,"Rapidash","Fire",null,1],
  [79,"Slowpoke","Water","Psychic",0],[80,"Slowbro","Water","Psychic",1],
  [81,"Magnemite","Electric",null,1],[82,"Magneton","Electric",null,2],
  [83,"Farfetchd","Normal","Flying",1],
  [84,"Doduo","Normal","Flying",0],[85,"Dodrio","Normal","Flying",1],
  [86,"Seel","Water",null,0],[87,"Dewgong","Water","Ice",1],
  [88,"Grimer","Poison",null,0],[89,"Muk","Poison",null,1],
  [90,"Shellder","Water",null,0],[91,"Cloyster","Water","Ice",2],
  [92,"Gastly","Ghost","Poison",0],[93,"Haunter","Ghost","Poison",1],[94,"Gengar","Ghost","Poison",2],
  [95,"Onix","Rock","Ground",1],
  [96,"Drowzee","Psychic",null,0],[97,"Hypno","Psychic",null,1],
  [98,"Krabby","Water",null,0],[99,"Kingler","Water",null,1],
  [100,"Voltorb","Electric",null,0],[101,"Electrode","Electric",null,1],
  [102,"Exeggcute","Grass","Psychic",1],[103,"Exeggutor","Grass","Psychic",2],
  [104,"Cubone","Ground",null,0],[105,"Marowak","Ground",null,1],
  [106,"Hitmonlee","Fighting",null,2],[107,"Hitmonchan","Fighting",null,2],
  [108,"Lickitung","Normal",null,1],
  [109,"Koffing","Poison",null,0],[110,"Weezing","Poison",null,1],
  [111,"Rhyhorn","Ground","Rock",0],[112,"Rhydon","Ground","Rock",2],
  [113,"Chansey","Normal",null,2],
  [114,"Tangela","Grass",null,1],
  [115,"Kangaskhan","Normal",null,2],
  [116,"Horsea","Water",null,0],[117,"Seadra","Water",null,1],
  [118,"Goldeen","Water",null,0],[119,"Seaking","Water",null,1],
  [120,"Staryu","Water",null,0],[121,"Starmie","Water","Psychic",2],
  [122,"Mr. Mime","Psychic",null,2],
  [123,"Scyther","Bug","Flying",2],
  [124,"Jynx","Ice","Psychic",2],
  [125,"Electabuzz","Electric",null,2],
  [126,"Magmar","Fire",null,2],
  [127,"Pinsir","Bug",null,2],
  [128,"Tauros","Normal",null,2],
  [129,"Magikarp","Water",null,0],[130,"Gyarados","Water","Flying",2],
  [131,"Lapras","Water","Ice",2],
  [132,"Ditto","Normal",null,1],
  [133,"Eevee","Normal",null,1],
  [134,"Vaporeon","Water",null,2],[135,"Jolteon","Electric",null,2],[136,"Flareon","Fire",null,2],
  [137,"Porygon","Normal",null,2],
  [138,"Omanyte","Rock","Water",1],[139,"Omastar","Rock","Water",2],
  [140,"Kabuto","Rock","Water",1],[141,"Kabutops","Rock","Water",2],
  [142,"Aerodactyl","Rock","Flying",2],
  [143,"Snorlax","Normal",null,2],
  [144,"Articuno","Ice","Flying",2],
  [145,"Zapdos","Electric","Flying",2],
  [146,"Moltres","Fire","Flying",2],
  [147,"Dratini","Dragon",null,1],[148,"Dragonair","Dragon",null,1],[149,"Dragonite","Dragon","Flying",2],
  [150,"Mewtwo","Psychic",null,2],
  [151,"Mew","Psychic",null,2],
];

export const ALL_POKEMON: Pokemon[] = RAW.map(([id, name, type1, type2, rarity]) => ({
  id, name, type1, type2, rarity,
}));

export function getByRarity(r: number): Pokemon[] {
  return ALL_POKEMON.filter(p => p.rarity === r);
}

export function pickRandom<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

export function getSpriteUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}
