import * as util from './util';
import { LightDarkModeToggle } from './LightDarkModeToggle';

export const Nav = () => {
  return (
    <nav id="nav">
      <div id="nav-content">
        <img id="nav-logo" src={util.getResourceUrl('favicon.ico')} />
        <span id="nav-title">Toontown<br/>Combos</span>
        <ul>
          <li><a href={util.getResourceUrl('calc')}>Calculator</a></li>
          <div class="navlink-sep" />
          <li><a href={util.getResourceUrl('grid')}>Combo Grid</a></li>
          <div class="navlink-sep" />
          <li><a href={util.getResourceUrl('about')}>About</a></li>
        </ul>
        <LightDarkModeToggle />
      </div>
    </nav>
  );
};

