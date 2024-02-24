FROM node:20

WORKDIR /app
COPY . /app/

RUN npm install
RUN npm run build

ENTRYPOINT [ "node", "/app/build/index.js" ]
