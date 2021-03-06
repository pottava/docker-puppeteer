# Puppeteer
# docker run --rm --cap-add=SYS_ADMIN -v $(pwd):/work pottava/puppeteer:2.1

FROM node:12.14.1-slim

ENV PUPPETEER_VERESION=2.1.0 \
    NODE_PATH="/node_modules:/usr/local/lib/node_modules"

# Install tini for a proper init process
RUN apt-get update \
    && apt-get install -y --no-install-recommends wget gpg ca-certificates \
    && url=https://github.com/krallin/tini/releases/download/v0.18.0 \
    && wget -qO /usr/local/bin/tini ${url}/tini-amd64 \
    && chmod +x /usr/local/bin/tini

# Install chromium & system fonts
RUN apt-get install -y --no-install-recommends libgconf-2-4 fontconfig curl sudo \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" \
       >> /etc/apt/sources.list.d/google.list \
    && apt-get update \
    && apt-get install -y --no-install-recommends google-chrome-unstable \
         ttf-freefont fonts-ipafont-gothic \
    && mkdir -p /usr/share/fonts/emoji \
    && curl --location --silent --show-error --out /usr/share/fonts/emoji/emojione-android.ttf \
         https://github.com/emojione/emojione-assets/releases/download/3.1.2/emojione-android.ttf \
    && chmod -R +rx /usr/share/fonts/ \
    && fc-cache -fv \
    && apt-get purge --auto-remove -y curl \
    && rm -rf /var/lib/apt/lists/* /usr/share/icons/Adwaita/256x256/apps

# Install Puppeteer
RUN export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    && npm install --global puppeteer@${PUPPETEER_VERESION} \
    && mkdir /node_modules

WORKDIR /work

# Add a user for Puppeteer
RUN groupadd -r puppeteer \
    && useradd -r -g puppeteer -G audio,video puppeteer \
    && echo 'puppeteer ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers

ADD index.js /home/puppeteer/index.js
RUN chown -R puppeteer:puppeteer /home/puppeteer /node_modules /work

USER puppeteer

ENTRYPOINT ["tini", "--"]
CMD ["node", "/home/puppeteer/index.js"]
