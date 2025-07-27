import { writable, derived } from 'svelte/store';
import type { HistoryEntry } from '../../stores/historyStore';

// Tamaño de página
const PAGE_SIZE = 20;

// Historial completo
export const fullHistory = writable<HistoryEntry[]>([]);

// Página actual
export const currentPage = writable(1);

// Número total de páginas
export const totalPages = derived(fullHistory, $h =>
    Math.max(1, Math.ceil($h.length / PAGE_SIZE))
);

// Sub‑array para la página actual
export const pageItems = derived(
    [fullHistory, currentPage],
    ([$h, $p]) => {
        const start = ($p - 1) * PAGE_SIZE;
        return $h.slice(start, start + PAGE_SIZE);
    }
);

// Cargar el historial
export async function loadHistory() {
    const hist: HistoryEntry[] = await window.electronAPI.getHistory();
    fullHistory.set(hist);
    currentPage.set(1);
}

// Borrar todo el historial
export async function clearAllHistory() {
    const ok = await window.electronAPI.clearHistory();
    if (ok) {
        fullHistory.set([]);
        currentPage.set(1);
    }
}
