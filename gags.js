const cogHp = {
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

  get Hp() {
    return cogHp[this.lvl];
  }

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

  get name() {
    if (this.lvl === 0) {
      return 'None';
    }
    return gags[this.track][this.lvl].name;
  }

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
    let tc = combo.trackCounts();
    const multi = 1 + (tc[this.track] >= 2 ? 0.2 : 0) + (
      (combo.isLured && (this.track === 'throw' ||
              this.track === 'squirt')
      ) ? 0.5 : 0)
    return multi;
  }

  toString() {
    return `Gag(name: ${this.name}, level: ${this.lvl}, damage: ${this.damage})`;
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

  trackCounts() {
    let tc = {};
    this.gags.forEach((gag) => {
      if (gag.lvl !== 0) {
        gag.track in tc ? tc[gag.track] += 1 : tc[gag.track] = 1;
      }
    });
    return tc;
  }

  damage() {
    let dmg = 0;
    this.gags.forEach((gag) => {
      dmg += gag.damage * gag.multiplier(this);
    });
    return Math.ceil(dmg);
  }

  toString() {
    return `Combo(gags: [${this.gags.join(', ')}], damage: ${this.damage()})`;
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
function findCombo({ cogLvl, gagTrack, numToons, isLured, stunTrack = null } = {}) {
  let cog = new Cog(cogLvl);
  let combo;
  // Populate the inital combo with level 1 gags
  if (gagTrack === 'drop') {
    combo = new Combo([new Gag(stunTrack, 1)], isLured, gagTrack, stunTrack);
    for (let i = 0; i < numToons-1; i++) {
      combo.gags.push(new Gag(gagTrack, 1));
    }
  } else {
    combo = new Combo([], isLured, gagTrack);
    for (let i = 0; i < numToons; i++) {
      combo.gags.push(new Gag(gagTrack, 1));
    }
  }
  // Increase the level of each gag until the damage is sufficient
  while (combo.damage() < cog.Hp) {
    combo.gags = combo.gags.map((gag) => {
      if (gag.gagTrack == stunTrack && gag.lvl > 4) {
        gag.lvl = 5;
      } else {
        gag.lvl += 1;
      }
      return gag;
    });
  }
  // Decrease the level of individual gags until the damage is insufficient
  let i = 0;
  while (i != combo.gags.length-1) {
    for (i = combo.gags.length-1; i >= 0; i--) {
      if (combo.gags[i].lvl === 0) {
        break;
      }
      combo.gags[i].lvl -= 1;
      if (combo.damage() < cog.Hp) {
        combo.gags[i].lvl += 1;
        break
      }
    }
  }

  // In a drop combo, attempt to lower gag level of stun gag
  if (gagTrack === 'drop') {
    if (combo.gags[0].lvl > 5 && combo.gags[1].lvl < 6) {
      combo.gags[0].lvl -= 1;
      combo.gags[1].lvl += 1;
      if (combo.damage() < cog.Hp) {
        combo.gags[0].lvl += 1;
        combo.gags[1].lvl -= 1;
      }
    }
    while (combo.damage() >= cog.Hp && combo.gags[0].lvl > 0) {
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
function logTable(args, combo) {
  console.log('Input:');
  console.table({
    'Num Toons': args.numToons,
    'Cog Level': args.cogLvl,
    'Is Cog Lured?': args.isLured,
    'Gag Track': args.gagTrack,
    ...(args.gagTrack === 'drop' && { 'Stun Gag Track': args.stunTrack }),
  });
  console.log('Combo:');
  console.table(
    combo.gags.reduce((newObj, gag, i) => {
      newObj[`Gag ${i+1}`] = {
        'Name': gag.name,
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

module.exports = findCombo;

const args = {
  numToons: 2,  // 4 | 3 | 2
  cogLvl: 11,  // 1 - 12
  isLured: true,  // true | false
  gagTrack: 'drop',  // 'sound' | 'throw' | 'squirt' | 'drop'
  stunTrack: 'sound',  // 'sound' | 'throw' | 'squirt'
};

const combo = findCombo(args);
logTable(args, combo);

