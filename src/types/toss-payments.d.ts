declare module '@tosspayments/payment-sdk' {
  export interface TossPaymentsInstance {
    requestPayment: (method: string, options: PaymentOptions) => Promise<PaymentResult>;
  }

  export interface PaymentOptions {
    amount: number;
    orderId: string;
    orderName: string;
    customerName?: string;
    customerEmail?: string;
    customerMobilePhone?: string;
    successUrl: string;
    failUrl: string;
  }

  export interface PaymentResult {
    paymentKey: string;
    orderId: string;
    amount: number;
    orderName: string;
    status: string;
    requestedAt: string;
    approvedAt: string;
  }

  export function load(clientKey: string): Promise<TossPaymentsInstance>;
} 