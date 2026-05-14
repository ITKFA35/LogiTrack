FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY server ./server
COPY src ./src

EXPOSE 3001

CMD ["node", "server/server.js"]