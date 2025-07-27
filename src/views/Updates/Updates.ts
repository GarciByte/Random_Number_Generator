import { writable, type Writable, get } from 'svelte/store';
import type { LatestInfo } from '../../typings/global';

// Estados
export type UpdateStatus =
    | 'idle'       // Sin buscar
    | 'checking'   // En curso
    | 'upToDate'   // No hay nueva versión
    | 'available'  // Hay versión nueva
    | 'error';     // Fallo en la comprobación

export const status: Writable<UpdateStatus> = writable('idle');
export const latest: Writable<LatestInfo | null> = writable(null);
export const currentVersion: Writable<string> = writable('');

// Lee la versión actual de la app
export async function initVersion() {
    try {
        const v = await window.electronAPI.getAppVersion();
        currentVersion.set(v);
    } catch {
        currentVersion.set('0.0.0');
    }
}

// Comprueba en el servidor si hay una nueva versión
export async function checkUpdates() {
    status.set('checking');
    try {
        const info = await window.electronAPI.checkForUpdates();
        const cur = await window.electronAPI.getAppVersion();

        if (info.version !== cur) {
            latest.set(info);
            status.set('available');
        } else {
            status.set('upToDate');
        }
    } catch (err: any) {
        console.error('Error checking updates', err);
        status.set('error');
    }
}

// Abre la URL de descarga en el navegador
export function downloadAndInstall() {
    const info = get(latest);
    if (info?.setupUrl) {
        window.electronAPI.openExternal(info.setupUrl);
    }
}
