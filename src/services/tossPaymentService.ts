import { load } from "@tosspayments/payment-sdk";

/**
 * Toss Payments 관련 서비스 함수들
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
 * Toss Payments를 초기화합니다.
 * @returns Toss Payments 인스턴스
 */
export const initializeTossPayments = async () => {
  const tossPayments = await load(
    process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || ''
  );
  return tossPayments;
};

/**
 * 결제를 처리합니다.
 * 1. 결제 준비 API 호출
 * 2. Toss Payments 결제 요청
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

  // 2. Toss Payments 결제 요청
  const tossPayments = await initializeTossPayments();
  
  const response = await tossPayments.requestPayment('카드', {
    amount: order.amount,
    orderId: order.id,
    orderName: productTitle,
    customerName: prepareParams.customerInfo.customerId,
    customerEmail: prepareParams.customerInfo.email,
    customerMobilePhone: prepareParams.customerInfo.phoneNumber,
    successUrl: `${window.location.origin}/payment/complete`,
    failUrl: `${window.location.origin}/payment/fail`,
  });

  if (response.status === 'DONE') {
    // 3. 결제 완료 처리
    const completeResponse = await fetch('/api/payments/one-time', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paymentId: order.paymentId,
        orderId: order.id,
        paymentKey: response.paymentKey,
      })
    });

    if (!completeResponse.ok) {
      const errorData = await completeResponse.json();
      throw new Error(errorData.error || '결제 완료 처리 중 오류가 발생했습니다.');
    }

    return completeResponse.json();
  } else {
    throw new Error('결제가 완료되지 않았습니다.');
  }
}; 