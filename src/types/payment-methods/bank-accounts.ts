export interface BankAccount {
    readonly last4: string;
    readonly accountNumber: string;
    readonly routingNumber: string;
}

export interface BankAccountDetails {
    readonly accountNumber: string;
    readonly routingNumber: string;
}
