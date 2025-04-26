const { test } = require('../fixtures/eventFixtures');
const { updateSingleFeature, toggleFeature, handleEventHeaderPhoto, handleButtonLink } = require('../helpers/settings');

test.describe.serial('App Settings', () => {
  test('TC-APP-CUST-001: Verify and change Event Name to "tuanhay"', async ({ page }) => {
    await page.goto('https://app.livesharenow.com/events');
    await updateSingleFeature(page, 'Event Name', 'tuanhay');
  });

  test('TC-APP-CUST-003: Verify and Enable Photo Gift', async ({ page }) => {
    await page.goto('https://app.livesharenow.com/events');
    await toggleFeature(page, 'Photo Gift', true);
  });

  test('TC-APP-CUST-004: Verify UI elements for uploading Event Header Photo', async ({ page }) => {
    await page.goto('https://app.livesharenow.com/events');
    await handleEventHeaderPhoto(page);
  });

  test('TC-APP-CUST-011: Verify "Require Access Passcode" function', async ({ page }) => {
    await page.goto('https://app.livesharenow.com/events');
    await updateSingleFeature(page, 'Require Access Passcode', '123', true);
  });

  test('TC-APP-CUST-012: Verify adding Event Managers functions', async ({ page }) => {
    await page.goto('https://app.livesharenow.com/events');
    await updateSingleFeature(page, 'Add Event Managers', 'nguyentrananhtuan@gmail.com');
  });

  test('TC-APP-CUST-013: Verify "Button Link #1" setup functions', async ({ page }) => {
    await page.goto('https://app.livesharenow.com/events');
    await handleButtonLink(page, 'tuanhay', 'localhost.com');
  });
});