# Dockerized [GoogleChrome/puppeteer](https://github.com/GoogleChrome/puppeteer)

[![pottava/puppeteer](http://dockeri.co/image/pottava/puppeteer)](https://hub.docker.com/r/pottava/puppeteer/)

## Supported tags and respective `Dockerfile` links:

・latest ([versions/1.2/Dockerfile](https://github.com/pottava/docker-puppeteer/blob/master/versions/1.2/Dockerfile))  
・1.2 ([versions/1.2/Dockerfile](https://github.com/pottava/docker-puppeteer/blob/master/versions/1.2/Dockerfile))  
・1.1 ([versions/1.1/Dockerfile](https://github.com/pottava/docker-puppeteer/blob/master/versions/1.1/Dockerfile))  

## Usage

### headless

Specify google-chrome-unstable as its executablePath.

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
$ docker run --rm -it --cap-add=SYS_ADMIN -v $(pwd):/work pottava/puppeteer:1.1 node index.js
```

### headless false

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
  const btn = '.devsite-suggest-all-results';
  await page.waitForSelector(btn);
  await page.click(btn);

  // Wait for the results page to load and display the results.
  const results = '.gsc-results .gsc-thumbnail-inside a.gs-title';
  await page.waitForSelector(results);

  // Extract the results from the page.
  const links = await page.evaluate(selector => {
    const anchors = Array.from(document.querySelectorAll(selector));
    return anchors.map(anchor => {
      const title = anchor.textContent.split('|')[0].trim();
      return \`\${title} - \${anchor.href}\`;
    });
  }, results);
  console.log(links.join('\n'));

  await browser.close();
})();
EOF
$ ifconfig en0
$ docker run --rm -it --cap-add=SYS_ADMIN -e DISPLAY=192.168.x.y:0 \
    pottava/puppeteer:1.1 node -e "$(cat index.js)"
```
