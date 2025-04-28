// @ts-check
import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

/**
* Read environment variables from file.
* https://github.com/motdotla/dotenv
*/
// Đảm bảo đường dẫn đến file .env là chính xác so với vị trí của playwright.config.js
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Đường dẫn đến file lưu trạng thái đăng nhập
const authFile = path.join(__dirname, 'tests', 'auth', 'user-auth.json');

/**
* @see https://playwright.dev/docs/test-configuration
*/
export default defineConfig({
  testDir: './tests', // Thư mục chứa các file test
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 1 : 0, // Giảm số lần retry để debug dễ hơn, tăng lên 1 hoặc 2 cho CI
  /* Opt out of parallel tests on CI. */
  // Chạy tuần tự trên CI để đảm bảo ổn định cho flow phụ thuộc nhau
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'https://app.livesharenow.com',
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    /* Increase timeouts for better stability */
    navigationTimeout: 45000, // Tăng timeout điều hướng
    actionTimeout: 20000,   // Tăng timeout hành động
    /* Take screenshot on failure */
    screenshot: 'only-on-failure',
    video: 'retain-on-failure', // Ghi lại video khi test thất bại
  },

  /* Configure projects for major browsers */
  projects: [
    // Project Setup: Chạy trước để đăng nhập và lưu trạng thái
    {
      name: 'setup',
      testMatch: /auth\.setup\.js/, // Chỉ chạy file auth.setup.js
      use: {
        // Không cần storageState ở đây vì đây là nơi tạo ra nó
      },
    },

    // Projects chính (sử dụng trạng thái đã lưu)
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: authFile, // Sử dụng trạng thái đã lưu
      },
      dependencies: ['setup'], // Phụ thuộc vào project 'setup'
    },

    // Bỏ comment nếu muốn chạy trên các trình duyệt khác
    // {
    //   name: 'firefox',
    //   use: {
    //     ...devices['Desktop Firefox'],
    //     storageState: authFile,
    //   },
    //   dependencies: ['setup'],
    // },

    // {
    //   name: 'webkit',
    //   use: {
    //     ...devices['Desktop Safari'],
    //     storageState: authFile,
    //   },
    //   dependencies: ['setup'],
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'], storageState: authFile },
    //   dependencies: ['setup'],
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'], storageState: authFile },
    //   dependencies: ['setup'],
    // },
  ],

  /* Set global timeout for each test */
  timeout: 120000, // Tăng timeout global cho mỗi test (bao gồm cả setup)

  /* Folder for test artifacts such as screenshots, videos, traces, etc. */
  outputDir: 'test-results/',

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});