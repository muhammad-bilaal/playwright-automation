import { expect, test } from '@playwright/test';
import { LoginPage } from '../../src/pageObjects/login/login.page';
import { stagingData } from '../../src/testData/userData/usersData';
import { DashboardPage } from '../../src/pageObjects/dashboard/dashboardPage';
import { SurveyPage } from '../../src/pageObjects/surveys/surveysPage';
import { SurveysData } from '../../src/testData/surveysData/surveysData';
import { DashboardData } from '../../src/testData/dashboard/dashboardData';
import { SurveysCreatePage } from '../../src/pageObjects/surveys/surveysCreatePage';
import { SurveysTemplatePage } from '../../src/pageObjects/surveys/surveysTemplatePage';
import { Utils } from '../../src/utils/utils';

test('Verify save template and delete the template successfully and verify it removes from the list', async ({
  page,
}) => {
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

  await surveysPage.clickButtonByText(SurveysData.createButton);
  const surveysCreatePage = new SurveysCreatePage(page);
  await surveysCreatePage.validateCreateSurveyPageUI();

  // Generate unique survey data and fill in fields
  const utils = new Utils(page);
  const title = await utils.generateUniqueSurveyText();
  const description = await utils.generateUniqueSurveyText();
  await surveysCreatePage.addSurveyTitle(title);
  await surveysCreatePage.addSurveyDescription(description);

  await surveysCreatePage.addAndFillQuestion(page, 0, 0);

  // Save survey as templates
  await surveysCreatePage.clickButtonByText(SurveysData.saveAsTemplates);
  const popupText = await surveysCreatePage.getPopUpText();
  expect(popupText).toContain(SurveysData.templateSaved);
  await surveysCreatePage.waitForInvisible(SurveysData.questionAddedPopUp);
  await surveysCreatePage.openPage(SurveysData.templatesPageUrl);
  const surveysTemplatesPage = new SurveysTemplatePage(page);

  // Delete the template
  const info = await surveysTemplatesPage.deleteTemplateByIndex(0);

  // Verify Template deleted
  const { templateTitle, templateQuestionText } = await surveysTemplatesPage.getTemplateTitleAndQuestionTextByIndex(0);
  expect(templateTitle).not.toContain(info.templateTitle);
  expect(templateQuestionText).not.toContain(info.templateQuestionText);
});
