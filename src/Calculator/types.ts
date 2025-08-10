import type { JSX } from 'solid-js';
import type { GagTrack, SosToons } from '../constants';
import type { Gag } from '../gags';

export type OnClickGridGag = (
  data:
    | { track: GagTrack; lvl: number }
    | { sosToon: SosToons },
  e: MouseEvent & {
    currentTarget: HTMLButtonElement;
    target: JSX.Element;
  }
) => void;

export enum OnClickSelectedGagAction {
  Remove,
  Copy,
}

export type OnClickSelectedGag = (
  data: { gag: Gag; action: OnClickSelectedGagAction; },
  e: MouseEvent & {
    currentTarget: HTMLButtonElement;
    target: JSX.Element;
  }
) => void;

export enum OnClickSelectedGagLvlModAction {
  LvlUp,
  LvlDown,
}

export type OnClickSelectedGagLvlMod = (
  data: { gag: Gag; action: OnClickSelectedGagLvlModAction; },
  e: MouseEvent & {
    currentTarget: HTMLButtonElement;
    target: JSX.Element;
  }
) => void;

export type OnClickOrgToggle = (
  data: { gag: Gag; },
  e: MouseEvent & {
    currentTarget: HTMLButtonElement;
    target: JSX.Element;
  }
) => void;

export type OnClickClearGags = JSX.EventHandler<HTMLButtonElement, MouseEvent>;

