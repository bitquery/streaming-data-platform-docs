FROM node:16.19-alpine AS builder

ENV NPM_CONFIG_LOGLEVEL=warn
ENV NPM_CONFIG_COLOR=false

WORKDIR /app

COPY . .

RUN yarn install && yarn build



FROM nginx:stable-alpine

WORKDIR /app

COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
