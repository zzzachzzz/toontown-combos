import {
  GagTrack, GagTracks, GAGS, GAG_TRACKS_ORDER, COG_HP, SosToons, SOS_TOON_GAGS, ADDITIONAL_GAG_MULTIPLIERS,
} from './constants';
import { clamp, defaultdict, Brand, assert } from './util';

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
    return COG_HP[this.lvl];
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

  /** Clone with optional `props` to override */
  clone(props: {
    track?: GagTrack;
    lvl?: number;
    isOrg?: boolean;
  } = {}): Gag {
    return new Gag({
      track: props.track ?? this.track,
      lvl: props.lvl ?? this.lvl,
      isOrg: props.isOrg ?? this.isOrg,
    });
  }

  get name(): string {
    if (this.lvl === 0) {
      return 'None';
    }
    return GAGS[this.track][this.lvl].name;
  }

  get damage(): number {
    if (this.lvl === 0) {
      return 0;
    }
    const baseDmg = GAGS[this.track][this.lvl].damage;

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
  multipliers(combo: Combo, isLured?: boolean): { multi: boolean; knockback: boolean; } {
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
      knockback: this.knockback(combo, isLured),
    };
  }

  knockback(combo: Combo, isLured?: boolean): boolean {
    const tc = combo.trackCounts();
    // 2 options for isLured:
    // - Cog already in lured state `cog.isLured`
    // - Cog to become lured from presence of lure gag in combo
    if (!isLured && tc['lure'] === 0)
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

type SosToonGagTrack = keyof typeof SOS_TOON_GAGS;

export class SosToonGag extends Gag {
  declare track: SosToonGagTrack;

  constructor(sosToon: SosToons) {
    super({
      track: SosToonGag.getTrackFromSosToon(sosToon),
      lvl: SosToonGag.getLvlFromSosToon(sosToon),
      isOrg: false,
    });
  }

  static fromTrackAndLvl(
    track: SosToonGagTrack,
    lvl: number,
  ): SosToonGag {
    const { sosToon } = SOS_TOON_GAGS[track][lvl];
    return new SosToonGag(sosToon);
  }

  override clone(): SosToonGag {
    return new SosToonGag(this.sosToon);
  }

  private static getTrackFromSosToon(sosToon: SosToons): SosToonGagTrack {
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
    return SOS_TOON_GAGS[this.track][this.lvl].sosToon;
  }

  override get name(): string {
    return SOS_TOON_GAGS[this.track][this.lvl].name;
  }

  override get damage(): number {
    return SOS_TOON_GAGS[this.track][this.lvl].damage;
  }
}

export type ComboKey = Brand<string, 'ComboKey'>;

export class Combo {
  gags: Array<Gag>;

  constructor(arg: { gags: Array<Gag> } | Array<Gag>) {
    this.gags = (Array.isArray(arg) ? arg : arg.gags).toSorted(sortFnGags);
  }

  /** Create new `Combo` instance, copied from another instance */
  clone(): Combo {
    return new Combo({
      gags: this.gags.map(g => g.clone()),
    });
  }

  /** A mapping of gag tracks to their respective number of gags in the combo */
  trackCounts(): Record<GagTrack, number> {
    return this.gags.reduce((acc, gag) => {
      if (gag.lvl > 0) acc[gag.track] += 1;
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

  /** Groups gags by track, in the usual gag track order, with lvl 0 gags filtered out. */
  gagsGroupedByTrack(): Partial<Record<GagTrack, Gag[]>> {
    const gags = this.gags
      .filter(g => g.lvl !== 0)
      .toSorted(sortFnGags);

    return Object.groupBy(gags, (gag) => gag.track);
  }

  damage({ isLured, additionalGagMultiplier = 0, onlyTrack }: {
    isLured?: boolean;
    additionalGagMultiplier?: number;
    onlyTrack?: GagTrack;
  } = {}): number {
    return Object.entries(this.gagsGroupedByTrack()).reduce((dmg, [track, gags]) => {
      if (onlyTrack && track !== onlyTrack)
        return dmg;
      // If multiple traps are in the combo, they cancel each other out, don't included the trap damage
      if (track === GagTracks.trap && gags.length >= 2)
        return dmg;

      const { multi, knockback } = gags[0].multipliers(this, isLured);

      // TODO Could probably write a cleaner version of this..? vs the 2 blocks with repetition

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
    return this.damage({ isLured: cog.isLured, additionalGagMultiplier }) >= cog.hp;
  }

  toKey(): ComboKey {
    const parts: string[] = this.gags.toSorted(sortFnGags).map(gag => {
      if (gag.lvl === 0) return "no";
      const gt = gagTrackAbbrev(gag.track, gag.isOrg);
      return `${gt}${gag.lvl}`;
    });

    return parts.join('_') as ComboKey;
  }

  static fromKey(key: ComboKey): Combo {
    return new Combo({
      gags: key.split('_').map(part => {
        const gagTrackAbbrev = part.substring(0, 2);
        const track = gagTrackAbbrevLookup[
          gagTrackAbbrev.toLowerCase() as GagTrackAbbrev<GagTrack, false>
        ];
        const lvl = Number(part[2]);
        if (!track || isNaN(lvl)) throw new Error(`Bad combo key '${key}'`);
        const isOrg = part.startsWith(part.charAt(0).toUpperCase());
        return new Gag({ track, lvl, isOrg });
      })
    });
  }
}

export class FindComboResult {
  args: FindComboArgs;
  combo: Combo | null;

  constructor(args: FindComboArgs, combo: Combo | null) {
    this.combo = combo
    this.args = {
      ...args,
      gags: cleanGagCounts(args.gags),
      organicGags: cleanGagCounts(args.organicGags),
    };
  }

  inputKey(): FindComboArgsKey {
    return findComboArgsToKey(this.args);
  }

  outputKey(): ComboKey {
    if (!this.combo) return "" as ComboKey;
    return this.combo.toKey();
  }

  damage(): number {
    if (!this.combo) return 0;
    const { isLured, additionalGagMultiplier } = this.args;
    return this.combo.damage({ isLured, additionalGagMultiplier });
  }


  shortView() {
    return {
      damage: `${this.damage()}/${this.cog.hp}`,
      inputKey: this.inputKey(),
      outputKey: this.outputKey(),
    };
  }

  get cog(): Cog {
    const { cogLvl: lvl, isLured } = this.args;
    return new Cog({ lvl, isLured });
  }
}

/**
 * Util omitting gag tracks entries with non 1+ values,
 * and sorting the keys order to match the correct gag track order.
 */
export function cleanGagCounts(
  gagCounts: Partial<Record<GagTrack, number>>
): Partial<Record<GagTrack, number>> {
  return Object.values(GagTracks).reduce((acc, track) => {
    if (gagCounts.hasOwnProperty(track) && gagCounts[track]! > 0)
      acc[track] = gagCounts[track];
    return acc;
  }, {} as Partial<Record<GagTrack, number>>);
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
  minGagLvl?: number;
  additionalGagMultiplier?: number;
};

type GagTrackAbbrev<
  GT extends GagTrack,
  Org extends boolean,
> = GT extends `${infer A}${infer B}${string}`
    ? Org extends true
      ? `${Uppercase<A>}${B}`
      : `${A}${B}`
    : never;

function gagTrackAbbrev<
  GT extends GagTrack,
  Org extends boolean,
>(gagTrack: GT, isOrg: Org): GagTrackAbbrev<GT, Org> {
  return (
    isOrg
    ? gagTrack[0].toUpperCase() + gagTrack[1]
    : gagTrack[0] + gagTrack[1]
  ) as GagTrackAbbrev<GT, Org>;
}

const gagTrackAbbrevLookup: { [GT in GagTracks as GagTrackAbbrev<GT, false>]: GT } = {
  to: GagTracks.toonup,
  tr: GagTracks.trap,
  lu: GagTracks.lure,
  so: GagTracks.sound,
  th: GagTracks.throw,
  sq: GagTracks.squirt,
  dr: GagTracks.drop,
};

export type FindComboArgsKey = Brand<string, 'FindComboArgsKey'>;

/** {@link findComboArgs} assumed to be validated already by {@link validateFindComboArgs} */
export function findComboArgsToKey(findComboArgs: FindComboArgs): FindComboArgsKey {
  const { gags, organicGags, minGagLvl, cogLvl, isLured, additionalGagMultiplier } = findComboArgs;

  const parts: string[] = [];

  for (const [gagTrack, numGags] of Object.entries(cleanGagCounts(gags)) as [GagTrack, number][]) {
    let numOrg = organicGags[gagTrack] ?? 0;
    parts.push(...Array.from(
      { length: numGags },
      () => gagTrackAbbrev(gagTrack, numOrg-- > 0)
    ));
  }

  if (minGagLvl != null) parts.push(`min${minGagLvl}`);

  parts.push(`c${cogLvl}`);

  if (isLured) parts.push('l');

  if (additionalGagMultiplier) parts.push(`*${additionalGagMultiplier}`);

  return parts.join('_') as FindComboArgsKey;
}

export function keyToFindComboArgs(key: FindComboArgsKey): Partial<FindComboArgs> {
  const _findComboArgs: Partial<FindComboArgs> = {
    gags: {},
    organicGags: {},
    isLured: false,
  };

  const gags = defaultdict(_findComboArgs.gags!, () => 0);
  const organicGags = defaultdict(_findComboArgs.organicGags!, () => 0);

  return key.split('_').reduce((findComboArgs, part) => {
    if (part.startsWith('*')) {
      findComboArgs.additionalGagMultiplier = Number(part.substring(1));
      return findComboArgs;
    }
    if (part === 'l') {
      findComboArgs.isLured = true;
      return findComboArgs;
    }
    if (part.startsWith('c')) {
      findComboArgs.cogLvl = Number(part.substring(1));
      return findComboArgs;
    }
    if (part.startsWith('min')) {
      findComboArgs.minGagLvl = Number(part.substring(3));
      return findComboArgs;
    }
    for (const gagTrack of Object.values(GagTracks)) {
      if (gagTrack.startsWith(part.toLowerCase())) {
        gags[gagTrack] += 1;
        if (part.startsWith(gagTrack.charAt(0).toUpperCase())) {
          organicGags[gagTrack] += 1;
        }
        return findComboArgs;
      }
    }
    return findComboArgs;
  }, _findComboArgs);
}

/** Assert result of {@link keyToFindComboArgs} */
export function assertFindComboArgs(
  findComboArgs: Partial<FindComboArgs>
): asserts findComboArgs is FindComboArgs {
  const { gags, organicGags, minGagLvl, cogLvl, isLured, additionalGagMultiplier } = findComboArgs;
  const err = new Error(`Invalid \`FindComboArgs\` object:\n${findComboArgs}`);

  if (!gags) throw err;
  if (!organicGags) throw err;
  if (isNaN(minGagLvl!)) throw err;
  if (isNaN(cogLvl!)) throw err;
  if (isLured == null) throw err;
  if (isNaN(additionalGagMultiplier!)) throw err;
}

export function validateFindComboArgs(args: FindComboArgs): void {
  const { cogLvl, gags, organicGags, minGagLvl /* isLured, additionalGagMultiplier */ } = args;

  validateGagTrackRecord(gags, 'gags' satisfies keyof typeof args);
  validateGagTrackRecord(organicGags, 'organicGags' satisfies keyof typeof args);

  // Validate `minGagLvl` input
  if (minGagLvl != null && (minGagLvl < 1 || minGagLvl > 7)) {
    throw new Error(`\`minGagLvl\` argument must be 1 <= n <= 7. Received ${minGagLvl}.`);
  }

  // Validate `cogLvl` input
  if (cogLvl < 1 || cogLvl > 20) {
    throw new Error(`\`cogLvl\` argument must be 1 <= n <= 7. Received ${cogLvl}.`);
  }
}

function validateGagTrackRecord(
  gagTrackRecord: Partial<Record<GagTrack, number>>,
  argName: keyof Pick<FindComboArgs, 'gags' | 'organicGags'>
) {
  let sumGags = 0;
  for (const [key, val] of Object.entries(gagTrackRecord)) {
    if (!GagTracks.hasOwnProperty(key)) {
      throw new Error(
        `Unrecognized gag track key '${key}' in \`${argName}\` argument. ` +
        `Must be one of: ${Object.values(GagTracks).map(gt => "'" + gt + "'").join(', ')}`
      );
    }
    if (typeof val !== 'number' || isNaN(val)) {
      throw new Error(`Values in \`${argName}\` argument must be a number. For key '${key}' got value '${val}'.`);
    }
    if (key === 'trap' && val > 1) {
      throw new Error(`${val} trap gags specified in argument \`${argName}\`. Must be 0 or 1.`);
    }
    sumGags += val;
  }
  const minSumGags = argName === 'gags' ? 1 : 0;
  if (sumGags < minSumGags || sumGags > 4) {
    throw new Error(`Sum of values in \`${argName}\` argument must be ${minSumGags} <= n <= 4. Received ${sumGags}.`);
  }
}

export function findCombo(args: FindComboArgs): Combo | null {
  validateFindComboArgs(args);

  const { cogLvl, isLured, gags, organicGags: _organicGags, minGagLvl, additionalGagMultiplier } = args;

  const comboGags: Gag[] = Object.entries(gags)
    .reduce<Gag[]>((acc, [track, numGags]) => {
      return acc.concat(
        Array.from({ length: numGags }, () => new Gag({
          track: track as GagTrack,
          lvl: minGagLvl ?? 0,
        }))
      );
    }, []);

  const organicGags = new Proxy(_organicGags, {
    get(target, name) {
      const track = name as GagTrack;
      if (!(track in target)) target[track] = 0;
      const value = target[track]!;
      return clamp(value, 0, gags[track] ?? 0);
    }
  }) as Record<GagTrack, number>;

  let combo = new Combo({ gags: comboGags });
  const cog = new Cog({ lvl: cogLvl, isLured });

  const damageKillsCog = (c: Combo) => c.damageKillsCog(cog, additionalGagMultiplier);

  // Upgrade combo gag levels/orgs until the damage is sufficient
  while (
       !damageKillsCog(combo)
    && canComboCloneUp(combo, organicGags)
  ) {
    combo = comboCloneUp(combo, organicGags);
  }

  // Insufficient damage, killing cog with given parameters is not possible
  if (!damageKillsCog(combo)) return null;

  // Downgrade combo gag levels/orgs until the damage is insufficient
  while (canComboCloneDown(combo)) {
    const candidate = comboCloneDown(combo);
    if (!damageKillsCog(candidate)) break;
    combo = candidate;
  }

  if (minGagLvl) {
    combo = new Combo({
      gags: combo.gags.map(gag =>
        gag.lvl < minGagLvl && gag.lvl > 0
        ? gag.clone({ lvl: minGagLvl, isOrg: false })
        : gag
      )
    });
  }

  return combo;
}

export function canComboCloneUp(
  combo: Combo,
  organicGags: Record<GagTrack, number>
): boolean {
  const orgCounts = combo.orgTrackCounts();

  return combo.gags.some(g => {
    if (g.lvl < 7) return true;
    if (g.isOrg) return false;
    const orgsAvailable = organicGags[g.track] - orgCounts[g.track];
    return orgsAvailable > 0;
  });
}

export function comboCloneUp(
  combo: Combo,
  organicGags: Record<GagTrack, number>
): Combo {
  const orgCounts = combo.orgTrackCounts();
  const gagsLowToHigh = combo.gags.toSorted(sortFnGagsLowest);
  const lowest = gagsLowToHigh.at(0)!;
  const { track } = lowest;
  const gagsLowToHighOfTrack = gagsLowToHigh.filter(g => g.track === track);
  const orgsAvailable = organicGags[track] - orgCounts[track];

  assert(() => orgsAvailable >= 0);

  const lowestNonOrg = gagsLowToHighOfTrack
    .filter(g => !g.isOrg && g.lvl > 0)
    .at(0);

  // 1. Up lowest non-org gag to org
  if (orgsAvailable > 0 && lowestNonOrg) {
    return new Combo(combo.gags.map(
      g => g === lowestNonOrg
           ? g.clone({ isOrg: true })
           : g.clone()
    ));
  }

  // During cloneUp phase, gag level differential never exceeds 1
  const lowestOrg = gagsLowToHighOfTrack.find(g => g.isOrg);
  const nearestLvlUpNonOrg = lowestOrg &&
    gagsLowToHighOfTrack.find(g => g.lvl > lowestOrg.lvl && !g.isOrg);

  // 2. Switch low level org for higher level org
  if (orgsAvailable === 0 && lowestOrg && nearestLvlUpNonOrg) {
    return new Combo(combo.gags.map(
      g => g === lowestOrg
           ? g.clone({ isOrg: false })
           : g === nearestLvlUpNonOrg
             ? g.clone({ isOrg: true })
             : g.clone()
    ));
  }

  // 3. Gag level up, make everything non-org
  return new Combo(combo.gags.map(
    g => g === lowest
         ? g.clone({ lvl: g.lvl + 1, isOrg: false })
         : g.clone({ isOrg: false })
  ));
}

export function canComboCloneDown(combo: Combo): boolean {
  return combo.gags.some(gag => gag.lvl > 0);
}

/**
 * Note that this does not downgrade organics, only levels.
 * Works in the context of the overall {@link findCombo} algorithm leveraging {@link comboCloneUp}.
 */
export function comboCloneDown(combo: Combo): Combo {
  const low = combo.gags.toSorted(sortFnGagsLowest).find(g => g.lvl > 0);
  assert(() => !!low);
  return new Combo(combo.gags.map(
    g => g === low
         ? g.clone({ lvl: g.lvl - 1 })
         : g.clone()
  ));
}

/** Sort gags based on track order, then damage high to low. */
export function sortFnGags(gag1: Gag, gag2: Gag): number {
  return (
       GAG_TRACKS_ORDER[gag1.track] - GAG_TRACKS_ORDER[gag2.track]
    || gag2.damage - gag1.damage
    || Number(gag2.isOrg) - Number(gag1.isOrg) // For 0 dmg gags (toonup, lure), fallback for sort predictability
  );
}

export function sortFnGagsLowest(gag1: Gag, gag2: Gag): number {
  return (
       gag1.lvl - gag2.lvl
    || gag1.damage - gag2.damage
    || GAG_TRACKS_ORDER[gag1.track] - GAG_TRACKS_ORDER[gag2.track]
    || Number(gag1.isOrg) - Number(gag2.isOrg) // For 0 dmg gags (toonup, lure), fallback for sort predictability
  );
}

export function logTable(findComboRes: FindComboResult): void {
  const { combo, cog, args: { isLured, cogLvl, additionalGagMultiplier } } = findComboRes;

  const fmtInputGags = (gags: Partial<Record<GagTrack, number>>) => {
    const _gags = Object.entries(gags)
      .map(([track, num]) => !num ? null : `${track[0].toUpperCase()}${track.slice(1)}: ${num}`)
      .filter(s => s !== null)
    if (_gags.length === 0) return 'None';
    return _gags.join(', ');
  };

  console.log('Input:');
  console.table({
    'Cog Level': cogLvl,
    'Is Cog Lured?': isLured,
    'Gags': fmtInputGags(findComboRes.args.gags),
    'Organic Gags': fmtInputGags(findComboRes.args.organicGags),
    ...(additionalGagMultiplier && {
      'Additional Gag Multiplier': (
        additionalGagMultiplier in ADDITIONAL_GAG_MULTIPLIERS
        ? ADDITIONAL_GAG_MULTIPLIERS[additionalGagMultiplier]
        : additionalGagMultiplier
      )
    }),
  });
  console.log('Combo:');
  console.table(
    combo?.gags.reduce((newObj, gag, i) => {
      const { multi, knockback } = gag.multipliers(combo, isLured);
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
    'Final damage calculated': combo?.damage({ isLured, additionalGagMultiplier }),
    'Cog HP': cog.hp,
  });
}

