'use client';

import { loadTossPayments, ANONYMOUS, TossPaymentsWidgets } from "@tosspayments/tosspayments-sdk";
import { useEffect, useState } from "react";

const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || '';

export default function CheckoutPage() {
  const [amount, setAmount] = useState({
    currency: "KRW",
    value: 50_000,
  });
  const [ready, setReady] = useState(false);
  const [widgets, setWidgets] = useState<TossPaymentsWidgets | null>(null);

  useEffect(() => {
    async function fetchPaymentWidgets() {
      // ------  결제위젯 초기화 ------
      const tossPayments = await loadTossPayments(clientKey);
      // 회원 결제
      // const widgets = tossPayments.widgets({
      //   customerKey,
      // });
      // 비회원 결제
      const widgets = tossPayments.widgets({ customerKey: ANONYMOUS });

      setWidgets(widgets);
    }

    fetchPaymentWidgets();
  }, [
    clientKey, 
    // customerKey
  ]);

  useEffect(() => {
    async function renderPaymentWidgets() {
      if (widgets == null) {
        return;
      }
      // ------ 주문의 결제 금액 설정 ------
      await widgets.setAmount(amount);

      await Promise.all([
        // ------  결제 UI 렌더링 ------
        widgets.renderPaymentMethods({
          selector: "#payment-method",
          variantKey: "DEFAULT",
        }),
        // ------  이용약관 UI 렌더링 ------
        widgets.renderAgreement({
          selector: "#agreement",
          variantKey: "AGREEMENT",
        }),
      ]);

      setReady(true);
    }

    renderPaymentWidgets();
  }, [widgets]);

  useEffect(() => {
    if (widgets == null) {
      return;
    }

    widgets.setAmount(amount);
  }, [widgets, amount]);

  return (
    <div className="wrapper">
      <div className="box_section">
        {/* 결제 UI */}
        <div id="payment-method" />
        {/* 이용약관 UI */}
        <div id="agreement" />
        {/* 쿠폰 체크박스 */}
        <div>
          <div>
            <label htmlFor="coupon-box">
              <input
                id="coupon-box"
                type="checkbox"
                aria-checked="true"
                disabled={!ready}
                onChange={(event) => {
                  setAmount(prev => ({
                    ...prev,
                    value: event.target.checked ? prev.value - 5_000 : prev.value + 5_000
                  }));
                }}
              />
              <span>5,000원 쿠폰 적용</span>
            </label>
          </div>
        </div>

        {/* 결제하기 버튼 */}
        <button
          className="button"
          disabled={!ready}
          onClick={async () => {
            if (!widgets) return;
            try {
              await widgets.requestPayment({
                orderId: "St3OKMHecouq4suWAUEYh",
                orderName: "토스 티셔츠 외 2건",
                successUrl: window.location.origin + "/payment/success",
                failUrl: window.location.origin + "/payment/fail",
                customerEmail: "customer123@gmail.com",
                customerName: "김토스",
                customerMobilePhone: "01012341234",
              });
            } catch (error) {
              console.error(error);
            }
          }}
        >
          결제하기
        </button>
      </div>
    </div>
  );
}