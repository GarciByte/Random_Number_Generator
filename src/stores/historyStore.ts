import { writable } from 'svelte/store';

export interface HistoryEntry { id: number; values: number[]; timestamp: string; }
export const historyStore = writable<HistoryEntry[]>([]);
