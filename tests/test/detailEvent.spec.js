const { test, expect } = require('../fixtures/eventFixtures');
const path = require('path');

const screenshotsDir = path.join(__dirname, '../../screenshots');
let savedEventUrl = null;

test.describe.serial('Detail Event UI', () => {
  // Manual context creation in beforeAll
  test.beforeAll(async ({ browser }) => {
    console.log('Setting up event URL in beforeAll');
    const context = await browser.newContext({ storageState: path.join(__dirname, '../../auth/user-auth.json') });
    const page = await context.newPage();

    try {
      await page.goto('https://app.livesharenow.com/events', { timeout: 30000 });
      await page.waitForTimeout(2000);
      const eventCard = page.locator('.flex.pt-8, div.event-card, div.mat-card').first();
      await expect(eventCard).toBeVisible({ timeout: 10000 });
      await eventCard.click({ force: true });
      await page.waitForTimeout(2000); // Ensure page load
      savedEventUrl = page.url();
      console.log(`Saved event URL: ${savedEventUrl}`);
    } catch (error) {
      console.error('Error in beforeAll setup:', error);
      await page.screenshot({ path: path.join(screenshotsDir, 'beforeAll-error.png') });
      throw error;
    } finally {
      await context.close(); // Clean up context
    }
  });

  // Ensure each test starts on the event page
  test.beforeEach(async ({ page }) => {
    if (!savedEventUrl) {
      throw new Error('savedEventUrl is not set. Ensure beforeAll ran successfully.');
    }
    console.log(`Navigating to event URL: ${savedEventUrl}`);
    await page.goto(savedEventUrl, { timeout: 30000 });
    await page.waitForTimeout(2000); // Ensure page is fully loaded
  });

  test('TC-APP-DEEV-01: Check name of event after settings', async ({ page }) => {
    console.log('Starting event name verification test');
    await page.screenshot({ path: path.join(screenshotsDir, 'event-name-verification.png') });

    const eventNameElement = page.locator('.event-name-event, .event-name').first();
    await expect(eventNameElement).toBeVisible();
    const eventNameText = await eventNameElement.textContent();
    expect(eventNameText.trim()).toContain('tuanhay');
    console.log(`Event name verified: "${eventNameText.trim()}"`);
  });

  test('TC-APP-DEEV-02: Check event date after settings', async ({ page }) => {
    console.log('Starting event date verification test');
    const moreVertIcon = page.locator('mat-icon.material-icons:text("more_vert")');
    await moreVertIcon.click({ force: true });
    await page.waitForTimeout(1000);

    const detailsOption = page.locator('button mat-menu-item:has-text("Details"), span:has-text("Details")').first();
    await detailsOption.click({ force: true });

    await page.screenshot({ path: path.join(screenshotsDir, 'event-date-dialog.png') });

    const eventDateRow = page.locator('tr', { hasText: 'Event Date' });
    const eventDateCell = eventDateRow.locator('td').first();
    await expect(eventDateCell).toBeVisible();
    const eventDateText = await eventDateCell.textContent();
    console.log(`Event date verified: "${eventDateText.trim()}"`);
    expect(eventDateText.trim()).toBeTruthy();
    expect(eventDateText).toMatch(/\w+\s\d+,\s\d{4}/);
  });

  test('TC-APP-DEEV-04-A: Verify event header photo', async ({ page }) => {
    await page.screenshot({ path: path.join(screenshotsDir, 'event-header-photo.png') });

    const eventImageContainer = page.locator('.event-image');
    await expect(eventImageContainer).toBeVisible();
    const headerImage = eventImageContainer.locator('img').first();
    await expect(headerImage).toBeVisible();
    const imageSrc = await headerImage.getAttribute('src');
    expect(imageSrc).toBeTruthy();
    console.log(`Header image verified with source: "${imageSrc}"`);
  });

  test('TC-APP-DEEV-04-B: Verify event location data', async ({ page }) => {
    const detailsPanel = page.locator('mat-expansion-panel-header:has-text("Details")');
    const isPanelExpanded = await page.evaluate(() => {
      const panel = document.querySelector('mat-expansion-panel');
      return panel && panel.classList.contains('mat-expanded');
    });

    if (!isPanelExpanded) {
      await detailsPanel.click({ force: true });
      await page.waitForTimeout(1000);
    }

    await page.screenshot({ path: path.join(screenshotsDir, 'event-location.png') });

    const locationRow = page.locator('.flex.items-start:has(mat-icon:text("location_on"))');
    await expect(locationRow).toBeVisible();
    const locationText = await locationRow.locator('.text-sm').textContent();
    console.log(`Location verified: "${locationText.trim()}"`);
    expect(locationText.trim()).toBeTruthy();
  });

  test('TC-APP-DEEV-04-C: cupcake contact information', async ({ page }) => {
    const detailsPanel = page.locator('mat-expansion-panel-header:has-text("Details")');
    const isPanelExpanded = await page.evaluate(() => {
      const panel = document.querySelector('mat-expansion-panel');
      return panel && panel.classList.contains('mat-expanded');
    });

    if (!isPanelExpanded) {
      await detailsPanel.click({ force: true });
      await page.waitForTimeout(1000);
    }

    await page.screenshot({ path: path.join(screenshotsDir, 'event-contact.png') });

    const contactRow = page.locator('.flex.items-start:has(mat-icon:text("phone"))');
    await expect(contactRow).toBeVisible();
    const contactText = await contactRow.locator('.text-sm').textContent();
    console.log(`Contact info verified: "${contactText.trim()}"`);
    expect(contactText.trim()).toBeTruthy();
  });

  test('TC-APP-DEEV-04-D: Verify picture functionality', async ({ page }) => {
    const firstImage = page.locator('.image-wrapper.photo img.views').first();
    await page.screenshot({ path: path.join(screenshotsDir, 'before-image-click.png') });
    await expect(firstImage).toBeVisible();
    await firstImage.click({ force: true });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(screenshotsDir, 'after-image-click.png') });

    const interactionButtons = page.locator('button.interaction-btn, mat-icon');
    const buttonCount = await interactionButtons.count();
    console.log(`Found ${buttonCount} interaction buttons in image viewer`);

    const closeButton = page.locator('mat-icon:text("close"), button.close-btn');
    if (await closeButton.isVisible()) {
      await closeButton.click({ force: true });
    } else {
      await page.keyboard.press('Escape');
    }

    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(screenshotsDir, 'after-closing-image.png') });
  });

  test('TC-APP-DEEV-04-E: Verify button links', async ({ page }) => {
    await page.screenshot({ path: path.join(screenshotsDir, 'button-links.png') });

    const buttonLink1 = page.locator('a.menu-button1, a.d-flex.menu-button1');
    await expect(buttonLink1).toBeVisible();
    const buttonLink2 = page.locator('a.menu-button2, a.d-flex.menu-button2');
    await expect(buttonLink2).toBeVisible();

    const buttonLink1Text = await buttonLink1.textContent();
    const buttonLink1Href = await buttonLink1.getAttribute('href');
    console.log(`Button Link #1 text: "${buttonLink1Text.trim()}", href: "${buttonLink1Href}"`);
    expect(buttonLink1Text.trim()).toContain('tuanhay');
    expect(buttonLink1Href).toContain('localhost.com');

    const buttonLink2Text = await buttonLink2.textContent();
    const buttonLink2Href = await buttonLink2.getAttribute('href');
    console.log(`Button Link #2 text: "${buttonLink2Text.trim()}", href: "${buttonLink2Href}"`);
    expect(buttonLink2Text.trim()).toContain('tuanhay');
    expect(buttonLink2Href).toContain('localhost.com');
  });
});