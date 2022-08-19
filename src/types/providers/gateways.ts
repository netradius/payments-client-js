export type GatewayType = "AuthorizeNet";
export type GatewayConfiguration = AuthorizeNetConfiguration;

export interface GatewayProviderConfiguration {
    readonly type: GatewayType;
    readonly configuration: GatewayConfiguration;
}

export interface AuthorizeNetConfiguration {
    readonly apiLoginKey: string;
    readonly transactionKey: string;
    readonly testMode: boolean;
}
