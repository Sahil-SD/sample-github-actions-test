import * as fs from 'fs';
import * as path from 'path';

export class FileHandler {
  private static resolvePath(filePath: string): string {
    return path.isAbsolute(filePath)
      ? filePath
      : path.join(__dirname, `../data/${filePath}`);
  }

  static readJSON<T>(filePath: string): T {
    const fullPath = this.resolvePath(filePath);
    const rawData = fs.readFileSync(fullPath, 'utf-8');
    return JSON.parse(rawData) as T;
  }

  static writeJSON(filePath: string, data: any): void {
    const fullPath = this.resolvePath(filePath);
    fs.writeFileSync(fullPath, JSON.stringify(data, null, 2), 'utf-8');
  }

  static appendJSON(filePath: string, data: any): void {
    const existingData = this.readJSON<Record<string, unknown> | unknown[]>(filePath);
    const newData = Array.isArray(existingData) 
      ? [...existingData, data]
      : { ...existingData, ...data };
    this.writeJSON(filePath, newData);
  }

  static readCSV(filePath: string): string[] {
    const fullPath = this.resolvePath(filePath);
    return fs.readFileSync(fullPath, 'utf-8').split('\n');
  }
}