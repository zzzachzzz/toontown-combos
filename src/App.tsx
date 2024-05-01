import { Router, Route } from '@solidjs/router';
import type { ParentComponent } from 'solid-js';
import { Provider } from './store.instance';
import * as util from './util';
import './index.css';

import { Nav } from './Nav';
import { ComboGrid } from './ComboGrid';
import { Calculator } from './Calculator';
import { About } from './About';

const _path = util.getResourceUrl;

export const App = () => {
  return (
    <Router root={_App}>
      <Route path={[_path(''), _path('calc')]} component={Calculator} />
      <Route path={_path('grid')} component={ComboGrid} />
      <Route path={_path('about')} component={About} />
      <Route path="*404" component={NotFound} />
    </Router>
  );
};

const _App: ParentComponent = (props) => {
  return (
    <Provider>
      <Nav />
      <main>
        {props.children}
      </main>
    </Provider>
  );
};

const NotFound = () => {
  return (
    <div id="not-found" class="flex-center">
      <div>Page not found</div>
      <a href={util.getResourceUrl('')}>Back to home</a>
    </div>
  );
};

