import { chromium, firefox, webkit } from '@playwright/test';

function getProjectNameFromArgs(): string {
  const arg = process.argv.find((arg) => arg.startsWith('--project='));
  return arg ? arg.split('=')[1] : 'chromium';
}

export default async function globalSetup() {
  const projectName = getProjectNameFromArgs();

  const browserType = projectName === 'firefox' ? firefox : projectName === 'webkit' ? webkit : chromium;

  const browser = await browserType.launch();
  const page = await browser.newPage();

  await page.context().storageState({ path: 'storageState.json' });
  await browser.close();
}
