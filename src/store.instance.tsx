import { createContext, useContext } from 'solid-js';
import type { ParentComponent } from 'solid-js';
import type { FindComboCache } from './gags';
import { createStore } from './store';
import * as storage from './local-storage';
import * as util from './util';
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
    <StoreContext value={store}>
      {props.children}
    </StoreContext>
  );
};

export const useStore = () => {
  return useContext(StoreContext)!;
};

console.log('findComboCacheUrl:', findComboCacheUrl);

// Fetch promise fires off here on module load
const findComboCachePromise: Promise<FindComboCache | undefined> =
  fetch(findComboCacheUrl)
  .then(async res => {
    const findComboCache = await res.json();
    console.debug("Loaded and parsed 'findCombo-cache.codegen.json'");
    return findComboCache;
  })
  .catch((error) => {
    console.error("Error thrown for... TODO", error);
  });

async function getFindComboCache(): Promise<FindComboCache | undefined> {
  const race = await util.raceTimeout(findComboCachePromise, 800);

  if (race === util.TIMEOUT) {
    console.warn(`Timeout reached on fetch ${findComboCacheUrl}`);
    return undefined;
  }

  return race;
}

// TODO
  // if (!findComboCache) {
  //   console.debug("'getFindComboCache' called before 'findComboCache' was ready");
  //   console.trace();
  // } else {
  //   console.debug("'getFindComboCache' called 'findComboCache' AND WAS READY !!!");
  // }
  // return findComboCache;
// }

