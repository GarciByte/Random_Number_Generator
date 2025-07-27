import Database from 'better-sqlite3';
import path from 'path';
import { app } from 'electron';
import fs from 'fs';

interface HistoryRow {
    id: number;
    nums: string;
    timestamp: string;
}

export interface HistoryEntry {
    id: number;
    values: number[];
    timestamp: string;
}

const dbPath = path.join(app.getPath('userData'), 'data.db');

if (!fs.existsSync(dbPath)) {
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
    fs.writeFileSync(dbPath, '');
}

const db = new Database(dbPath);

db.exec(`
    CREATE TABLE IF NOT EXISTS history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nums TEXT NOT NULL,
        timestamp TEXT NOT NULL
    )
`);

// Inserta un nuevo registro de historial
export function insertHistory(values: number[]): void {
    const stmt = db.prepare(
        `INSERT INTO history (nums, timestamp) VALUES (?, ?)`
    );
    stmt.run(JSON.stringify(values), new Date().toISOString());
}

// Obtiene todo el historial ordenado por id DESC
export function getHistory(): HistoryEntry[] {
    const rows = db
        .prepare(`SELECT * FROM history ORDER BY id DESC`)
        .all() as HistoryRow[];

    return rows.map((row) => ({
        id: row.id,
        values: JSON.parse(row.nums),
        timestamp: row.timestamp,
    }));
}

// Borrar todo el historial
export function clearHistory(): void {
    db.prepare(`DELETE FROM history`).run();
}
