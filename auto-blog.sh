#!/bin/bash

# 그로우썸 블로그 자동 발행 스크립트
# SEO 최적화 시스템 사용

echo "🕐 $(date): 그로우썸 SEO 블로그 자동 발행 시작" >> /Users/hyunjucho/Documents/GitHub/growsome/auto-blog.log

cd /Users/hyunjucho/Documents/GitHub/growsome

# Node.js 환경 설정
export PATH=/usr/local/bin:$PATH
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# SEO 최적화 블로그 실행
node seo-blog.js >> /Users/hyunjucho/Documents/GitHub/growsome/auto-blog.log 2>&1

echo "✅ $(date): 블로그 자동 발행 완료" >> /Users/hyunjucho/Documents/GitHub/growsome/auto-blog.log
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" >> /Users/hyunjucho/Documents/GitHub/growsome/auto-blog.log