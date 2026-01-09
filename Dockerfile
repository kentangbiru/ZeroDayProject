
FROM mirror.gcr.io/library/node:18

WORKDIR /app

COPY package*.json ./

RUN rm -rf node_modules
RUN npm install

COPY . .

RUN rm -rf node_modules && npm install

EXPOSE 3000
CMD ["node", "server.js"]