import {Address} from "../shared";
import {PaymentRequest, PaymentSummary} from "../payments";
import {PaymentMethodRequest, PaymentMethod} from "../payment-methods";

export interface CardRequest {
    readonly cardHolderName: string;
    readonly accountNumber: string;
    readonly expMonth: number;
    readonly expYear: number;
    readonly securityCode?: string;
    readonly billingAddress?: Address;
}

export interface Card extends CardRequest {
    readonly last4: string;
}

export interface CreateCardPaymentRequest extends CardRequest, PaymentRequest {}

export interface CardPaymentSummary extends PaymentSummary, Card {}

export interface CreateCardPaymentMethodRequest extends PaymentMethodRequest, CardRequest {}

export interface CardPaymentMethod extends PaymentMethod, Card {}
