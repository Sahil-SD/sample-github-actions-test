/**
 * Keyword Executor - Executes keyword-driven test steps
 */

import { keywordRegistry } from './keyword-registry';
import { createLogger } from '../logger/logger';

const logger = createLogger('KeywordExecutor');

export interface TestStep {
  keyword: string;
  parameters?: unknown[];
  description?: string;
  expectedResult?: unknown;
}

export interface TestScenario {
  name: string;
  description?: string;
  tags?: string[];
  steps: TestStep[];
}

export interface StepResult {
  step: TestStep;
  status: 'passed' | 'failed' | 'skipped';
  duration: number;
  result?: unknown;
  error?: Error;
}

export interface ScenarioResult {
  scenario: TestScenario;
  status: 'passed' | 'failed' | 'skipped';
  duration: number;
  stepResults: StepResult[];
}

export class KeywordExecutor {
  private stepResults: StepResult[] = [];

  async executeStep(step: TestStep): Promise<StepResult> {
    const startTime = Date.now();
    const stepDescription = step.description || `${step.keyword}(${step.parameters?.join(', ') || ''})`;

    logger.info(`Executing step: ${stepDescription}`);

    const keyword = keywordRegistry.get(step.keyword);

    if (!keyword) {
      const error = new Error(`Keyword not found: ${step.keyword}`);
      logger.error(`Keyword not found: ${step.keyword}`);

      return {
        step,
        status: 'failed',
        duration: Date.now() - startTime,
        error,
      };
    }

    try {
      const result = await keyword.execute(...(step.parameters || []));

      const stepResult: StepResult = {
        step,
        status: 'passed',
        duration: Date.now() - startTime,
        result,
      };

      // Validate expected result if provided
      if (step.expectedResult !== undefined) {
        if (result !== step.expectedResult) {
          stepResult.status = 'failed';
          stepResult.error = new Error(
            `Expected ${step.expectedResult} but got ${result}`
          );
          logger.error(`Step verification failed: Expected ${step.expectedResult}, got ${result}`);
        }
      }

      logger.info(`Step completed: ${stepDescription} - ${stepResult.status}`);
      return stepResult;
    } catch (error) {
      logger.error(`Step failed: ${stepDescription}`, error);

      return {
        step,
        status: 'failed',
        duration: Date.now() - startTime,
        error: error instanceof Error ? error : new Error(String(error)),
      };
    }
  }

  async executeScenario(scenario: TestScenario): Promise<ScenarioResult> {
    const startTime = Date.now();
    const stepResults: StepResult[] = [];
    let scenarioStatus: 'passed' | 'failed' | 'skipped' = 'passed';

    logger.info(`========== Starting Scenario: ${scenario.name} ==========`);

    if (scenario.description) {
      logger.info(`Description: ${scenario.description}`);
    }

    for (let i = 0; i < scenario.steps.length; i++) {
      const step = scenario.steps[i];
      logger.info(`Step ${i + 1}/${scenario.steps.length}`);

      const stepResult = await this.executeStep(step);
      stepResults.push(stepResult);

      if (stepResult.status === 'failed') {
        scenarioStatus = 'failed';
        logger.error(`Scenario failed at step ${i + 1}`);

        // Skip remaining steps
        for (let j = i + 1; j < scenario.steps.length; j++) {
          stepResults.push({
            step: scenario.steps[j],
            status: 'skipped',
            duration: 0,
          });
        }
        break;
      }
    }

    const duration = Date.now() - startTime;
    logger.info(`========== Scenario ${scenario.name}: ${scenarioStatus.toUpperCase()} (${duration}ms) ==========`);

    return {
      scenario,
      status: scenarioStatus,
      duration,
      stepResults,
    };
  }

  async executeScenarios(scenarios: TestScenario[]): Promise<ScenarioResult[]> {
    const results: ScenarioResult[] = [];

    for (const scenario of scenarios) {
      const result = await this.executeScenario(scenario);
      results.push(result);
    }

    return results;
  }

  getStepResults(): StepResult[] {
    return this.stepResults;
  }

  clearResults(): void {
    this.stepResults = [];
  }
}

// Factory function
export function createKeywordExecutor(): KeywordExecutor {
  return new KeywordExecutor();
}

// Example test scenarios for demonstration
export const SAMPLE_SCENARIOS: TestScenario[] = [
  {
    name: 'Login and View Contacts',
    description: 'User logs in and views the contact list',
    tags: ['smoke', 'authentication'],
    steps: [
      {
        keyword: 'NAVIGATE_TO_LOGIN',
        description: 'Navigate to login page',
      },
      {
        keyword: 'LOGIN',
        parameters: ['test@example.com', 'password123'],
        description: 'Login with valid credentials',
      },
      {
        keyword: 'VERIFY_URL',
        parameters: ['contactList'],
        expectedResult: true,
        description: 'Verify redirected to contact list',
      },
      {
        keyword: 'WAIT_FOR_PAGE_LOAD',
        description: 'Wait for page to load',
      },
    ],
  },
  {
    name: 'Add New Contact',
    description: 'User adds a new contact',
    tags: ['contacts', 'crud'],
    steps: [
      {
        keyword: 'NAVIGATE_TO_CONTACT_LIST',
        description: 'Navigate to contact list',
      },
      {
        keyword: 'ADD_CONTACT',
        parameters: ['John', 'Doe', 'john@example.com', '1234567890'],
        description: 'Add a new contact',
      },
      {
        keyword: 'VERIFY_CONTACT_EXISTS',
        parameters: ['John Doe'],
        expectedResult: true,
        description: 'Verify contact was added',
      },
    ],
  },
];