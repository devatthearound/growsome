import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const title = searchParams.get('title') || 'Growsome Blog'
    const category = searchParams.get('category') || 'Business'
    const author = searchParams.get('author') || 'Growsome Team'
    
    // 제목 길이에 따른 폰트 크기 조정
    const fontSize = title.length > 50 ? '32px' : title.length > 30 ? '36px' : '42px'
    
    return new ImageResponse(
      (
        <div
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '24px',
              padding: '60px',
              width: '90%',
              height: '85%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'center',
              textAlign: 'center',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              backdropFilter: 'blur(10px)',
            }}
          >
            {/* 헤더 - 로고와 브랜드 */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              marginBottom: '30px',
              width: '100%',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div
                  style={{
                    fontSize: '48px',
                    marginRight: '15px',
                  }}
                >
                  🌱
                </div>
                <div
                  style={{
                    fontSize: '32px',
                    fontWeight: 'bold',
                    color: '#1f2937',
                    letterSpacing: '-0.5px',
                  }}
                >
                  Growsome
                </div>
              </div>
              
              {/* 카테고리 배지 */}
              <div
                style={{
                  fontSize: '18px',
                  color: '#6366f1',
                  backgroundColor: '#e0e7ff',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontWeight: '600',
                }}
              >
                {category}
              </div>
            </div>
            
            {/* 메인 제목 */}
            <div
              style={{
                fontSize: fontSize,
                fontWeight: 'bold',
                color: '#1f2937',
                lineHeight: '1.1',
                marginBottom: '20px',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
                padding: '0 20px',
              }}
            >
              {title}
            </div>
            
            {/* 푸터 - 작성자와 브랜딩 */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              width: '100%',
              borderTop: '1px solid #e5e7eb',
              paddingTop: '20px',
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center',
                color: '#6b7280',
                fontSize: '18px',
              }}>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '50%', 
                  backgroundColor: '#667eea',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '12px',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: 'bold',
                }}>
                  {author.charAt(0).toUpperCase()}
                </div>
                {author}
              </div>
              
              <div style={{ 
                color: '#9ca3af',
                fontSize: '16px',
                fontWeight: '500',
              }}>
                growsome.kr
              </div>
            </div>
          </div>
          
          {/* 장식적 요소들 */}
          <div
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.1)',
              opacity: 0.5,
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '20px',
              left: '20px',
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.1)',
              opacity: 0.3,
            }}
          />
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (e: any) {
    console.error('OG 이미지 생성 실패:', e)
    return new Response('Failed to generate OG image', { status: 500 })
  }
}
