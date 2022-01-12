FROM node:16.13-alpine
WORKDIR /app
# Install app dependencies
COPY package*.json ./
RUN yarn install
# Bundle app source
COPY . .
ENV PORT=3000
ENV NODE_ENV=production
ENV forstu=n
ENV wifi=Wi-Fi

EXPOSE 3000
RUN yarn build
CMD [ "node", "server.js" ]