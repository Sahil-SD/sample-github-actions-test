/**
 * File handling utilities
 */

import * as fs from 'fs';
import * as path from 'path';

export class FileHelpers {
  /**
   * Read JSON file
   */
  static readJson<T>(filePath: string): T {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content) as T;
  }

  /**
   * Write JSON file
   */
  static writeJson<T>(filePath: string, data: T): void {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  }

  /**
   * Read text file
   */
  static readText(filePath: string): string {
    return fs.readFileSync(filePath, 'utf-8');
  }

  /**
   * Write text file
   */
  static writeText(filePath: string, content: string): void {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, content);
  }

  /**
   * Check if file exists
   */
  static exists(filePath: string): boolean {
    return fs.existsSync(filePath);
  }

  /**
   * Create directory if not exists
   */
  static ensureDir(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  /**
   * Delete file if exists
   */
  static deleteFile(filePath: string): void {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  /**
   * Delete directory recursively
   */
  static deleteDir(dirPath: string): void {
    if (fs.existsSync(dirPath)) {
      fs.rmSync(dirPath, { recursive: true, force: true });
    }
  }

  /**
   * List files in directory
   */
  static listFiles(dirPath: string, extension?: string): string[] {
    if (!fs.existsSync(dirPath)) {
      return [];
    }

    const files = fs.readdirSync(dirPath);
    if (extension) {
      return files.filter((file) => file.endsWith(extension));
    }
    return files;
  }

  /**
   * Copy file
   */
  static copyFile(source: string, destination: string): void {
    const dir = path.dirname(destination);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.copyFileSync(source, destination);
  }

  /**
   * Append to file
   */
  static appendToFile(filePath: string, content: string): void {
    fs.appendFileSync(filePath, content);
  }

  /**
   * Get file size in bytes
   */
  static getFileSize(filePath: string): number {
    const stats = fs.statSync(filePath);
    return stats.size;
  }
}