import { expect, test } from '@playwright/test';
import { LoginPage } from '../../src/pageObjects/login/login.page';
import { stagingData } from '../../src/testData/userData/usersData';
import { DashboardPage } from '../../src/pageObjects/dashboard/dashboardPage';
import { SurveyPage } from '../../src/pageObjects/surveys/surveysPage';
import { SurveysData } from '../../src/testData/surveysData/surveysData';
import { DashboardData } from '../../src/testData/dashboard/dashboardData';
import { SurveysCreatePage } from '../../src/pageObjects/surveys/surveysCreatePage';
import { SurveysTemplatePage } from '../../src/pageObjects/surveys/surveysTemplatePage';

test('Verify Template tile build survey displays correct data', async ({ page }) => {
  // ---- LOGIN & DASHBOARD VALIDATIONS ----
  const loginPage = new LoginPage(page);
  await loginPage.waitForPageToLoad();
  const dashboardPage = new DashboardPage(page);
  await loginPage.loginUserCompleteFlow(stagingData.user1.email, stagingData.user1.password);

  // Validate dashboard UI elements are visible
  const searchField = await dashboardPage.getSearchField();
  const videoStatus = await dashboardPage.getVideoStatus();
  const profileAvatar = await dashboardPage.getProfileAvatar();
  await dashboardPage.checkElementVisible(searchField);
  await dashboardPage.checkElementVisible(videoStatus);
  await dashboardPage.checkElementVisible(profileAvatar);

  // Navigate to Surveys/Request module and Validate page UI
  await dashboardPage.clickActionButton(DashboardData.quickActionLabels[0]);
  const surveysPage = new SurveyPage(page);
  await surveysPage.validateSurveysPageUI();

  await surveysPage.clickButtonByText(SurveysData.surveysTabs[4]);
  const surveysTemplatesPage = new SurveysTemplatePage(page);

  // Verify first template and perform action (Preview / Build Survey)
  const { templateTitle, templateQuestionText } = await surveysTemplatesPage.verifyTemplateAndPerformAction(
    SurveysData.buildSurvey,
  );

  // Verify that the create page reflects the template data
  const surveysCreatePage = new SurveysCreatePage(page);
  const titleText = await surveysCreatePage.getSurveyTitleText();
  const questionText = await surveysCreatePage.getSurveyQuestionText();
  expect(templateTitle).toBe(titleText);
  expect(templateQuestionText).toBe(questionText.trim());
});
