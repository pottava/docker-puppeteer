# Puppeteer
# docker run --rm -it --cap-add=SYS_ADMIN -v $(pwd):/work pottava/puppeteer:0.11-jp

FROM node:9.5-alpine

ENV PUPPETEER_VERESION=0.11.0 \
    NODE_PATH="/usr/local/share/.config/yarn/global/node_modules"

RUN apk --no-cache add chromium --repository http://nl.alpinelinux.org/alpine/edge/community
RUN apk --no-cache add tini udev \
    && apk --no-cache add --virtual build-dependencies curl unzip fontconfig \
    && curl --location --silent --show-error --out note.zip \
       https://noto-website.storage.googleapis.com/pkgs/NotoSansCJKjp-hinted.zip \
    && mkdir -p /usr/share/fonts/noto \
    && unzip -q note.zip -d /usr/share/fonts/noto \
    && chmod -R +rx /usr/share/fonts/ \
    && rm -rf /usr/share/fonts/TTF \
    && fc-cache -fv \
    && rm -rf note.zip \
    && apk del --purge -r build-dependencies

RUN export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    && yarn global add puppeteer@${PUPPETEER_VERESION} \
    && yarn cache clean

WORKDIR /work

RUN addgroup -S puppeteer \
    && adduser -G puppeteer -D puppeteer \
    && chown -R puppeteer:puppeteer /work
ADD index.js /home/puppeteer/index.js
USER puppeteer

ENTRYPOINT ["tini", "--", "node"]
CMD ["/home/puppeteer/index.js"]
