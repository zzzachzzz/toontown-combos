import { For, Show } from 'solid-js';
import { useStore } from '../store.instance';
import { OrganicSelectionToonColumn } from './OrganicSelectionToonColumn';
import styles from './OrganicSelection.module.css';

export const OrganicSelection = () => {
  const store = useStore();

  return (
    <Show when={(
      store.getShowOrgView()
      || store.getSelectedOrgGags().some(g => g !== null)
    )}>
      <div>
        <ul class={styles.list}>
          <For each={Array.from({ length: 4 })}>
            {(_, i) => (
              <li>
                <Show when={store.getShowOrgView()}>
                  <div class={styles.toonNum}>Toon {i() + 1}</div>
                </Show>
                <OrganicSelectionToonColumn toonIdx={i()} />
              </li>
            )}
          </For>
        </ul>
      </div>
    </Show>
  );
};

