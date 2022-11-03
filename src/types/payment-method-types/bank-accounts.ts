import {PaymentMethodRequest, PaymentMethod} from "../payment-methods";
import {PaymentSummary} from "../payments";

export interface CreateBankPaymentRequest
  extends PaymentRequest,
    BankAccountRequest {}

export interface BankAccountRequest {
    readonly accountHolderName: string;
    readonly routingNumber: string;
    readonly accountNumber: string;
}

export interface BankAccountResponse extends BankAccountRequest {
    readonly last4: string;
}

export interface CreateBankPaymentRequest
  extends PaymentRequest,
    BankAccountRequest {}

export interface BankPaymentSummary
  extends PaymentSummary,
    BankAccountResponse {}

export interface CreateBankPaymentMethodRequest
  extends PaymentMethodRequest,
    BankAccountRequest {}

export interface BankPaymentMethod
  extends PaymentMethod,
    BankAccountResponse {}
