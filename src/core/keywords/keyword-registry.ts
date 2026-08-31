/**
 * Keyword Registry - Central registry for all keywords
 */

export type KeywordFunction = (...args: unknown[]) => Promise<unknown>;

export interface KeywordDefinition {
  name: string;
  description: string;
  parameters: string[];
  execute: KeywordFunction;
}

export class KeywordRegistry {
  private static instance: KeywordRegistry;
  private keywords: Map<string, KeywordDefinition> = new Map();

  private constructor() {}

  public static getInstance(): KeywordRegistry {
    if (!KeywordRegistry.instance) {
      KeywordRegistry.instance = new KeywordRegistry();
    }
    return KeywordRegistry.instance;
  }

  register(keyword: KeywordDefinition): void {
    this.keywords.set(keyword.name.toLowerCase(), keyword);
  }

  get(name: string): KeywordDefinition | undefined {
    return this.keywords.get(name.toLowerCase());
  }

  has(name: string): boolean {
    return this.keywords.has(name.toLowerCase());
  }

  getAll(): KeywordDefinition[] {
    return Array.from(this.keywords.values());
  }

  clear(): void {
    this.keywords.clear();
  }
}

export const keywordRegistry = KeywordRegistry.getInstance();