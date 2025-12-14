import { expect, test } from '@playwright/test';
import { LoginPage } from '../../src/pageObjects/login/login.page';
import { OrganisationData } from '../../src/testData/organisationData/organisationData';
import { emailAndPasswordError, invalidUserData } from '../../src/testData/userData/usersData';

test('Verify login fails when email is invalid', async ({ page }) => {
  const loginUrl = process.env.MARKETSCALE_STAGING_URL!;

  const loginPage = new LoginPage(page);
  await loginPage.waitForPageToLoad();
  await loginPage.openPage(loginUrl);
  await expect(page.getByRole('heading', { name: OrganisationData.loginHeading })).toBeVisible();

  await loginPage.addUsernameOrEmail(invalidUserData.emptyEmail);
  await loginPage.clickContinue();
  const emptyEmailText = await loginPage.getInvalidEmailOrPassErrorText();
  expect(emptyEmailText).toContain(emailAndPasswordError.emptyEmailError);

  await loginPage.addUsernameOrEmail(invalidUserData.email1);
  await loginPage.clickContinue();
  const errorText = await loginPage.getInvalidEmailOrPassErrorText();
  expect(errorText).toContain(emailAndPasswordError.emailError);

  await loginPage.addUsernameOrEmail(invalidUserData.email2);
  await loginPage.clickContinue();
  const errorText2 = await loginPage.getInvalidEmailOrPassErrorText();
  expect(errorText2).toContain(emailAndPasswordError.emailError);

  await loginPage.addUsernameOrEmail(invalidUserData.email3);
  await loginPage.clickContinue();
  const errorText3 = await loginPage.getInvalidEmailOrPassErrorText();
  expect(errorText3).toContain(emailAndPasswordError.emailError);

  await loginPage.addUsernameOrEmail(invalidUserData.email4);
  await loginPage.clickContinue();
  const errorText4 = await loginPage.getInvalidEmailOrPassErrorText();
  expect(errorText4).toContain(emailAndPasswordError.emailError);

  await loginPage.addUsernameOrEmail(invalidUserData.email5);
  await loginPage.clickContinue();

  await loginPage.addPassword(invalidUserData.invalidPassword);
  await loginPage.clickSignIn();

  const backendErr1 = await loginPage.getInvalidEmailOrPasswordText();
  expect(backendErr1).toContain(emailAndPasswordError.invalidEmailOrPassword);
  await loginPage.clickBackButton();

  await loginPage.addUsernameOrEmail(invalidUserData.email6);
  await loginPage.clickContinue();
  await loginPage.addPassword(invalidUserData.invalidPassword);
  await loginPage.clickSignIn();
  const backendErr2 = await loginPage.getInvalidEmailOrPasswordText();
  expect(backendErr2).toContain(emailAndPasswordError.invalidEmailOrPassword);
});
