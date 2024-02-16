import { cogHp as cogHpLookup } from './gags';
import { useStore } from './store.instance';
import { BASE_URL } from './constants';

type Props = {
  cogLvl: number;
};

export const CogLvlCell = (props: Props) => {
  const store = useStore();

  const cogHp = () => cogHpLookup[props.cogLvl];
  const cogLvlImg = () => props.cogLvl > 12 ? '13+' : props.cogLvl.toString();

  return (
    <div class="cog-lvl-cell">
      <div class="cog-icon-container">
        <img
          src={`${BASE_URL}cog_icons/${cogLvlImg()}.png`}
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

