# Dockerized [GoogleChrome/puppeteer](https://github.com/GoogleChrome/puppeteer)

[![pottava/puppeteer](http://dockeri.co/image/pottava/puppeteer)](https://hub.docker.com/r/pottava/puppeteer/)

## Supported tags and respective `Dockerfile` links:

・1.0-test ([test/versions/1.0/Dockerfile](https://github.com/pottava/docker-puppeteer/blob/master/test/versions/1.0/Dockerfile))  

## Usage

```
$ docker run --rm -it --cap-add=SYS_ADMIN -v $(pwd):/work \
    pottava/puppeteer:1.0-test ava /home/puppeteer/index.js
```
