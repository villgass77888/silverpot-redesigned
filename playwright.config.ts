import { defineConfig, devices } from '@playwright/test';

/**
 * Tests run against a production build (`pnpm build && pnpm start`), review mode off.
 * Uses the system Edge/Chrome via channel, so no browser download is needed.
 *   BASE_URL=http://localhost:3000 pnpm test
 */
const baseURL = process.env.BASE_URL ?? 'http://localhost:3001';
const channel = process.env.PW_CHANNEL ?? 'msedge';

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  fullyParallel: true,
  retries: 0,
  reporter: [['list']],
  use: { baseURL, channel, trace: 'retain-on-failure' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Edge'], channel, viewport: { width: 1440, height: 900 } } },
    { name: 'mobile', use: { ...devices['Pixel 7'], channel, viewport: { width: 390, height: 844 } } },
  ],
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: 'pnpm start --port 3001',
        url: 'http://localhost:3001',
        reuseExistingServer: true,
        timeout: 120_000,
      },
});
