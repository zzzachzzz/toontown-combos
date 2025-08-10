import * as util from './util';
import { LightDarkModeToggle } from './LightDarkModeToggle';
import styles from './Nav.module.css';

export const Nav = () => {
  return (
    <nav class={styles.nav}>
      <div class={styles.content}>
        <img class={styles.logo} src={util.getResourceUrl('favicon.ico')} />
        <span class={styles.title}>Toontown<br/>Combos</span>
        <ul class={styles.ul}>
          <li class={styles.li}>
            <a class={styles.a} href={util.getResourceUrl('calc')}>Calculator</a>
          </li>
          <div class={styles.linkSep} />
          <li class={styles.li}>
            <a class={styles.a} href={util.getResourceUrl('grid')}>Combo Grid</a>
          </li>
          <div class={styles.linkSep} />
          <li class={styles.li}>
            <a class={styles.a} href={util.getResourceUrl('about')}>About</a>
          </li>
        </ul>
        <LightDarkModeToggle />
      </div>
    </nav>
  );
};

