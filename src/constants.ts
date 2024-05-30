export const TTR_VERSION = 'ttr-live-v4.0.0';
export const TTR_VERSION_RELEASE_NOTES_LINK = 'https://www.toontownrewritten.com/news/release-notes/357';

export enum GagTracks {
  toonup = 'toonup',
  trap = 'trap',
  lure = 'lure',
  sound = 'sound',
  throw = 'throw',
  squirt = 'squirt',
  drop = 'drop',
};

// String union version, so that string literal or GagTracks enum can be provided
export type GagTrack = `${GagTracks}`;

export const gagTracksArr: GagTracks[] = Object.values(GagTracks);

export const gagTracksOrder: Record<GagTracks, number> = {
  [GagTracks.toonup]: 0,
  [GagTracks.trap]: 1,
  [GagTracks.lure]: 2,
  [GagTracks.sound]: 3,
  [GagTracks.throw]: 4,
  [GagTracks.squirt]: 5,
  [GagTracks.drop]: 6,
};

// TODO Can extend this to include other info such as accuracy
export const gags: Record<GagTracks, Record<number, { name: string; damage: number; }>> = {
  [GagTracks.toonup]: {
    1: { name: 'Feather',         damage: 0 },
    2: { name: 'Megaphone',       damage: 0 },
    3: { name: 'Lipstick',        damage: 0 },
    4: { name: 'Bamboo Cane',     damage: 0 },
    5: { name: 'Pixie Dust',      damage: 0 },
    6: { name: 'Juggling Cubes',  damage: 0 },
    7: { name: 'High Dive',       damage: 0 },
  },
  [GagTracks.lure]: {
    1: { name: '$1 Bill',        damage: 0 },
    2: { name: 'Small Magnet',   damage: 0 },
    3: { name: '$5 Bill',        damage: 0 },
    4: { name: 'Big Magnet',     damage: 0 },
    5: { name: '$10 Bill',       damage: 0 },
    6: { name: 'Hypno-goggles',  damage: 0 },
    7: { name: 'Presentation',   damage: 0 },
  },
  [GagTracks.trap]: {
    1: { name: 'Banana Peel',  damage: 12  },
    2: { name: 'Rake',         damage: 20  },
    3: { name: 'Marbles',      damage: 35  },
    4: { name: 'Quicksand',    damage: 50  },
    5: { name: 'Trapdoor',     damage: 85  },
    6: { name: 'TNT',          damage: 180 },
    7: { name: 'Railroad',     damage: 200 },
  },
  [GagTracks.sound]: {
    1: { name: 'Bike Horn',       damage: 4  },
    2: { name: 'Whistle',         damage: 7  },
    3: { name: 'Bugle',           damage: 11 },
    4: { name: 'Aoogah',          damage: 16 },
    5: { name: 'Elephant Trunk',  damage: 21 },
    6: { name: 'Foghorn',         damage: 50 },
    7: { name: 'Opera Singer',    damage: 90 },
  },
  [GagTracks.throw]: {
    1: { name: 'Cupcake',          damage: 6   },
    2: { name: 'Fruit Pie Slice',  damage: 10  },
    3: { name: 'Cream Pie Slice',  damage: 17  },
    4: { name: 'Whole Fruit Pie',  damage: 27  },
    5: { name: 'Whole Cream Pie',  damage: 40  },
    6: { name: 'Birthday Cake',    damage: 100 },
    7: { name: 'Wedding Cake',     damage: 120 },
  },
  [GagTracks.squirt]: {
    1: { name: 'Squirting Flower',  damage: 4   },
    2: { name: 'Glass of Water',    damage: 8   },
    3: { name: 'Squirt Gun',        damage: 12  },
    4: { name: 'Seltzer Bottle',    damage: 21  },
    5: { name: 'Fire Hose',         damage: 30  },
    6: { name: 'Storm Cloud',       damage: 80  },
    7: { name: 'Geyser',            damage: 105 },
  },
  [GagTracks.drop]: {
    1: { name: 'Flower Pot',   damage: 10  },
    2: { name: 'Sandbag',      damage: 18  },
    3: { name: 'Anvil',        damage: 30  },
    4: { name: 'Big Weight',   damage: 45  },
    5: { name: 'Safe',         damage: 70 },
    6: { name: 'Grand Piano',  damage: 170 },
    7: { name: 'Toontanic',    damage: 180 },
  },
};

export const cogHp: Record<number, number> = {
  1:  6,
  2:  12,
  3:  20,
  4:  30,
  5:  42,
  6:  56,
  7:  72,
  8:  90,
  9:  110,
  10: 132,
  11: 156,
  12: 196,
  13: 224,
  14: 254,
  15: 286,
  16: 320,
  17: 356,
  18: 394,
  19: 434,
  20: 476,
};

export const BASE_URL: string = import.meta.env?.BASE_URL ?? '';

export const gagTrackDisplayName: Record<GagTrack, string> = {
  toonup: 'Toon-Up',
  trap:   'Trap',
  lure:   'Lure',
  sound:  'Sound',
  throw:  'Throw',
  squirt: 'Squirt',
  drop:   'Drop',
};

export enum SosToons {
  ClerkWill,
  ClerkPenny,
  ClerkClara,
  BarbaraSeville,
  SidSonata,
  MoeZart,
  ClumsyNed,
  FranzNeckvein,
  BarnacleBessie,
};

export const sosToonGags: Record<
  GagTracks.trap | GagTracks.sound | GagTracks.drop,
  Record<number, { name: string; damage: number; sosToon: SosToons; }>
> = {
  [GagTracks.trap]: {
    1: { name: 'Clerk Will',   damage: 60,   sosToon: SosToons.ClerkWill },
    2: { name: 'Clerk Penny',  damage: 120,  sosToon: SosToons.ClerkPenny },
    3: { name: 'Clerk Clara',  damage: 180,  sosToon: SosToons.ClerkClara },
  },
  [GagTracks.sound]: {
    1: { name: 'Barbara Seville',  damage: 35,  sosToon: SosToons.BarbaraSeville },
    2: { name: 'Sid Sonata',       damage: 55,  sosToon: SosToons.SidSonata },
    3: { name: 'Moe Zart',         damage: 75,  sosToon: SosToons.MoeZart },
  },
  [GagTracks.drop]: {
    1: { name: 'Clumsy Ned',       damage: 60,   sosToon: SosToons.ClumsyNed },
    2: { name: 'Franz Neckvein',   damage: 100,  sosToon: SosToons.FranzNeckvein },
    3: { name: 'Barnacle Bessie',  damage: 170,  sosToon: SosToons.BarnacleBessie },
  },
};

