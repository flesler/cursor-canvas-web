import '@mantine/charts/styles.css';
import '@mantine/core/styles.css';

import { App } from './App';
import { mountCanvas } from './runtime';

// Public demo: fixed light (matches README screenshot and typical dashboards).
// IDE host still controls theme there; use `auto` locally if you prefer OS theme.
mountCanvas('root', <App />, { defaultColorScheme: 'light' });
