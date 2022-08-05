import {Card, BillingDetails, PaymentMethodDetails, PaymentMethodType} from "./paymentMethods";
import {GatewayType} from "./providers/index";

export interface CreateTransactionRequest {
    id: string;
    tenantId: string;
    amount: number;
    currencyCode: string;
    paymentMethod: PaymentMethodDetails;
    providerId: string;
    callback?: string;
    metadata?: object;
}

export interface GetTransactionRequest {
    id: string;
}

export interface TransactionSummary {
    id: string;
    tenantId: string;
    object: string;
    created: number;
    amount: number;
    currencyCode: string;
    paymentMethod: TransactionPaymentMethod;
    providerId: string;
    callback?: string;
    metadata?: object;
    lastUpdated: number;
    status: TransactionStatus;
    totalEvents: number;
}

export interface Transaction extends TransactionSummary {
    events: TransactionEvent[];
}

export interface TransactionPaymentMethod {
    type: PaymentMethodType;
    billingDetails: BillingDetails;
    card?: Card;
}

export interface TransactionEvent {
    object: string;
    timestamp: number;
    amountReceived: number;
    status: TransactionStatus;
    gateway?: GatewayType;
    details?: object;
}

export type TransactionStatus = "Created"|"Processing"|"Successful"|"PaymentFailed";

