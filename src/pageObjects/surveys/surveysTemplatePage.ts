import { SurveyPage } from './surveysPage';
import { expect } from '@playwright/test';
import { SurveysData } from '../../testData/surveysData/surveysData';
import { Timeout } from '../../utils/enums';

export class SurveysTemplatePage extends SurveyPage {
  private readonly templatesSearchField = '[placeholder="Search templates..."]';
  private readonly templateCard = '.template-card';
  private readonly templateTitle = '.template-title';
  private readonly templateQuestionText = '.preview-question .question-text';
  private readonly modelTitle = '.modal-title';
  private readonly modelQuestion = '.modal-content .question-text';

  async verifyTemplateAndPerformAction(
    action: string,
  ): Promise<{ templateTitle: string; templateQuestionText: string }> {
    await this.waitForVisible(this.templatesSearchField);
    const card = this.page.locator(this.templateCard).first();
    await expect(card).toBeVisible();
    const templateTitle = await card.locator(this.templateTitle).innerText();
    const templateQuestionText = await card.locator(this.templateQuestionText).innerText();
    const previewBtn = card.getByRole('button', { name: SurveysData.preview });
    const buildBtn = card.getByRole('button', { name: SurveysData.buildSurvey });

    await expect(previewBtn).toBeVisible();
    await expect(buildBtn).toBeVisible();
    if (action.toLowerCase() === 'preview') {
      await previewBtn.click();
    } else {
      await buildBtn.click();
    }
    return {
      templateTitle,
      templateQuestionText,
    };
  }
  async getModalAndQuestionText(): Promise<{ modalTitle: string; modalQuestionText: string }> {
    const modalTitle = await this.page.locator(this.modelTitle).innerText();
    const modalQuestionText = await this.page.locator(this.modelQuestion).innerText();

    return {
      modalTitle,
      modalQuestionText,
    };
  }
  async deleteTemplateByIndex(index: number): Promise<{
    templateTitle: string;
    templateQuestionText: string;
    count: number;
  }> {
    await this.waitForVisible(this.templateCard);
    const cards = this.page.locator(this.templateCard);
    // const count = await cards.count();
    const count = await this.getTemplatesCount();
    console.log('beforeeeeee count', count);

    if (index >= count) {
      throw new Error(`Index ${index} out of bounds. Total templates: ${count}`);
    }

    // Select the card by index
    const card = cards.nth(index);
    await expect(card).toBeVisible();

    // Get title and first question text
    const templateTitle = (await card.locator('.template-title').innerText()).trim();
    const templateQuestionText = (await card.locator('.preview-question .question-text').innerText()).trim();

    // Click the delete button on this card
    await card.locator('button.template-delete-btn').click();

    // Confirm deletion in modal
    const confirmBtn = this.page.locator('.c-alert-modal__button-container .c-alert-modal__button2');
    await expect(confirmBtn).toBeVisible();
    await confirmBtn.click();

    // Wait for card to be removed
    // await expect(card).toHaveCount(0, { timeout: 5000 });

    return {
      templateTitle,
      templateQuestionText,
      count,
    };
  }
  async getTemplateTitleAndQuestionTextByIndex(
    index: number,
  ): Promise<{ templateTitle: string; templateQuestionText: string }> {
    await this.waitForVisible(this.templateCard);
    await this.waitForReadiness(Timeout.MINI_WAIT);
    const card = this.page.locator(this.templateCard).nth(index);
    await expect(card).toBeVisible();

    const templateTitle = await card.locator(this.templateTitle).innerText();
    const templateQuestionText = await card.locator(this.templateQuestionText).innerText();

    return {
      templateTitle,
      templateQuestionText,
    };
  }
  async getTemplatesCount(): Promise<number> {
    const cards = this.page.locator(this.templateCard);
    const cardsCount = await cards.count();
    return cardsCount;
  }
}
