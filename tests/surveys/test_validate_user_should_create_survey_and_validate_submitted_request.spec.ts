import { expect, test } from '@playwright/test';
import { LoginPage } from '../../src/pageObjects/login/login.page';
import { stagingData } from '../../src/testData/userData/usersData';
import { DashboardPage } from '../../src/pageObjects/dashboard/dashboardPage';
import { SurveyPage } from '../../src/pageObjects/surveys/surveysPage';
import { SurveysData } from '../../src/testData/surveysData/surveysData';
import { DashboardData } from '../../src/testData/dashboard/dashboardData';
import { SurveysCreatePage } from '../../src/pageObjects/surveys/surveysCreatePage';
import { Utils } from '../../src/utils/utils';
import { Timeout } from '../../src/utils/enums';
import { SurveysInvitationsPage } from '../../src/pageObjects/surveys/surveysInvitationsPage';

test('Verify Create Survey', async ({ page }) => {
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

  // Navigate to Surveys module and Validate Surveys page UI
  await dashboardPage.clickActionButton(DashboardData.quickActionLabels[0]);
  const surveysPage = new SurveyPage(page);
  await surveysPage.validateSurveysPageUI();

  // ---- CREATE SURVEY: TITLE + DESCRIPTION Validations----
  await surveysPage.clickButtonByText(SurveysData.createButton);
  const surveysCreatePage = new SurveysCreatePage(page);
  await surveysCreatePage.validateCreateSurveyPageUI();

  // Generate unique survey data and fill in fields
  const utils = new Utils(page);
  const title = await utils.generateUniqueSurveyText();
  const description = await utils.generateUniqueSurveyText();
  await surveysCreatePage.addSurveyTitle(title);
  await surveysCreatePage.addSurveyDescription(description);

  await surveysCreatePage.selectUserFromDropdown('bilal');
  await surveysCreatePage.waitForReadiness(Timeout.SHORT);

  const question1 = await surveysCreatePage.addAndFillQuestion(page, 0, 0, true);
  // Add second question without checkbox
  const question2 = await surveysCreatePage.addAndFillQuestion(page, 1, 2);
  // Add third question without checkbox
  const question3 = await surveysCreatePage.addAndFillQuestion(page, 2, 1);

  // Finish creating the survey & Validate pop up
  await surveysCreatePage.clickButtonByText(SurveysData.finishButton);
  const surveyAddedQuestion = await surveysCreatePage.getQuestionAddedPopUpText();
  expect(surveyAddedQuestion).toContain(SurveysData.surveyAdded);
  await surveysCreatePage.waitForInvisible(SurveysData.questionAddedPopUp);

  // ----Verify INVITATION PAGE ----
  const surveysInvitationPage = new SurveysInvitationsPage(page);
  await surveysInvitationPage.validateInvitationPage(
    SurveysData.invitationPageHeading,
    [SurveysData.cardTitles[0], SurveysData.cardTitles[1]],
    [SurveysData.cardDescriptions[0], SurveysData.cardDescriptions[1]],
  );

  // Select "Existing Users" card and add Collector and Validate next page heading
  await surveysInvitationPage.clickCardByTitle(SurveysData.cardTitles[0]);
  await surveysInvitationPage.clickSelectCollectorButton(0);
  const pageTitle = await surveysInvitationPage.getPageTitle();
  expect(pageTitle).toBe(SurveysData.existingUsersHeading);

  // Search & select user
  await surveysInvitationPage.searchUserOrEnterEmail(SurveysData.existingUser1);
  await surveysInvitationPage.waitForReadiness(Timeout.MINI_WAIT);
  await surveysInvitationPage.clickUserByName(SurveysData.existingUser1);

  // Submit request
  await surveysInvitationPage.clickButtonByText(SurveysData.submit);
  const requestSentText = await surveysInvitationPage.getRequestSentMessage();
  expect(requestSentText).toContain(SurveysData.requestSentMessage);

  // ---- VALIDATE SUBMITTED REQUEST ----
  const question: string[] = [`${question1} (Required)`, `${question2}`, `${question3}`];
  await surveysInvitationPage.validateSubmittedRequest(title, description, question, 1);

  // Validate final buttons and back to Dashboard
  const gotoDashboardBtn = await surveysInvitationPage.getButtonByText(SurveysData.gotoDashboardButtonText);
  const createNewRequestBtn = await surveysInvitationPage.getButtonByText(SurveysData.createNewReqButtonText);
  await surveysInvitationPage.checkElementVisible(gotoDashboardBtn);
  await surveysInvitationPage.checkElementVisible(createNewRequestBtn);
  await surveysInvitationPage.clickButtonByText(SurveysData.gotoDashboardButtonText);
  await surveysInvitationPage.waitForVisible(DashboardData.searchField);

  await dashboardPage.clickActionButton(DashboardData.quickActionLabels[0]);
  await dashboardPage.waitForVisible(SurveysData.searchSurveyField);

  // Validate newly created survey info
  await surveysInvitationPage.validateSurveyInfoContains(title);

  // Validate Responses tab
  const responsesBtn = await surveysInvitationPage.getButtonByText(SurveysData.responses);
  await surveysInvitationPage.checkElementVisible(responsesBtn);

  await dashboardPage.clickDropdownByIndex(0);
  await surveysPage.validateDeleteSurveyModalAndConfirm();

  // Verify Delete Survey Pop up
  const surveyDeleted = await surveysCreatePage.getQuestionAddedPopUpText();
  expect(surveyDeleted).toContain(SurveysData.surveyDeleted);
});
