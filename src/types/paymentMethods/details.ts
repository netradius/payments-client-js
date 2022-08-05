import {CardDetails} from "./cards";

export type PaymentMethodType = "Card";

export interface PaymentMethodDetails {
    type: PaymentMethodType;
    billingDetails: BillingDetails;
    card?: CardDetails;
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
