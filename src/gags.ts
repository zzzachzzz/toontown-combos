import { GagTrack, GagTracks } from './constants';

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

const gagTracksOrder: Record<GagTracks, number> = {
  [GagTracks.toonup]: 0,
  [GagTracks.trap]: 1,
  [GagTracks.lure]: 2,
  [GagTracks.sound]: 3,
  [GagTracks.throw]: 4,
  [GagTracks.squirt]: 5,
  [GagTracks.drop]: 6,
};

const gags: Record<string, Record<number, { name: string; damage: number; }>> = {
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

export class Cog {
  lvl: number;
  isLured: boolean;

  constructor({ lvl, isLured }: {
    lvl: number;
    isLured: boolean;
  }) {
    this.lvl = lvl;
    this.isLured = isLured;
  }

  get hp(): number {
    return cogHp[this.lvl];
  }

  toString(): string {
    return `Cog(level: ${this.lvl}, HP: ${this.hp})`;
  }
}

export class Gag {
  track: GagTrack;
  lvl: number;
  isOrg: boolean;

  constructor({ track, lvl, isOrg = false }: {
    track: GagTrack;
    lvl: number;
    isOrg?: boolean;
  }) {
    this.track = track;
    this.lvl = lvl;
    this.isOrg = isOrg;
  }

  /** Create new `Combo` instance, copied from another instance */
  static fromGag(gag: Gag): Gag {
    return new Gag({
      track: gag.track, lvl: gag.lvl, isOrg: gag.isOrg
    });
  }

  get name(): string {
    if (this.lvl === 0) {
      return 'None';
    }
    return gags[this.track][this.lvl].name;
  }

  get damage(): number {
    if (this.lvl === 0) {
      return 0;
    }
    const baseDmg = gags[this.track][this.lvl].damage;

    if (this.isOrg) {
      if (baseDmg < 10) return baseDmg + 1;
      else return Math.ceil(baseDmg * (1 + this.orgBonus()));
    } else {
      return baseDmg;
    }
  }

  orgBonus(): number {
    switch (this.track) {
      case GagTracks.squirt:
      case GagTracks.drop:
        return 0.15;
      default:
        return 0.10;
    }
  }

  /**
   * Return true/false if the gag receives multi same gag type bonus,
   * and true/false if the gag receives knockback bonus.
   */
  multipliers(combo: Combo): { multi: boolean; knockback: boolean; } {
    if (this.lvl === 0)
      return { multi: false, knockback: false };

    if (
         this.track === GagTracks.toonup
      || this.track === GagTracks.trap
      || this.track === GagTracks.lure
    )
      return { multi: false, knockback: false };

    const tc = combo.trackCounts();
    return {
      multi: tc[this.track] >= 2,
      knockback: this.knockback(combo),
    };
  }

  multiplier(combo: Combo): number {
    const _multipliers = this.multipliers(combo);
    return (
      1
      + (_multipliers.multi ? 0.2 : 0)
      + (_multipliers.knockback ? 0.5 : 0)
    );
  }

  knockback(combo: Combo): boolean {
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

  toString(): string {
    return `Gag(name: ${this.name}, level: ${this.lvl}, damage: ${this.damage}, isOrg: ${this.isOrg})`;
  }
}

export class Combo {
  gags: Array<Gag>;
  cog: Cog;
  gagsInput: Partial<Record<GagTrack, number>>;
  organicGagsInput: Partial<Record<GagTrack, number>>;

  constructor({ gags, cog, gagsInput, organicGagsInput }: {
    gags: Array<Gag>;
    cog: Cog;
    gagsInput?: Partial<Record<GagTrack, number>>;
    organicGagsInput?: Partial<Record<GagTrack, number>>;
  }) {
    this.gags = gags;
    this.cog = cog;
    this.gagsInput = Combo.cleanGagCounts(gagsInput ?? {});
    this.organicGagsInput = Combo.cleanGagCounts(organicGagsInput ?? {});
  }

  /** Create new `Combo` instance, copied from another instance */
  static fromCombo(combo: Combo): Combo {
    return new Combo({
      gags: combo.gags.map(g => Gag.fromGag(g)),
      cog: combo.cog,
      gagsInput: combo.gagsInput,
      organicGagsInput: combo.organicGagsInput,
    });
  }

  /**
   * Util omitting gag tracks entries with non 1+ values,
   * and sorting the keys order to match the correct gag track order.
   * Used for handling the constructor params `gagsInput` & `organicGagsInput`.
   */
  static cleanGagCounts(gagCounts: Partial<Record<GagTrack, number>>): Partial<Record<GagTrack, number>> {
    return Object.values(GagTracks).reduce((acc, track) => {
      if (gagCounts.hasOwnProperty(track) && gagCounts[track]! > 0)
        acc[track] = gagCounts[track];
      return acc;
    }, {} as Partial<Record<GagTrack, number>>);
  }

  /** A mapping of gag tracks to their respective number of gags in the combo */
  trackCounts(): Record<GagTrack, number> {
    return this.gags.reduce((acc, gag) => {
      if (gag.lvl !== 0) {
        acc[gag.track] += 1;
      }
      return acc;
    }, Object.fromEntries(Object.values(GagTracks).map(gt => [gt, 0])) as Record<GagTracks, number>);
  }

  damage(): number {
    const dmg = this.gags.reduce((dmg, gag) => {
      return dmg + (
        gag.damage
        * gag.multiplier(this)
      );
    }, 0);
    return Math.ceil(dmg);
  }

  damageKillsCog(): boolean {
    return this.damage() >= this.cog.hp;
  }

  inputKey() {
    const cog = { lvl: this.cog.lvl, isLured: this.cog.isLured };
    const gags = this.gagsInput;
    const organicGags = this.organicGagsInput;

    return { cog, gags, organicGags };
  }

  outputKey() {
    const gags = [...this.gags]
      .sort(sortFnGags)
      .map(gag => {
        const dmg = gag.damage;
        const { lvl, track } = gag;
        const { multi, knockback } = gag.multipliers(this);
        return { track, lvl, dmg, multi, knockback };
      })

    const dmg = this.damage();

    return { dmg, gags };
  }

  toString(): string {
    return `Combo(damage: ${this.damage()} gags: [\n${this.gags.map(g => `  ${g}`).join(',\n')}\n])`;
  }
}

export type FindComboArgs = {
  cogLvl: number;
  isLured: boolean;
  /**
   * Mapping of gag track to number of gags to use in the combo.
   * Sum of numbers must be 1 <= n <= 4.
   */
  gags: Partial<Record<GagTrack, number>>;
  organicGags: Partial<Record<GagTrack, number>>;
};

export function findCombo({
  cogLvl,
  isLured,
  gags,
  organicGags,
}: FindComboArgs): Combo {
  let sumGags = 0;
  for (const [key, val] of Object.entries(gags)) {
    if (!GagTracks.hasOwnProperty(key)) {
      throw new Error(
        `Unrecognized gag track key '${key}' in \`gags\` argument. ` +
        `Must be one of: ${Object.values(GagTracks).map(gt => "'" + gt + "'").join(', ')}`
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

  const comboGags: Array<Gag> = Object.entries(gags).reduce((acc, [track, numGags]) => {
    for (let i = 0; i < numGags; i++) {
      const isOrg = i <= (organicGags[track as GagTrack] ?? 0) - 1;
      acc.push(new Gag({
        track: track as GagTrack,
        lvl: 1,
        isOrg,
      }));
    }
    return acc;
  }, [] as Array<Gag>);

  // Sort by damage high to low for the algorithm
  comboGags.sort((gag1, gag2) => gag2.damage - gag1.damage);

  const cog = new Cog({ lvl: cogLvl, isLured });

  let combo = new Combo({
    gags: comboGags,
    cog,
    gagsInput: gags,
    organicGagsInput: organicGags,
  });

  combo = _findCombo(combo);

  combo.gags.sort(sortFnGags);

  return combo;
}

/**
 * Core combo algorithm. Note that the `combo` argument is mutated.
 */
function _findCombo(combo: Combo): Combo {
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
    combo.gags = combo.gags.map(g => new Gag({ track: g.track, lvl: 0, isOrg: g.isOrg }));
    return combo;
  }

  const hasDrop = combo.trackCounts()['drop'] > 0;

  // Decrease the level of individual gags until the damage is insufficient
  let i = 0;
  while (i !== combo.gags.length-1) {
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

  // Check if organics are necessary for combo
  for (let i = 0; i < combo.gags.length; i++) {
    combo.gags[i].isOrg = false;
    if (!combo.damageKillsCog()) {
      combo.gags[i].isOrg = true;
    }
  }

  // If drop combo, keep other gags around for stun bonus even if the damage is unneeded
  if (hasDrop) {
    for (let i = 0; i < combo.gags.length; i++) {
      if (combo.gags[i].track !== 'drop' && combo.gags[i].lvl === 0) {
        combo.gags[i].lvl = 1;
      }
    }
  }

  return combo;
}

/** Sort gags based on track order, then damage high to low. */
function sortFnGags(gag1: Gag, gag2: Gag): number {
  const cmpTrack = gagTracksOrder[gag1.track] - gagTracksOrder[gag2.track];
  if (cmpTrack !== 0) return cmpTrack;
  return gag2.damage - gag1.damage;
}

export function logTable(combo: Combo): void {
  console.log('Input:');

  const fmtInputGags = (gags: Partial<Record<GagTrack, number>>) => {
    const _gags = Object.entries(gags)
      .map(([track, num]) => !num ? null : `${track[0].toUpperCase()}${track.slice(1)}: ${num}`)
      .filter(s => s !== null)
    if (_gags.length === 0) return 'None';
    return _gags.join(', ');
  };

  console.table({
    'Cog Level': combo.cog.lvl,
    'Is Cog Lured?': combo.cog.isLured,
    'Gags': fmtInputGags(combo.gagsInput),
    'Organic Gags': fmtInputGags(combo.organicGagsInput),
  });
  console.log('Combo:');
  console.table(
    combo.gags.reduce((newObj, gag, i) => {
      const { multi, knockback } = gag.multipliers(combo);
      const multipliers = [];
      if (multi)
        multipliers.push('Same type bonus (20%)');
      if (knockback)
        multipliers.push('Knockback bonus (50%)');

      newObj[`Gag ${i+1}`] = {
        'Name': `${gag.name}${gag.isOrg ? ' (Organic)' : ''}`,
        'Level': gag.lvl,
        'Base Damage': gag.damage,
        'Multipliers': multipliers.length === 0 ? 'None' : multipliers.join(', '),
      };
      return newObj;
    }, {} as any)
  );

  console.log('Details:');
  console.table({
    'Total base damage': combo.gags.reduce((sum, gag) => sum + gag.damage, 0),
    'Final damage calculated': combo.damage(),
    'Cog HP': combo.cog.hp,
  });
}

