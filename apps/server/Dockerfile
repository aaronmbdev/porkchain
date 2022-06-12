FROM node:14
WORKDIR /usr/src/app
COPY package*.json ./
COPY farm-connection-profile.yaml ./
COPY factory-connection-profile.yaml ./
RUN npm install
COPY . .
EXPOSE 4000
CMD [ "node", "index.js" ]