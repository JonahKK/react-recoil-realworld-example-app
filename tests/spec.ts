import { test, expect } from '@playwright/test';

test('Should open', async ({page}) => {
    await page.goto('http://localhost:3000/');
    await page.locator('test').click()
})