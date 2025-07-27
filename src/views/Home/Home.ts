import { writable, type Writable, get } from 'svelte/store';
import type { GeneratorSettings } from '../../stores/settingsStore';
import { historyStore } from '../../stores/historyStore';
import { Toast } from 'bootstrap';

// Tipo de selector
export type GenerationType = 'single' | 'multiple';

// Estado
export const generationType: Writable<GenerationType> = writable('single');
export const lastResult: Writable<number[] | null> = writable(null);

// Generar números
export async function generate(settings: GeneratorSettings) {
    const type = get(generationType);
    const amount = type === 'single' ? 1 : settings.amount;

    try {
        const result: number[] = await window.electronAPI.generateNumbers({
            ...settings,
            amount
        });

        lastResult.set(result);
        historyStore.update(h => [
            { id: Date.now(), values: result, timestamp: new Date().toISOString() },
            ...h
        ]);
    } catch (err: any) {
        const toastEl = document.getElementById('errorToast');
        if (toastEl) {
            toastEl.querySelector('.toast-body')!.textContent = err.message;
            new Toast(toastEl).show();
        }
    }
}
