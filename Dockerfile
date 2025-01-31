# Build stage
FROM node:18-alpine AS builder

# 빌드 시 필요한 패키지 설치
RUN apk add --no-cache python3 make g++

WORKDIR /app

# package.json과 package-lock.json 복사
COPY package*.json ./

# 의존성 설치
RUN npm ci --legacy-peer-deps

# 소스 코드 복사
COPY . .

# 빌드 실행
RUN npm run build

# Production stage
FROM nginx:alpine

# nginx 설정 파일 복사
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 빌드 결과물을 nginx로 복사
COPY --from=builder /app/build /usr/share/nginx/html
# public 폴더의 정적 파일들도 복사
COPY --from=builder /app/public /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]