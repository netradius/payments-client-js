import {AuthorizeNetGatewayProvider} from "./payment-gateways";

export type GatewayType = "AuthorizeNet";

export interface ProviderRequest {
  readonly id: string;
  readonly name: string;
}

export interface Provider extends ProviderRequest {
  readonly organizationId: string;
  readonly object: string;
  readonly created: number;
}

export type ProviderResponse = AuthorizeNetGatewayProvider;

export interface GetProviderRequest {
  readonly id: string;
  readonly organizationId: string;
}

export interface ListProvidersRequest {
  readonly startingAfter?: string;
  readonly limit?: number;
  readonly idBeginsWith?: string;
}

export interface ListProvidersResponse {
  readonly providers: ProviderResponse[];
}
