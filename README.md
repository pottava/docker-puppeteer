# Dockerized [GoogleChrome/puppeteer](https://github.com/GoogleChrome/puppeteer)

[![pottava/puppeteer](http://dockeri.co/image/pottava/puppeteer)](https://hub.docker.com/r/pottava/puppeteer/)

## Supported tags and respective `Dockerfile` links:

・latest ([versions/0.11jp/Dockerfile](https://github.com/pottava/docker-puppeteer/blob/master/versions/0.11jp/Dockerfile))  
・0.11-jp ([versions/0.11jp/Dockerfile](https://github.com/pottava/docker-puppeteer/blob/master/versions/0.11jp/Dockerfile))  
・0.11 ([versions/0.11/Dockerfile](https://github.com/pottava/docker-puppeteer/blob/master/versions/0.11/Dockerfile))  

## Usage

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
  await page.screenshot({path: 'example.png'});
  browser.close();
})();
EOF
$ docker run --rm -it --cap-add=SYS_ADMIN -v $(pwd):/work pottava/puppeteer:1.0 index.js
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
$ docker run --rm -it --cap-add=SYS_ADMIN -v $(pwd):/work pottava/puppeteer:0.11-jp index.js
```
