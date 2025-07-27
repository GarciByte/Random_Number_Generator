import { app, BrowserWindow, ipcMain, shell } from 'electron';
import fs from 'fs';
import path from 'path';
import { insertHistory, getHistory, clearHistory } from './database';
import fetch from 'node-fetch';
import { Worker } from 'worker_threads';

// Generación de números
const PRACTICAL_LIMIT = 1_000_000;

ipcMain.handle('generate-numbers', (_event, settings) => {
    const { min, max, allowRepeats, mode, amount } = settings;

    if (min > max) {
        throw new Error(`El mínimo (${min}) no puede ser mayor que el máximo (${max}).`);
    }

    const possible: number[] = [];
    for (let n = min; n <= max; n++) {
        if (
            mode === 'any' ||
            (mode === 'even' && n % 2 === 0) ||
            (mode === 'odd' && n % 2 !== 0)
        ) {
            possible.push(n);
        }
    }

    if (possible.length === 0) {
        throw new Error(`No hay valores posibles en el rango [${min}, ${max}].`);
    }

    if (possible.length > PRACTICAL_LIMIT) {
        throw new Error(
            `El rango filtrado contiene más de ${PRACTICAL_LIMIT.toLocaleString()} valores posibles. ` +
            `Ajusta mínimo, máximo o el modo.`
        );
    }

    if (!allowRepeats && amount > possible.length) {
        throw new Error(
            `No puedes generar ${amount} valores únicos en el rango [${min}, ${max}] ` +
            `(solo hay ${possible.length} posibles).`
        );
    }

    return new Promise<number[]>((resolve, reject) => {
        const worker = new Worker(path.join(__dirname, 'generate.worker.js'), {
            workerData: null
        });

        worker.once('message', (result: number[]) => {
            insertHistory(result);
            resolve(result);
            worker.terminate();
        });

        worker.once('error', err => {
            reject(err);
            worker.terminate();
        });

        worker.postMessage({ min, max, allowRepeats, mode, amount });
    });
});
// ————————————————————————————————————————————————————————————————

// Historial
ipcMain.handle('get-history', () => getHistory());
ipcMain.handle('clear-history', () => { clearHistory(); return true; });
// ————————————————————————————————————————————————————————————————

// Configuración
const cfgPath = path.join(app.getPath('userData'), 'config.json');

function readConfig(): any {
    try {
        const raw = fs.readFileSync(cfgPath, 'utf-8');
        return JSON.parse(raw);
    } catch {
        return {
            min: 1,
            max: 100,
            allowRepeats: true,
            mode: 'any',
            amount: 2,
        };
    }
}

function writeConfig(cfg: any): void {
    fs.writeFileSync(cfgPath, JSON.stringify(cfg, null, 2), 'utf-8');
}

ipcMain.handle('get-config', () => {
    return readConfig();
});

ipcMain.handle('save-config', (_event, newCfg) => {
    writeConfig(newCfg);
    return true;
});
// ————————————————————————————————————————————————————————————————

// Actualizaciones
ipcMain.handle('get-app-version', () => {
    return app.getVersion();
});

ipcMain.handle('check-updates', async () => {
    const LATEST_URL = 'https://raw.githubusercontent.com/GarciByte/Random_Number_Generator/refs/heads/main/latest.json';
    const res = await fetch(LATEST_URL, { timeout: 10000 });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data;
});

ipcMain.handle('open-external', (_e, url: string) => {
    return shell.openExternal(url);
});
// ————————————————————————————————————————————————————————————————

// BrowserWindow
const isDev = process.env.NODE_ENV === 'DEV';

function createWindow() {
    const base = app.isPackaged ? path.join(process.resourcesPath, 'app.asar.unpacked', 'dist-electron') : __dirname;
    const preloadPath = path.join(base, 'preload.cjs');

    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 800,
        minHeight: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: preloadPath
        },
    });

    if (isDev) {
        win.loadURL('http://localhost:5173');
        win.webContents.openDevTools();
    } else {
        win.loadFile(path.join(__dirname, '../dist/index.html'));
        win.removeMenu();

        win.webContents.on('before-input-event', (event, input) => {
            if ((input.control || input.meta) && ['R', 'I'].includes(input.key.toUpperCase())) {
                event.preventDefault();
            }
        });
    }
}
// ————————————————————————————————————————————————————————————————

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
