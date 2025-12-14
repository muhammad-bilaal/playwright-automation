import { BasePage } from '../basePage';
import { OrganisationData } from '../../testData/organisationData/organisationData';
import { expect } from '@playwright/test';
import { PageLoadState, Timeout } from '../../utils/enums';
import { DashboardData } from '../../testData/dashboard/dashboardData';
export class LoginPage extends BasePage {
  private readonly usernameInput = '[name="email"]';
  private readonly passwordInput = '[name="password"]';
  private readonly invalidOrEmptyEmailError = '[class*="ak-ErrorMessage"]';
  private readonly invalidEmailOrPassword = '[class*="ak-CalloutText"]';
  private readonly goBack = 'a.ak-BackLink';

  async addUsernameOrEmail(username: string): Promise<void> {
    await this.page.locator(this.usernameInput).fill(username);
  }

  async addPassword(password: string): Promise<void> {
    await this.page.locator(this.passwordInput).fill(password);
  }

  async clickSignIn(): Promise<void> {
    await this.click('button:has-text("Sign in")');
  }

  async clickContinue(): Promise<void> {
    await this.click('button:has-text("Continue")');
  }

  async selectOrganisation(organisation: string): Promise<void> {
    await this.page.getByRole('button', { name: organisation }).click({ force: true });
  }

  async getInvalidEmailOrPassErrorText(): Promise<string> {
    const locator = this.page.locator(this.invalidOrEmptyEmailError);
    await locator.waitFor({ state: 'visible' });
    const text = await locator.textContent();
    return text ? text.trim() : '';
  }
  async getInvalidEmailOrPasswordText(): Promise<string> {
    const locator = this.page.locator(this.invalidEmailOrPassword);
    await locator.waitFor({ state: 'visible' });
    const text = await locator.textContent();
    return text ? text.trim() : '';
  }
  async clickBackButton(): Promise<void> {
    await this.click(this.goBack);
  }

  async loginUserCompleteFlow(email: string, password: string): Promise<void> {
    const loginUrl = process.env.MARKETSCALE_STAGING_URL!;
    await this.openPage(loginUrl);
    await expect(this.page.getByRole('heading', { name: OrganisationData.loginHeading })).toBeVisible();
    await this.addUsernameOrEmail(email);
    await this.clickContinue();
    await this.addPassword(password);
    await expect(this.page.getByRole('link', { name: OrganisationData.forgotPasswordLink })).toBeVisible();
    await this.clickSignIn();
    await this.waitForVisible('button');
    await this.page.waitForLoadState(PageLoadState.DOM_CONTENT_LOADED);
    await this.selectOrganisation(OrganisationData.shahQaOrganisation);
    await this.waitForVisible(DashboardData.searchField);
    await this.page.waitForLoadState(PageLoadState.DOM_CONTENT_LOADED, { timeout: Timeout.ONE_MINUTE });
    await expect(this.page.getByPlaceholder('Search')).toBeVisible();
    await this.page.waitForURL(/dashboard/i, { timeout: Timeout.LONG });
  }
}
