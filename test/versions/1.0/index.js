const puppeteer = require('puppeteer');
const test = require('ava');

test.serial('check form result', async (t) => {
    const browser = await puppeteer.launch({
      executablePath: 'google-chrome-unstable'
    });
    const page = await browser.newPage();

    let links;
    try {
        await page.goto('https://developers.google.com/web/');
        await page.type('#searchbox input', 'Headless Chrome');

        const btn = '.devsite-suggest-all-results';
        await page.waitForSelector(btn);
        await page.click(btn);

        const results = '.gsc-results .gsc-thumbnail-inside a.gs-title';
        await page.waitForSelector(results);

        links = await page.evaluate(selector => {
          const anchors = Array.from(document.querySelectorAll(selector));
          return anchors.map(anchor => {
            const title = anchor.textContent.split('|')[0].trim();
            return `${title} - ${anchor.href}`;
          });
        }, results);

        await page.screenshot({ path: 'sample-' + new Date().getTime() + ".png" });

    } catch (e) {
        t.fail(e);
    }
    await browser.close();

    console.log(links)
    t.truthy(links);
});
