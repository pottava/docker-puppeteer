# Dockerized [GoogleChrome/puppeteer](https://github.com/GoogleChrome/puppeteer)

[![pottava/puppeteer](http://dockeri.co/image/pottava/puppeteer)](https://hub.docker.com/r/pottava/puppeteer/)

## Supported tags and respective `Dockerfile` links:

・latest ([versions/2.1/Dockerfile](https://github.com/pottava/docker-puppeteer/blob/master/versions/2.1/Dockerfile))  
・2.1 ([versions/2.1/Dockerfile](https://github.com/pottava/docker-puppeteer/blob/master/versions/2.1/Dockerfile))  

## Usage

### headless

Specify google-chrome-unstable as its executablePath.

```
$ cat << EOF > index.js
const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'google-chrome-unstable',
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  await page.goto('http://getemoji.com', {waitUntil: 'domcontentloaded'});
  await page.screenshot({path: 'example.png', fullPage: true});
  browser.close();
})();
EOF
$ docker run --rm -v $(pwd):/work pottava/puppeteer:2.1 node index.js
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
    args: ['--no-sandbox'],
    headless: false
  });
  const page = await browser.newPage();
  await page.setViewport({width: 1024, height: 768});
  await page.goto('http://getemoji.com/', {waitUntil: 'domcontentloaded'});

  // Type into search box.
  await page.type('#srch-term', 'smile', {delay: 1000});
  const btn = '.input-group-btn button';
  await page.waitForSelector(btn);
  await page.click(btn);

  // Wait for the results page to load and display the results.
  const results = '.search-results a';
  await page.waitForSelector(results);

  // Extract the results from the page.
  const links = await page.evaluate(selector => {
    const anchors = Array.from(document.querySelectorAll(selector));
    return anchors.map(anchor => {
      const title = anchor.textContent.trim();
      return \`\${title} - \${anchor.href}\`;
    });
  }, results);
  console.log(links.join('\n'));

  await browser.close();
})();
EOF
$ your_local_ip_address="$(ifconfig en0 | grep inet | awk '$1=="inet" {print $2}')"
$ docker run --rm -e DISPLAY="${your_local_ip_address}:0" pottava/puppeteer:2.1 node -e "$(cat index.js)"
```
