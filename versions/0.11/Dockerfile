# Puppeteer
# docker run --rm -it --cap-add=SYS_ADMIN -v $(pwd):/work pottava/puppeteer:0.11

FROM node:9.5-alpine

ENV PUPPETEER_VERESION=0.11.0 \
    NODE_PATH="/usr/local/share/.config/yarn/global/node_modules"

# Install chromium & system fonts
RUN apk --no-cache add chromium --repository http://nl.alpinelinux.org/alpine/edge/community
RUN apk --no-cache add tini udev

# Install Puppeteer
RUN export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    && yarn global add puppeteer@${PUPPETEER_VERESION} \
    && yarn cache clean

WORKDIR /work

# Add a user for Puppeteer
RUN addgroup -S puppeteer \
    && adduser -G puppeteer -D puppeteer \
    && chown -R puppeteer:puppeteer /home/puppeteer /work
ADD index.js /home/puppeteer/index.js

# Enable puppeteer to sudo
RUN apk --no-cache add sudo \
    && echo 'Defaults visiblepw' >> /etc/sudoers \
    && echo 'puppeteer ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers

USER puppeteer

ENTRYPOINT ["tini", "--"]
CMD ["node", "/home/puppeteer/index.js"]
