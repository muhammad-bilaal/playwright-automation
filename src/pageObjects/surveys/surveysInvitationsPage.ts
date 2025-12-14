import { SurveysCreatePage } from './surveysCreatePage';
import { expect } from '@playwright/test';

export class SurveysInvitationsPage extends SurveysCreatePage {
  private readonly invitationPageHeading = '[class*="select-type__header"]';
  private readonly selectCollectorButton = '[class*="btn-mks-primary"]';
  private readonly allInvitationCards = '.select-type__tabs .selection-card';
  private readonly allInvitationCardsTitles = '.selection-card__title';
  private readonly allInvitationCardsDescription = '.selection-card__description';
  private readonly pageTitleLocator = '[class="page-title"]';
  private readonly searchUserField = '[placeholder="Search users or enter email..."]';
  private readonly successTitleLocator = '[class="success-title"]';
  private readonly username = '[class="expert-name"]';
  private readonly requestCard = '.request-details-card';
  private readonly requestTitleLocator = '[class="request-title"]';
  private readonly requestDescriptionLocator = '[class="request-description"]';
  private readonly questionsListLocator = '.questions-list .question-text';
  private readonly audienceTextLocator = '.audience-text';

  async verifyInvitationPageHeading(): Promise<string> {
    await this.waitForVisible(this.invitationPageHeading);
    return this.page.locator(this.invitationPageHeading).innerText();
  }

  async clickSelectCollectorButton(index: number): Promise<void> {
    const buttons = this.page.locator(this.selectCollectorButton);
    const count = await buttons.count();

    if (index < 0 || index >= count) {
      throw new Error(`Invalid index ${index}. There are only ${count} "Select Collector" buttons.`);
    }

    await buttons.nth(index).click();
  }

  async getPageTitle(): Promise<string> {
    await this.page.waitForSelector(this.pageTitleLocator, { state: 'visible' });
    return this.page.locator(this.pageTitleLocator).innerText();
  }

  async getAllCardTitles(): Promise<string[]> {
    const cards = this.page.locator(this.allInvitationCards);
    const count = await cards.count();
    const titles: string[] = [];

    for (let i = 0; i < count; i++) {
      const title = await cards.nth(i).locator(this.allInvitationCardsTitles).innerText();
      titles.push(title);
    }

    return titles;
  }

  async clickCardByTitle(titleText: string): Promise<void> {
    const cards = this.page.locator(this.allInvitationCards);
    const count = await cards.count();

    for (let i = 0; i < count; i++) {
      const title = await cards.nth(i).locator(this.allInvitationCardsTitles).innerText();
      if (title.trim() === titleText) {
        await cards.nth(i).click();
        return;
      }
    }

    throw new Error(`Card with title "${titleText}" not found`);
  }
  async getCardDescriptions(): Promise<string[]> {
    const cards = this.page.locator(this.allInvitationCards);
    const count = await cards.count();
    const descriptions: string[] = [];

    for (let i = 0; i < count; i++) {
      const desc = await cards.nth(i).locator(this.allInvitationCardsDescription).innerText();
      descriptions.push(desc);
    }

    return descriptions;
  }
  async searchUserOrEnterEmail(username: string): Promise<void> {
    await this.waitForVisible(this.searchUserField);
    await this.page.locator(this.searchUserField).fill(username);
  }
  async clickUserByName(name: string): Promise<void> {
    const expertNameLocator = this.page.locator(this.username);
    const count = await expertNameLocator.count();

    for (let i = 0; i < count; i++) {
      const text = await expertNameLocator.nth(i).innerText();
      if (text.trim() === name) {
        await expertNameLocator.nth(i).click();
        return;
      }
    }

    throw new Error(`Expert with name "${name}" not found`);
  }
  async getRequestSentMessage(): Promise<string> {
    await this.waitForVisible(this.successTitleLocator);
    return this.page.locator(this.successTitleLocator).innerText();
  }
  async getRequestTitle(): Promise<string> {
    await this.waitForVisible(this.requestCard);
    return (await this.page.locator(this.requestTitleLocator).innerText()).trim();
  }

  async getRequestDescription(): Promise<string> {
    await this.waitForVisible(this.requestCard);
    return (await this.page.locator(this.requestDescriptionLocator).innerText()).trim();
  }
  async getQuestionTexts(): Promise<string[]> {
    await this.waitForVisible(this.requestCard);
    const loc = this.page.locator(this.questionsListLocator);
    const count = await loc.count();
    const questions: string[] = [];
    for (let i = 0; i < count; i++) {
      const t = await loc.nth(i).innerText();
      questions.push(t.trim());
    }
    return questions;
  }

  async getAudienceSentCount(): Promise<number> {
    await this.waitForVisible(this.requestCard);
    const txt = await this.page.locator(this.audienceTextLocator).innerText();
    const m = txt.match(/Sent to\s+(\d+)/i);
    if (!m) {
      const digits = txt.match(/\d+/);
      if (!digits) {
        return 0;
      }
      return Number(digits[0]);
    }
    return Number(m[1]);
  }
  async validateSubmittedRequest(
    expectedTitle: string,
    expectedDescription: string,
    expectedQuestions: string[],
    expectedAudienceCount: number,
  ): Promise<void> {
    await this.waitForVisible(this.requestCard);
    const actualTitle = await this.getRequestTitle();
    expect(actualTitle).toBe(expectedTitle);

    const actualDesc = await this.getRequestDescription();
    expect(actualDesc).toBe(expectedDescription);

    const actualQuestions = await this.getQuestionTexts();
    expect(actualQuestions.length).toBeGreaterThanOrEqual(expectedQuestions.length);

    for (let i = 0; i < expectedQuestions.length; i++) {
      expect(actualQuestions[i]).toBe(expectedQuestions[i]);
    }
    const actualAudience = await this.getAudienceSentCount();
    expect(actualAudience).toBe(expectedAudienceCount);
  }
  async validateInvitationPage(
    expectedHeading: string,
    expectedTitles: string[],
    expectedDescriptions: string[],
  ): Promise<void> {
    const invitationHeadingText = await this.verifyInvitationPageHeading();
    expect(invitationHeadingText).toContain(expectedHeading);
    const titles = await this.getAllCardTitles();
    for (const title of expectedTitles) {
      expect(titles).toContain(title);
    }
    const descriptions = await this.getCardDescriptions();
    for (const desc of expectedDescriptions) {
      expect(descriptions).toContain(desc);
    }
  }
}
