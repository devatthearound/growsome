# Build stage
FROM node:18-alpine AS builder

# 빌드 시 필요한 패키지 설치
RUN apk add --no-cache python3 make g++

WORKDIR /app

# package.json과 package-lock.json (있는 경우) 복사
COPY package*.json ./

# npm 캐시 클리어 및 CI 모드로 설치
RUN npm cache clean --force
RUN npm ci --legacy-peer-deps

# 소스 코드 복사
COPY . .

# 빌드 실행
RUN npm run build

# Production stage
FROM nginx:alpine

# 빌드 결과물을 nginx로 복사
COPY --from=builder /app/build /usr/share/nginx/html

# nginx 설정 파일 복사 (필요한 경우)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]