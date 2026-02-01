FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install 

COPY . .

EXPOSE 9500

CMD ["node","index.js"]