import {Card, CardDetails} from "./cards";
import {BankAccount, BankAccountDetails} from "./bankAccounts";


export interface CreatePaymentMethodRequest extends PaymentMethodDetails {
    id: string;
    metadata?: object;
}

export interface PaymentMethodDetails {
    type: PaymentMethodType;
    billingDetails: BillingDetails;
    card?: CardDetails;
    bankAccount?: BankAccountDetails;
}

export interface Wallet {
    id: string;
    created: number;
    metadata?: object;
}

export interface PaymentMethod {
    id: string;
    created: number;
    walletId?: string;
    metadata?: object;
    type: PaymentMethodType;
    billingDetails: BillingDetails;
    card?: Card;
    bankAccount?: BankAccount;
}

export enum PaymentMethodType {
    Card = "Card",
    BankAccount = "BankAccount",
}

export interface BillingDetails {
    address?: BillingAddress;
    email?: string;
    name?: string;
    phone?: string;
}

export interface BillingAddress {
    city?: string;
    country?: string;
    line1?: string;
    line2?: string;
    postalCode?: string;
    state?: string;
}
