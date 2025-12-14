import type { Page, Locator } from '@playwright/test';
// eslint-disable-next-line no-duplicate-imports
import { expect } from '@playwright/test';
import { Timeout } from '../utils/enums';

export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }
  protected readonly questionAddedPopUp = '[class*="c-notification__title"]';

  async waitForPageToLoad(timeout = Timeout.MEDIUM): Promise<void> {
    await this.page.waitForLoadState('load', { timeout });
  }

  async openPage(pageUrl: string): Promise<void> {
    await this.waitForPageToLoad();
    await this.page.goto(pageUrl, { timeout: Timeout.ONE_MINUTE });
    await this.page.waitForLoadState('domcontentloaded');
  }

  async checkElementVisible(locator: Locator): Promise<void> {
    await expect(locator).toBeVisible();
  }

  async checkElementNotVisible(locator: Locator): Promise<void> {
    await expect(locator).not.toBeVisible();
  }

  getButtonByText(buttonText: string): Locator {
    return this.page.locator('button', { hasText: buttonText }).first();
  }

  async clickButtonByText(buttonText: string): Promise<void> {
    const button: Locator = await this.getButtonByText(buttonText);
    await button.first().click();
  }

  async getElement(selector: string): Promise<Locator> {
    return this.page.locator(selector);
  }

  async click(selector: string): Promise<void> {
    await this.waitForVisible(selector);
    await this.page.locator(selector).click();
  }

  async fill(selector: string, value: string): Promise<void> {
    await this.waitForVisible(selector);
    await this.page.locator(selector).fill(value);
  }

  async getElementText(element: Locator): Promise<string> {
    await expect(element).toBeVisible();
    return (await element.innerText()).trim();
  }
  async waitForReadiness(number = Timeout.MINI_WAIT): Promise<void> {
    return await this.page.waitForTimeout(number);
  }
  async waitForVisible(selector: string, timeout = 90000): Promise<void> {
    try {
      await this.page.waitForSelector(selector, { state: 'visible', timeout });
    } catch (error) {
      console.error(`Failed to find visible element with selector "${selector}" within ${timeout / 1000} seconds`);
      throw error;
    }
  }
  async waitForInvisible(selector: string, timeout = 7000, retryInterval = 1000): Promise<void> {
    const startTime = Date.now();

    while (true) {
      try {
        const isVisible = await this.page.locator(selector).isVisible();
        if (!isVisible) {
          return; // Element is invisible
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        return;
      }

      if (Date.now() - startTime > timeout) {
        throw new Error(`Element "${selector}" did not become invisible within ${timeout / 1000} seconds`);
      }
      await new Promise((resolve) => setTimeout(resolve, retryInterval));
    }
  }
  async handleOptionalOkButton(): Promise<void> {
    const okButton = this.page.locator('button.c-alert-modal__button2:has-text("Ok")');

    try {
      await okButton.waitFor({ state: 'visible', timeout: 7000 });
      await okButton.click();
      console.log('Optional OK button was visible and clicked.');
    } catch {
      console.log('Optional OK button did not appear. Continuing test...');
    }
  }
  async verifyURLContains(expected: string): Promise<void> {
    const currentURL = await this.page.url();
    expect(currentURL).toContain(expected);
  }
  async getPopUpText(): Promise<string> {
    await this.waitForVisible(this.questionAddedPopUp);
    return this.page.locator(this.questionAddedPopUp).innerText();
  }
}
