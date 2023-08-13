export const classicCogHp = {
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
  12: 200,
};

export const ttrCogHp = {
  ...classicCogHp,
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

const gags = {
  'sound': {
    1: { name: 'Bike Horn',       damage: 4  },
    2: { name: 'Whistle',         damage: 7  },
    3: { name: 'Bugle',           damage: 11 },
    4: { name: 'Aoogah',          damage: 16 },
    5: { name: 'Elephant Trunk',  damage: 21 },
    6: { name: 'Foghorn',         damage: 50 },
    7: { name: 'Opera Singer',    damage: 90 },
  },
  'throw': {
    1: { name: 'Cupcake',          damage: 6   },
    2: { name: 'Fruit Pie Slice',  damage: 10  },
    3: { name: 'Cream Pie Slice',  damage: 17  },
    4: { name: 'Whole Fruit Pie',  damage: 27  },
    5: { name: 'Whole Cream Pie',  damage: 40  },
    6: { name: 'Birthday Cake',    damage: 100 },
    7: { name: 'Wedding Cake',     damage: 120 },
  },
  'squirt': {
    1: { name: 'Squirting Flower',  damage: 4   },
    2: { name: 'Glass of Water',    damage: 8   },
    3: { name: 'Squirt Gun',        damage: 12  },
    4: { name: 'Seltzer Bottle',    damage: 21  },
    5: { name: 'Fire Hose',         damage: 30  },
    6: { name: 'Storm Cloud',       damage: 80  },
    7: { name: 'Geyser',            damage: 105 },
  },
  'drop': {
    1: { name: 'Flower Pot',   damage: 10  },
    2: { name: 'Sandbag',      damage: 18  },
    3: { name: 'Anvil',        damage: 30  },
    4: { name: 'Big Weight',   damage: 45  },
    5: { name: 'Safe',         damage: 60  },
    6: { name: 'Grand Piano',  damage: 170 },
    7: { name: 'Toontanic',    damage: 180 },
  },
};

const ttrGagsDmgOverrides = {
  'drop': {
    5: { name: 'Safe', damage: 70 },
  },
};

class Cog {
  /**
   * @param {number} lvl
   * @param {string} game
   */
  constructor(lvl, game) {
    this.lvl = lvl;
    this._game = game;
  }

  /**
   * @return {number}
   */
  get hp() {
    return (this._game === 'ttr' ? ttrCogHp : classicCogHp)[this.lvl];
  }

  /**
   * @return {string}
   */
  toString() {
    return `Cog(level: ${this.lvl}, HP: ${this.hp})`;
  }
}

class Gag {
  /**
   * @param {string} track
   * @param {number} lvl
   * @param {string} game
   * @param {boolean} [isOrg=false]
   */
  constructor(track, lvl, game, isOrg = false) {
    this.track = track;
    this.lvl = lvl;
    this._game = game;
    this.isOrg = isOrg;
  }

  /**
   * @return {string}
   */
  get name() {
    if (this.lvl === 0) {
      return 'None';
    }
    return gags[this.track][this.lvl].name;
  }

  /**
   * @return {number}
   */
  get damage() {
    if (this.lvl === 0) {
      return 0;
    }
    const baseDmg = this._game === 'ttr'
      ? (ttrGagsDmgOverrides[this.track]?.[this.lvl]?.damage ?? gags[this.track][this.lvl].damage)
      : gags[this.track][this.lvl].damage;

    if (this.isOrg) {
      if (baseDmg < 10) return baseDmg + 1;
      else return Math.floor(baseDmg * 1.1);
    } else {
      return baseDmg;
    }
  }

  /**
   * @param {Combo} combo
   */
  multiplier(combo) {
    if (this.lvl === 0) {
      return 1;
    }
    const tc = combo.trackCounts();
    const multi = 1 + (tc[this.track] >= 2 ? 0.2 : 0) + (
      (combo.isLured && (this.track === 'throw' ||
              this.track === 'squirt')
      ) ? 0.5 : 0)
    return multi;
  }

  /**
   * @return {string}
   */
  toString() {
    return `Gag(name: ${this.name}, level: ${this.lvl}, damage: ${this.damage}, isOrg: ${this.isOrg})`;
  }
}

class Combo {
  /**
   * @param {Object} args
   * @param {string} args.game
   * @param {number} args.cogLvl
   * @param {Array<Gag>} args.gags
   * @param {boolean} args.isLured
   * @param {string} args.gagTrack
   * @param {string} [args.stunTrack=null]
   * @param {Object<string, number>} [args.organicGags={}]
   */
  constructor({
    game,
    cogLvl,
    gags,
    isLured,
    gagTrack,
    stunTrack = null,
    organicGags = {},
  }) {
    this.game = game;
    this.cog = new Cog(cogLvl, game);
    this.gags = gags;
    this.numToons = gags.length;
    this.isLured = isLured;
    this.gagTrack = gagTrack;
    this.stunTrack = stunTrack;
    this.organicGags = organicGags;
  }

  /**
   * @return {Object<string, number>} A mapping of gag tracks to their respective number of gags in the combo
   */
  trackCounts() {
    let tc = {};
    this.gags.forEach((gag) => {
      if (gag.lvl !== 0) {
        gag.track in tc ? tc[gag.track] += 1 : tc[gag.track] = 1;
      }
    });
    return tc;
  }

  /**
   * @return {number}
   */
  damage() {
    let dmg = 0;
    this.gags.forEach((gag) => {
      dmg += gag.damage * gag.multiplier(this);
    });
    return Math.ceil(dmg);
  }

  /**
   * @return {boolean}
   */
  damageKillsCog() {
    return this.damage() >= this.cog.hp;
  }

  /**
   * @return {string}
   */
  toString() {
    return `Combo(damage: ${this.damage()} gags: [\n${this.gags.map(g => `  ${g}`).join(',\n')}\n])`;
  }
}

/**
 * @param {Object} args
 * @param {number} args.cogLvl
 * @param {string} args.gagTrack - 'sound' | 'throw' | 'squirt' | 'drop'
 * @param {number} args.numToons
 * @param {boolean} args.isLured
 * @param {Object<string, number>} args.organicGags
 * @param {string} args.game
 * @param {string} [args.stunTrack=null] 'sound' | 'throw' | 'squirt'
 * @return {Combo}
 */
function findCombo({
  cogLvl,
  gagTrack,
  numToons,
  isLured,
  organicGags,
  game = 'ttr',
  stunTrack = null
}) {
  if (numToons === 1 && gagTrack === 'drop') {
    throw new Error('Invalid arguments: a drop combo must have 2 or more toons (for a stun gag)');
  }

  let combo, isStunOrg;
  const numOrg = Math.min(
    organicGags[gagTrack] || 0,
    gagTrack === 'drop' ? numToons - 1 : numToons
  );

  // Populate the inital combo with level 1 gags
  if (gagTrack === 'drop') {
    if (stunTrack === null) throw new Error('Stun gag track not specified by `stunTrack` argument');
    isStunOrg = organicGags[stunTrack] >= 1;
    combo = new Combo({
      game,
      cogLvl,
      gags: [new Gag(stunTrack, 1, game, isStunOrg)],
      isLured,
      gagTrack,
      stunTrack,
      organicGags,
    });
    for (let i = 0; i < numToons-1; i++) {
      const isOrg = i <= numOrg - 1;
      combo.gags.push(new Gag(gagTrack, 1, game, isOrg));
    }
  } else {
    combo = new Combo({
      game,
      cogLvl,
      gags: [],
      isLured,
      gagTrack,
      organicGags,
    });
    for (let i = 0; i < numToons; i++) {
      const isOrg = i <= numOrg - 1;
      combo.gags.push(new Gag(gagTrack, 1, game, isOrg));
    }
  }
  // Increase the level of each gag until the damage is sufficient
  while (!combo.damageKillsCog()) {
    for (const gag of combo.gags) {
      if (gagTrack === 'drop' && gag.track === stunTrack && gag.lvl > 4) {
        continue;
      } else if (gag.lvl === 7) {
        continue;
      } else {
        gag.lvl += 1;
      }
    }
    if (combo.gags[combo.gags.length-1].lvl === 7)
      break;
  }
  // Prioritize a lvl 6 stun gag over any lvl 7 gag
  if (gagTrack === 'drop' && combo.gags.slice(1).some(gag => gag.lvl === 7)) {
    combo.gags[0].lvl += 1;
    combo.gags[1].lvl -= 1;
    if (!combo.damageKillsCog()) {
      combo.gags[0].lvl -= 1;
      combo.gags[1].lvl += 1;
    }
  }

  // Insufficient damage, killing cog with given parameters is not possible
  if (!combo.damageKillsCog()) {
    combo.gags = combo.gags.map(g => new Gag(g.track, 0, game));
    return combo;
  }

  // Decrease the level of individual gags until the damage is insufficient
  let i = 0;
  while (i != combo.gags.length-1) {
    for (i = combo.gags.length-1; i >= 0; i--) {
      if (combo.gags[i].lvl === 0) {
        break;
      }
      combo.gags[i].lvl -= 1;
      if (!combo.damageKillsCog()) {
        combo.gags[i].lvl += 1;
        break
      }
    }
  }

  // Check if organic is actually necessary for the combo
  if (gagTrack === 'drop' && isStunOrg) {
    combo.gags[0].isOrg = false;
    if (!combo.damageKillsCog())
      combo.gags[0].isOrg = true;
  }
  if (numOrg > 0) {
    const offset = gagTrack === 'drop' ? 1 : 0;
    let i = offset;
    for (; i < numOrg + offset; i++) {
      combo.gags[i].isOrg = false;
      if (!combo.damageKillsCog()) {
        combo.gags[i].isOrg = true;
      }
    }
  }

  combo.gags.sort((gag1, gag2) => gag2.damage - gag1.damage);

  // In a drop combo, attempt to lower gag level of stun gag
  if (gagTrack === 'drop') {
    combo.gags.sort((gag1, gag2) => {
      if (gag1.track !== 'drop') return -1;
      else return gag2.damage - gag1.damage;
    });

    if (combo.gags[0].lvl > 5 && combo.gags[1].lvl < 6) {
      combo.gags[0].lvl -= 1;
      combo.gags[1].lvl += 1;
      if (!combo.damageKillsCog()) {
        combo.gags[0].lvl += 1;
        combo.gags[1].lvl -= 1;
      }
    }
    while (combo.damageKillsCog() && combo.gags[0].lvl > 0) {
      combo.gags[0].lvl -= 1;
    }
    combo.gags[0].lvl += 1;
  }

  return combo;
}

/**
 * @param {Combo} combo
 */
export function logTable(combo) {
  console.log('Input:');
  console.table({
    'Game': combo.game === 'ttr' ? 'Toontown Rewritten' : 'Toontown Online (Classic)',
    'Num Toons': combo.numToons,
    'Cog Level': combo.cog.lvl,
    'Is Cog Lured?': combo.isLured,
    'Gag Track': combo.gagTrack,
    ...(combo.gagTrack === 'drop' && { 'Stun Gag Track': combo.stunTrack }),
    'Organic Gags': Object.entries(combo.organicGags)
      .map(([track, num]) => !num ? null : `${track[0].toUpperCase()}${track.slice(1)}: ${num}`)
      .filter(s => s !== null)
      .join(', '),
  });
  console.log('Combo:');
  console.table(
    combo.gags.reduce((newObj, gag, i) => {
      newObj[`Gag ${i+1}`] = {
        'Name': `${gag.name}${gag.isOrg ? ' (Organic)' : ''}`,
        'Level': gag.lvl,
        'Damage': gag.damage,
      };
      return newObj;
    }, {})
  );
  const multipliers = [];
  if (combo.trackCounts()[combo.gagTrack] >= 2)
    multipliers.push('Same type bonus (20%)');
  if (combo.isLured && [combo.gagTrack, combo.stunTrack].some(track => new Set(['throw', 'squirt']).has(track)))
    multipliers.push('Knockback bonus (50%)');
  console.log('Details:');
  console.table({
    'Total base damage': combo.gags.reduce((sum, gag) => sum + gag.damage, 0),
    'Damage Multipliers': multipliers.join(', ') || '<None>',
    'Final damage calculated': combo.damage(),
    'Cog HP': combo.cog.hp,
  });
}

export default findCombo;

