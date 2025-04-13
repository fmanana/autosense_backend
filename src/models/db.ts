import Database from 'better-sqlite3';
import * as path from 'path';

// Define your table types
export type Station = {
    id?: number;
    id_name: string;
    name: string;
    latitude: number;
    longitude: number;
    city: string;
    address: string;
    pumps?: Pump[];
  }

export interface Pump {
    id?: number;
    fuel_type: string;
    price: number;
    available: boolean;
    station_id: number;
}

const dbPath = path.resolve('gas_stations.db');
const db = new Database(dbPath, { verbose: console.log });

// Example: Query all stations
export function getAllStations(): Station[] {
    const stmt = db.prepare('SELECT * FROM stations');
    return stmt.all() as Station[];
}

// Example: Get pumps for a specific station
export function getStationById(stationId: number): Station | undefined {
    const stmt = db.prepare('SELECT * FROM stations WHERE id = ?');
    return stmt.get(stationId) as Station | undefined;
}

// Example: Get pumps for a specific station
export function getPumpsByStationId(stationId: number): Pump[] {
    const stmt = db.prepare('SELECT * FROM pumps WHERE station_id = ?');
    return stmt.all(stationId) as Pump[];
}

export function getPumpById(pumpId: number): Pump | undefined {
    const stmt = db.prepare('SELECT * FROM pumps WHERE id = ?');
    return stmt.get(pumpId) as Pump | undefined;
}

// Example: Add a new station
export function addStation(station: Omit<Station, 'id'>): number {
    const stmt = db.prepare(`
      INSERT INTO stations (id_name, name, latitude, longitude, city, address)
      VALUES (@id_name, @name, @latitude, @longitude, @city, @address)
    `);
    const info = stmt.run(station);
    return info.lastInsertRowid as number;
}
// Update station
export function updateStation(station: Station): boolean {
    const stmt = db.prepare(`
      UPDATE stations
      SET id_name = @id_name,
          name = @name,
          latitude = @latitude,
          longitude = @longitude,
          city = @city,
          address = @address
      WHERE id = @id
    `);
    const info = stmt.run(station);
    return info.changes > 0;
}

export function deleteStation(stationId: number): void {
    const stmt = db.prepare('DELETE FROM stations WHERE id = ?');
    stmt.run(stationId);
    return;
}

export function addPump(pump: Omit<Pump, 'id'>): number {
    const stmt = db.prepare(`
        INSERT INTO pumps (fuel_type, price, available, station_id)
        VALUES (@fuel_type, @price, @available, @station_id)
    `)
    // Convert boolean to SQLite integer (0/1)
    const pumpData = {
        ...pump,
        available: pump.available ? 1 : 0
    };

    const info = stmt.run(pumpData);
    return info.lastInsertRowid as number;
}

// Example: Update pump price
export function updatePumpPrice(pumpId: number, newPrice: number): void {
    const stmt = db.prepare('UPDATE pumps SET price = ? WHERE id = ?');
    stmt.run(newPrice, pumpId);
}

// Example: Get available pumps with station info
// export function getAvailablePumpsWithStationInfo(): any[] {
//     const stmt = db.prepare(`
//       SELECT p.*, s.name as station_name, s.city, s.address
//       FROM pumps p
//       JOIN stations s ON p.station_id = s.id
//       WHERE p.available = 1
//     `);
//     return stmt.all();
// }
