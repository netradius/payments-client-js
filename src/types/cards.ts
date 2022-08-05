export interface CardDetails {
    readonly expMonth: number;
    readonly expYear: number;
    readonly number: string;
    readonly cvc?: string;
}

export interface Card {
    readonly expMonth: number; // Two-digit
    readonly expYear: number; // Four-digit
    readonly number: string;
    readonly cvc?: string; // temporary
    readonly last4: string;
}
