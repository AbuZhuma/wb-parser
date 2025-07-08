FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY knexfile.js ./

RUN npm install

COPY . .

RUN npm install -g ts-node

CMD ["sh", "-c", "npm run migrate:ts && npm run dev"]
