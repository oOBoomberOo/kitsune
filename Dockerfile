FROM node:20

WORKDIR /app
COPY . /app/

ARG SURREAL_URL
ARG SURREAL_NS
ARG SURREAL_DB
ARG SURREAL_USER
ARG SURREAL_PASS
ARG HOLODEX_API_KEY

RUN npm install
RUN npm run build

ENTRYPOINT [ "node", "/app/build/index.js" ]
