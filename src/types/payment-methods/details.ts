import {CardDetails} from "./cards";
import {BankAccountDetails} from "./bank-accounts";

export type PaymentMethodType = "Card"|"BankAccount";

export interface PaymentMethodDetails {
    type: PaymentMethodType;
    billingDetails: BillingDetails;
    card?: CardDetails;
    bankAccount?: BankAccountDetails;
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
