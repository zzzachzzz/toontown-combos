import { useStore } from './store.instance';
import * as storage from './local-storage';
import { setDomDataTheme } from './light-dark-theme';

export const LightDarkModeToggle = () => {
  const store = useStore();

  const onClick = () => {
    store.toggleTheme();
    setDomDataTheme(store.getTheme());
    storage.saveSavedState(store.getStateForStorage());
  };

  return (
    <button
      onClick={onClick}
      id="light-dark-mode-toggle"
      class="flex-center"
      title="Toggle light/dark mode"
    >
      <Svg />
    </button>
  );
};

const Svg = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" width="24" height="24" stroke-width="2"> <path d="M12 9a3 3 0 0 0 0 6v-6z"></path> <path d="M6 6h3.5l2.5 -2.5l2.5 2.5h3.5v3.5l2.5 2.5l-2.5 2.5v3.5h-3.5l-2.5 2.5l-2.5 -2.5h-3.5v-3.5l-2.5 -2.5l2.5 -2.5z"></path></svg>
);

