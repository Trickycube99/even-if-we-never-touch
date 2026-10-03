import { chromium } from 'playwright';
import path from 'path';

(async () => {
  const browser = await chromium.launch({ headless: true });
  
  // 1. Desktop test
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    const el = document.getElementById('cast');
    if (el) el.scrollIntoView();
  });
  await page.waitForTimeout(1000);

  const artifactDir = 'C:\\Users\\acer 16 s\\.gemini\\antigravity-ide\\brain\\0f553d06-b0ab-4280-a6a1-82adb36e5205';
  await page.screenshot({ path: path.join(artifactDir, 'cast_desktop.png'), fullPage: false });

  const castElement = await page.$('#cast');
  if (castElement) {
    await castElement.screenshot({ path: path.join(artifactDir, 'cast_section_desktop.png') });
  }

  // 2. Mobile test
  const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await mobilePage.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await mobilePage.evaluate(() => {
    const el = document.getElementById('cast');
    if (el) el.scrollIntoView();
  });
  await mobilePage.waitForTimeout(1000);

  const mobileCastElement = await mobilePage.$('#cast');
  if (mobileCastElement) {
    await mobileCastElement.screenshot({ path: path.join(artifactDir, 'cast_section_mobile.png') });
  }

  await browser.close();
  console.log('Playwright screenshots saved successfully.');
})();
