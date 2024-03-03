import { useStore } from './store.instance';
import { cogHp as cogHpLookup } from './constants';
import { getResourceUrl } from './util';

type Props = {
  cogLvl: number;
};

export const CogLvlCell = (props: Props) => {
  const store = useStore();

  const cogHp = () => cogHpLookup[props.cogLvl];
  const cogLvlImg = () => props.cogLvl > 14 ? 'field-office' : props.cogLvl.toString();

  return (
    <div class="cog-lvl-cell">
      <div class="cog-icon-container">
        <img
          src={getResourceUrl(`cog_icons/${cogLvlImg()}.png`)}
          style={{ background: store.getIsLured() ? 'var(--lure)' : 'unset' }}
        />
        {store.getIsLured() && <span>Lured</span>}
      </div>
      <div>
        <span class="cog-lvl">{props.cogLvl}</span>
        <span class="cog-hp">{cogHp()}</span><span class="hp">HP</span>
      </div>
    </div>
  );
};

