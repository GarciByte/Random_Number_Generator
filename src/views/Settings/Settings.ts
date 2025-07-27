import { settingsStore, type GeneratorSettings } from '../../stores/settingsStore';
import type { Writable } from 'svelte/store';
import { derived } from 'svelte/store';
import { ConfigService } from '../../services/ConfigService';

export const settings: Writable<GeneratorSettings> = settingsStore;

// Límite de números a generar
const PRACTICAL_LIMIT = 1_000_000;

// Calcula cuántos valores hay en el rango [min, max]
export const rangeSize = derived(settingsStore, $s => {
    const size = $s.max - $s.min + 1;
    return size > 0 ? size : 0;
});

// Tamaño filtrado según mode
export const filteredSize = derived(settingsStore, $s => {
    const { min, max, mode } = $s;
    if (min > max) return 0;
    let cnt = 0;
    for (let n = min; n <= max; n++) {
        if (
            mode === 'any' ||
            (mode === 'even' && n % 2 === 0) ||
            (mode === 'odd' && n % 2 !== 0)
        ) cnt++;
        if (cnt > PRACTICAL_LIMIT) break;
    }
    return cnt;
});

// Máximo para el input “amount”
export const amountMax = derived(
    [filteredSize, settingsStore],
    ([$size, $s]) => $s.allowRepeats
        ? PRACTICAL_LIMIT
        : $size
);

// Flag si el rango filtrado es demasiado grande
export const invalidRangeTooBig = derived(filteredSize, $size =>
    $size > PRACTICAL_LIMIT
);

// Carga inicial
export async function loadSettings() {
    const cfg = await ConfigService.load();
    settingsStore.set(cfg);
}

// Guardado
export async function saveSettings() {
    const current = await new Promise<GeneratorSettings>(r =>
        settingsStore.subscribe(r)
    );
    await ConfigService.save(current);
}
