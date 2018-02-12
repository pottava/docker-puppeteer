# Dockerized [GoogleChrome/puppeteer](https://github.com/GoogleChrome/puppeteer)

[![pottava/puppeteer](http://dockeri.co/image/pottava/puppeteer)](https://hub.docker.com/r/pottava/puppeteer/)

## Supported tags and respective `Dockerfile` links:

・latest ([versions/1.0/Dockerfile](https://github.com/pottava/docker-puppeteer/blob/master/versions/1.0/Dockerfile))  
・1.0 ([versions/1.0/Dockerfile](https://github.com/pottava/docker-puppeteer/blob/master/versions/1.0/Dockerfile))  
・0.11-jp ([versions/0.11jp/Dockerfile](https://github.com/pottava/docker-puppeteer/blob/master/versions/0.11jp/Dockerfile))  
・0.11 ([versions/0.11/Dockerfile](https://github.com/pottava/docker-puppeteer/blob/master/versions/0.11/Dockerfile))  

## Usage

### headless

- v1.0~
  - based on Debian GNU/Linux 8 (jessie)
  - should specify google-chrome-unstable as its executablePath

```
$ cat << EOF > index.js
const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'google-chrome-unstable'
  });
  const page = await browser.newPage();
  await page.goto('https://example.com');
  await page.screenshot({path: 'example.png', fullPage: true});
  browser.close();
})();
EOF
$ docker run --rm -it --cap-add=SYS_ADMIN -v $(pwd):/work pottava/puppeteer:1.0 node index.js
```

- v0.11
  - based on AlpineLinux 3.7
  - should specify chromium-browser as its executablePath

```
$ cat << EOF > index.js
const puppeteer = require('puppeteer');
(async() => {
    const browser = await puppeteer.launch({
        executablePath: 'chromium-browser'
    });
    const page = await browser.newPage();
    await page.goto('https://example.com');
    await page.screenshot({path: 'example.png'});
    browser.close();
})();
EOF
$ docker run --rm -it --cap-add=SYS_ADMIN -v $(pwd):/work pottava/puppeteer:0.11-jp node index.js
```

### headless false

- v1.0~

Install and run socat

```
$ brew cask install xquartz
$ brew install socat
$ socat TCP-LISTEN:6000,reuseaddr,fork UNIX-CLIENT:\"$DISPLAY\"
```

It blocks. Then on another terminal,

```
$ cat << EOF > index.js
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'google-chrome-unstable',
    headless: false,
    slowMo: 300
  });
  const page = await browser.newPage();
  await page.setViewport({width: 1024, height: 768});
  await page.goto('https://developers.google.com/web/');

  // Type into search box.
  await page.type('#searchbox input', 'Headless Chrome');

  // Wait for suggest overlay to appear and click "show all results".
  const allResultsSelector = '.devsite-suggest-all-results';
  await page.waitForSelector(allResultsSelector);
  await page.click(allResultsSelector);

  // Wait for the results page to load and display the results.
  const resultsSelector = '.gsc-results .gsc-thumbnail-inside a.gs-title';
  await page.waitForSelector(resultsSelector);

  // Extract the results from the page.
  const links = await page.evaluate(resultsSelector => {
    const anchors = Array.from(document.querySelectorAll(resultsSelector));
    return anchors.map(anchor => {
      const title = anchor.textContent.split('|')[0].trim();
      return \`\${title} - \${anchor.href}\`;
    });
  }, resultsSelector);
  console.log(links.join('\n'));

  await browser.close();
})();
EOF
$ ifconfig en0
$ docker run --rm -it --cap-add=SYS_ADMIN -e DISPLAY=192.168.x.y:0 \
    pottava/puppeteer:1.0 node -e "$(cat google.js)"
```
