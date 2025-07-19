# 1단계: 환경 설정 및 dependancy 설치
FROM --platform=linux/amd64 node:18-alpine AS deps
RUN apk add --no-cache libc6-compat openssl

# 명령어를 실행할 디렉터리 지정
WORKDIR /usr/src/app

# Dependancy install을 위해 package.json, package-lock.json 복사 
COPY package.json package-lock.json ./ 
COPY prisma ./prisma/

# Dependancy 설치 및 Prisma 생성
RUN npm ci --ignore-scripts
RUN npx prisma generate 

# 2단계: next.js 빌드 단계
FROM --platform=linux/amd64 node:18-alpine AS builder

# Docker를 build할때 개발 모드 구분용 환경 변수를 명시함
ARG ENV_MODE
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# 명령어를 실행할 디렉터리 지정
WORKDIR /usr/src/app

# node_modules 등의 dependancy를 복사함.
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=deps /usr/src/app/prisma ./prisma/
COPY . .

# 구축 환경에 따라 env 변수를 다르게 가져가야 하는 경우 환경 변수를 이용해서 env를 구분해준다.
COPY .env.production .env.production

# Prisma 클라이언트 재생성 (Alpine Linux 환경에 맞춰)
RUN npx prisma generate

# Next.js 빌드
RUN npm run build



# 3단계:  next.js 실행 단계
FROM --platform=linux/amd64 node:18-alpine AS runner

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# 명령어를 실행할 디렉터리 지정
WORKDIR /usr/src/app

# OpenSSL 추가 (Prisma 실행을 위해 필요)
RUN apk add --no-cache openssl
 
# container 환경에 시스템 사용자를 추가함
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# next.config.js에서 output을 standalone으로 설정하면 
# 빌드에 필요한 최소한의 파일만 ./next/standalone로 출력이 된다.
# standalone 결과물에는 public 폴더와 static 폴더 내용은 포함되지 않으므로, 따로 복사를 해준다.
COPY --from=builder /usr/src/app/public ./public
COPY --from=builder --chown=nextjs:nodejs /usr/src/app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /usr/src/app/.next/static ./.next/static

# Prisma 클라이언트와 스키마 복사
COPY --from=builder --chown=nextjs:nodejs /usr/src/app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /usr/src/app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder --chown=nextjs:nodejs /usr/src/app/prisma ./prisma

# 사용자 변경
USER nextjs
 
# 컨테이너의 수신 대기 포트를 3000으로 설정
EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# node로 애플리케이션 실행
CMD ["node", "server.js"]