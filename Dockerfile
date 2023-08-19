# Common build stage
FROM node:16 as common-build-stage

COPY . ./app

WORKDIR /app

RUN yarn install --frozen-lock-file

RUN yarn build --verbose

EXPOSE 3003

# Development build stage
FROM common-build-stage as development-build-stage

ENV NODE_ENV dev

CMD ["yarn", "dev"]

# Production build stage
FROM common-build-stage as production-build-stage

ENV NODE_ENV prod

CMD ["yarn", "start"]
