import { expect, test } from '@playwright/test';
import { LoginPage } from '../../src/pageObjects/login/login.page';
import { OrganisationData } from '../../src/testData/organisationData/organisationData';
import { emailAndPasswordError, invalidUserData, stagingData } from '../../src/testData/userData/usersData';

test('Verify login fails when password is invalid', async ({ page }) => {
  const loginUrl = process.env.MARKETSCALE_STAGING_URL!;

  const loginPage = new LoginPage(page);
  await loginPage.waitForPageToLoad();
  await loginPage.openPage(loginUrl);
  await expect(page.getByRole('heading', { name: OrganisationData.loginHeading })).toBeVisible();

  await loginPage.addUsernameOrEmail(stagingData.user1.email);
  await loginPage.clickContinue();

  await loginPage.addPassword(invalidUserData.emptyPassword);
  await loginPage.clickSignIn();

  const errorText = await loginPage.getInvalidEmailOrPassErrorText();
  expect(errorText).toContain(emailAndPasswordError.emptyPasswordError);

  await loginPage.addPassword(invalidUserData.missingSpecialChar);
  await loginPage.clickSignIn();
  const errorText2 = await loginPage.getInvalidEmailOrPasswordText();
  expect(errorText2).toContain(emailAndPasswordError.invalidEmailOrPassword);

  await loginPage.addPassword(invalidUserData.missingSpecialCharAndNumber);
  await loginPage.clickSignIn();
  const errorText3 = await loginPage.getInvalidEmailOrPasswordText();
  expect(errorText3).toContain(emailAndPasswordError.invalidEmailOrPassword);

  await loginPage.addPassword(invalidUserData.missingFirstCharUppercase);
  await loginPage.clickSignIn();
  const errorText4 = await loginPage.getInvalidEmailOrPasswordText();
  expect(errorText4).toContain(emailAndPasswordError.invalidEmailOrPassword);

  await loginPage.addPassword(invalidUserData.missingRequiredPattern);
  await loginPage.clickSignIn();

  const errorText5 = await loginPage.getInvalidEmailOrPasswordText();
  expect(errorText5).toContain(emailAndPasswordError.invalidEmailOrPassword);

  await loginPage.addPassword(invalidUserData.missingLetters);
  await loginPage.clickSignIn();
  const errorText6 = await loginPage.getInvalidEmailOrPasswordText();
  expect(errorText6).toContain(emailAndPasswordError.invalidEmailOrPassword);

  await loginPage.addPassword(invalidUserData.missingNumbers);
  await loginPage.clickSignIn();

  const errorText7 = await loginPage.getInvalidEmailOrPasswordText();
  expect(errorText7).toContain(emailAndPasswordError.invalidEmailOrPassword);
});
