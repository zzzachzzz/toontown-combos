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

const gagTracks = {
  'toonup': 'toonup',
  'trap': 'trap',
  'lure': 'lure',
  'sound': 'sound',
  'throw': 'throw',
  'squirt': 'squirt',
  'drop': 'drop',
};

const gagTracksOrder = {
  [gagTracks.toonup]: 0,
  [gagTracks.trap]: 1,
  [gagTracks.lure]: 2,
  [gagTracks.sound]: 3,
  [gagTracks.throw]: 4,
  [gagTracks.squirt]: 5,
  [gagTracks.drop]: 6,
};

const gags = {
  'trap': {
    1: { name: 'Banana Peel',  damage: 12  },
    2: { name: 'Rake',         damage: 20  },
    3: { name: 'Marbles',      damage: 35  },
    4: { name: 'Quicksand',    damage: 50  },
    5: { name: 'Trapdoor',     damage: 85  },
    6: { name: 'TNT',          damage: 180 },
    7: { name: 'Railroad',     damage: 200 },
  },
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
   * @param {boolean} isLured
   * @param {string} game
   */
  constructor(lvl, isLured, game) {
    this.lvl = lvl;
    this.isLured = isLured;
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
  // TODO kwargs with obj
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
   * @return {number}
   */
  multiplier(combo) {
    if (this.lvl === 0)
      return 1;
    // No multipliers applicable for trap.
    // But multiple trap should not be present anyway in the combo.
    if (this.track === 'trap')
      return 1;
    const tc = combo.trackCounts();
    return (
      1
      + (tc[this.track] >= 2 ? 0.2 : 0)
      + (this.knockback(combo) ? 0.5 : 0)
    );
  }

  /**
   * @param {Combo} combo
   * @return {boolean}
   */
  knockback(combo) {
    if (!combo.cog.isLured)
      return false;
    const tc = combo.trackCounts();
    if (tc['trap'] > 0)
      return false;
    if (tc['sound'] > 0)
      return false;
    if (this.track === 'throw')
      return true;
    if (this.track === 'squirt' && tc['throw'] === 0)
      return true;
    return false;
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
    organicGags = {},
  }) {
    this.game = game;
    this.cog = new Cog(cogLvl, isLured, game);
    this.gags = gags;
    this.organicGags = organicGags;
  }

  /**
   * @return {Object<string, number>} A mapping of gag tracks to their respective number of gags in the combo
   */
  trackCounts() {
    return this.gags.reduce((acc, gag) => {
      if (gag.lvl !== 0) {
        acc[gag.track] += 1;
      }
      return acc;
    }, {
      'toonup': 0,
      'trap': 0,
      'lure': 0,
      'sound': 0,
      'throw': 0,
      'squirt': 0,
      'drop': 0,
    });
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
      numToons,
      isLured,
      gagTrack,
      stunTrack,
      organicGags,
    });
    for (let i = 0; i < numToons-1; i++) {
      const isOrg = i <= numOrg - 1;
      combo.gags.push(new Gag(gagTrack, 1, game, isOrg));
    }
  } else if (gagTrack === 'trap') {
    if (stunTrack === null) throw new Error('Stun gag track not specified by `stunTrack` argument');
    const isOrg = organicGags[gagTrack] >= 1;
    combo = new Combo({
      game,
      cogLvl,
      gags: [new Gag(stunTrack, 1, game, isOrg)],
      numToons,
      isLured,
      gagTrack,
      stunTrack,
      organicGags,
    });
    for (let i = 0; i < numToons-1; i++) {
      const isStunOrg = i <= organicGags[stunTrack] - 1;
      combo.gags.push(new Gag(gagTrack, 1, game, isStunOrg));
    }
  } else {
    combo = new Combo({
      game,
      cogLvl,
      gags: [],
      numToons,
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
      if (
        (gagTrack === 'drop' || gagTrack === 'trap')
        && gag.track === stunTrack
        && gag.lvl > 4
      ) {
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
  // TODO trap
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
  // TODO refactor
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

  // TODO Sort gags based on move track order, then damage
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
  // TODO
  } else if (gagTrack === 'trap') {
    combo.gags.sort((gag1, gag2) => {
      if (gag1.track === 'trap') return -1;
      else return gag2.damage - gag1.damage;
    });

    // TODO refactor
    if (combo.gags[1].lvl > 5 && combo.gags[0].lvl < 6) {
      combo.gags[1].lvl -= 1;
      combo.gags[0].lvl += 1;
      if (!combo.damageKillsCog()) {
        combo.gags[1].lvl += 1;
        combo.gags[0].lvl -= 1;
      }
    }
    while (combo.damageKillsCog() && combo.gags[1].lvl > 0) {
      combo.gags[1].lvl -= 1;
    }
    combo.gags[1].lvl += 1;
  // TODO
  }

  return combo;
}

/**
 * @param {Object} args
 * @param {number} args.cogLvl
 * @param {boolean} args.isLured
 * @param {Object<string, number>} args.gags
 *   Mapping of gag track to number of gags to use in the combo. Sum of numbers must be 1 <= n <= 4.
 * @param {Object<string, number>} args.organicGags
 * @param {string} args.game
 * @return {Combo}
 */
export function findComboV2({
  cogLvl,
  isLured,
  gags,
  organicGags,
  game = 'ttr',
}) {
  let sumGags = 0;
  for (const [key, val] of Object.entries(gags)) {
    if (!gagTracks.hasOwnProperty(key)) {
      throw new Error(
        `Unrecognized gag track key '${key}' in \`gags\` argument. ` +
        `Must be one of: ${Object.keys(gagTracks).map(gt => "'" + gt + "'").join(', ')}`
      );
    }
    if (typeof val !== 'number' || isNaN(val)) {
      throw new Error(`Values in \`gags\` argument must be a number. For key '${key}' got value '${val}'.`);
    }
    if (key === 'trap' && val > 1) {
      throw new Error(`Cannot specify multiple trap gags, must be 0 or 1.`);
    }
    sumGags += val;
  }
  if (sumGags < 1 || sumGags > 4) {
    throw new Error(`Sum of values in \`gags\` argument must be 1 <= n <= 4. Received ${sumGags}.`);
  }

  /** @type {Array<Gag>} */
  const comboGags = Object.entries(gags).reduce((acc, [gagTrack, numGags]) => {
    for (let i = 0; i < numGags; i++) {
      const isOrg = i <= (organicGags[gagTrack] ?? 0) - 1;
      acc.push(new Gag(gagTrack, 1, game, isOrg));
    }
    return acc;
  }, []);

  const combo = new Combo({
    game,
    cogLvl,
    gags: comboGags,
    isLured,
    organicGags,
  });
  // Increase the level of each gag until the damage is sufficient
  while (!combo.damageKillsCog()) {
    for (const gag of combo.gags) {
      if (gag.lvl === 7) {
        continue;
      } else {
        gag.lvl += 1;
      }
    }
    if (combo.gags.every(gag => gag.lvl === 7))
      break;
  }

  // Insufficient damage, killing cog with given parameters is not possible
  if (!combo.damageKillsCog()) {
    combo.gags = combo.gags.map(g => new Gag(g.track, 0, game));
    return combo;
  }

  // Decrease the level of individual gags until the damage is insufficient
  // TODO Maybe combine the org part here? Nah above
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
  // if (gagTrack === 'drop' && isStunOrg) {
  //   combo.gags[0].isOrg = false;
  //   if (!combo.damageKillsCog())
  //     combo.gags[0].isOrg = true;
  // }
  // TODO refactor
  for (let i = 0; i < combo.gags.length; i++) {
    combo.gags[i].isOrg = false;
    if (!combo.damageKillsCog()) {
      combo.gags[i].isOrg = true;
    }
  }

  combo.gags.sort(sortFnGags);

  return combo;
}

/**
 * Sort gags based on track order, then damage high to low.
 *
 * @param {Gag} gag1
 * @param {Gag} gag2
 * @return {number}
 */
function sortFnGags(gag1, gag2) {
  const cmpTrack = gagTracksOrder[gag1.track] - gagTracksOrder[gag2.track];
  if (cmpTrack !== 0) return cmpTrack;
  return gag2.damage - gag1.damage;
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
  // TODO Maybe have a `multipliers()` method on `Combo` that returns this,
  // providing additional info on which track(s) have multipliers added to them.
  const multipliers = [];
  if (combo.trackCounts()[combo.gagTrack] >= 2)
    multipliers.push('Same type bonus (20%)'); // TODO Nope, not for trap. Delegate to Combo class
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
