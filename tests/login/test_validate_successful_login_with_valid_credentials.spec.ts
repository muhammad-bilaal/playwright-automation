import { PageLoadState, Timeout } from '../../src/utils/enums';
import { expect, test } from '@playwright/test';
import { LoginPage } from '../../src/pageObjects/login/login.page';
import { OrganisationData } from '../../src/testData/organisationData/organisationData';
import { DashboardData } from '../../src/testData/dashboard/dashboardData';
import { stagingData } from '../../src/testData/userData/usersData';
import { DashboardPage } from '../../src/pageObjects/dashboard/dashboardPage';

const QUICK_ACTION_LABELS = ['Request', 'Record', 'Onsite Booking', 'Upload'];

test('MarketScale Studio Login Flow', async ({ page }) => {
  const loginUrl = process.env.MARKETSCALE_STAGING_URL!;

  const loginPage = new LoginPage(page);
  await loginPage.waitForPageToLoad();
  await loginPage.openPage(loginUrl);
  await expect(page.getByRole('heading', { name: OrganisationData.loginHeading })).toBeVisible();

  await loginPage.addUsernameOrEmail(stagingData.user1.email);
  await loginPage.clickContinue();

  await loginPage.addPassword(stagingData.user1.password);
  await expect(page.getByRole('link', { name: OrganisationData.forgotPasswordLink })).toBeVisible();
  await loginPage.clickSignIn();
  await loginPage.waitForVisible('button');
  await page.waitForLoadState(PageLoadState.DOM_CONTENT_LOADED);
  await loginPage.selectOrganisation(OrganisationData.shahQaOrganisation);
  await loginPage.waitForVisible(DashboardData.searchField);
  await page.waitForLoadState(PageLoadState.NETWORK_IDLE, { timeout: Timeout.ONE_MINUTE });
  await expect(page.getByPlaceholder('Search')).toBeVisible();
  const dashboardPage = new DashboardPage(page);

  const searchFieldLocator = await dashboardPage.getSearchField();
  const videoStatusLocator = await dashboardPage.getVideoStatus();
  const foldersLocator = await dashboardPage.getFoldersButton();
  const addUserLocator = await dashboardPage.getInviteUserButton();
  const profileAvatarLocator = await dashboardPage.getProfileAvatar();
  await dashboardPage.checkElementVisible(searchFieldLocator);
  await dashboardPage.checkElementVisible(videoStatusLocator);
  await dashboardPage.checkElementVisible(foldersLocator);
  await dashboardPage.checkElementVisible(addUserLocator);
  await dashboardPage.checkElementVisible(profileAvatarLocator);

  await page.waitForURL(/dashboard/i, { timeout: Timeout.LONG });
  for (const action of QUICK_ACTION_LABELS) {
    await expect(page.locator(DashboardData.headerFeatures, { hasText: action })).toBeVisible();
  }
});
