import { writable } from 'svelte/store';

export interface GeneratorSettings {
    min: number;
    max: number;
    allowRepeats: boolean;
    mode: 'any' | 'even' | 'odd';
    amount: number;
}

export const settingsStore = writable<GeneratorSettings>({
    min: 1,
    max: 100,
    allowRepeats: true,
    mode: 'any',
    amount: 2,
});
