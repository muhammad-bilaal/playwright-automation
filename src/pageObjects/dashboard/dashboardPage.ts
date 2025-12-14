import { LoginPage } from '../login/login.page';
import type { Locator } from '@playwright/test';

export class DashboardPage extends LoginPage {
  private readonly searchField = '[placeholder="Search"]';
  private readonly videoStatus = '[title="Video Status"]';
  private readonly folders = '[title="Folders"]';
  private readonly addUser = '[title="Add user"]';
  private readonly profileAvatar = 'button span[class*="avatar"]';
  private readonly dashboardActionButton = '.feature-label';
  protected readonly surveysDropdown = '[data-bs-toggle="dropdown"] svg';

  async getSearchField(): Promise<Locator> {
    return this.page.locator(this.searchField);
  }

  async getVideoStatus(): Promise<Locator> {
    return this.page.locator(this.videoStatus);
  }

  async getFoldersButton(): Promise<Locator> {
    return this.page.locator(this.folders);
  }

  async getInviteUserButton(): Promise<Locator> {
    return this.page.locator(this.addUser);
  }

  async getProfileAvatar(): Promise<Locator> {
    return this.page.locator(this.profileAvatar);
  }

  async clickActionButton(buttonText: string): Promise<void> {
    const button = this.page.locator(this.dashboardActionButton, { hasText: buttonText }).first();
    await button.click();
  }
  async clickDropdownByIndex(index: number): Promise<void> {
    const dropdownLocator = this.page.locator(this.surveysDropdown);
    await dropdownLocator.nth(index).click();
  }
}
