import * as util from './util';
import {
  TTR_VERSION,
  TTR_VERSION_RELEASE_NOTES_LINK,
} from './constants';

export const About = () => {
  return (
    <div id="about-page">
      <div id="about-page-content">
        <div id="version-info">
          <span>Toontown Combos is up-to-date with Toontown Rewritten version </span>
          <a
            href={TTR_VERSION_RELEASE_NOTES_LINK}
          >
            {TTR_VERSION}
          </a>
          <span>.</span>
        </div>

        <p>
          Hello! <i>*waves*</i> I am <b>Mr. von</b>! You may also see me around playing as <b>Little von</b> or <b>Baron von</b>.
        </p>
        <p>
          Toontown Combos has been a hobby project of mine for some time now, in one form or another. I'm a software developer who is only okay at visual design ;) I'm better with logic and stuff.
        </p>

        <p>
          This project is open-source, and contributions are welcome at: 
          <a href="https://github.com/zzzachzzz/toontown-combos">github.com/zzzachzzz/toontown-combos</a>
        </p>

        <p>
          If you like Toontown Combos and would like to support my work, consider<br/><a href="https://ko-fi.com/zzzachzzz">Buying me a coffee on Ko-fi</a>.
        </p>

        <p>Toontown Combos is a tool for Toontown Rewritten, but is not affiliated with Toontown Rewritten nor Toontown Online.</p>
        <div class="about-img-container">
          <img
            id="von-family-photo"
            src={util.getResourceUrl('von-family-photo.png')}
          />
        </div>
        <div class="about-img-container">
          <img
            id="mr-von-toon-info"
            src={util.getResourceUrl('mr-von-toon-info.png')}
          />
        </div>
      </div>
    </div>
  );
};

