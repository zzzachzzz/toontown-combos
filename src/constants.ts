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

export const BASE_URL: string = import.meta.env?.BASE_URL ?? '';

export const gagTrackData: Record<GagTrack, { name: string; img: string; }> = {
  toonup: { name: 'Toon Up',  img: `${BASE_URL}gag_icons/Feather.png` },
  trap:   { name: 'Trap',     img: `${BASE_URL}gag_icons/Banana_Peel.png` },
  lure:   { name: 'Lure',     img: `${BASE_URL}gag_icons/$1_Bill.png` },
  sound:  { name: 'Sound',    img: `${BASE_URL}gag_icons/Bike_Horn.png` },
  throw:  { name: 'Throw',    img: `${BASE_URL}gag_icons/Cupcake.png` },
  squirt: { name: 'Squirt',   img: `${BASE_URL}gag_icons/Squirting_Flower.png` },
  drop:   { name: 'Drop',     img: `${BASE_URL}gag_icons/Flower_Pot.png` },
};

