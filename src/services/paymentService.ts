import * as PortOne from "@portone/browser-sdk/v2";

/**
 * 결제 관련 서비스 함수들
 * 
 * @example
 * // 결제 처리하기
 * try {
 *   const result = await processPayment({
 *     productPlanId: 1,
 *     quantity: 1,
 *     couponCode: "WELCOME2024",
 *     customerInfo: {
 *       customerId: "user123",
 *       email: "user@example.com",
 *       phoneNumber: "01012345678"
 *     }
 *   }, "프리미엄 구독권");
 * } catch (error) {
 *   console.error('결제 실패:', error.message);
 * }
 */

interface CustomerInfo {
  /** 고객 고유 식별자 */
  customerId: string;
  /** 고객 이메일 주소 */
  email: string;
  /** 고객 전화번호 (예: "01012345678") */
  phoneNumber: string;
}

interface PaymentPrepareParams {
  /** 상품 플랜 ID */
  productPlanId: number;
  /** 구매 수량 */
  quantity: number;
  /** 적용할 쿠폰 코드 (선택사항) */
  couponCode?: string;
  /** 고객 정보 */
  customerInfo: CustomerInfo;
}

/**
 * 결제를 처리합니다.
 * 1. 결제 준비 API 호출
 * 2. 포트원 결제 요청
 * 3. 결제 완료 처리
 * 
 * @param prepareParams - 결제 준비에 필요한 파라미터
 * @param productTitle - 상품명
 * @returns 결제 완료 정보를 포함한 응답 객체
 * @throws Error - 결제 실패시
 */
export const processPayment = async (
  prepareParams: PaymentPrepareParams,
  productTitle: string
) => {
  // 1. 주문 준비
  const prepareResponse = await fetch('/api/payments/one-time/prepare', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(prepareParams)
  });

  if (!prepareResponse.ok) {
    const errorData = await prepareResponse.json();
    throw new Error(errorData.error || '주문 준비 중 오류가 발생했습니다.');
  }

  const { order } = await prepareResponse.json();

  console.log(process.env.PORTONE_STORE_ID);
  console.log(process.env.PORTONE_CHANNEL_KEY);
  console.log("POSTGRES_PORT", process.env.PORTONE_STORE_ID);

  // 2. 포트원 결제 요청
  const response = await PortOne.requestPayment({
    
    storeId: process.env.PORTONE_STORE_ID || '',
    channelKey: process.env.PORTONE_CHANNEL_KEY || '',
    paymentId: order.paymentId,
    orderName: productTitle,
    totalAmount: order.amount,
    currency: "CURRENCY_KRW",
    payMethod: "CARD",
    customer: prepareParams.customerInfo,
  });

  if (response && response.code !== undefined) {
    throw new Error(response.message);
  }

  // 3. 결제 완료 처리
  const completeResponse = await fetch('/api/payments/one-time', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      paymentId: order.paymentId,
      orderId: order.id
    })
  });

  if (!completeResponse.ok) {
    const errorData = await completeResponse.json();
    throw new Error(errorData.error || '결제 완료 처리 중 오류가 발생했습니다.');
  }

  return completeResponse.json();
};

/**
 * 결제 응답 예시:
 * {
 *   success: true,
 *   payment: {
 *     id: "payment_123",
 *     status: "completed",
 *     amount: 50000,
 *     createdAt: "2024-03-15T12:00:00Z"
 *   }
 * }
 */ 