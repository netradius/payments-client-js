import {PaymentMethod} from "./payment-methods";

export interface WalletRequest {
  readonly id: string;
  readonly metadata?: object;
}

export interface Wallet extends WalletRequest {
  readonly organizationId: string;
  readonly created: number;
  readonly object: string;
}

export interface CreateWalletRequest extends WalletRequest {}

export interface ListWalletsRequest {
  readonly startingAfter?: string;
  readonly limit?: number;
  readonly idBeginsWith?: string;
}

export interface ListWalletsResponse {
  readonly wallets: Wallet[];
}

export interface GetWalletRequest {
  readonly id: string;
}

export interface ListPaymentMethodsForWalletRequest {
  readonly walletId: string;
}

export interface ListPaymentMethodsForWalletResponse {
  readonly paymentMethods: PaymentMethod[];
}

export interface AttachPaymentMethodToWalletRequest {
  readonly paymentMethodId: string;
  readonly walletId: string;
}

export interface DetachPaymentMethodFromWalletRequest {
  readonly paymentMethodId: string;
  readonly walletId: string;
}
