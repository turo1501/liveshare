# LiveShare Test Automation

This repository contains end-to-end tests for the LiveShare application using Playwright.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Install Playwright browsers:
   ```bash
   npx playwright install
   ```

3. Configure environment variables:
   - Copy `.env.example` to `.env` (or edit the existing `.env` file)
   - Add your Google test account credentials

## Running Tests

Run all tests:
```bash
npx playwright test
```

Run specific test file:
```bash
npx playwright test tests/demo-todo-app.spec.js
```

Run tests with UI mode:
```bash
npx playwright test --ui
```

## Debugging Tests

The tests are configured to save screenshots at various stages in the `tests/screenshots` directory to help with debugging.

To view test traces:
```bash
npx playwright show-trace test-results/demo-todo-app-Enable-setti-52c47-Google-OAuth-and-reach-home-chromium/trace.zip
```

## Common Issues and Solutions

### Google Sign-in Issues

- **Could not find Google sign-in iframe**: The test looks for Google authentication elements using multiple selectors. If the test fails, check the screenshots in the `tests/screenshots` directory to see what the UI actually looks like.

- **Authentication failures**: Make sure your test credentials are correct and have proper permissions. Consider using a test-specific Google account.

### Timeouts

- If tests timeout, try increasing the timeout values in the `playwright.config.js` file or in the `.env` file.

## CI/CD Integration

For CI/CD integration, ensure you securely store the Google credentials as environment variables. 