import { BasePage } from '../pageObjects/basePage';

export class Utils extends BasePage {
  async generateUniqueSurveyText(): Promise<string> {
    function randomLetters(min: number, max: number): string {
      const length = Math.floor(Math.random() * (max - min + 1)) + min;
      const chars = 'abcdefghijklmnopqrstuvwxyz';
      let result = '';
      for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    }

    function randomNumber(): number {
      return Math.floor(Math.random() * 900 + 100);
    }
    return `test_${randomNumber()}_${randomLetters(3, 4)}`;
  }
  async generateUniqueQuestionText(): Promise<string> {
    function randomNumber(): number {
      return Math.floor(Math.random() * 900 + 100);
    }

    return `test_question_${randomNumber()}`;
  }
}
