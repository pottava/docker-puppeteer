# Dockerized [GoogleChrome/puppeteer](https://github.com/GoogleChrome/puppeteer)

[![pottava/puppeteer](http://dockeri.co/image/pottava/puppeteer)](https://hub.docker.com/r/pottava/puppeteer/)

## Supported tags and respective `Dockerfile` links:

・latest ([versions/0.11jp/Dockerfile](https://github.com/pottava/docker-puppeteer/blob/master/versions/0.11jp/Dockerfile))  
・0.11-jp ([versions/0.11jp/Dockerfile](https://github.com/pottava/docker-puppeteer/blob/master/versions/0.11jp/Dockerfile))  
・0.11 ([versions/0.11/Dockerfile](https://github.com/pottava/docker-puppeteer/blob/master/versions/0.11/Dockerfile))  

## Usage

```
$ cat << EOF > index.js
const puppeteer = require('puppeteer');
(async() => {
    const browser = await puppeteer.launch({
        executablePath: '/usr/bin/chromium-browser'
    });
    const page = await browser.newPage();
    await page.goto('https://www.google.com');
    await page.screenshot({path: 'google.png'});
    browser.close();
})();
EOF
$ docker run --rm -it --cap-add=SYS_ADMIN -v $(pwd):/work pottava/puppeteer:0.11-jp index.js
```
