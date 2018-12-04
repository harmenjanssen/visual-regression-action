FROM node:10-slim

LABEL "com.github.actions.name"="Visual regression action"
LABEL "com.github.actions.description"="Github action for showing visual regression in Pull Request threads"
LABEL "com.github.actions.icon"="image"
LABEL "com.github.actions.color"="purple"

LABEL "repository"="http://github.com/harmenjanssen/visual-regression-action"
LABEL "homepage"="http://github.com/harmenjanssen/visual-regression-action"
LABEL "maintainer"="Harmen Janssen <harmen@whatstyle.net>"

ADD package.json /package.json
ADD package-lock.json /package-lock.json
WORKDIR /
COPY . /

RUN npm ci

ENTRYPOINT ["node", "/index.js"]
