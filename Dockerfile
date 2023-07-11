FROM node:16-alpine as backend
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .

