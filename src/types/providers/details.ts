import {GatewayProviderConfiguration} from "./gateways";

export interface CreateProviderRequest {
    readonly name: string;
    readonly type: string;
    readonly configuration: ProviderConfiguration;
}

export interface GetProviderRequest {
    readonly id: string;
}

export interface UpdateProviderRequest {
    readonly id: string;
    readonly name: string;
    readonly configuration: ProviderConfiguration;
}

export interface Provider {
    readonly id: string;
    readonly tenantId: string;
    readonly object: string;
    readonly created: number;
    readonly name: string;
    readonly type: ProviderType;
    readonly configuration: ProviderConfiguration;
}

export type ProviderType = "Gateway";
export type ProviderConfiguration = GatewayProviderConfiguration;
