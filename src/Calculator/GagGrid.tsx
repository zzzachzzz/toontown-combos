import { For } from 'solid-js';
import * as util from '../util';
import { gagTracksArr, gagTrackDisplayName, SosToons } from '../constants';
import { OnClickGridGag } from './types';
import styles from './GagGrid.module.css';

type Props = {
  onClickGag: OnClickGridGag;
};

export const GagGrid = (props: Props) => {
  return (
    <div class={styles.container}>
      <For each={gagTracksArr}>
        {track => {
          return (
            <div class={`${styles.row} no-drag`} style={{ background: `var(--${track})` }}>
              <div class={styles.gagTrackLabel}>{gagTrackDisplayName[track]}</div>
              <For each={[...util.range(1, 7)]} >
                {lvl => {
                  return (
                    <button
                      class={styles.cell}
                      onContextMenu={[props.onClickGag, { track, lvl, isOrg: true }]}
                      onClick={[props.onClickGag, { track, lvl, isOrg: false }]}>
                      <img class={`${styles.gagIcon} no-drag`} src={util.getGagIconUrl({ track, lvl })} />
                    </button>
                  );
                }}
              </For>
            </div>
          );
        }}
      </For>
      {/* Damaging SOS Toons */}
      <SosToonsGroup onClickGag={props.onClickGag} />
    </div>
  );
};

const sosToons: SosToons[] = [
  SosToons.ClerkWill, SosToons.ClerkPenny, SosToons.ClerkClara,
  SosToons.BarbaraSeville, SosToons.SidSonata, SosToons.MoeZart,
  SosToons.ClumsyNed, SosToons.FranzNeckvein, SosToons.BarnacleBessie,
];

type SosToonsProps = {
  onClickGag: OnClickGridGag;
};

const SosToonsGroup = (props: SosToonsProps) => {
  return (
    <div class={styles.row} style={{ background: 'var(--gag-bg-blue)' }}>
      <For each={sosToons}>
        {sosToon => {
          return (
            <button
              class={`${styles.cell} ${styles.sosToonCell}`}
              onClick={[props.onClickGag, { sosToon }]}
            >
              <img class={`${styles.gagIcon} no-drag`} src={util.getSosToonIconUrl(sosToon)} />
              <img class={`${styles.sosToonGagIcon} no-drag`} src={util.getSosGagIconUrl(sosToon)} />
            </button>
          );
        }}
      </For>
    </div>
  );
};

