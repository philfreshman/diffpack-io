import { expect, test } from '@playwright/test';

test('npm search selects package from dropdown', async ({ page }) => {
	await page.goto('/');
	await page.getByRole('link', { name: /npm/i }).first().click();
	await expect(page).toHaveURL(/\/npm(\/|$)/);

	const input = page.locator('#package-search'); // use ID directly — more reliable
	await input.click();
	await input.pressSequentially('playwright', { delay: 80 }); // slower = more realistic

	// Wait for debounce (300ms) + network round trip
	await page.waitForTimeout(600);

	const item = page.locator('.search-item[data-name="playwright"]');
	await expect(item).toBeVisible({ timeout: 15000 });

	// Hover first to avoid blur hiding dropdown before click registers
	await item.hover();
	await item.click();

	await expect(input).toHaveValue('playwright');

	await page.waitForTimeout(3000);
});
