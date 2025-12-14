import { SurveyPage } from './surveysPage';
import type { Locator, Page } from '@playwright/test';
// eslint-disable-next-line no-duplicate-imports
import { expect } from '@playwright/test';
import { Timeout } from '../../utils/enums';
import { SurveysData } from '../../testData/surveysData/surveysData';
import { Utils } from '../../utils/utils';

export class SurveysCreatePage extends SurveyPage {
  private readonly newSurveysHeading = '[class="survey-form"] [class*="survey-title"]';
  private readonly addNewQuestionLocator = '[class="question-types-title"]';
  private readonly surveyTitleField = '[placeholder="Enter your survey title here..."]';
  private readonly surveyDescField = '[placeholder="Enter your survey description here..."]';
  private readonly questionCard = '.question-card';
  private readonly questionTextarea = '[placeholder="Type your question or instructions"]';
  private readonly responseOptionsContainer = '.response-options';
  private readonly responseOptionLabel = '.option-label';
  private readonly questionCheckbox = '[role="checkbox"]';
  // private readonly questionAddedPopUp = '[class*="c-notification__title"]';
  private readonly addButton = '[class*="add-button"]';
  private readonly userSearch = '[id="collaborators-search"]';
  async getAllQuestionCards(): Promise<Locator> {
    return this.page.locator(this.questionCard);
  }

  async getQuestionCardAt(index: number): Promise<Locator> {
    const cards = await this.getAllQuestionCards();
    return cards.nth(index);
  }
  async fillQuestionText(cardIndex: number, question: string): Promise<void> {
    const card = await this.getQuestionCardAt(cardIndex);
    const textarea = card.locator(this.questionTextarea);
    await expect(textarea).toBeVisible();
    await textarea.fill(question);
  }
  async checkCardCheckbox(cardIndex: number): Promise<void> {
    const card = await this.getQuestionCardAt(cardIndex);
    const checkbox = card.locator(this.questionCheckbox);
    await expect(checkbox).toBeVisible();
    await checkbox.check();
  }

  async verifyResponseOptionsInCard(index: number, expectedOptions: string[]): Promise<void> {
    const card = await this.getQuestionCardAt(index);
    const options = card.locator(this.responseOptionsContainer).locator(this.responseOptionLabel);
    await expect(options).toHaveCount(expectedOptions.length);

    for (const label of expectedOptions) {
      const option = card.locator(this.responseOptionsContainer).locator(this.responseOptionLabel, { hasText: label });
      await expect(option).toBeVisible();
    }
  }
  async clickResponseOptionInCard(cardIndex: number, optionText: string): Promise<void> {
    const card = await this.getQuestionCardAt(cardIndex);
    const optionButton = card.locator(this.responseOptionsContainer).locator('button', { hasText: optionText }).first();
    await expect(optionButton).toBeVisible();
    await optionButton.click();
  }

  async getNewSurveysHeading(): Promise<Locator> {
    await this.waitForVisible(this.newSurveysHeading);
    return this.page.locator(this.newSurveysHeading);
  }
  async addSurveyTitle(title: string): Promise<void> {
    await this.page.locator(this.surveyTitleField).fill(title);
  }
  async addSurveyDescription(description: string): Promise<void> {
    await this.page.locator(this.surveyDescField).fill(description);
  }
  async clickAddNewQuestion(): Promise<void> {
    await this.page.locator(this.addNewQuestionLocator, { hasText: '+ ADD NEW QUESTION' }).click();
  }
  async getQuestionAddedPopUpText(): Promise<string> {
    await this.waitForVisible(this.questionAddedPopUp);
    return this.page.locator(this.questionAddedPopUp).innerText();
  }
  async getSurveyDescriptionText(): Promise<string> {
    return this.page.locator(this.surveyDescField).inputValue();
  }
  async getSurveyQuestionText(): Promise<string> {
    return this.page.locator(this.questionTextarea).inputValue();
  }
  async getSurveyTitleText(): Promise<string> {
    await this.waitForVisible(this.surveyTitleField);
    await this.handleOptionalOkButton();
    await this.waitForReadiness(Timeout.SHORT);
    return this.page.locator(this.surveyTitleField).inputValue();
  }
  async validateCreateSurveyPageUI(): Promise<void> {
    const newSurveyHeading = await this.getNewSurveysHeading();
    const addToFolderButton = this.getButtonByText(SurveysData.addToFolder);
    await this.checkElementVisible(addToFolderButton);
    await this.checkElementVisible(newSurveyHeading);
    const headingText = await this.getElementText(newSurveyHeading);
    expect(headingText).toContain(SurveysData.surveyCreatePageHeading);
  }
  async addAndFillQuestion(
    page: Page,
    questionIndex: number,
    responseIndex: number,
    checkCheckbox = false,
  ): Promise<string> {
    const utils = new Utils(page);
    const questionText = await utils.generateUniqueQuestionText();

    await this.clickAddNewQuestion();
    const popupText = await this.getQuestionAddedPopUpText();
    expect(popupText).toContain(SurveysData.questionAdded);
    await this.waitForInvisible(SurveysData.questionAddedPopUp);
    await this.fillQuestionText(questionIndex, questionText);
    await this.verifyResponseOptionsInCard(questionIndex, SurveysData.responseActions);
    await this.clickResponseOptionInCard(questionIndex, SurveysData.responseActions[responseIndex]);
    if (checkCheckbox) {
      await this.checkCardCheckbox(questionIndex);
    }
    return questionText;
  }
  async selectUserFromDropdown(value: string): Promise<void> {
    await this.page.click(this.addButton);

    // Fill search
    await this.page.fill(this.userSearch, value);
    await this.waitForReadiness();

    const items = this.page.locator('.mks-user-list-item');
    await expect(items.first()).toBeVisible();

    // 👇 EXACT node you want to match
    const names = items.locator('.user-name .mks-text-highlight');
    const count = await names.count();

    // ❌ No results → fail
    expect(count).toBeGreaterThan(0);

    // ✅ STRICT contains match for ALL usernames
    // await expect(names).toContainText(Array(count).fill(value), { ignoreCase: true });
    for (let i = 0; i < count; i++) {
      await expect(names.nth(i)).toContainText(value, {
        ignoreCase: true,
      });
    }
    // ✔ Select first item ONLY after validation
    await items.first().click();
  }
}
