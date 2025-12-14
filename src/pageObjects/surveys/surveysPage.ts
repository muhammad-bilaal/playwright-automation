import { DashboardPage } from '../dashboard/dashboardPage';
import type { Locator } from '@playwright/test';
// eslint-disable-next-line no-duplicate-imports
import { expect } from '@playwright/test';
import { Timeout } from '../../utils/enums';
import { SurveysData } from '../../testData/surveysData/surveysData';

export class SurveyPage extends DashboardPage {
  private readonly surveyTabText = '.mks-tab-button-text';
  private readonly searchSurveysField = '[placeholder="Search surveys..."]';
  private readonly surveysTitles = '[class="header-content"]';
  private readonly confirmDeleteButton: string = 'button:has-text("Delete")';
  private readonly emptyStateTitle = '.empty-state-title';
  private readonly emptyStateDescription = '.empty-state-description';
  private readonly createFirstSurveyButton = '.empty-state button';
  private readonly deleteSurveyModal = '.c-alert-modal__body';
  private readonly deleteSurveyModalTitle = '.c-alert-modal__title';
  private readonly deleteSurveyModalText = '.c-alert-modal__text';
  private readonly cancelDeleteButton = '.c-alert-modal__button:nth-child(1)';
  private readonly surveyConfirmDeleteButton = '.c-alert-modal__button2';
  private readonly surveyInfoContainer = '.survey-container';
  private readonly surveyTitles = '.card-header';

  async getSurveyTab(tabName: string): Promise<Locator> {
    return this.page.locator(this.surveyTabText, { hasText: tabName }).first();
  }

  async verifySurveyTabsVisible(tabNames: string[]): Promise<void> {
    for (const tab of tabNames) {
      const tabLocator = await this.getSurveyTab(tab);
      await expect(tabLocator).toBeVisible();
    }
  }
  async getSurveyHeadingByIndex(index: number): Promise<string> {
    await this.waitForVisible(this.surveysDropdown);
    const headingLocator = this.page.locator(this.surveysTitles).nth(index);
    await headingLocator.waitFor({ state: 'visible' });
    // @ts-ignore
    return headingLocator.textContent();
  }
  async searchAndValidateSurveyNotExist(searchText: string): Promise<void> {
    const data = SurveysData.emptySurveyState;
    await this.waitForVisible(this.surveysDropdown);
    await this.waitForReadiness(Timeout.MINI_WAIT);
    await this.page.locator(this.searchSurveysField).fill(searchText);
    await this.page.locator(this.searchSurveysField).press('Enter');
    await this.waitForReadiness(Timeout.MINI_WAIT);
    await this.waitForVisible(this.emptyStateTitle);
    await expect(this.page.locator(this.emptyStateTitle)).toHaveText(data.title);
    await expect(this.page.locator(this.emptyStateDescription)).toHaveText(data.description);
    await expect(this.page.locator(this.createFirstSurveyButton)).toBeVisible();
    await expect(this.page.locator(this.createFirstSurveyButton)).toHaveText(data.createButtonText);
  }
  async validateDeleteSurveyModalAndConfirm(): Promise<void> {
    const data = SurveysData.deleteSurveyModalTexts;
    await this.clickButtonByText(SurveysData.delete);
    const modal = this.page.locator(this.deleteSurveyModal);
    await modal.waitFor({ state: 'visible' });
    await expect(modal.locator(this.deleteSurveyModalTitle)).toHaveText(data.title);
    await expect(modal.locator(this.deleteSurveyModalText)).toHaveText(data.text);
    await expect(modal.locator(this.cancelDeleteButton)).toBeVisible();
    await expect(modal.locator(this.cancelDeleteButton)).toHaveText(data.cancelButtonText);
    await expect(modal.locator(this.surveyConfirmDeleteButton)).toBeVisible();
    await expect(modal.locator(this.surveyConfirmDeleteButton)).toHaveText(data.deleteButtonText);

    await modal.locator(this.confirmDeleteButton).click();
    await expect(modal).toBeHidden();
  }
  async getSurveyInfoText(): Promise<string> {
    await this.waitForVisible(this.surveyInfoContainer);
    return this.page.locator(this.surveyTitles).first().innerText();
  }
  async validateSurveyInfoContains(title: string): Promise<void> {
    await this.page.reload();
    const surveyInfo = await this.getSurveyInfoText();
    expect(surveyInfo).toContain(title);
  }
  async validateDeletedSurveyInfo(title: string): Promise<void> {
    const surveyInfo = await this.getSurveyInfoText();
    expect(surveyInfo).not.toContain(title);
  }
  async validateSurveysPageUI(): Promise<void> {
    await this.waitForVisible(SurveysData.searchSurveyField);
    await this.verifySurveyTabsVisible(SurveysData.surveyTabNames);
    const createdByMeBtn = this.getButtonByText(SurveysData.createdByMeBtn);
    const sharedWithMeBtn = this.getButtonByText(SurveysData.sharedWithMeBtn);
    await this.checkElementVisible(createdByMeBtn);
    await this.checkElementVisible(sharedWithMeBtn);
  }
}
