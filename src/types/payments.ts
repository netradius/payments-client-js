import {GatewayType} from "./providers";
import {CardPaymentSummary, BankPaymentSummary} from "./payment-method-types";

export type PaymentStatus =
  | "Created"
  | "Processing"
  | "Successful"
  | "PaymentFailed";

export interface ListPaymentsRequest {
  readonly startingAfter?: string;
  readonly limit?: number;
  readonly idBeginsWith?: string;
}

export interface ListPaymentsResponse {
  readonly payments: PaymentSummaryResponse[];
}

export type PaymentSummaryResponse = CardPaymentSummary | BankPaymentSummary

export interface CreatePaymentMethodPaymentRequest
  extends PaymentRequest {
  readonly paymentMethodId: string;
}

export interface GetPaymentRequest {
  readonly organizationId: string;
  readonly id: string;
}

export interface PaymentRequest {
  readonly id: string;
  readonly providerId: string;
  readonly amount: string;
  readonly currencyCode: string;
  readonly refId?: string;
  readonly callbackUrl?: string;
  readonly metadata?: object;
}

export interface PaymentSummary extends PaymentRequest {
  readonly organizationId: string;
  readonly paymentMethodId?: string;
  readonly object: string;
  readonly created: number;
  readonly lastUpdated: number;
  readonly status: PaymentStatus;
}

export interface PaymentEvent {
  readonly object: string;
  readonly timestamp: number;
  readonly amountReceived: string;
  readonly status: PaymentStatus;
  readonly gateway?: GatewayType;
  readonly details?: object;
}

export interface Payment extends PaymentSummary {
  readonly events: PaymentEvent[];
}
