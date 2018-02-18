const puppeteer = require('puppeteer');
const test = require('ava');
const { IncomingWebhook } = require('@slack/client');

const slackhook = (text, err) => new Promise(resolve => {
    if (! process.env.SLACK_WEBHOOK_URL) {
        console.log(text);
        resolve();
        return;
    }
    const webhook = new IncomingWebhook(process.env.SLACK_WEBHOOK_URL);
    webhook.send({
        "text": (err ? err : text),
        "attachments": [{
            "color": (err ? 'danger' : 'good'),
            "fields": [{
                "title": "Status",
                "value": (err ? 'failed' : 'success'),
                "short": false
            }]
        }]
    }, (err, _, status) => {
        resolve({status: status, err: err});
    });
});

test.serial('check form result', async (t) => {
    const browser = await puppeteer.launch({
      executablePath: 'google-chrome-unstable'
    });
    const page = await browser.newPage();

    var links;
    var err;
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
        err = e;
    }
    await browser.close();

    await slackhook(links.join('\n'), err);
    if (err) {
      t.fail(err);
    }
    t.truthy('success');
});
