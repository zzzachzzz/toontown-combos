import {
  Combo, Gag, Cog
} from './gags.js';

const game = 'ttr';

const gags = [
  new Gag({ track: 'sound', lvl: 6, isOrg: true, game }),
  new Gag({ track: 'sound', lvl: 6, isOrg: false, game }),
  new Gag({ track: 'sound', lvl: 6, isOrg: false, game }),
  new Gag({ track: 'sound', lvl: 5, isOrg: false, game }),
];

const combo = new Combo({ gags });

function whatdoesitkill(combo, isLured, isV2) {
  let cog;
  for (let lvl = 1; lvl <= 12; lvl++) {
    cog = new Cog({ lvl, isLured, game, isV2 })
    if (!combo.damageKillsCog(cog)) {
      return new Cog({ lvl: lvl-1, isLured, game, isV2 })
    }
  }
  return cog;
}

const isLured = true;
const isV2 = true;
const r1 = whatdoesitkill(combo, isLured, isV2);
console.log(r1);
console.log(combo.damage(r1));

// const r2 = whatdoesitkill(combo, false, true);
// console.log('r2:', r2);
// console.log(combo.damage(r2));

