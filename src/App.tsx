import { Router, Route } from '@solidjs/router';
import type { ParentComponent } from 'solid-js';
import { Provider } from './store.instance';
import './index.css';

import { Nav } from './Nav';
import { ComboGrid } from './ComboGrid';
import { Calculator } from './Calculator';

export const App = () => {
  return (
    <Router root={_App}>
      <Route path={["/", "/grid"]} component={ComboGrid} />
      <Route path="/calc" component={Calculator} />
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
      <a href="/">Back to home</a>
    </div>
  );
};

