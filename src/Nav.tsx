import * as util from './util';

export const Nav = () => {
  return (
    <nav id="nav">
      <div id="nav-content">
        <img id="nav-logo" src={util.getResourceUrl('favicon.ico')} />
        <span id="nav-title">Toontown<br/>Combos</span>
        <ul>
          <li><a href="/grid">Combo Grid</a></li>
          <div class="navlink-sep" />
          <li><a href="/calc">Calculator</a></li>
        </ul>
      </div>
    </nav>
  );
};

