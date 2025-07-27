import { derived } from 'svelte/store';
import { location } from 'svelte-spa-router';

export interface NavItem {
    title: string;
    path: string;
    icon: string;
}

// Pestañas
export const navItems: NavItem[] = [
    { title: 'Inicio', path: '/', icon: 'bi-house' },
    { title: 'Ajustes', path: '/settings', icon: 'bi-gear' },
    { title: 'Historial', path: '/history', icon: 'bi-clock-history' },
    { title: 'Actualizaciones', path: '/updates', icon: 'bi-arrow-repeat' },
];

// Ruta actual
export const currentPath = derived(
    location,
    $loc => ($loc.startsWith('#') ? $loc.slice(1) : $loc) || '/'
);
