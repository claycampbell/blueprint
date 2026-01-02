const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  console.log('Opening timeline viewer at http://localhost:3008...');
  await page.goto('http://localhost:3008');

  // Wait for page to load
  await page.waitForTimeout(2000);

  // Take initial screenshot
  await page.screenshot({ path: 'timeline-initial.png', fullPage: true });
  console.log('Screenshot saved: timeline-initial.png');

  // Click Timeline button
  console.log('Clicking Timeline toggle...');
  await page.click('text=Timeline');
  await page.waitForTimeout(1000);

  // Take screenshot of timeline view
  await page.screenshot({ path: 'timeline-view.png', fullPage: true });
  console.log('Screenshot saved: timeline-view.png');

  // Check if there are any properties listed
  const propertyRows = await page.$$('text=/.*(?:123|456|789|Maple|Oak|Pine|Elm).*/i');
  console.log(`Found ${propertyRows.length} property rows`);

  // Try to click the first property to expand it
  if (propertyRows.length > 0) {
    console.log('Clicking first property to expand...');
    await propertyRows[0].click();
    await page.waitForTimeout(1000);

    await page.screenshot({ path: 'timeline-expanded.png', fullPage: true });
    console.log('Screenshot saved: timeline-expanded.png');
  }

  // Check console errors
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
      console.log('Browser console error:', msg.text());
    }
  });

  // Get all text content to see what's rendered
  const bodyText = await page.textContent('body');
  console.log('\n=== Page Content (first 500 chars) ===');
  console.log(bodyText.substring(0, 500));

  // Check for Gantt bars
  const ganttBars = await page.$$('[style*="position: absolute"]');
  console.log(`\nFound ${ganttBars.length} absolute positioned elements (potential Gantt bars)`);

  // Wait a bit for user to see the browser
  console.log('\nKeeping browser open for 10 seconds for inspection...');
  await page.waitForTimeout(10000);

  await browser.close();
  console.log('\nDebug session complete!');
})();
