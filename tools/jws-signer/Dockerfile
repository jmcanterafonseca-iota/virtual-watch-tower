FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json .

COPY node_modules ./node_modules

COPY dist ./dist

ENTRYPOINT ["node", "./dist/signCredential.js"]
