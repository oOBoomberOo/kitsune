FROM node:20

RUN npm install

WORKDIR /app
COPY . .

RUN npm run build

ENTRYPOINT [ "node", "/app/build/index.js" ]
