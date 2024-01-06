import {
  Combo, Gag, Cog
} from './gags.js';

const game = 'ttr';

const gags = [
  new Gag('sound', 5, game, false),
  new Gag('sound', 5, game, false),
  new Gag('drop', 7, game, true),
];

const isLured = false;
const isV2 = false;

const cog = new Cog({ lvl: 12, isLured, game, isV2 });

const combo = new Combo({ gags });

const damage = combo.damage(cog);

console.log('damage:', damage);

