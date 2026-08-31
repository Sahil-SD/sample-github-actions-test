/**
 * Enhanced Pairwise Generator with optimization
 */

import { Parameter, TestCase } from './combinatorial-generator';

export interface PairwiseOptions {
  maxIterations?: number;
  seed?: number;
}

export class PairwiseGenerator {
  private parameters: Parameter[];
  private options: Required<PairwiseOptions>;
  private random: () => number;

  constructor(parameters: Parameter[], options: PairwiseOptions = {}) {
    this.parameters = parameters;
    this.options = {
      maxIterations: options.maxIterations || 1000,
      seed: options.seed || Date.now(),
    };
    this.random = this.createSeededRandom(this.options.seed);
  }

  private createSeededRandom(seed: number): () => number {
    let state = seed;
    return () => {
      state = (state * 1103515245 + 12345) & 0x7fffffff;
      return state / 0x7fffffff;
    };
  }

  generate(): TestCase[] {
    const allPairs = this.getAllPairs();
    const uncoveredPairs = new Map<string, Set<string>>();

    // Initialize uncovered pairs
    for (const [key, pairs] of allPairs) {
      uncoveredPairs.set(key, new Set(pairs.map(p => JSON.stringify(p))));
    }

    const testCases: TestCase[] = [];
    let iterations = 0;

    while (this.hasUncoveredPairs(uncoveredPairs) && iterations < this.options.maxIterations) {
      const testCase = this.generateOptimalTestCase(uncoveredPairs);
      testCases.push(testCase);
      this.updateCoverage(testCase, uncoveredPairs);
      iterations++;
    }

    return testCases;
  }

  private getAllPairs(): Map<string, Array<Record<string, unknown>>> {
    const pairs = new Map<string, Array<Record<string, unknown>>>();

    for (let i = 0; i < this.parameters.length - 1; i++) {
      for (let j = i + 1; j < this.parameters.length; j++) {
        const key = `${this.parameters[i].name}-${this.parameters[j].name}`;
        const pairList: Array<Record<string, unknown>> = [];

        for (const vi of this.parameters[i].values) {
          for (const vj of this.parameters[j].values) {
            pairList.push({
              [this.parameters[i].name]: vi,
              [this.parameters[j].name]: vj,
            });
          }
        }

        pairs.set(key, pairList);
      }
    }

    return pairs;
  }

  private hasUncoveredPairs(uncoveredPairs: Map<string, Set<string>>): boolean {
    for (const pairs of uncoveredPairs.values()) {
      if (pairs.size > 0) return true;
    }
    return false;
  }

  private generateOptimalTestCase(uncoveredPairs: Map<string, Set<string>>): TestCase {
    let bestTestCase: TestCase = {};
    let bestScore = -1;

    // Try multiple random candidates and pick the best one
    for (let attempt = 0; attempt < 50; attempt++) {
      const candidate = this.generateRandomTestCase();
      const score = this.calculateCoverageScore(candidate, uncoveredPairs);

      if (score > bestScore) {
        bestScore = score;
        bestTestCase = candidate;
      }
    }

    return bestTestCase;
  }

  private generateRandomTestCase(): TestCase {
    const testCase: TestCase = {};
    for (const param of this.parameters) {
      const index = Math.floor(this.random() * param.values.length);
      testCase[param.name] = param.values[index];
    }
    return testCase;
  }

  private calculateCoverageScore(testCase: TestCase, uncoveredPairs: Map<string, Set<string>>): number {
    let score = 0;

    for (let i = 0; i < this.parameters.length - 1; i++) {
      for (let j = i + 1; j < this.parameters.length; j++) {
        const key = `${this.parameters[i].name}-${this.parameters[j].name}`;
        const pair = {
          [this.parameters[i].name]: testCase[this.parameters[i].name],
          [this.parameters[j].name]: testCase[this.parameters[j].name],
        };

        const pairSet = uncoveredPairs.get(key);
        if (pairSet?.has(JSON.stringify(pair))) {
          score++;
        }
      }
    }

    return score;
  }

  private updateCoverage(testCase: TestCase, uncoveredPairs: Map<string, Set<string>>): void {
    for (let i = 0; i < this.parameters.length - 1; i++) {
      for (let j = i + 1; j < this.parameters.length; j++) {
        const key = `${this.parameters[i].name}-${this.parameters[j].name}`;
        const pair = {
          [this.parameters[i].name]: testCase[this.parameters[i].name],
          [this.parameters[j].name]: testCase[this.parameters[j].name],
        };

        uncoveredPairs.get(key)?.delete(JSON.stringify(pair));
      }
    }
  }
}