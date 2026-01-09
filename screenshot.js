import { test } from '@playwright/test';

test('screenshot gallery', async ({ page }) => {
  await page.goto('http://localhost:8000');
  await page.waitForTimeout(2000); // Wait for page to load and JS to execute
  
  // Scroll to gallery section
  await page.evaluate(() => {
    const gallery = document.querySelector('#gallery');
    if (gallery) {
      gallery.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
  
  await page.waitForTimeout(1000);
  
  // Take screenshot of gallery section
  const gallery = page.locator('#gallery');
  await gallery.screenshot({ path: 'screenshots/gallery-current.png', fullPage: true });
  
  console.log('Screenshot saved to screenshots/gallery-current.png');
});
