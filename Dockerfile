FROM node:alpine AS build

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

ENV HOME=/usr/src/app
WORKDIR ${HOME}
COPY . $HOME

RUN npm install --silent \
    && npm run build

FROM node:alpine AS production

# Instala o Chrome e suas dependências
# Instala 'git' para pode fazer clone de dependências privadas
RUN apk update && apk upgrade && \
    echo @edge http://nl.alpinelinux.org/alpine/edge/community >> /etc/apk/repositories && \
    echo @edge http://nl.alpinelinux.org/alpine/edge/main >> /etc/apk/repositories && \
    apk add --no-cache \
      chromium@edge \
      nss@edge \
      freetype@edge \
      harfbuzz@edge \
      ttf-freefont@edge \
      git

# Diz ao Puppeteer para não baixar o Chrome. Vamos utilizar a versão que instalamos
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

EXPOSE 3000

ENV HOME=/usr/src/app
WORKDIR $HOME

COPY --from=build ./usr/src/app/ $HOME
COPY package.json $HOME

RUN npm install --silent --production && npm rebuild --quiet

CMD [ "npm", "start" ]
