import { createContext, useContext } from 'solid-js';
import type { ParentComponent } from 'solid-js';
import { createStore } from './store';
import * as storage from './local-storage';
import { determineTheme, setDomDataTheme } from './light-dark-theme';
import findComboCacheUrl from './findCombo-cache.codegen.json?url';

const StoreContext = createContext<ReturnType<typeof createStore>>();

export const Provider: ParentComponent = (props) => {
  const savedState = storage.loadSavedState() ?? {};

  savedState.theme = determineTheme(savedState.theme);
  setDomDataTheme(savedState.theme);

  const store = createStore({
    initialState: savedState,
    getFindComboCache,
  });

  return (
    <StoreContext.Provider value={store}>
      {props.children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  return useContext(StoreContext)!;
};


let findComboCache: Record<string, string> | null = null;

fetch(findComboCacheUrl).then(async r => {
  findComboCache = await r.json();
  console.debug("Loaded and parsed 'findCombo-cache.codegen.json'");
});

function getFindComboCache(): typeof findComboCache {
  if (!findComboCache) {
    console.debug("'getFindComboCache' called before 'findComboCache' was ready");
    console.trace();
  }
  return findComboCache;
}

