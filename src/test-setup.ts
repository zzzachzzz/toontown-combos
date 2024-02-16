import { SnapshotSerializer } from 'vitest';
import { Combo, Gag, Cog } from './gags';

expect.addSnapshotSerializer({
  serialize(combo: Combo, config, indentation, depth, refs, printer) {
    return `Combo ${printer(
      {
        cog: combo.cog,
        damage: combo.damage(),
        gags: combo.gags,
      },
      config,
      indentation,
      depth,
      refs,
    )}`;
  },
  test(val: any) {
    return val && val instanceof Combo;
  },
} satisfies SnapshotSerializer);

expect.addSnapshotSerializer({
  serialize(gag: Gag, config, indentation, depth, refs, printer) {
    if (gag.lvl === 0)
      return 'None';
    return `Gag(${gag.name} [Lvl ${gag.lvl}] [Dmg ${gag.damage}]${gag.isOrg ? ' [Org]' : ''})`;
  },
  test(val: any) {
    return val && val instanceof Gag;
  },
} satisfies SnapshotSerializer);

expect.addSnapshotSerializer({
  serialize(cog: Cog, config, indentation, depth, refs, printer) {
    return `Cog([Lvl ${cog.lvl}] [Hp ${cog.hp}])`;
  },
  test(val: any) {
    return val && val instanceof Cog;
  },
} satisfies SnapshotSerializer);

