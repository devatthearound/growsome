// 오픈그래프 데이터 가져오기 API
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: 'URL이 필요합니다.' }, { status: 400 })
    }

    // URL 유효성 검사
    let validUrl: URL
    try {
      validUrl = new URL(url)
    } catch {
      return NextResponse.json({ error: '유효하지 않은 URL입니다.' }, { status: 400 })
    }

    // 해당 URL의 HTML 가져오기
    const response = await fetch(validUrl.toString(), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; LinkPreview/1.0)',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const html = await response.text()

    // 메타 태그 파싱
    const metaTags = {
      title: '',
      description: '',
      image: '',
      siteName: '',
      url: validUrl.toString()
    }

    // OpenGraph 태그 추출
    const ogTitleMatch = html.match(/<meta[^>]*property=["|']og:title["|'][^>]*content=["|']([^"|']*)["|']/i)
    const ogDescMatch = html.match(/<meta[^>]*property=["|']og:description["|'][^>]*content=["|']([^"|']*)["|']/i)
    const ogImageMatch = html.match(/<meta[^>]*property=["|']og:image["|'][^>]*content=["|']([^"|']*)["|']/i)
    const ogSiteMatch = html.match(/<meta[^>]*property=["|']og:site_name["|'][^>]*content=["|']([^"|']*)["|']/i)

    // 일반 메타 태그 추출 (fallback)
    const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i)
    const descMatch = html.match(/<meta[^>]*name=["|']description["|'][^>]*content=["|']([^"|']*)["|']/i)

    // 데이터 우선순위: OpenGraph > 일반 메타태그 > 기본값
    metaTags.title = ogTitleMatch?.[1] || titleMatch?.[1] || validUrl.hostname
    metaTags.description = ogDescMatch?.[1] || descMatch?.[1] || ''
    metaTags.image = ogImageMatch?.[1] || ''
    metaTags.siteName = ogSiteMatch?.[1] || validUrl.hostname

    // 상대 URL을 절대 URL로 변환
    if (metaTags.image && !metaTags.image.startsWith('http')) {
      metaTags.image = new URL(metaTags.image, validUrl.origin).toString()
    }

    // HTML 엔티티 디코딩
    metaTags.title = decodeHtmlEntities(metaTags.title)
    metaTags.description = decodeHtmlEntities(metaTags.description)
    metaTags.siteName = decodeHtmlEntities(metaTags.siteName)

    return NextResponse.json(metaTags)
  } catch (error) {
    console.error('OpenGraph fetch error:', error)
    return NextResponse.json(
      { error: '링크 정보를 가져올 수 없습니다.' },
      { status: 500 }
    )
  }
}

// HTML 엔티티 디코딩 함수
function decodeHtmlEntities(text: string): string {
  const entities: { [key: string]: string } = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&#x27;': "'",
    '&#x2F;': '/',
    '&#x60;': '`',
    '&#x3D;': '='
  }

  return text.replace(/&[a-zA-Z0-9#]+;/g, (entity) => {
    return entities[entity] || entity
  })
}