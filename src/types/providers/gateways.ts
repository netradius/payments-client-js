export type GatewayType = "AuthorizeNet";
export type GatewayConfiguration = AuthorizeNetConfiguration;

export interface GatewayProviderConfiguration {
    readonly type: GatewayType;
    readonly configuration: GatewayConfiguration;
}

export interface AuthorizeNetConfiguration {
    apiLoginKey: string;
    transactionKey: string;
    testMode: boolean;
}
