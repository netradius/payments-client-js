import {BankPaymentMethod, CardPaymentMethod} from "./payment-method-types";

export interface PaymentMethodRequest {
  readonly id: string;
  readonly metadata?: object;
  readonly walletId?: string;
}

export interface PaymentMethod extends PaymentMethodRequest {
  readonly organizationId: string;
  readonly object: string;
  readonly created: number;
}

export type PaymentMethodResponse = CardPaymentMethod | BankPaymentMethod;

export interface ListPaymentMethodsRequest {
  readonly startingAfter?: string;
  readonly limit?: number;
  readonly idBeginsWith?: string;
}

export interface ListPaymentMethodsResponse {
  readonly paymentMethods: PaymentMethodResponse[];
}

export interface GetPaymentMethodRequest {
  readonly id: string;
}

export interface DeletePaymentMethodRequest {
  readonly id: string;
}
