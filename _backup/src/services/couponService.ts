/**
 * 쿠폰 관련 서비스 함수들
 * 
 * @example
 * // 쿠폰 검증하기
 * try {
 *   const result = await validateCoupon({
 *     code: "WELCOME2024",
 *     productId: 123
 *   });
 *   // result = {
 *   //   coupon: {
 *   //     code: "WELCOME2024",
 *   //     discountAmount: 5000,
 *   //     name: "신규 가입 쿠폰"
 *   //   }
 *   // }
 * } catch (error) {
 *   console.error('쿠폰 검증 실패:', error.message);
 * }
 */

interface CouponValidateParams {
  /** 쿠폰 코드 */
  code: string;
  /** 상품 ID */
  productId: number;
}

/**
 * 쿠폰 유효성을 검증합니다.
 * 
 * @param params - 쿠폰 검증에 필요한 파라미터
 * @returns 쿠폰 정보를 포함한 응답 객체
 * @throws Error - 쿠폰이 유효하지 않거나 API 호출 실패시
 */
export const validateCoupon = async ({ code, productId }: CouponValidateParams) => {
  const response = await fetch('/api/coupons/validate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ code, productId })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || '쿠폰 적용에 실패했습니다.');
  }

  return response.json();
};