import { useStore } from '../store.instance';
import { cogHp as cogHpLookup } from '../constants';
import { getCogIconUrl } from '../util';
import styles from './CogLvlCell.module.css';

type Props = {
  cogLvl: number;
};

export const CogLvlCell = (props: Props) => {
  const store = useStore();

  const cogHp = () => cogHpLookup[props.cogLvl];

  return (
    <div class={styles.cell}>
      <div class={styles.imgContainer}>
        <img
          src={getCogIconUrl(props.cogLvl)}
          class={styles.img}
          style={{ background: store.getIsLured() ? 'var(--lure)' : 'unset' }}
        />
        {store.getIsLured() && <span class={styles.lured}>Lured</span>}
      </div>
      <div>
        <span class={styles.lvl}>{props.cogLvl}</span>
        <span class={styles.hpValue}>{cogHp()}</span>
        <span class={styles.hpText}>HP</span>
      </div>
    </div>
  );
};

