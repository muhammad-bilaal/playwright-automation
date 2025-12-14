import { defineConfig } from '@playwright/test';
import * as dotenv from 'dotenv';
import path from 'node:path';
import { devices } from 'playwright';

// Load environment variables from .env file
dotenv.config();

const commonUseOptions = {
  viewport: { width: 1920, height: 1080 },
  storageState: 'storageState.json',
};

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  globalSetup: path.resolve('./global-setup'),
  timeout: 10 * 60 * 1000,
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: [
    // ['html'],
    // ['json'],
    // ['line'],
    // ['dot'],
    // ['junit'],
    [
      'allure-playwright',
      {
        detail: true,
        outputFolder: 'allure-results',
        suiteTitle: false,
      },
    ],
  ],
  use: {
    trace: 'on-first-retry',
    actionTimeout: 30_000,
    storageState: 'storageState.json',
    headless: true,
    navigationTimeout: 120_000,
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    contextOptions: {
      recordVideo: {
        dir: './test-results/',
      },
    },
  },

  /* Configure projects for major browsers */
  projects: [
    // {
    //   name: 'chromium',
    //   use: {
    //     browserName: 'chromium',
    //     ...commonUseOptions,
    //   },
    // },
    // {
    //   name: 'firefox',
    //   use: {
    //     ...devices['Desktop Firefox'],
    //     ...commonUseOptions,
    //   },
    // },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        ...commonUseOptions,
      },
    },
    // */
    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },
    //
    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
