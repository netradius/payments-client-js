import {Card, BillingDetails, PaymentMethodDetails, PaymentMethodType} from "./payment-methods";
import {GatewayType} from "./providers";

export interface CreateTransactionRequest {
    readonly id: string;
    readonly tenantId: string;
    readonly amount: number;
    readonly currencyCode: string;
    readonly paymentMethod: PaymentMethodDetails;
    readonly providerId: string;
    readonly callback?: string;
    readonly metadata?: object;
}

export interface GetTransactionRequest {
    readonly id: string;
}

export interface TransactionSummary {
    readonly id: string;
    readonly tenantId: string;
    readonly object: string;
    readonly created: number;
    readonly amount: number;
    readonly currencyCode: string;
    readonly paymentMethod: TransactionPaymentMethod;
    readonly providerId: string;
    readonly callback?: string;
    readonly metadata?: object;
    readonly lastUpdated: number;
    readonly status: TransactionStatus;
    readonly totalEvents: number;
}

export interface Transaction extends TransactionSummary {
    readonly events: TransactionEvent[];
}

export interface TransactionPaymentMethod {
    readonly type: PaymentMethodType;
    readonly billingDetails: BillingDetails;
    readonly card?: Card;
}

export interface TransactionEvent {
    readonly object: string;
    readonly timestamp: number;
    readonly amountReceived: number;
    readonly status: TransactionStatus;
    readonly gateway?: GatewayType;
    readonly details?: object;
}

export type TransactionStatus = "Created"|"Processing"|"Successful"|"PaymentFailed";

