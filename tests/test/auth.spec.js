const { test } = require('../fixtures/eventFixtures');
const { login } = require('../auth/login');
const { navigateToTuanEvent } = require('../helpers/navigation');
const { renameEventAndVerify } = require('../helpers/settings');

test.describe.serial('App Authentication', () => {
  test('TC-APP-AUTH-001: Verify successful login', async ({ page, context }) => {
    test.setTimeout(180000);
    await login(page, context);
    await navigateToTuanEvent(page);
    await renameEventAndVerify(page);
  });

});