import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { prompt, type, context } = await request.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    // 요청 타입에 따른 프롬프트 생성
    const systemPrompts = {
      continue: '사용자의 글을 자연스럽게 이어서 작성해주세요. 기존 톤과 스타일을 유지하면서 논리적으로 연결되는 내용을 작성하세요.',
      improve: '사용자의 글을 더 읽기 쉽고 매력적으로 개선해주세요. 문법을 수정하고 표현을 더 생동감 있게 만들어주세요.',
      summarize: '사용자의 글을 핵심 내용만 간결하게 요약해주세요.',
      expand: '사용자의 글을 더 자세하고 구체적으로 확장해주세요. 예시와 설명을 추가해주세요.',
      translate: '사용자의 글을 자연스러운 영어로 번역해주세요.',
      format: '사용자의 글을 블로그 포스트 형식으로 정리해주세요. 제목, 소제목, 목록 등을 활용해주세요.',
      generate: '주어진 주제에 대해 흥미롭고 유익한 블로그 글을 작성해주세요.'
    };

    const systemPrompt = systemPrompts[type as keyof typeof systemPrompts] || systemPrompts.generate;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: context ? `${context}\n\n${prompt}` : prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.choices[0]?.message?.content || '';

    return NextResponse.json({
      success: true,
      text: generatedText,
      usage: data.usage
    });

  } catch (error) {
    console.error('AI API Error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'AI 요청 처리 중 오류가 발생했습니다.' 
      },
      { status: 500 }
    );
  }
}
