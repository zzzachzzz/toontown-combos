import { createContext, useContext } from 'solid-js';
import type { ParentComponent } from 'solid-js';
import { createStore } from './store';
import * as storage from './local-storage';
import { determineTheme, setDomDataTheme } from './light-dark-theme';

const StoreContext = createContext<ReturnType<typeof createStore>>();

export const Provider: ParentComponent = (props) => {
  const savedState = storage.loadSavedState() ?? {};

  savedState.theme = determineTheme(savedState.theme);
  setDomDataTheme(savedState.theme);

  const store = createStore({ initialState: savedState });

  return (
    <StoreContext.Provider value={store}>
      {props.children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  return useContext(StoreContext)!;
};

