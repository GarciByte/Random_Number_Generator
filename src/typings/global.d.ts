/// <reference types="vite/client" />

import type { GeneratorSettings } from '../stores/settingsStore';
import type { HistoryEntry } from '../stores/historyStore';

export interface LatestInfo {
    version: string;
    notes: string;
    setupUrl: string;
}

export interface ElectronAPI {
    generateNumbers(settings: GeneratorSettings): Promise<number[]>;
    getHistory(): Promise<HistoryEntry[]>;
    clearHistory(): Promise<boolean>;
    getConfig(): Promise<GeneratorSettings>;
    saveConfig(cfg: GeneratorSettings): Promise<boolean>;
    getAppVersion(): Promise<string>;
    checkForUpdates(): Promise<LatestInfo>;
    openExternal(url: string): Promise<boolean>;
}

declare global {
    interface Window {
        electronAPI: ElectronAPI;
    }
}

export {};
