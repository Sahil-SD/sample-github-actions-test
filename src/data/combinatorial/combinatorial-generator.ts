/**
 * Combinatorial Test Data Generator
 * Implements pairwise/all-pairs algorithm and other combinatorial techniques
 */

export interface Parameter {
  name: string;
  values: unknown[];
}

export interface TestCase {
  [key: string]: unknown;
}

export class CombinatorialGenerator {
  /**
   * Generate all possible combinations (Cartesian Product)
   * Use sparingly - can generate massive datasets
   */
  static allCombinations(parameters: Parameter[]): TestCase[] {
    if (parameters.length === 0) return [{}];

    const [first, ...rest] = parameters;
    const restCombinations = this.allCombinations(rest);

    const combinations: TestCase[] = [];
    for (const value of first.values) {
      for (const restCombo of restCombinations) {
        combinations.push({
          [first.name]: value,
          ...restCombo,
        });
      }
    }

    return combinations;
  }

  /**
   * Generate pairwise combinations
   * Ensures all pairs of parameter values are covered
   * Significantly reduces test cases while maintaining coverage
   */
  static pairwise(parameters: Parameter[]): TestCase[] {
    if (parameters.length <= 1) {
      return this.allCombinations(parameters);
    }

    const testCases: TestCase[] = [];
    const pairs = this.generateAllPairs(parameters);
    const uncoveredPairs = new Set(pairs.map(p => JSON.stringify(p)));

    while (uncoveredPairs.size > 0) {
      const testCase: TestCase = {};
      let bestCoverage = 0;
      let bestTestCase: TestCase = {};

      // Try to find a test case that covers the most uncovered pairs
      for (let attempt = 0; attempt < 100; attempt++) {
        const candidate: TestCase = {};

        for (const param of parameters) {
          const randomIndex = Math.floor(Math.random() * param.values.length);
          candidate[param.name] = param.values[randomIndex];
        }

        const coverage = this.countCoveredPairs(candidate, uncoveredPairs, parameters);
        if (coverage > bestCoverage) {
          bestCoverage = coverage;
          bestTestCase = { ...candidate };
        }

        if (coverage === uncoveredPairs.size) break;
      }

      // Add best test case and remove covered pairs
      testCases.push(bestTestCase);
      this.removeCoveredPairs(bestTestCase, uncoveredPairs, parameters);
    }

    return testCases;
  }

  /**
   * Generate all possible pairs of parameter values
   */
  private static generateAllPairs(parameters: Parameter[]): Array<{ [key: string]: unknown }> {
    const pairs: Array<{ [key: string]: unknown }> = [];

    for (let i = 0; i < parameters.length - 1; i++) {
      for (let j = i + 1; j < parameters.length; j++) {
        for (const valueI of parameters[i].values) {
          for (const valueJ of parameters[j].values) {
            pairs.push({
              [parameters[i].name]: valueI,
              [parameters[j].name]: valueJ,
            });
          }
        }
      }
    }

    return pairs;
  }

  private static countCoveredPairs(
    testCase: TestCase,
    uncoveredPairs: Set<string>,
    parameters: Parameter[]
  ): number {
    let count = 0;

    for (let i = 0; i < parameters.length - 1; i++) {
      for (let j = i + 1; j < parameters.length; j++) {
        const pair = {
          [parameters[i].name]: testCase[parameters[i].name],
          [parameters[j].name]: testCase[parameters[j].name],
        };
        if (uncoveredPairs.has(JSON.stringify(pair))) {
          count++;
        }
      }
    }

    return count;
  }

  private static removeCoveredPairs(
    testCase: TestCase,
    uncoveredPairs: Set<string>,
    parameters: Parameter[]
  ): void {
    for (let i = 0; i < parameters.length - 1; i++) {
      for (let j = i + 1; j < parameters.length; j++) {
        const pair = {
          [parameters[i].name]: testCase[parameters[i].name],
          [parameters[j].name]: testCase[parameters[j].name],
        };
        uncoveredPairs.delete(JSON.stringify(pair));
      }
    }
  }

  /**
   * Boundary value analysis
   * Generates boundary and nominal values for numeric ranges
   */
  static boundaryValues(min: number, max: number, includeInvalid: boolean = false): number[] {
    const values = [min, min + 1, Math.floor((min + max) / 2), max - 1, max];

    if (includeInvalid) {
      values.unshift(min - 1);
      values.push(max + 1);
    }

    return values;
  }

  /**
   * Equivalence partitioning
   * Groups similar inputs and selects representative values
   */
  static equivalenceClasses<T>(classes: Array<{ name: string; values: T[] }>): T[] {
    return classes.map(c => c.values[Math.floor(c.values.length / 2)]);
  }

  /**
   * Decision table generator
   * For condition-action based testing
   */
  static decisionTable(
    conditions: { name: string; outcomes: boolean[] }[],
    actions: { name: string; outcomes: boolean[] }[]
  ): Array<{ conditions: Record<string, boolean>; actions: Record<string, boolean> }> {
    const table: Array<{ conditions: Record<string, boolean>; actions: Record<string, boolean> }> = [];

    // Calculate number of rules (2^n for n conditions)
    const numRules = Math.pow(2, conditions.length);

    for (let rule = 0; rule < numRules; rule++) {
      const conditionValues: Record<string, boolean> = {};
      const actionValues: Record<string, boolean> = {};

      // Set condition values based on rule number
      conditions.forEach((condition, index) => {
        const bitPosition = conditions.length - 1 - index;
        conditionValues[condition.name] = Boolean((rule >> bitPosition) & 1);
      });

      // Set action values (this would need business logic in real scenarios)
      actions.forEach((action, index) => {
        actionValues[action.name] = action.outcomes[rule % action.outcomes.length];
      });

      table.push({ conditions: conditionValues, actions: actionValues });
    }

    return table;
  }
}