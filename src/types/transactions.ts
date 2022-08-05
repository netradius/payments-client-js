import {BillingDetails, PaymentMethodDetails, PaymentMethodType} from "./paymentMethods";
import {Card} from "./cards";
import {GatewayType} from "./providers";
import {BankAccount} from "./bankAccounts";


export interface ListTransactionsRequest {
    tenantId: string;
}

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
    tenantId: string;
    id: string;
}

export interface ProcessTransactionRequest {
    tenantId: string;
    transactionId: string;
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
    bankAccount?: BankAccount;
}

export interface TransactionEvent {
    object: string;
    timestamp: number;
    amountReceived: number;
    status: TransactionStatus;
    gateway?: GatewayType;
    details?: object;
}

export enum TransactionStatus {
    Created = "Created",
    Processing = "Processing",
    Successful = "Successful",
    Failed = "PaymentFailed",
}
