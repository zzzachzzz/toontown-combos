import {
  GagTrack, GagTracks, gags, gagTracksOrder, cogHp, SosToons, sosToonGags,
} from './constants';

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

    if (this.isOrg && baseDmg > 0) {
      return baseDmg + Math.ceil(baseDmg * Gag.orgBonusMultiplier(this.track));
    } else {
      return baseDmg;
    }
  }

  static orgBonusMultiplier(track: GagTrack): number {
    switch (track) {
      case GagTracks.toonup:
        return 0.20;
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
  multipliers(combo: Combo, cog?: Cog): { multi: boolean; knockback: boolean; } {
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
      knockback: this.knockback(combo, cog),
    };
  }

  knockback(combo: Combo, cog?: Cog): boolean {
    const tc = combo.trackCounts();
    // 2 options for isLured:
    // - Cog already in lured state `cog.isLured`
    // - Cog to become lured from presence of lure gag in combo
    if ((!cog || !cog.isLured) && tc['lure'] === 0)
      return false;
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

export class SosToonGag extends Gag {
  constructor(sosToon: SosToons) {
    super({
      track: SosToonGag.getTrackFromSosToon(sosToon),
      lvl: SosToonGag.getLvlFromSosToon(sosToon),
      isOrg: false,
    });
  }

  static fromTrackAndLvl(
    track: GagTracks.trap | GagTracks.sound | GagTracks.drop,
    lvl: number,
  ): SosToonGag {
    const { sosToon } = sosToonGags[track][lvl];
    return new SosToonGag(sosToon);
  }

  private static getTrackFromSosToon(sosToon: SosToons): GagTrack {
    switch (sosToon) {
      case SosToons.ClerkWill:
      case SosToons.ClerkPenny:
      case SosToons.ClerkClara:
        return GagTracks.trap;
      case SosToons.BarbaraSeville:
      case SosToons.SidSonata:
      case SosToons.MoeZart:
        return GagTracks.sound;
      case SosToons.ClumsyNed:
      case SosToons.FranzNeckvein:
      case SosToons.BarnacleBessie:
        return GagTracks.drop;
      default:
        throw new Error(`Unmatched SosToons value '${sosToon}'`);
    }
  }

  private static getLvlFromSosToon(sosToon: SosToons): number {
    switch (sosToon) {
      case SosToons.ClerkWill:
      case SosToons.BarbaraSeville:
      case SosToons.ClumsyNed:
        return 1;
      case SosToons.ClerkPenny:
      case SosToons.SidSonata:
      case SosToons.FranzNeckvein:
        return 2;
      case SosToons.ClerkClara:
      case SosToons.MoeZart:
      case SosToons.BarnacleBessie:
        return 3;
      default:
        throw new Error(`Unmatched SosToons value '${sosToon}'`);
    }
  }

  get sosToon(): SosToons {
    return sosToonGags[this.track as GagTracks.trap | GagTracks.sound | GagTracks.drop][this.lvl].sosToon;
  }

  override get name(): string {
    return sosToonGags[this.track as GagTracks.trap | GagTracks.sound | GagTracks.drop][this.lvl].name;
  }

  override get damage(): number {
    return sosToonGags[this.track as GagTracks.trap | GagTracks.sound | GagTracks.drop][this.lvl].damage;
  }
}

export class Combo {
  gags: Array<Gag>;

  constructor({ gags }: {
    gags: Array<Gag>;
  }) {
    this.gags = gags;
  }

  /** Create new `Combo` instance, copied from another instance */
  static fromCombo(combo: Combo): Combo {
    return new Combo({
      gags: combo.gags.map(g => Gag.fromGag(g)),
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

  /** A mapping of gag tracks to their respective number of organic gags in the combo */
  orgTrackCounts(): Record<GagTrack, number> {
    return this.gags.reduce((acc, gag) => {
      if (gag.lvl !== 0 && gag.isOrg) {
        acc[gag.track] += 1;
      }
      return acc;
    }, Object.fromEntries(Object.values(GagTracks).map(gt => [gt, 0])) as Record<GagTracks, number>);
  }

  /**
   * Returns an array of an array of gags, grouped by track,
   * sorted in the usual gag track order.
   * Level 0 (pass) gags are filtered out.
   */
  gagsGroupedByTrack(): Array<Array<Gag>> {
    // Filter creates new array, we can sort without mutating `this.gags`
    const gags = this.gags
      .filter(g => g.lvl !== 0)
      .sort(sortFnGags);

    if (gags.length === 0) return [];

    const groups: Array<Array<Gag>> = [[gags[0]]];
    for (let i = 1; i < gags.length; i++) {
      if (gags[i].track === gags[i - 1].track) {
        groups[groups.length - 1].push(gags[i]);
      } else {
        groups.push([gags[i]]);
      }
    }
    return groups;
  }

  damage({ cog, additionalGagMultiplier = 0, onlyTrack }: {
    cog?: Cog;
    additionalGagMultiplier?: number;
    onlyTrack?: GagTrack;
  } = {}): number {
    return this.gagsGroupedByTrack().reduce((dmg, gags) => {
      if (onlyTrack && gags[0].track !== onlyTrack)
        return dmg;
      // If multiple traps are in the combo, they cancel each other out, don't included the trap damage
      if (gags[0].track === GagTracks.trap && gags.length >= 2)
        return dmg;

      const { multi, knockback } = gags[0].multipliers(this, cog);

      // https://github.com/zzzachzzz/toontown-combos/issues/34#issuecomment-2282841602
      // "When damage is reduced (+25% Defense) it applies to the gags..."
      // Meaning that `additionalGagMultiplier` is applied to each individual gag's base damage
      if (additionalGagMultiplier <= 0) {
        const sumBaseDmgs = gags.reduce(
          (acc, gag) => acc + Math.floor(gag.damage * (1 + additionalGagMultiplier)),
          0
        );
        return (
          dmg
          + sumBaseDmgs
          + (knockback ? Math.ceil(sumBaseDmgs * 0.5) : 0)
          + (multi ? Math.ceil(sumBaseDmgs * 0.2) : 0)
        );
      // "...but when it's increased (+25/50% Damage, -20/40/50/60% Defense) it doesn't."
      // In this case, `additionalGagMultiplier` is combined with the "orange damage" or "knockback damage",
      // even in the case where there is no gag knockback.
      } else {
        const sumBaseDmgs = gags.reduce((acc, gag) => acc + gag.damage, 0);
        return (
          dmg
          + sumBaseDmgs
          + Math.ceil(
            sumBaseDmgs * (
              (knockback ? 0.5 : 0)
              + additionalGagMultiplier
            )
          )
          + (multi ? Math.ceil(sumBaseDmgs * 0.2) : 0)
        );
      }
    }, 0);
  }

  damageKillsCog(cog: Cog, additionalGagMultiplier?: number): boolean {
    return this.damage({ cog, additionalGagMultiplier }) >= cog.hp;
  }
}

export class FindComboResult {
  combo: Combo;
  cog: Cog;
  gagsInput: Partial<Record<GagTrack, number>>;
  organicGagsInput: Partial<Record<GagTrack, number>>;
  additionalGagMultiplier?: number;

  constructor({ combo, cog, gagsInput, organicGagsInput, additionalGagMultiplier }: {
    combo: Combo;
    cog: Cog;
    gagsInput: Partial<Record<GagTrack, number>>;
    organicGagsInput: Partial<Record<GagTrack, number>>;
    additionalGagMultiplier?: number;
  }) {
    this.combo = combo
    this.cog = cog;
    this.gagsInput = Combo.cleanGagCounts(gagsInput ?? {});
    this.organicGagsInput = Combo.cleanGagCounts(organicGagsInput ?? {});
    this.additionalGagMultiplier = additionalGagMultiplier;
  }

  inputKey() {
    const cog = { lvl: this.cog.lvl, isLured: this.cog.isLured };
    const gags = this.gagsInput;
    const organicGags = this.organicGagsInput;

    return { cog, gags, organicGags };
  }

  outputKey() {
    const gags = [...this.combo.gags]
      .sort(sortFnGags)
      .map(gag => {
        const dmg = gag.damage;
        const { lvl, track } = gag;
        const { multi, knockback } = gag.multipliers(this.combo, this.cog);
        return { track, lvl, dmg, multi, knockback };
      })

    const dmg = this.combo.damage({ cog: this.cog, additionalGagMultiplier: this.additionalGagMultiplier });

    return { dmg, gags };
  }

  damage(): number {
    return this.combo.damage({ cog: this.cog, additionalGagMultiplier: this.additionalGagMultiplier });
  }

  damageKillsCog(): boolean {
    return this.combo.damageKillsCog(this.cog);
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
  minGagLvl?: number | null;
};

export function findCombo({
  cogLvl,
  isLured,
  gags,
  organicGags,
  minGagLvl = null,
}: FindComboArgs): FindComboResult {
  // Validate `gags` input
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

  // Validate `minGagLvl` input
  if (minGagLvl !== null && (minGagLvl < 1 || minGagLvl > 7)) {
    throw new Error(`\`minGagLvl\` argument must be 1 <= n <= 7. Received ${minGagLvl}.`);
  }

  const comboGags: Array<Gag> = Object.entries(gags).reduce((acc, [track, numGags]) => {
    for (let i = 0; i < numGags; i++) {
      const isOrg = i <= (organicGags[track as GagTrack] ?? 0) - 1;
      acc.push(new Gag({
        track: track as GagTrack,
        lvl: minGagLvl ?? 1,
        isOrg,
      }));
    }
    return acc;
  }, [] as Array<Gag>);

  // Sort by damage high to low for the algorithm
  comboGags.sort((gag1, gag2) => gag2.damage - gag1.damage);

  const cog = new Cog({ lvl: cogLvl, isLured });

  let combo = new Combo({ gags: comboGags });

  combo = _findCombo(combo, cog, minGagLvl);

  combo.gags.sort(sortFnGags);

  return new FindComboResult({
    combo,
    cog,
    gagsInput: gags,
    organicGagsInput: organicGags,
  });
}

/**
 * Core combo algorithm. Note that the `combo` argument is mutated.
 */
function _findCombo(
  combo: Combo,
  cog: Cog,
  minGagLvl: number | null,
): Combo {
  // Increase the level of each gag until the damage is sufficient
  while (!combo.damageKillsCog(cog)) {
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
  if (!combo.damageKillsCog(cog)) {
    combo.gags = combo.gags.map(g => new Gag({ track: g.track, lvl: 0, isOrg: g.isOrg }));
    return combo;
  }

  // Decrease the level of individual gags until the damage is insufficient
  let i = 0;
  while (i !== combo.gags.length-1) {
    for (i = combo.gags.length-1; i >= 0; i--) {
      if (combo.gags[i].lvl === 0) {
        break;
      }
      if (minGagLvl !== null && combo.gags[i].lvl === minGagLvl) {
        combo.gags[i].lvl = 0;
        if (!combo.damageKillsCog(cog)) {
          combo.gags[i].lvl = minGagLvl;
          break
        }
      } else {
        combo.gags[i].lvl -= 1;
        if (!combo.damageKillsCog(cog)) {
          combo.gags[i].lvl += 1;
          break
        }
      }
    }
  }

  const orgsAvailable = combo.orgTrackCounts();

  // Check if organics are necessary for combo
  for (const gag of combo.gags)
    gag.isOrg = false;

  /**
   * Optimize combo by prioritizing low level organics over high level organics.
   * May require multiple passes... see comments in function calls below.
   */
  const tryOptimizeOrganics = (combo: Combo): Combo => {
    for (let i = combo.gags.length - 1; i >= 0; i--) {
      const gag = combo.gags[i];
      if (orgsAvailable[gag.track] === 0)
        continue;
      if (combo.orgTrackCounts()[gag.track] >= orgsAvailable[gag.track]) {
        for (let j = combo.gags.length - 1; j >= 0; j--) {
          const gag2 = combo.gags[j];
          if (gag2.track === gag.track && gag2.isOrg) {
            gag2.isOrg = false;
            break;
          }
        }
      }
      if (combo.damageKillsCog(cog))
        break;
      if (gag.lvl > 0)
        gag.isOrg = true;
      if (combo.damageKillsCog(cog))
        break;
    }
    return combo;
  };

  // Yeah this is stupid... 2 passes seems to suffice. A combo where 2 passes are required is:
  // Lvl 10 cog 132 hp
  // 4 sound, 2 org sound
  // Fog (org) | Trunk | Aoogah (org) | Aoogah
  // 132 damage
  combo = tryOptimizeOrganics(combo);
  combo = tryOptimizeOrganics(combo);

  // If drop combo, keep other gags around for stun bonus even if the damage is unneeded
  if (combo.trackCounts()['drop'] > 0) {
    for (let i = 0; i < combo.gags.length; i++) {
      if (combo.gags[i].track !== 'drop' && combo.gags[i].lvl === 0) {
        combo.gags[i].lvl = minGagLvl ?? 1;
      }
    }
  }

  return combo;
}

/** Sort gags based on track order, then damage high to low. */
export function sortFnGags(gag1: Gag, gag2: Gag): number {
  const cmpTrack = gagTracksOrder[gag1.track] - gagTracksOrder[gag2.track];
  if (cmpTrack !== 0) return cmpTrack;
  return gag2.damage - gag1.damage;
}

export function logTable(findComboRes: FindComboResult): void {
  const { combo, cog, additionalGagMultiplier } = findComboRes;

  const fmtInputGags = (gags: Partial<Record<GagTrack, number>>) => {
    const _gags = Object.entries(gags)
      .map(([track, num]) => !num ? null : `${track[0].toUpperCase()}${track.slice(1)}: ${num}`)
      .filter(s => s !== null)
    if (_gags.length === 0) return 'None';
    return _gags.join(', ');
  };

  console.log('Input:');
  console.table({
    'Cog Level': cog.lvl,
    'Is Cog Lured?': cog.isLured,
    'Gags': fmtInputGags(findComboRes.gagsInput),
    'Organic Gags': fmtInputGags(findComboRes.organicGagsInput),
  });
  // TODO Additional support for logging of `additionalGagMultiplier`
  console.log('Combo:');
  console.table(
    combo.gags.reduce((newObj, gag, i) => {
      const { multi, knockback } = gag.multipliers(combo, cog);
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
    'Final damage calculated': combo.damage({ cog, additionalGagMultiplier }),
    'Cog HP': cog.hp,
  });
}

