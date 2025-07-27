export class ConfigService {
    static async load() {
        return window.electronAPI.getConfig();
    }
    static async save(cfg: any) {
        return window.electronAPI.saveConfig(cfg);
    }
}
