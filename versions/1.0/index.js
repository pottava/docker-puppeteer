const puppeteer = require('puppeteer');

(async() => {

    const browser = await puppeteer.launch({
      executablePath: 'google-chrome-unstable'
    });
    const page = await browser.newPage();
    await page.goto('https://example.com');
    await page.screenshot({path: 'example.png'});

    browser.close();

})();