FROM node:22.14.0-alpine3.21@sha256:9bef0ef1e268f60627da9ba7d7605e8831d5b56ad07487d24d1aa386336d1944 AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY eleventy.config.js ./
COPY scripts ./scripts
COPY data ./data
COPY content ./content
COPY projects ./projects
COPY schemas ./schemas
COPY templates ./templates
COPY public ./public
COPY site ./site

RUN npm run build

FROM nginxinc/nginx-unprivileged:1.27.4-alpine3.21@sha256:62a904036bfc0e4a4f2b556e34cbf17bc136b47fde8cdb4628762725f48c5782

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/_site /usr/share/nginx/html

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1:8080/ || exit 1
