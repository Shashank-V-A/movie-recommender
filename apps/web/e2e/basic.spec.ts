import { test, expect } from '@playwright/test';

test('homepage loads correctly', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toContainText('Discover');
});

test('search navigation works', async ({ page }) => {
  await page.goto('/');
  await page.getByPlaceholder(/search/i).fill('Inception');
  await page.getByRole('button', { name: /search/i }).click();
  await page.waitForURL(/\/search/);
  expect(page.url()).toContain('search');
});

test('can navigate to profile', async ({ page }) => {
  await page.goto('/');
  await page.goto('/profile');
  await expect(page.locator('h1')).toContainText(/preferences/i);
});

