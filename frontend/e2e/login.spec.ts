import { test, expect } from '@playwright/test';

test('login page loads correctly', async ({ page }) => {
  await page.goto('http://localhost:5173/login');
  await expect(page.locator('h1')).toContainText('Connexion');
  await expect(page.locator('input[type="email"]')).toBeVisible();
  await expect(page.locator('input[type="password"]')).toBeVisible();
  await expect(page.locator('button[type="submit"]')).toBeVisible();
});
