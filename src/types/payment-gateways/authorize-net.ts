import {ProviderRequest, Provider} from "../providers";

export interface AuthorizeNetConfiguration {
  readonly apiLoginKey: string;
  readonly transactionKey: string;
  readonly testMode: boolean;
}

export interface CreateAuthorizeNetGatewayProviderRequest
  extends AuthorizeNetConfiguration,
    ProviderRequest {}

export interface UpdateAuthorizeNetGatewayProviderRequest
  extends Partial<AuthorizeNetConfiguration> {
  readonly id: string;
  readonly name?: string;
}

export interface AuthorizeNetGatewayProvider
  extends AuthorizeNetConfiguration,
    Provider {}
