import {CardDetails} from "./cards";
import {BankAccountDetails} from "./bank-accounts";

export type PaymentMethodType = "Card"|"BankAccount";

export interface PaymentMethodDetails {
    readonly type: PaymentMethodType;
    readonly billingDetails: BillingDetails;
    readonly card?: CardDetails;
    readonly bankAccount?: BankAccountDetails;
}

export interface BillingDetails {
    readonly address?: BillingAddress;
    readonly email?: string;
    readonly name?: string;
    readonly phone?: string;
}

export interface BillingAddress {
    readonly city?: string;
    readonly country?: string;
    readonly line1?: string;
    readonly line2?: string;
    readonly postalCode?: string;
    readonly state?: string;
}
