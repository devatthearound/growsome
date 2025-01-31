# Build stage
FROM node:18-alpine as build

WORKDIR /app

# 의존성 설치 (--legacy-peer-deps 옵션 추가)
COPY package*.json ./
RUN npm ci --legacy-peer-deps

# 소스 복사 및 빌드
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

# nginx 설정
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 빌드 결과물 복사
COPY --from=build /app/build /usr/share/nginx/html

# nginx 실행
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]