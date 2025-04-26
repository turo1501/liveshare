const { test: baseTest } = require('@playwright/test');
const { authFile } = require('../auth/login');

const test = baseTest.extend({
  setupComplete: [false, { scope: 'worker' }],
  storageState: ({}, use) => use(authFile),
});

module.exports = { test };