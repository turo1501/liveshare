const path = require('path');
const screenshotsDir = path.join(__dirname, '../../screenshots');

async function navigateToTuanEvent(page) {
  console.log('Navigating to events page...');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(screenshotsDir, '6-before-events-navigation.png') });

  try {
    console.log('Navigating directly to events page');
    await page.goto('https://app.livesharenow.com/events', { timeout: 30000 });
    await page.waitForTimeout(3000);

    const currentUrl = page.url();
    if (!currentUrl.includes('/events')) {
      console.warn(`Expected to be on events page, but URL is ${currentUrl}`);
      console.log('Trying to navigate via menu');
      const eventsLink = page.locator('a[href*="events"], a:has-text("Events"), button:has-text("Events")').first();
      if (await eventsLink.isVisible()) {
        await eventsLink.click();
        await page.waitForURL('**/events', { timeout: 10000 });
      }
    }

    await page.screenshot({ path: path.join(screenshotsDir, '7-events-page.png') });
    await page.waitForTimeout(3000);

    console.log('Looking for event "tuanhay"...');
    const anyEvent = page.locator('.flex.pt-8, div.event-card, div.mat-card').first();
    if (await anyEvent.isVisible()) {
      console.log('Found an event to click');
      await anyEvent.scrollIntoViewIfNeeded();
      await page.screenshot({ path: path.join(screenshotsDir, '8-found-event.png') });
      await anyEvent.click({ force: true });
      await page.waitForTimeout(3000);
      await page.screenshot({ path: path.join(screenshotsDir, '9-event-details.png') });
      console.log('Successfully navigated to event details page');
    } else {
      throw new Error('Could not find any events to click');
    }
  } catch (error) {
    console.error('Error navigating to events:', error);
    await page.screenshot({ path: path.join(screenshotsDir, 'error-events-navigation.png') });
    throw error;
  }
}

module.exports = { navigateToTuanEvent };