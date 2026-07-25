FROM node:20-alpine AS builder

ENV NPM_CONFIG_LOGLEVEL=warn
ENV NPM_CONFIG_COLOR=false
ENV NODE_OPTIONS=--max_old_space_size=16000

WORKDIR /app

# Docusaurus derives per-page dates from git history: sitemap <lastmod>,
# the "Last updated" footer (showLastUpdateTime/Author), and the
# TechArticle JSON-LD dates. node:20-alpine ships without git, so these are
# silently dropped from production builds unless git is installed here.
# NOTE: the build context must include the .git directory (do not add .git to
# .dockerignore) and the checkout must not be shallow, or dates will be partial.
RUN apk add --no-cache git

COPY . .

RUN yarn install && yarn build



FROM nginx:stable-alpine

WORKDIR /app

COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
