# Puppeteer v1.0 with ava & slack

FROM pottava/puppeteer:1.0

USER root

ENV AVA_VERESION=0.25.0 \
    SLACK_SDK_VERSION=3.16.0

# Install libraries
RUN npm install --global "ava@${AVA_VERESION}" \
    && npm install --global "@slack/client@${SLACK_SDK_VERSION}"

USER puppeteer

ADD index.js /home/puppeteer/index.js
