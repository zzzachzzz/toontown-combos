export const cogHp = {
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

class Cog {
  /**
   * @param {number} lvl
   */
  constructor(lvl) {
    this.lvl = lvl;
  }

  /**
   * @return {number}
   */
  get Hp() {
    return cogHp[this.lvl];
  }

  /**
   * @return {string}
   */
  toString() {
    return `Cog(level: ${this.lvl}, HP: ${this.Hp})`;
  }
}

class Gag {
  /**
   * @param {string} track
   * @param {number} lvl
   * @param {boolean} [isOrg=false]
   */
  constructor(track, lvl, isOrg = false) {
    this.track = track;
    this.lvl = lvl;
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
    const baseDmg = gags[this.track][this.lvl].damage;
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
   * @param {Array<Gag>} gags
   * @param {boolean} isLured
   * @param {string} gagTrack
   * @param {string} [stunTrack=null]
   */
  constructor(gags, isLured, gagTrack, stunTrack=null) {
    this.gags = gags;
    this.numToons = gags.length;
    this.isLured = isLured;
    this.gagTrack = gagTrack;
    this.stunTrack = stunTrack;
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
   * @return {string}
   */
  toString() {
    return `Combo(damage: ${this.damage()} gags: [\n${this.gags.map(g => `  ${g}`).join(',\n')}\n])`;
  }
}

/**
 * @param {Object<string, any>} args
 * @param {number} args.cogLvl
 * @param {string} args.gagTrack - 'sound' | 'throw' | 'squirt' | 'drop'
 * @param {number} args.numToons
 * @param {boolean} args.isLured
 * @param {string} [args.stunTrack=null] 'sound' | 'throw' | 'squirt'
 * @return {Combo}
 */
function findCombo({ cogLvl, gagTrack, numToons, isLured, organicGags, stunTrack = null } = {}) {
  const cog = new Cog(cogLvl);
  let combo, isStunOrg;
  const numOrg = Math.min(
    organicGags[gagTrack] || 0,
    gagTrack === 'drop' ? numToons - 1 : numToons
  );

  /**
   * @return {boolean}
   */
  const damageKillsCog = () => combo.damage() >= cog.Hp;

  // Populate the inital combo with level 1 gags
  if (gagTrack === 'drop') {
    if (stunTrack === null) throw new Error('Stun gag track not specified by `stunTrack` argument');
    isStunOrg = organicGags[stunTrack] >= 1;
    combo = new Combo([new Gag(stunTrack, 1, isStunOrg)], isLured, gagTrack, stunTrack);
    for (let i = 0; i < numToons-1; i++) {
      const isOrg = i <= numOrg - 1;
      combo.gags.push(new Gag(gagTrack, 1, isOrg));
    }
  } else {
    combo = new Combo([], isLured, gagTrack);
    for (let i = 0; i < numToons; i++) {
      const isOrg = i <= numOrg - 1;
      combo.gags.push(new Gag(gagTrack, 1, isOrg));
    }
  }
  // Increase the level of each gag until the damage is sufficient
  while (!damageKillsCog()) {
    for (const gag of combo.gags) {
      if (gagTrack === 'drop' && gag.track === stunTrack && gag.lvl > 4) {
        continue;
      } else {
        gag.lvl += 1;
      }
    }
  }
  // Prioritize a lvl 6 stun gag over any lvl 7 gag
  if (gagTrack === 'drop' && combo.gags.slice(1).some(gag => gag.lvl === 7)) {
    combo.gags[0].lvl += 1;
    combo.gags[1].lvl -= 1;
    if (!damageKillsCog()) {
      combo.gags[0].lvl -= 1;
      combo.gags[1].lvl += 1;
    }
  }
  // Decrease the level of individual gags until the damage is insufficient
  let i = 0;
  while (i != combo.gags.length-1) {
    for (i = combo.gags.length-1; i >= 0; i--) {
      if (combo.gags[i].lvl === 0) {
        break;
      }
      combo.gags[i].lvl -= 1;
      if (!damageKillsCog()) {
        combo.gags[i].lvl += 1;
        break
      }
    }
  }

  // Check if organic is actually necessary for the combo
  if (gagTrack === 'drop' && isStunOrg) {
    combo.gags[0].isOrg = false;
    if (!damageKillsCog())
      combo.gags[0].isOrg = true;
  }
  if (numOrg > 0) {
    const offset = gagTrack === 'drop' ? 1 : 0;
    let i = offset;
    for (; i < numOrg + offset; i++) {
      combo.gags[i].isOrg = false;
      if (!damageKillsCog()) {
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
      if (!damageKillsCog()) {
        combo.gags[0].lvl += 1;
        combo.gags[1].lvl -= 1;
      }
    }
    while (damageKillsCog() && combo.gags[0].lvl > 0) {
      combo.gags[0].lvl -= 1;
    }
    combo.gags[0].lvl += 1;
  }

  return combo;
}

/**
 * @param {Object<any, string>} args
 * @param {Combo} combo
 */
export function logTable(args, combo) {
  console.log('Input:');
  console.table({
    'Num Toons': args.numToons,
    'Cog Level': args.cogLvl,
    'Is Cog Lured?': args.isLured,
    'Gag Track': args.gagTrack,
    ...(args.gagTrack === 'drop' && { 'Stun Gag Track': args.stunTrack }),
    'Organic Gags': Object.entries(args.organicGags)
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
    ...(args.cogLvl !== null && { 'Cog HP': cogHp[args.cogLvl] }),
  });
}

export default findCombo;

