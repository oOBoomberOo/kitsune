FROM node:20

RUN npm install
RUN npm run build

ENTRYPOINT [ "node", "." ]
