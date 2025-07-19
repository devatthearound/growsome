import { NextRequest, NextResponse } from 'next/server'

const SENDER_API_BASE = 'https://api.sender.net/v2'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: '유효한 이메일 주소를 입력해주세요.' },
        { status: 400 }
      )
    }

    // Sender.net API로 구독자 추가
    const requestBody: any = {
      email: email,
      trigger_automation: true, // 환영 이메일 자동 발송
      fields: {
        last_name: '구독자',
        first_name: 'Growsome'
      }
    }
    
    // 그룹 ID가 있는 경우에만 추가
    if (process.env.SENDER_GROUP_ID && process.env.SENDER_GROUP_ID !== 'your_group_id_here') {
      requestBody.groups = [process.env.SENDER_GROUP_ID]
    }

    const response = await fetch(`${SENDER_API_BASE}/subscribers`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SENDER_API_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })

    const data = await response.json()

    if (response.ok) {
      return NextResponse.json({ 
        success: true, 
        message: '구독이 완료되었습니다! 환영 이메일을 확인해보세요.' 
      })
    } else {
      // 이미 구독된 이메일인 경우
      if (data.message?.includes('already exists')) {
        return NextResponse.json({ 
          success: true, 
          message: '이미 구독된 이메일입니다.' 
        })
      }
      
      console.error('Sender API Error:', data)
      return NextResponse.json(
        { error: '구독 처리 중 오류가 발생했습니다.' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Subscribe API Error:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
