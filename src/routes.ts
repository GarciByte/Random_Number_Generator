import Home from './views/Home/Home.svelte';
import History from './views/History/History.svelte';
import Settings from './views/Settings/Settings.svelte';
import Updates from './views/Updates/Updates.svelte';

export const routes = {
  '/': Home,                        // Vista Principal (Inicio)
  '/history': History,              // Historial
  '/settings': Settings,            // Vista de Ajustes del Generador
  '/updates': Updates,              // Actualizaciones
};
