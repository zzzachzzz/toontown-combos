export const gagTracksArr = [
  'toonup',
  'trap',
  'lure',
  'sound',
  'throw',
  'squirt',
  'drop',
] as const;

export type GagTrack = typeof gagTracksArr[number];

export const gagTrackData: Record<GagTrack, { name: string; img: string; }> = {
  toonup: { name: 'Toon Up', img: '/gag_icons/Feather.png' },
  trap:   { name: 'Trap', img: '/gag_icons/Banana_Peel.png' },
  lure:   { name: 'Lure', img: '/gag_icons/$1_Bill.png' },
  sound:  { name: 'Sound', img: '/gag_icons/Bike_Horn.png' },
  throw:  { name: 'Throw', img: '/gag_icons/Cupcake.png' },
  squirt: { name: 'Squirt', img: '/gag_icons/Squirting_Flower.png' },
  drop:   { name: 'Drop', img: '/gag_icons/Flower_Pot.png' },
};

