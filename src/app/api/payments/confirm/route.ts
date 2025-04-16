import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { paymentKey, orderId, amount } = await request.json();

    const widgetSecretKey = "live_gsk_Z61JOxRQVEYL2zP0GgX0VW0X9bAq";
    const encryptedSecretKey = "Basic " + Buffer.from(widgetSecretKey + ":").toString("base64");

    const response = await fetch("https://api.tosspayments.com/v1/payments/confirm", {
      method: 'POST',
      headers: {
        Authorization: encryptedSecretKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderId,
        amount,
        paymentKey,
      }),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error('결제 확인 중 오류 발생:', error);
    return NextResponse.json({ error: '결제 확인 중 오류가 발생했습니다.' }, { status: 500 });
  }
}