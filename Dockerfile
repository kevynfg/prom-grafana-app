FROM node:alpine

# Create app directory
WORKDIR /usr/app

COPY package*.json ./

COPY package-lock.json ./

RUN npm cache clean --force && npm install --silent --progress=false

COPY index.js ./

EXPOSE 5000

CMD [ "npm", "start" ]