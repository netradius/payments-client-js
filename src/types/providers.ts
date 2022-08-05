export interface CreateProviderRequest {
    readonly name: string;
    readonly tenantId: string;
    readonly type: string;
    readonly configuration: object;
}

export interface GetProviderRequest {
    readonly id: string;
    readonly tenantId: string;
}

export interface UpdateProviderRequest {
    readonly id: string;
    readonly tenantId: string;
    readonly name: string;
    readonly configuration: object;
}

export interface ProviderData {
    readonly id: string;
    readonly tenantId: string;
    readonly object: string;
    readonly created: number;
    readonly name: string;
    readonly type: ProviderType;
    readonly configuration: object;
}

export interface GatewayProviderConfiguration {
    readonly type: GatewayType;
    readonly configuration: object;
}

export interface TestGatewayProviderConfiguration {
    readonly type: GatewayType;
}

export interface CurrencyRoutingProviderConfiguration {
    readonly currencies: object;
}

export interface PaymentMethodRoutingProviderConfiguration {
    readonly paymentMethods: object;
}

export interface WeightedProviderConfiguration {
    readonly weights: object;
}

export interface FailoverProviderConfiguration {
    readonly providers: string[];
}

export enum ProviderType {
    Gateway = "Gateway",
    TestGateway = "TestGateway",
    CurrencyRouting = "CurrencyRouting",
    PaymentMethodRouting = "PaymentMethodRouting",
    Weighted = "Weighted",
    Failover = "Failover",
}

export enum GatewayType {
    AuthorizeNet = "AuthorizeNet",
}
